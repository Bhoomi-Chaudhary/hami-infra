"use client";

import { useState, useEffect, useCallback } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Enquiry {
  _id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  createdAt: string;
}

interface Admin {
  _id: string;
  name: string;
  email: string;
  role: "main" | "admin";
  isActive: boolean;
  createdAt: string;
}

interface AdminInvite {
  _id: string;
  name: string;
  email: string;
  proposedBy: { _id: string; name: string; email: string };
  approvals: { _id: string; name: string; email: string }[];
  requiredApprovals: number;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

interface SiteContent {
  _id: string;
  key: string;
  value: string;
  type: "text" | "image";
  page: string;
  section: string;
  updatedBy?: { name: string; email: string };
  updatedAt: string;
}

type Tab = "enquiries" | "admins" | "invites" | "content";
type ModalType = "message" | "deleteEnquiry" | "deleteAdmin" | "inviteAdmin" | "password" | "addContent" | null;

const SERVICE_OPTIONS = ["all", "Electrical", "Mechanical", "Fire Safety", "Commercial", "AMC"];
const PAGE_OPTIONS = ["home", "about", "services", "projects", "contact"];

// ─── Styles ──────────────────────────────────────────────────────────────────

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg:      #0B1F3A; --bg2: #0e2548; --bg3: #132d54;
    --surface: #0f2440; --border: rgba(217,106,26,0.18);
    --border2: rgba(255,255,255,0.07); --accent: #D96A1A;
    --accent2: #f07d2e; --text: #e8edf5; --muted: #6b82a0;
    --danger: #e05454; --success: #3ecf8e;
    --mono: 'IBM Plex Mono', monospace; --sans: 'IBM Plex Sans', sans-serif;
  }
  body { background: var(--bg); color: var(--text); font-family: var(--sans); }
  .dash-wrap { min-height: 100vh; background: var(--bg); }

  .topbar { display: flex; align-items: center; justify-content: space-between; padding: 14px 28px; background: var(--surface); border-bottom: 1px solid var(--border); position: sticky; top: 0; z-index: 100; }
  .topbar-brand { display: flex; align-items: center; gap: 10px; font-family: var(--mono); font-size: 13px; font-weight: 600; letter-spacing: 0.12em; color: var(--accent); text-transform: uppercase; }
  .topbar-brand .dot { width: 8px; height: 8px; border-radius: 50%; background: var(--accent); animation: pulse 2s ease-in-out infinite; }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.35} }
  .topbar-actions { display: flex; gap: 10px; align-items: center; }
  .topbar-admin { font-family: var(--mono); font-size: 11px; color: var(--muted); padding: 6px 12px; border: 1px solid var(--border2); border-radius: 3px; }
  .topbar-admin span { color: var(--accent); }

  .tabs { display: flex; border-bottom: 1px solid var(--border2); background: var(--surface); padding: 0 28px; }
  .tab { font-family: var(--mono); font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; padding: 13px 18px; background: none; border: none; color: var(--muted); cursor: pointer; border-bottom: 2px solid transparent; transition: all 0.15s; margin-bottom: -1px; }
  .tab:hover { color: var(--text); }
  .tab.active { color: var(--accent); border-bottom-color: var(--accent); }
  .tab-badge { display: inline-flex; align-items: center; justify-content: center; background: var(--accent); color: #fff; font-size: 9px; font-weight: 700; width: 16px; height: 16px; border-radius: 50%; margin-left: 6px; }

  .btn { font-family: var(--mono); font-size: 11px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; padding: 7px 14px; border-radius: 3px; border: none; cursor: pointer; transition: all 0.15s; display: inline-flex; align-items: center; gap: 6px; }
  .btn-primary { background: var(--accent); color: #fff; }
  .btn-primary:hover:not(:disabled) { background: var(--accent2); }
  .btn-ghost { background: transparent; color: var(--muted); border: 1px solid var(--border2); }
  .btn-ghost:hover { color: var(--text); border-color: rgba(255,255,255,0.2); }
  .btn-danger { background: transparent; color: var(--danger); border: 1px solid rgba(224,84,84,0.3); }
  .btn-danger:hover { background: rgba(224,84,84,0.12); }
  .btn:disabled { opacity: 0.5; cursor: not-allowed; }

  .content { padding: 24px 28px; }

  .stats-bar { display: flex; gap: 1px; margin-bottom: 24px; background: var(--border2); border-radius: 4px; overflow: hidden; border: 1px solid var(--border2); }
  .stat { flex: 1; padding: 14px 18px; background: var(--surface); display: flex; flex-direction: column; gap: 4px; }
  .stat-label { font-family: var(--mono); font-size: 10px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.1em; }
  .stat-val { font-family: var(--mono); font-size: 22px; font-weight: 600; color: var(--text); }
  .stat-val.accent { color: var(--accent); }

  .filter-bar { display: flex; gap: 10px; align-items: flex-end; margin-bottom: 18px; flex-wrap: wrap; }
  .filter-group { display: flex; flex-direction: column; gap: 5px; }
  .filter-label { font-family: var(--mono); font-size: 10px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.08em; }
  .filter-select, .filter-input { font-family: var(--mono); font-size: 12px; background: var(--surface); color: var(--text); border: 1px solid var(--border2); border-radius: 3px; padding: 7px 10px; outline: none; transition: border-color 0.15s; }
  .filter-select:focus, .filter-input:focus { border-color: rgba(217,106,26,0.5); }
  .filter-select option { background: var(--bg2); }
  .search-input { font-family: var(--sans); font-size: 13px; background: var(--surface); color: var(--text); border: 1px solid var(--border2); border-radius: 3px; padding: 7px 12px; outline: none; width: 220px; transition: border-color 0.15s; }
  .search-input:focus { border-color: rgba(217,106,26,0.5); }
  .search-input::placeholder { color: var(--muted); }

  .table-wrap { background: var(--surface); border: 1px solid var(--border2); border-radius: 4px; overflow: hidden; }
  .table-scroll { overflow-x: auto; }
  table { width: 100%; border-collapse: collapse; }
  thead { background: var(--bg3); }
  th { font-family: var(--mono); font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: var(--muted); padding: 11px 16px; text-align: left; white-space: nowrap; border-bottom: 1px solid var(--border2); }
  th:first-child { padding-left: 20px; }
  th.sortable { cursor: pointer; user-select: none; }
  th.sortable:hover { color: var(--text); }
  tbody tr { border-bottom: 1px solid var(--border2); transition: background 0.1s; }
  tbody tr:last-child { border-bottom: none; }
  tbody tr:hover { background: rgba(217,106,26,0.05); }
  td { padding: 12px 16px; font-size: 13px; color: var(--text); vertical-align: middle; }
  td:first-child { padding-left: 20px; }
  .td-name { font-weight: 500; }
  .td-email { font-family: var(--mono); font-size: 12px; color: var(--muted); }
  .td-phone { font-family: var(--mono); font-size: 12px; }
  .td-date { font-family: var(--mono); font-size: 11px; color: var(--muted); white-space: nowrap; }
  .td-msg { max-width: 220px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--muted); font-size: 12px; cursor: pointer; }
  .td-msg:hover { color: var(--accent); }

  .badge { font-family: var(--mono); font-size: 10px; font-weight: 600; padding: 3px 8px; border-radius: 2px; letter-spacing: 0.06em; text-transform: uppercase; white-space: nowrap; }
  .badge-Electrical { background: rgba(96,165,250,0.12); color: #60a5fa; border: 1px solid rgba(96,165,250,0.25); }
  .badge-Mechanical { background: rgba(217,106,26,0.12); color: var(--accent2); border: 1px solid rgba(217,106,26,0.25); }
  .badge-Fire       { background: rgba(239,68,68,0.12); color: #f87171; border: 1px solid rgba(239,68,68,0.25); }
  .badge-Commercial { background: rgba(62,207,142,0.12); color: #3ecf8e; border: 1px solid rgba(62,207,142,0.25); }
  .badge-AMC        { background: rgba(167,139,250,0.12); color: #a78bfa; border: 1px solid rgba(167,139,250,0.25); }
  .badge-main       { background: rgba(217,106,26,0.15); color: var(--accent); border: 1px solid rgba(217,106,26,0.3); }
  .badge-admin      { background: rgba(255,255,255,0.05); color: var(--muted); border: 1px solid var(--border2); }
  .badge-active     { background: rgba(62,207,142,0.12); color: #3ecf8e; border: 1px solid rgba(62,207,142,0.25); }
  .badge-inactive   { background: rgba(224,84,84,0.12); color: var(--danger); border: 1px solid rgba(224,84,84,0.25); }
  .badge-text       { background: rgba(96,165,250,0.12); color: #60a5fa; border: 1px solid rgba(96,165,250,0.25); }
  .badge-image      { background: rgba(167,139,250,0.12); color: #a78bfa; border: 1px solid rgba(167,139,250,0.25); }

  .copy-btn { font-family: var(--mono); font-size: 10px; background: none; border: none; cursor: pointer; color: var(--muted); padding: 2px 4px; border-radius: 2px; transition: color 0.15s; }
  .copy-btn:hover { color: var(--accent); }
  .copy-btn.copied { color: var(--success); }
  .td-actions { display: flex; gap: 6px; align-items: center; }
  .icon-btn { background: none; border: none; cursor: pointer; color: var(--muted); padding: 5px; border-radius: 3px; transition: all 0.15s; font-size: 14px; line-height: 1; display: inline-flex; align-items: center; }
  .icon-btn:hover { background: rgba(255,255,255,0.07); color: var(--text); }
  .icon-btn.del:hover { background: rgba(224,84,84,0.12); color: var(--danger); }
  .empty-row td { text-align: center; padding: 48px; font-family: var(--mono); font-size: 12px; color: var(--muted); }

  .approval-bar { display: flex; align-items: center; gap: 8px; }
  .approval-track { flex: 1; height: 4px; background: var(--border2); border-radius: 2px; overflow: hidden; min-width: 60px; }
  .approval-fill { height: 100%; background: var(--accent); border-radius: 2px; transition: width 0.3s; }
  .approval-label { font-family: var(--mono); font-size: 10px; color: var(--muted); white-space: nowrap; }

  .content-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 12px; }
  .content-card { background: var(--surface); border: 1px solid var(--border2); border-radius: 4px; padding: 16px; transition: border-color 0.15s; }
  .content-card:hover { border-color: rgba(217,106,26,0.3); }
  .content-card-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 10px; gap: 8px; }
  .content-key { font-family: var(--mono); font-size: 11px; color: var(--accent); word-break: break-all; }
  .content-meta { font-family: var(--mono); font-size: 10px; color: var(--muted); margin-top: 8px; }
  .content-preview { font-size: 13px; color: var(--text); margin-top: 8px; line-height: 1.5; }
  .content-img { width: 100%; max-height: 120px; object-fit: cover; border-radius: 3px; margin-top: 8px; }
  .content-actions { display: flex; gap: 6px; margin-top: 12px; }

  .pagination { display: flex; align-items: center; justify-content: space-between; padding: 12px 20px; background: var(--bg3); border-top: 1px solid var(--border2); font-family: var(--mono); font-size: 11px; color: var(--muted); }
  .page-btns { display: flex; gap: 4px; }
  .page-btn { background: none; border: 1px solid var(--border2); color: var(--muted); padding: 4px 10px; border-radius: 2px; cursor: pointer; font-family: var(--mono); font-size: 11px; transition: all 0.15s; }
  .page-btn:hover:not(:disabled) { border-color: var(--accent); color: var(--accent); }
  .page-btn.active { background: var(--accent); color: #fff; border-color: var(--accent); }
  .page-btn:disabled { opacity: 0.35; cursor: not-allowed; }

  .modal-overlay { position: fixed; inset: 0; z-index: 200; background: rgba(7,16,30,0.85); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; padding: 20px; animation: fadeIn 0.15s ease; }
  @keyframes fadeIn { from{opacity:0} to{opacity:1} }
  .modal { background: var(--bg2); border: 1px solid var(--border); border-radius: 6px; width: 100%; max-width: 520px; overflow: hidden; animation: slideUp 0.2s ease; box-shadow: 0 24px 64px rgba(0,0,0,0.6); }
  @keyframes slideUp { from{transform:translateY(16px);opacity:0} to{transform:none;opacity:1} }
  .modal-header { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-bottom: 1px solid var(--border2); }
  .modal-title { font-family: var(--mono); font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: var(--accent); }
  .modal-close { background: none; border: none; cursor: pointer; color: var(--muted); font-size: 18px; line-height: 1; padding: 2px 6px; border-radius: 3px; transition: color 0.15s; }
  .modal-close:hover { color: var(--text); }
  .modal-body { padding: 20px; max-height: 70vh; overflow-y: auto; }
  .modal-footer { display: flex; gap: 10px; justify-content: flex-end; padding: 14px 20px; border-top: 1px solid var(--border2); }

  .field { margin-bottom: 16px; }
  .field label { display: block; font-family: var(--mono); font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: var(--muted); margin-bottom: 6px; }
  .field input, .field select, .field textarea { width: 100%; font-family: var(--mono); font-size: 13px; background: var(--surface); color: var(--text); border: 1px solid var(--border2); border-radius: 3px; padding: 9px 12px; outline: none; transition: border-color 0.15s; }
  .field textarea { resize: vertical; min-height: 80px; font-family: var(--sans); }
  .field input:focus, .field select:focus, .field textarea:focus { border-color: rgba(217,106,26,0.5); }
  .field select option { background: var(--bg2); }
  .field-error { font-size: 11px; color: var(--danger); margin-top: 5px; font-family: var(--mono); }
  .field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

  .upload-zone { border: 2px dashed var(--border2); border-radius: 4px; padding: 24px; text-align: center; cursor: pointer; transition: border-color 0.15s; display: block; }
  .upload-zone:hover { border-color: rgba(217,106,26,0.4); }
  .upload-label { font-family: var(--mono); font-size: 11px; color: var(--muted); margin-top: 8px; display: block; }
  .upload-preview { width: 100%; max-height: 160px; object-fit: cover; border-radius: 3px; margin-top: 10px; }

  .msg-meta { display: grid; grid-template-columns: auto 1fr; gap: 8px 14px; margin-bottom: 16px; font-size: 13px; }
  .msg-meta-key { font-family: var(--mono); font-size: 11px; color: var(--muted); padding-top: 1px; }
  .msg-text { background: var(--surface); border: 1px solid var(--border2); border-radius: 3px; padding: 14px; font-size: 13px; line-height: 1.65; color: var(--text); white-space: pre-wrap; max-height: 220px; overflow-y: auto; }
  .confirm-text { font-size: 14px; color: var(--text); line-height: 1.6; margin-bottom: 6px; }
  .confirm-sub { font-size: 12px; color: var(--muted); font-family: var(--mono); }

  .login-wrap { min-height: 100vh; background: var(--bg); display: flex; align-items: center; justify-content: center; }
  .login-card { background: var(--surface); border: 1px solid var(--border); border-radius: 6px; padding: 36px 32px; width: 100%; max-width: 340px; box-shadow: 0 32px 80px rgba(0,0,0,0.5); }
  .login-logo { font-family: var(--mono); font-size: 11px; font-weight: 600; letter-spacing: 0.14em; color: var(--accent); text-transform: uppercase; margin-bottom: 28px; display: flex; align-items: center; gap: 8px; }
  .login-logo::before { content:''; display:block; width:24px; height:2px; background:var(--accent); }
  .login-title { font-size: 22px; font-weight: 600; color: var(--text); margin-bottom: 6px; }
  .login-sub { font-size: 13px; color: var(--muted); margin-bottom: 28px; }
  .login-btn { width: 100%; background: var(--accent); color: #fff; border: none; border-radius: 3px; padding: 10px; font-family: var(--mono); font-size: 12px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; cursor: pointer; transition: background 0.15s; }
  .login-btn:hover { background: var(--accent2); }

  .toast { position: fixed; bottom: 24px; right: 24px; z-index: 300; background: var(--bg3); border: 1px solid var(--border); border-radius: 4px; padding: 12px 18px; font-family: var(--mono); font-size: 12px; color: var(--text); box-shadow: 0 8px 32px rgba(0,0,0,0.4); animation: toastIn 0.2s ease; display: flex; align-items: center; gap: 10px; }
  @keyframes toastIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none} }
  .toast-dot { width:7px; height:7px; border-radius:50%; flex-shrink:0; }

  ::-webkit-scrollbar { width: 5px; height: 5px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.15); }
`;

// ─── Helpers ─────────────────────────────────────────────────────────────────

const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

const fmtTime = (d: string) =>
  new Date(d).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

const badgeClass = (svc: string) =>
  svc === "Fire Safety" ? "badge badge-Fire" : `badge badge-${svc}`;

// ─── Component ───────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [access, setAccess] = useState(false);
  const [password, setPassword] = useState("");
  const [currentAdmin, setCurrentAdmin] = useState<Admin | null>(null);
  const [tab, setTab] = useState<Tab>("enquiries");

  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [invites, setInvites] = useState<AdminInvite[]>([]);
  const [siteContent, setSiteContent] = useState<SiteContent[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [filterService, setFilterService] = useState("all");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");
  const [search, setSearch] = useState("");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;

  const [contentPage, setContentPage] = useState("all");
  const [modalType, setModalType] = useState<ModalType>(null);
  const [activeEnquiry, setActiveEnquiry] = useState<Enquiry | null>(null);
  const [activeAdmin, setActiveAdmin] = useState<Admin | null>(null);
  const [activeContent, setActiveContent] = useState<SiteContent | null>(null);

  const [inviteForm, setInviteForm] = useState({ name: "", email: "", tempPassword: "" });
  const [inviteError, setInviteError] = useState("");
  const [pwForm, setPwForm] = useState({ current: "", newPw: "", confirm: "" });
  const [pwError, setPwError] = useState("");
  const [contentForm, setContentForm] = useState({ key: "", value: "", type: "text" as "text" | "image", page: "home", section: "" });
  const [contentError, setContentError] = useState("");
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  const closeModal = () => {
    setModalType(null);
    setActiveEnquiry(null); setActiveAdmin(null); setActiveContent(null);
    setInviteForm({ name: "", email: "", tempPassword: "" }); setInviteError("");
    setPwForm({ current: "", newPw: "", confirm: "" }); setPwError("");
    setContentForm({ key: "", value: "", type: "text", page: "home", section: "" }); setContentError("");
    setUploadPreview(null); setUploadFile(null);
  };

  const fetchEnquiries = useCallback(async () => {
    setIsLoading(true); setError(null);
    try {
      const res = await fetch("/api/contact", { cache: "no-store" });
      if (!res.ok) throw new Error();
      setEnquiries(await res.json());
    } catch { setError("Failed to load enquiries."); }
    finally { setIsLoading(false); }
  }, []);

  const fetchAdmins = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/list", { cache: "no-store" });
      if (!res.ok) throw new Error();
      setAdmins(await res.json());
    } catch { showToast("Failed to load admins", false); }
  }, []);

  const fetchInvites = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/invites", { cache: "no-store" });
      if (!res.ok) throw new Error();
      setInvites(await res.json());
    } catch { showToast("Failed to load invites", false); }
  }, []);

  const fetchContent = useCallback(async () => {
    try {
      const res = await fetch("/api/site-content", { cache: "no-store" });
      if (!res.ok) throw new Error();
      setSiteContent(await res.json());
    } catch { showToast("Failed to load content", false); }
  }, []);

  useEffect(() => {
    if (!access) return;
    fetchEnquiries(); fetchAdmins(); fetchInvites(); fetchContent();
  }, [access, fetchEnquiries, fetchAdmins, fetchInvites, fetchContent]);

  const handleLogin = async () => {
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentAdmin(data.admin ?? null);
        setAccess(true); setPassword("");
      } else { alert("Wrong password"); }
    } catch { alert("Login failed."); }
  };

  const handleDeleteEnquiry = async () => {
    if (!activeEnquiry) return;
    try {
      const res = await fetch(`/api/contact/${activeEnquiry._id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setEnquiries((d) => d.filter((x) => x._id !== activeEnquiry._id));
      showToast("Enquiry deleted");
    } catch { showToast("Delete failed", false); }
    finally { closeModal(); }
  };

  const handleInviteAdmin = async () => {
    setInviteError("");
    const { name, email, tempPassword } = inviteForm;
    if (!name || !email || !tempPassword) { setInviteError("All fields required"); return; }
    if (tempPassword.length < 6) { setInviteError("Password min 6 characters"); return; }
    if (!currentAdmin) return;
    try {
      const res = await fetch("/api/admin/invite", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...inviteForm, proposedById: currentAdmin._id }),
      });
      const data = await res.json();
      if (!res.ok) { setInviteError(data.error ?? "Failed"); return; }
      showToast(data.autoApproved ? "Admin created immediately" : "Invite sent for approval");
      closeModal(); fetchAdmins(); fetchInvites();
    } catch { setInviteError("Server error"); }
  };

  const handleApproveInvite = async (inviteId: string) => {
    if (!currentAdmin) return;
    try {
      const res = await fetch(`/api/admin/invite/${inviteId}/approve`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminId: currentAdmin._id }),
      });
      const data = await res.json();
      if (!res.ok) { showToast(data.error ?? "Failed", false); return; }
      showToast(data.approved ? "Admin approved and created" : `Approval recorded (${data.approvalsCount}/${data.requiredApprovals})`);
      fetchInvites(); fetchAdmins();
    } catch { showToast("Server error", false); }
  };

  const handleDeleteAdmin = async () => {
    if (!activeAdmin || !currentAdmin) return;
    try {
      const res = await fetch(`/api/admin/${activeAdmin._id}`, {
        method: "DELETE", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestedById: currentAdmin._id }),
      });
      const data = await res.json();
      if (!res.ok) { showToast(data.error ?? "Failed", false); closeModal(); return; }
      setAdmins((a) => a.filter((x) => x._id !== activeAdmin._id));
      showToast("Admin removed");
    } catch { showToast("Server error", false); }
    finally { closeModal(); }
  };

  const handlePasswordChange = async () => {
    setPwError("");
    if (!pwForm.current) { setPwError("Current password required"); return; }
    if (pwForm.newPw.length < 6) { setPwError("Min 6 characters"); return; }
    if (pwForm.newPw !== pwForm.confirm) { setPwError("Passwords don't match"); return; }
    if (!currentAdmin) return;
    try {
      const res = await fetch(`/api/admin/${currentAdmin._id}/password`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: pwForm.current, newPassword: pwForm.newPw }),
      });
      const data = await res.json();
      if (!res.ok) { setPwError(data.error ?? "Failed"); return; }
      showToast("Password updated"); closeModal();
    } catch { setPwError("Server error"); }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadFile(file);
    setUploadPreview(URL.createObjectURL(file));
  };

  const handleSaveContent = async () => {
    setContentError("");
    const { key, value, type, page: pg, section } = contentForm;
    if (!key || !section) { setContentError("Key and section required"); return; }
    let finalValue = value;
    if (type === "image" && uploadFile) {
      setIsUploading(true);
      try {
        const fd = new FormData();
        fd.append("file", uploadFile);
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        const data = await res.json();
        if (!res.ok) { setContentError(data.error ?? "Upload failed"); setIsUploading(false); return; }
        finalValue = data.url;
      } catch { setContentError("Upload failed"); setIsUploading(false); return; }
      setIsUploading(false);
    }
    if (!finalValue) { setContentError("Value or image required"); return; }
    try {
      const res = await fetch("/api/site-content", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value: finalValue, type, page: pg, section, updatedBy: currentAdmin?._id }),
      });
      const data = await res.json();
      if (!res.ok) { setContentError(data.error ?? "Failed"); return; }
      showToast(activeContent ? "Content updated" : "Content saved");
      closeModal(); fetchContent();
    } catch { setContentError("Server error"); }
  };

  const openEditContent = (item: SiteContent) => {
    setActiveContent(item);
    setContentForm({ key: item.key, value: item.type === "text" ? item.value : "", type: item.type, page: item.page, section: item.section });
    if (item.type === "image") setUploadPreview(item.value);
    setModalType("addContent");
  };

  const copyEmail = (id: string, email: string) => {
    navigator.clipboard.writeText(email);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filtered = enquiries
    .filter((d) => filterService === "all" || d.service === filterService)
    .filter((d) => {
      if (!filterDateFrom && !filterDateTo) return true;
      const dt = new Date(d.createdAt);
      if (filterDateFrom && dt < new Date(filterDateFrom)) return false;
      if (filterDateTo && dt > new Date(filterDateTo + "T23:59:59")) return false;
      return true;
    })
    .filter((d) => {
      if (!search) return true;
      const q = search.toLowerCase();
      return d.name.toLowerCase().includes(q) || d.email.toLowerCase().includes(q) ||
        d.phone.includes(q) || d.message.toLowerCase().includes(q);
    })
    .sort((a, b) => {
      const diff = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      return sortDir === "asc" ? diff : -diff;
    });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  useEffect(() => setPage(1), [filterService, filterDateFrom, filterDateTo, search]);

  const svcCounts = SERVICE_OPTIONS.slice(1).map((s) => ({ label: s, count: enquiries.filter((d) => d.service === s).length }));
  const filteredContent = contentPage === "all" ? siteContent : siteContent.filter((c) => c.page === contentPage);
  const isMainAdmin = currentAdmin?.role === "main";

  // ════ LOGIN ════
  if (!access) {
    return (
      <>
        <style>{STYLES}</style>
        <div className="login-wrap">
          <div className="login-card">
            <div className="login-logo">hamiInfra</div>
            <h1 className="login-title">Admin Portal</h1>
            <p className="login-sub">Enter your password to continue</p>
            <div className="field">
              <label>Password</label>
              <input type="password" placeholder="••••••••" value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()} />
            </div>
            <button className="login-btn" onClick={handleLogin}>Authenticate →</button>
          </div>
        </div>
      </>
    );
  }

  // ════ DASHBOARD ════
  return (
    <>
      <style>{STYLES}</style>
      <div className="dash-wrap">

        <header className="topbar">
          <div className="topbar-brand"><span className="dot" />hamiInfra · Admin</div>
          <div className="topbar-actions">
            {currentAdmin && (
              <div className="topbar-admin">
                <span>{currentAdmin.name}</span> · {currentAdmin.role}
              </div>
            )}
            <button className="btn btn-ghost" onClick={() => setModalType("password")}>⚙ Password</button>
            <button className="btn btn-primary" onClick={() => { fetchEnquiries(); fetchAdmins(); fetchInvites(); fetchContent(); }} disabled={isLoading}>
              {isLoading ? "↻ Loading" : "↻ Refresh"}
            </button>
          </div>
        </header>

        <nav className="tabs">
          {(["enquiries", "admins", "invites", "content"] as Tab[]).map((t) => (
            <button key={t} className={`tab${tab === t ? " active" : ""}`} onClick={() => setTab(t)}>
              {t}
              {t === "invites" && invites.length > 0 && <span className="tab-badge">{invites.length}</span>}
            </button>
          ))}
        </nav>

        <div className="content">

          {/* ── ENQUIRIES ── */}
          {tab === "enquiries" && (
            <>
              <div className="stats-bar">
                <div className="stat"><span className="stat-label">Total</span><span className="stat-val accent">{enquiries.length}</span></div>
                {svcCounts.map((s) => (
                  <div className="stat" key={s.label}><span className="stat-label">{s.label}</span><span className="stat-val">{s.count}</span></div>
                ))}
              </div>
              <div className="filter-bar">
                <div className="filter-group">
                  <span className="filter-label">Service</span>
                  <select className="filter-select" value={filterService} onChange={(e) => setFilterService(e.target.value)}>
                    {SERVICE_OPTIONS.map((s) => <option key={s} value={s}>{s === "all" ? "All Services" : s}</option>)}
                  </select>
                </div>
                <div className="filter-group">
                  <span className="filter-label">From</span>
                  <input type="date" className="filter-input" value={filterDateFrom} onChange={(e) => setFilterDateFrom(e.target.value)} />
                </div>
                <div className="filter-group">
                  <span className="filter-label">To</span>
                  <input type="date" className="filter-input" value={filterDateTo} onChange={(e) => setFilterDateTo(e.target.value)} />
                </div>
                <div className="filter-group" style={{ flex: 1 }}>
                  <span className="filter-label">Search</span>
                  <input type="text" className="search-input" placeholder="Name, email, phone, message…" value={search} onChange={(e) => setSearch(e.target.value)} style={{ width: "100%" }} />
                </div>
                {(filterService !== "all" || filterDateFrom || filterDateTo || search) && (
                  <button className="btn btn-ghost" style={{ alignSelf: "flex-end" }} onClick={() => { setFilterService("all"); setFilterDateFrom(""); setFilterDateTo(""); setSearch(""); }}>✕ Clear</button>
                )}
              </div>
              {error && <p style={{ color: "var(--danger)", fontFamily: "var(--mono)", fontSize: 12, marginBottom: 16 }}>⚠ {error}</p>}
              <div className="table-wrap">
                <div className="table-scroll">
                  <table>
                    <thead>
                      <tr>
                        <th>#</th><th>Name</th><th>Contact</th><th>Service</th><th>Message</th>
                        <th className="sortable" onClick={() => setSortDir((d) => d === "asc" ? "desc" : "asc")}>Date {sortDir === "asc" ? "↑" : "↓"}</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {isLoading && <tr className="empty-row"><td colSpan={7}>Loading…</td></tr>}
                      {!isLoading && paged.length === 0 && <tr className="empty-row"><td colSpan={7}>No enquiries found</td></tr>}
                      {!isLoading && paged.map((item, idx) => (
                        <tr key={item._id}>
                          <td style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--muted)" }}>{(page - 1) * PAGE_SIZE + idx + 1}</td>
                          <td className="td-name">{item.name}</td>
                          <td>
                            <div className="td-email">{item.email}
                              <button className={`copy-btn${copiedId === item._id ? " copied" : ""}`} onClick={() => copyEmail(item._id, item.email)}>
                                {copiedId === item._id ? "✓" : "copy"}
                              </button>
                            </div>
                            <div className="td-phone">{item.phone}</div>
                          </td>
                          <td><span className={badgeClass(item.service)}>{item.service}</span></td>
                          <td className="td-msg" onClick={() => { setActiveEnquiry(item); setModalType("message"); }}>{item.message}</td>
                          <td className="td-date">{fmtDate(item.createdAt)}<br /><span style={{ fontSize: 10 }}>{fmtTime(item.createdAt)}</span></td>
                          <td>
                            <div className="td-actions">
                              <button className="icon-btn" onClick={() => { setActiveEnquiry(item); setModalType("message"); }}>👁</button>
                              <button className="icon-btn del" onClick={() => { setActiveEnquiry(item); setModalType("deleteEnquiry"); }}>🗑</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="pagination">
                  <span>{filtered.length === 0 ? "0 results" : `${(page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, filtered.length)} of ${filtered.length}`}</span>
                  <div className="page-btns">
                    <button className="page-btn" disabled={page === 1} onClick={() => setPage(1)}>«</button>
                    <button className="page-btn" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>‹</button>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const p = Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
                      return <button key={p} className={`page-btn${p === page ? " active" : ""}`} onClick={() => setPage(p)}>{p}</button>;
                    })}
                    <button className="page-btn" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>›</button>
                    <button className="page-btn" disabled={page === totalPages} onClick={() => setPage(totalPages)}>»</button>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ── ADMINS ── */}
          {tab === "admins" && (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <div style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--muted)" }}>{admins.length} admin{admins.length !== 1 ? "s" : ""}</div>
                <button className="btn btn-primary" onClick={() => setModalType("inviteAdmin")}>+ Invite Admin</button>
              </div>
              <div className="table-wrap">
                <div className="table-scroll">
                  <table>
                    <thead><tr><th>#</th><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Joined</th><th>Actions</th></tr></thead>
                    <tbody>
                      {admins.length === 0 && <tr className="empty-row"><td colSpan={7}>No admins found</td></tr>}
                      {admins.map((admin, idx) => (
                        <tr key={admin._id}>
                          <td style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--muted)" }}>{idx + 1}</td>
                          <td className="td-name">{admin.name}{admin._id === currentAdmin?._id && <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--muted)", marginLeft: 8 }}>(you)</span>}</td>
                          <td className="td-email">{admin.email}</td>
                          <td><span className={`badge badge-${admin.role}`}>{admin.role}</span></td>
                          <td><span className={`badge badge-${admin.isActive ? "active" : "inactive"}`}>{admin.isActive ? "Active" : "Inactive"}</span></td>
                          <td className="td-date">{fmtDate(admin.createdAt)}</td>
                          <td>
                            {isMainAdmin && admin._id !== currentAdmin?._id && admin.role !== "main" && (
                              <button className="icon-btn del" onClick={() => { setActiveAdmin(admin); setModalType("deleteAdmin"); }}>🗑</button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* ── INVITES ── */}
          {tab === "invites" && (
            <>
              <div style={{ marginBottom: 20, fontFamily: "var(--mono)", fontSize: 12, color: "var(--muted)" }}>
                {invites.length} pending invite{invites.length !== 1 ? "s" : ""}
              </div>
              <div className="table-wrap">
                <div className="table-scroll">
                  <table>
                    <thead><tr><th>#</th><th>Name</th><th>Email</th><th>Proposed By</th><th>Approvals</th><th>Date</th><th>Actions</th></tr></thead>
                    <tbody>
                      {invites.length === 0 && <tr className="empty-row"><td colSpan={7}>No pending invites</td></tr>}
                      {invites.map((inv, idx) => {
                        const alreadyApproved = inv.approvals.some((a) => a._id === currentAdmin?._id);
                        const isProposer = inv.proposedBy?._id === currentAdmin?._id;
                        return (
                          <tr key={inv._id}>
                            <td style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--muted)" }}>{idx + 1}</td>
                            <td className="td-name">{inv.name}</td>
                            <td className="td-email">{inv.email}</td>
                            <td style={{ fontSize: 13 }}>{inv.proposedBy?.name ?? "—"}</td>
                            <td>
                              <div className="approval-bar">
                                <div className="approval-track">
                                  <div className="approval-fill" style={{ width: `${Math.min(100, (inv.approvals.length / inv.requiredApprovals) * 100)}%` }} />
                                </div>
                                <span className="approval-label">{inv.approvals.length}/{inv.requiredApprovals}</span>
                              </div>
                            </td>
                            <td className="td-date">{fmtDate(inv.createdAt)}</td>
                            <td>
                              {!alreadyApproved && !isProposer && (
                                <button className="btn btn-primary" style={{ padding: "5px 10px", fontSize: 10 }} onClick={() => handleApproveInvite(inv._id)}>Approve</button>
                              )}
                              {alreadyApproved && <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--success)" }}>✓ Approved</span>}
                              {isProposer && !alreadyApproved && <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--muted)" }}>Awaiting others</span>}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* ── CONTENT ── */}
          {tab === "content" && (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
                <div className="filter-group">
                  <span className="filter-label">Filter by Page</span>
                  <select className="filter-select" value={contentPage} onChange={(e) => setContentPage(e.target.value)}>
                    <option value="all">All Pages</option>
                    {PAGE_OPTIONS.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <button className="btn btn-primary" onClick={() => { setActiveContent(null); setModalType("addContent"); }}>+ Add Content</button>
              </div>
              {filteredContent.length === 0 && (
                <div style={{ textAlign: "center", padding: 48, fontFamily: "var(--mono)", fontSize: 12, color: "var(--muted)" }}>No content entries yet</div>
              )}
              <div className="content-grid">
                {filteredContent.map((item) => (
                  <div key={item._id} className="content-card">
                    <div className="content-card-header">
                      <div>
                        <div className="content-key">{item.key}</div>
                        <div style={{ marginTop: 4 }}>
                          <span className={`badge badge-${item.type}`}>{item.type}</span>
                          <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--muted)", marginLeft: 8 }}>{item.page} / {item.section}</span>
                        </div>
                      </div>
                    </div>
                    {item.type === "text" && <div className="content-preview">{item.value.length > 120 ? item.value.slice(0, 120) + "…" : item.value}</div>}
                    {item.type === "image" && <img src={item.value} alt={item.key} className="content-img" />}
                    <div className="content-meta">
                      {item.updatedBy ? `Updated by ${item.updatedBy.name}` : ""}
                      {item.updatedAt ? ` · ${fmtDate(item.updatedAt)}` : ""}
                    </div>
                    <div className="content-actions">
                      <button className="btn btn-ghost" style={{ fontSize: 10, padding: "5px 10px" }} onClick={() => openEditContent(item)}>Edit</button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

        </div>
      </div>

      {/* ── MODAL: View Message ── */}
      {modalType === "message" && activeEnquiry && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">Enquiry Detail</span>
              <button className="modal-close" onClick={closeModal}>✕</button>
            </div>
            <div className="modal-body">
              <div className="msg-meta">
                <span className="msg-meta-key">Name</span><span>{activeEnquiry.name}</span>
                <span className="msg-meta-key">Email</span><span style={{ fontFamily: "var(--mono)", fontSize: 12 }}>{activeEnquiry.email}</span>
                <span className="msg-meta-key">Phone</span><span style={{ fontFamily: "var(--mono)", fontSize: 12 }}>{activeEnquiry.phone}</span>
                <span className="msg-meta-key">Service</span><span><span className={badgeClass(activeEnquiry.service)}>{activeEnquiry.service}</span></span>
                <span className="msg-meta-key">Date</span><span style={{ fontFamily: "var(--mono)", fontSize: 12 }}>{new Date(activeEnquiry.createdAt).toLocaleString("en-IN")}</span>
              </div>
              <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--muted)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.1em" }}>Message</div>
              <div className="msg-text">{activeEnquiry.message}</div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => copyEmail(activeEnquiry._id, activeEnquiry.email)}>{copiedId === activeEnquiry._id ? "✓ Copied" : "Copy Email"}</button>
              <button className="btn btn-danger" onClick={() => setModalType("deleteEnquiry")}>Delete</button>
              <button className="btn btn-primary" onClick={closeModal}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: Delete Enquiry ── */}
      {modalType === "deleteEnquiry" && activeEnquiry && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" style={{ maxWidth: 420 }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title" style={{ color: "var(--danger)" }}>Confirm Delete</span>
              <button className="modal-close" onClick={closeModal}>✕</button>
            </div>
            <div className="modal-body">
              <p className="confirm-text">Delete enquiry from <strong>{activeEnquiry.name}</strong>?</p>
              <p className="confirm-sub">{activeEnquiry.email} · {activeEnquiry.service}</p>
              <p style={{ marginTop: 12, fontSize: 12, color: "var(--muted)" }}>This action cannot be undone.</p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={closeModal}>Cancel</button>
              <button className="btn btn-danger" onClick={handleDeleteEnquiry}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: Delete Admin ── */}
      {modalType === "deleteAdmin" && activeAdmin && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" style={{ maxWidth: 420 }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title" style={{ color: "var(--danger)" }}>Remove Admin</span>
              <button className="modal-close" onClick={closeModal}>✕</button>
            </div>
            <div className="modal-body">
              <p className="confirm-text">Remove <strong>{activeAdmin.name}</strong> as admin?</p>
              <p className="confirm-sub">{activeAdmin.email}</p>
              <p style={{ marginTop: 12, fontSize: 12, color: "var(--muted)" }}>This action cannot be undone.</p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={closeModal}>Cancel</button>
              <button className="btn btn-danger" onClick={handleDeleteAdmin}>Remove</button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: Invite Admin ── */}
      {modalType === "inviteAdmin" && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">Invite Admin</span>
              <button className="modal-close" onClick={closeModal}>✕</button>
            </div>
            <div className="modal-body">
              <div className="field">
                <label>Name</label>
                <input type="text" placeholder="Full name" value={inviteForm.name} onChange={(e) => setInviteForm((f) => ({ ...f, name: e.target.value }))} />
              </div>
              <div className="field">
                <label>Email</label>
                <input type="email" placeholder="email@example.com" value={inviteForm.email} onChange={(e) => setInviteForm((f) => ({ ...f, email: e.target.value }))} />
              </div>
              <div className="field">
                <label>Temporary Password</label>
                <input type="password" placeholder="Min 6 characters" value={inviteForm.tempPassword} onChange={(e) => setInviteForm((f) => ({ ...f, tempPassword: e.target.value }))} />
              </div>
              {inviteError && <p className="field-error">{inviteError}</p>}
              <p style={{ fontSize: 12, color: "var(--muted)", fontFamily: "var(--mono)" }}>
                Requires {Math.ceil(admins.filter((a) => a.role === "admin").length * 2 / 3) || 1} approval(s) to activate
              </p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={closeModal}>Cancel</button>
              <button className="btn btn-primary" onClick={handleInviteAdmin}>Send Invite</button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: Password ── */}
      {modalType === "password" && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" style={{ maxWidth: 400 }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">Change Password</span>
              <button className="modal-close" onClick={closeModal}>✕</button>
            </div>
            <div className="modal-body">
              <div className="field">
                <label>Current Password</label>
                <input type="password" placeholder="••••••••" value={pwForm.current} onChange={(e) => { setPwForm((f) => ({ ...f, current: e.target.value })); setPwError(""); }} />
              </div>
              <div className="field">
                <label>New Password</label>
                <input type="password" placeholder="••••••••" value={pwForm.newPw} onChange={(e) => { setPwForm((f) => ({ ...f, newPw: e.target.value })); setPwError(""); }} />
              </div>
              <div className="field">
                <label>Confirm Password</label>
                <input type="password" placeholder="••••••••" value={pwForm.confirm}
                  onChange={(e) => { setPwForm((f) => ({ ...f, confirm: e.target.value })); setPwError(""); }}
                  onKeyDown={(e) => e.key === "Enter" && handlePasswordChange()} />
                {pwError && <p className="field-error">{pwError}</p>}
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={closeModal}>Cancel</button>
              <button className="btn btn-primary" onClick={handlePasswordChange}>Update Password</button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: Add / Edit Content ── */}
      {modalType === "addContent" && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">{activeContent ? "Edit Content" : "Add Content"}</span>
              <button className="modal-close" onClick={closeModal}>✕</button>
            </div>
            <div className="modal-body">
              <div className="field-row">
                <div className="field">
                  <label>Page</label>
                  <select value={contentForm.page} onChange={(e) => setContentForm((f) => ({ ...f, page: e.target.value }))}>
                    {PAGE_OPTIONS.map((p) => <option key={p} value={p}>{p}</option>)}
                    <option value="other">other</option>
                  </select>
                </div>
                <div className="field">
                  <label>Type</label>
                  <select value={contentForm.type} disabled={!!activeContent}
                    onChange={(e) => setContentForm((f) => ({ ...f, type: e.target.value as "text" | "image", value: "" }))}>
                    <option value="text">Text</option>
                    <option value="image">Image</option>
                  </select>
                </div>
              </div>
              <div className="field">
                <label>Section</label>
                <input type="text" placeholder="e.g. hero, about-card, banner" value={contentForm.section}
                  onChange={(e) => setContentForm((f) => ({ ...f, section: e.target.value }))} />
              </div>
              <div className="field">
                <label>Key</label>
                <input type="text" placeholder="e.g. home.hero.heading" value={contentForm.key}
                  disabled={!!activeContent}
                  onChange={(e) => setContentForm((f) => ({ ...f, key: e.target.value }))} />
              </div>
              {contentForm.type === "text" && (
                <div className="field">
                  <label>Value</label>
                  <textarea placeholder="Enter text content…" value={contentForm.value}
                    onChange={(e) => setContentForm((f) => ({ ...f, value: e.target.value }))} />
                </div>
              )}
              {contentForm.type === "image" && (
                <div className="field">
                  <label>Image</label>
                  <label className="upload-zone">
                    <input type="file" accept="image/*" style={{ display: "none" }} onChange={handleImageSelect} />
                    {!uploadPreview && (
                      <>
                        <div style={{ fontSize: 28 }}>📁</div>
                        <span className="upload-label">Click to upload · JPEG, PNG, WebP, GIF, SVG · max 10MB</span>
                      </>
                    )}
                    {uploadPreview && <img src={uploadPreview} alt="preview" className="upload-preview" />}
                  </label>
                  {uploadPreview && (
                    <button className="btn btn-ghost" style={{ marginTop: 8, fontSize: 10 }} onClick={() => { setUploadPreview(null); setUploadFile(null); }}>✕ Remove</button>
                  )}
                </div>
              )}
              {contentError && <p className="field-error">{contentError}</p>}
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={closeModal}>Cancel</button>
              <button className="btn btn-primary" disabled={isUploading} onClick={handleSaveContent}>
                {isUploading ? "Uploading…" : activeContent ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="toast">
          <span className="toast-dot" style={{ background: toast.ok ? "var(--success)" : "var(--danger)" }} />
          {toast.msg}
        </div>
      )}
    </>
  );
}
