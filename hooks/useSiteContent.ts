// hooks/useSiteContent.ts
// Fetches site content from MongoDB, falls back to hardcoded default

import { useEffect, useState } from "react";

interface SiteContentItem {
  key: string;
  value: string;
  type: "text" | "image";
  page: string;
  section: string;
}

const cache: Record<string, string> = {};

export function useSiteContent(key: string, fallback: string = ""): string {
  const [value, setValue] = useState<string>(cache[key] ?? fallback);

  useEffect(() => {
    // Already cached, no need to fetch
    if (cache[key]) {
      setValue(cache[key]);
      return;
    }

    fetch(`/api/site-content?key=${encodeURIComponent(key)}`)
      .then((res) => res.json())
      .then((data: SiteContentItem[]) => {
        if (Array.isArray(data) && data.length > 0) {
          cache[key] = data[0].value;
          setValue(data[0].value);
        } else {
          // Nothing in DB yet, use fallback
          setValue(fallback);
        }
      })
      .catch(() => {
        // On error, silently fall back
        setValue(fallback);
      });
  }, [key, fallback]);

  return value;
}


// Fetch all content for a page at once (more efficient for pages with many keys)
export function usePageContent(page: string): Record<string, string> {
  const [content, setContent] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch(`/api/site-content?page=${encodeURIComponent(page)}`)
      .then((res) => res.json())
      .then((data: SiteContentItem[]) => {
        if (Array.isArray(data)) {
          const map: Record<string, string> = {};
          data.forEach((item) => {
            map[item.key] = item.value;
            cache[item.key] = item.value;
          });
          setContent(map);
        }
      })
      .catch(() => {});
  }, [page]);

  return content;
}
