"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="w-full shadow-md sticky top-0 z-50">

      {/* TOP BAR */}
      <div className="bg-[#0B1F3A] border-b border-white/10 text-white">
  <div className="max-w-6xl mx-auto px-6 py-3 flex justify-between items-center">

          {/* BRAND */}
          <div className="flex items-center gap-3">
  <span className="text-2xl md:text-3xl font-bold tracking-wide">
    Hami Infra
  </span>

  {/* optional: keep logo on right but slightly smaller */}
</div>

          {/* LOGO */}
          <div>
            <Image src="/logo.jpg" alt="logo" width={55} height={55} />
          </div>

        </div>
      </div>

      {/* NAV LINKS */}
      <div className="bg-[#2B2B2B] text-white">
  <div className="max-w-6xl mx-auto px-6 py-2 flex gap-6 text-sm font-medium">

          <Link href="/" className="hover:text-[#D96A1A] transition">Home</Link>
          <Link href="/about" className="hover:text-[#D96A1A] transition">
  About Us
</Link>

          <div className="relative group">
  
  {/* CLICKABLE TRIGGER */}
  <Link href="/services" className="cursor-pointer hover:text-[#D96A1A]">
    Services ▾
  </Link>

  {/* DROPDOWN */}
  <div className="absolute left-0 top-full w-56 bg-white text-black shadow-md rounded-md opacity-0 invisible group-hover:visible group-hover:opacity-100 transition-all duration-200">

    <Link href="/services#electrical" className="block px-4 py-2 hover:bg-gray-100">
      Electrical
    </Link>

    <Link href="/services#mechanical" className="block px-4 py-2 hover:bg-gray-100">
      Mechanical
    </Link>

    <Link href="/services#fire" className="block px-4 py-2 hover:bg-gray-100">
      Fire Safety
    </Link>

    <Link href="/services#commercial" className="block px-4 py-2 hover:bg-gray-100">
      Office & Commercial
    </Link>

    <Link href="/services#amc" className="block px-4 py-2 hover:bg-gray-100">
      AMC
    </Link>

  </div>

</div>

          <Link href="/projects"  className="hover:text-[#D96A1A] transition">Projects</Link>
          <Link href="/contact"  className="hover:text-[#D96A1A] transition">Contact Us</Link>

        </div>
      </div>

    </nav>
  );
}