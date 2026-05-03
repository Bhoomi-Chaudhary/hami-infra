"use client";

import { useState, useEffect, useCallback } from "react";

interface Enquiry {
  _id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  createdAt: string;
}

type ModalType = "message" | "delete" | "password" | null;

const SERVICE_OPTIONS = ["all", "Electrical", "Mechanical", "Fire Safety", "Commercial", "AMC"];

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:       #0B1F3A;
    --bg2:      #0e2548;
    --bg3:      #132d54;
    --surface:  #0f2440;
    --border:   rgba(217,106,26,0.18);
    --border2:  rgba(255,255,255,0.07);
    --accent:   #D96A1A;
    --accent2:  #f07d2e;
    --text:     #e8edf5;
    --muted:    #6b82a0;
    --danger:   #e05454;
    --success:  #3ecf8e;
    --mono:     'IBM Plex Mono', monospace;
    --sans:     'IBM Plex Sans', sans-serif;
  }

  body { background: var(--bg); color: var(--text); font-family: var(--sans); }

  .dash-wrap { min-height: 100vh; background: var(--bg); }

  /* ── TOP BAR ── */
  .topbar {
    display: flex; align-items: center; justify-content: space-between;
    padding: 14px 28px;
    background: var(--surface);
    border-bottom: 1px solid var(--border);
    position: sticky; top: 0; z-index: 100;
  }
  .topbar-brand {
    display: flex; align-items: center; gap: 10px;
    font-family: var(--mono); font-size: 13px; font-weight: 600;
    letter-spacing: 0.12em; color: var(--accent); text-transform: uppercase;
  }
  .topbar-brand .dot {
    width: 8px; height: 8px; border-radius: 50%; background: var(--accent);
    animation: pulse 2s ease-in-out infinite;
  }
  @keyframes pulse {
    0%,100% { opacity:1; } 50% { opacity:0.35; }
  }
  .topbar-actions { display: flex; gap: 10px; align-items: center; }

  /* ── BUTTONS ── */
  .btn {
    font-family: var(--mono); font-size: 11px; font-weight: 600;
    letter-spacing: 0.08em; text-transform: uppercase;
    padding: 7px 14px; border-radius: 3px; border: none;
    cursor: pointer; transition: all 0.15s;
    display: inline-flex; align-items: center; gap: 6px;
  }
  .btn-primary { background: var(--accent); color: #fff; }
  .btn-primary:hover:not(:disabled) { background: var(--accent2); }
  .btn-ghost { background: transparent; color: var(--muted); border: 1px solid var(--border2); }
  .btn-ghost:hover { color: var(--text); border-color: rgba(255,255,255,0.2); }
  .btn-danger { background: transparent; color: var(--danger); border: 1px solid rgba(224,84,84,0.3); }
  .btn-danger:hover { background: rgba(224,84,84,0.12); }
  .btn:disabled { opacity: 0.5; cursor: not-allowed; }

  /* ── CONTENT ── */
  .content { padding: 24px 28px; }

  /* ── STATS BAR ── */
  .stats-bar {
    display: flex; gap: 1px; margin-bottom: 24px;
    background: var(--border2); border-radius: 4px; overflow: hidden;
    border: 1px solid var(--border2);
  }
  .stat {
    flex: 1; padding: 14px 18px; background: var(--surface);
    display: flex; flex-direction: column; gap: 4px;
  }
  .stat-label { font-family: var(--mono); font-size: 10px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.1em; }
  .stat-val { font-family: var(--mono); font-size: 22px; font-weight: 600; color: var(--text); }
  .stat-val.accent { color: var(--accent); }

  /* ── FILTER BAR ── */
  .filter-bar {
    display: flex; gap: 10px; align-items: flex-end;
    margin-bottom: 18px; flex-wrap: wrap;
  }
  .filter-group { display: flex; flex-direction: column; gap: 5px; }
  .filter-label { font-family: var(--mono); font-size: 10px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.08em; }
  .filter-select, .filter-input {
    font-family: var(--mono); font-size: 12px;
    background: var(--surface); color: var(--text);
    border: 1px solid var(--border2); border-radius: 3px;
    padding: 7px 10px; outline: none;
    transition: border-color 0.15s;
  }
  .filter-select:focus, .filter-input:focus { border-color: rgba(217,106,26,0.5); }
  .filter-select option { background: var(--bg2); }
  .search-input {
    font-family: var(--sans); font-size: 13px;
    background: var(--surface); color: var(--text);
    border: 1px solid var(--border2); border-radius: 3px;
    padding: 7px 12px; outline: none; width: 220px;
    transition: border-color 0.15s;
  }
  .search-input:focus { border-color: rgba(217,106,26,0.5); }
  .search-input::placeholder { color: var(--muted); }

  /* ── TABLE ── */
  .table-wrap {
    background: var(--surface);
    border: 1px solid var(--border2);
    border-radius: 4px; overflow: hidden;
  }
  .table-scroll { overflow-x: auto; }
  table { width: 100%; border-collapse: collapse; }
  thead { background: var(--bg3); }
  th {
    font-family: var(--mono); font-size: 10px; font-weight: 600;
    text-transform: uppercase; letter-spacing: 0.1em; color: var(--muted);
    padding: 11px 16px; text-align: left; white-space: nowrap;
    border-bottom: 1px solid var(--border2);
  }
  th:first-child { padding-left: 20px; }
  th.sortable { cursor: pointer; user-select: none; }
  th.sortable:hover { color: var(--text); }

  tbody tr {
    border-bottom: 1px solid var(--border2);
    transition: background 0.1s;
  }
  tbody tr:last-child { border-bottom: none; }
  tbody tr:hover { background: rgba(217,106,26,0.05); }

  td {
    padding: 12px 16px; font-size: 13px; color: var(--text);
    vertical-align: middle;
  }
  td:first-child { padding-left: 20px; }

  .td-name { font-weight: 500; }
  .td-email { font-family: var(--mono); font-size: 12px; color: var(--muted); }
  .td-phone { font-family: var(--mono); font-size: 12px; }
  .td-date { font-family: var(--mono); font-size: 11px; color: var(--muted); white-space: nowrap; }
  .td-msg {
    max-width: 220px; overflow: hidden;
    text-overflow: ellipsis; white-space: nowrap;
    color: var(--muted); font-size: 12px; cursor: pointer;
  }
  .td-msg:hover { color: var(--accent); }

  .badge {
    font-family: var(--mono); font-size: 10px; font-weight: 600;
    padding: 3px 8px; border-radius: 2px; letter-spacing: 0.06em;
    text-transform: uppercase; white-space: nowrap;
  }
  .badge-Electrical  { background: rgba(96,165,250,0.12); color: #60a5fa; border: 1px solid rgba(96,165,250,0.25); }
  .badge-Mechanical  { background: rgba(217,106,26,0.12); color: var(--accent2); border: 1px solid rgba(217,106,26,0.25); }
  .badge-Fire { background: rgba(239,68,68,0.12); color: #f87171; border: 1px solid rgba(239,68,68,0.25); }
  .badge-Commercial  { background: rgba(62,207,142,0.12); color: #3ecf8e; border: 1px solid rgba(62,207,142,0.25); }
  .badge-AMC         { background: rgba(167,139,250,0.12); color: #a78bfa; border: 1px solid rgba(167,139,250,0.25); }

  .copy-btn {
    font-family: var(--mono); font-size: 10px;
    background: none; border: none; cursor: pointer;
    color: var(--muted); padding: 2px 4px;
    border-radius: 2px; transition: color 0.15s;
  }
  .copy-btn:hover { color: var(--accent); }
  .copy-btn.copied { color: var(--success); }

  .td-actions { display: flex; gap: 6px; align-items: center; }
  .icon-btn {
    background: none; border: none; cursor: pointer;
    color: var(--muted); padding: 5px; border-radius: 3px;
    transition: all 0.15s; font-size: 14px; line-height: 1;
    display: inline-flex; align-items: center;
  }
  .icon-btn:hover { background: rgba(255,255,255,0.07); color: var(--text); }
  .icon-btn.del:hover { background: rgba(224,84,84,0.12); color: var(--danger); }

  /* ── EMPTY / LOADING ── */
  .empty-row td {
    text-align: center; padding: 48px;
    font-family: var(--mono); font-size: 12px; color: var(--muted);
  }

  /* ── PAGINATION ── */
  .pagination {
    display: flex; align-items: center; justify-content: space-between;
    padding: 12px 20px; background: var(--bg3);
    border-top: 1px solid var(--border2);
    font-family: var(--mono); font-size: 11px; color: var(--muted);
  }
  .page-btns { display: flex; gap: 4px; }
  .page-btn {
    background: none; border: 1px solid var(--border2);
    color: var(--muted); padding: 4px 10px; border-radius: 2px;
    cursor: pointer; font-family: var(--mono); font-size: 11px;
    transition: all 0.15s;
  }
  .page-btn:hover:not(:disabled) { border-color: var(--accent); color: var(--accent); }
  .page-btn.active { background: var(--accent); color: #fff; border-color: var(--accent); }
  .page-btn:disabled { opacity: 0.35; cursor: not-allowed; }

  /* ── MODAL ── */
  .modal-overlay {
    position: fixed; inset: 0; z-index: 200;
    background: rgba(7,16,30,0.85); backdrop-filter: blur(4px);
    display: flex; align-items: center; justify-content: center;
    padding: 20px;
    animation: fadeIn 0.15s ease;
  }
  @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
  .modal {
    background: var(--bg2);
    border: 1px solid var(--border);
    border-radius: 6px; width: 100%; max-width: 520px;
    overflow: hidden;
    animation: slideUp 0.2s ease;
    box-shadow: 0 24px 64px rgba(0,0,0,0.6);
  }
  @keyframes slideUp { from { transform: translateY(16px); opacity:0 } to { transform:none; opacity:1 } }
  .modal-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 16px 20px;
    border-bottom: 1px solid var(--border2);
  }
  .modal-title {
    font-family: var(--mono); font-size: 12px; font-weight: 600;
    text-transform: uppercase; letter-spacing: 0.1em; color: var(--accent);
  }
  .modal-close {
    background: none; border: none; cursor: pointer;
    color: var(--muted); font-size: 18px; line-height: 1;
    padding: 2px 6px; border-radius: 3px; transition: color 0.15s;
  }
  .modal-close:hover { color: var(--text); }
  .modal-body { padding: 20px; }
  .modal-footer {
    display: flex; gap: 10px; justify-content: flex-end;
    padding: 14px 20px; border-top: 1px solid var(--border2);
  }

  .msg-meta {
    display: grid; grid-template-columns: auto 1fr; gap: 8px 14px;
    margin-bottom: 16px; font-size: 13px;
  }
  .msg-meta-key { font-family: var(--mono); font-size: 11px; color: var(--muted); padding-top: 1px; }
  .msg-text {
    background: var(--surface); border: 1px solid var(--border2);
    border-radius: 3px; padding: 14px; font-size: 13px;
    line-height: 1.65; color: var(--text); white-space: pre-wrap;
    max-height: 220px; overflow-y: auto;
  }

  .confirm-text { font-size: 14px; color: var(--text); line-height: 1.6; margin-bottom: 6px; }
  .confirm-sub { font-size: 12px; color: var(--muted); font-family: var(--mono); }

  /* ── FORM FIELDS ── */
  .field { margin-bottom: 16px; }
  .field label {
    display: block; font-family: var(--mono); font-size: 10px;
    text-transform: uppercase; letter-spacing: 0.1em; color: var(--muted);
    margin-bottom: 6px;
  }
  .field input {
    width: 100%; font-family: var(--mono); font-size: 13px;
    background: var(--surface); color: var(--text);
    border: 1px solid var(--border2); border-radius: 3px;
    padding: 9px 12px; outline: none; transition: border-color 0.15s;
  }
  .field input:focus { border-color: rgba(217,106,26,0.5); }
  .field-error { font-size: 11px; color: var(--danger); margin-top: 5px; font-family: var(--mono); }

  /* ── LOGIN ── */
  .login-wrap {
    min-height: 100vh; background: var(--bg);
    display: flex; align-items: center; justify-content: center;
  }
  .login-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 6px; padding: 36px 32px; width: 100%; max-width: 340px;
    box-shadow: 0 32px 80px rgba(0,0,0,0.5);
  }
  .login-logo {
    font-family: var(--mono); font-size: 11px; font-weight: 600;
    letter-spacing: 0.14em; color: var(--accent); text-transform: uppercase;
    margin-bottom: 28px; display: flex; align-items: center; gap: 8px;
  }
  .login-logo::before {
    content: ''; display: block; width: 24px; height: 2px; background: var(--accent);
  }
  .login-title {
    font-size: 22px; font-weight: 600; color: var(--text);
    margin-bottom: 6px; letter-spacing: -0.01em;
  }
  .login-sub { font-size: 13px; color: var(--muted); margin-bottom: 28px; }
  .login-btn {
    width: 100%; background: var(--accent); color: #fff;
    border: none; border-radius: 3px; padding: 10px;
    font-family: var(--mono); font-size: 12px; font-weight: 600;
    letter-spacing: 0.08em; text-transform: uppercase; cursor: pointer;
    transition: background 0.15s;
  }
  .login-btn:hover { background: var(--accent2); }

  /* ── STATUS TOAST ── */
  .toast {
    position: fixed; bottom: 24px; right: 24px; z-index: 300;
    background: var(--bg3); border: 1px solid var(--border);
    border-radius: 4px; padding: 12px 18px;
    font-family: var(--mono); font-size: 12px; color: var(--text);
    box-shadow: 0 8px 32px rgba(0,0,0,0.4);
    animation: toastIn 0.2s ease;
    display: flex; align-items: center; gap: 10px;
  }
  @keyframes toastIn { from { opacity:0; transform: translateY(8px) } to { opacity:1; transform:none } }
  .toast-dot { width:7px; height:7px; border-radius:50%; flex-shrink:0; }

  /* ── SCROLLBAR ── */
  ::-webkit-scrollbar { width: 5px; height: 5px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.15); }
`;

// ────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const [access, setAccess] = useState(false);
  const [password, setPassword] = useState("");
  const [data, setData] = useState<Enquiry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // filters
  const [filterService, setFilterService] = useState("all");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");
  const [search, setSearch] = useState("");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  // pagination
  const PAGE_SIZE = 10;
  const [page, setPage] = useState(1);

  // modals
  const [modalType, setModalType] = useState<ModalType>(null);
  const [activeItem, setActiveItem] = useState<Enquiry | null>(null);

  // password change
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [pwError, setPwError] = useState("");

  // copy feedback
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // toast
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/contact", { cache: "no-store" });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const json = await res.json();
      setData(Array.isArray(json) ? json : []);
    } catch (err) {
      console.error(err);
      setError("Failed to load data.");
      setData([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { if (access) fetchData(); }, [access, fetchData]);

  const handleLogin = async () => {
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) { setAccess(true); setPassword(""); }
      else alert("Wrong password");
    } catch { alert("Login failed."); }
  };

  const handleDelete = async () => {
    if (!activeItem) return;
    try {
      const res = await fetch(`/api/contact/${activeItem._id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setData((d) => d.filter((x) => x._id !== activeItem._id));
      showToast("Enquiry deleted");
    } catch {
      showToast("Delete failed", false);
    } finally {
      setModalType(null);
      setActiveItem(null);
    }
  };

  const handlePasswordChange = async () => {
    setPwError("");
    if (!newPw || newPw.length < 6) { setPwError("Min 6 characters"); return; }
    if (newPw !== confirmPw) { setPwError("Passwords don't match"); return; }
    try {
      const res = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword: newPw }),
      });
      if (!res.ok) throw new Error();
      showToast("Password updated");
      setModalType(null);
      setNewPw(""); setConfirmPw("");
    } catch {
      showToast("Failed to update password", false);
    }
  };

  const copyEmail = (item: Enquiry) => {
    navigator.clipboard.writeText(item.email);
    setCopiedId(item._id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // ── FILTER + SEARCH + SORT ──
  const filtered = data
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
      return (
        d.name.toLowerCase().includes(q) ||
        d.email.toLowerCase().includes(q) ||
        d.phone.includes(q) ||
        d.message.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      const diff = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      return sortDir === "asc" ? diff : -diff;
    });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => { setPage(1); }, [filterService, filterDateFrom, filterDateTo, search]);

  // ── SERVICE STATS ──
  const svcCounts = SERVICE_OPTIONS.slice(1).map((s) => ({
    label: s,
    count: data.filter((d) => d.service === s).length,
  }));

  const badgeClass = (svc: string) => {
    if (svc === "Fire Safety") return "badge badge-Fire";
    return `badge badge-${svc}`;
  };

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
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
            </div>
            <button className="login-btn" onClick={handleLogin}>
              Authenticate →
            </button>
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

        {/* TOP BAR */}
        <header className="topbar">
          <div className="topbar-brand">
            <span className="dot" />
            hamiInfra · Enquiries
          </div>
          <div className="topbar-actions">
            <button className="btn btn-ghost" onClick={() => setModalType("password")}>
              ⚙ Password
            </button>
            <button className="btn btn-primary" onClick={fetchData} disabled={isLoading}>
              {isLoading ? "↻ Loading" : "↻ Refresh"}
            </button>
          </div>
        </header>

        <div className="content">

          {/* STATS */}
          <div className="stats-bar">
            <div className="stat">
              <span className="stat-label">Total</span>
              <span className="stat-val accent">{data.length}</span>
            </div>
            {svcCounts.map((s) => (
              <div className="stat" key={s.label}>
                <span className="stat-label">{s.label}</span>
                <span className="stat-val">{s.count}</span>
              </div>
            ))}
          </div>

          {/* FILTER BAR */}
          <div className="filter-bar">
            <div className="filter-group">
              <span className="filter-label">Service</span>
              <select
                className="filter-select"
                value={filterService}
                onChange={(e) => setFilterService(e.target.value)}
              >
                {SERVICE_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s === "all" ? "All Services" : s}</option>
                ))}
              </select>
            </div>
            <div className="filter-group">
              <span className="filter-label">From</span>
              <input
                type="date"
                className="filter-input"
                value={filterDateFrom}
                onChange={(e) => setFilterDateFrom(e.target.value)}
              />
            </div>
            <div className="filter-group">
              <span className="filter-label">To</span>
              <input
                type="date"
                className="filter-input"
                value={filterDateTo}
                onChange={(e) => setFilterDateTo(e.target.value)}
              />
            </div>
            <div className="filter-group" style={{ flex: 1 }}>
              <span className="filter-label">Search</span>
              <input
                type="text"
                className="search-input"
                placeholder="Name, email, phone, message…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ width: "100%" }}
              />
            </div>
            {(filterService !== "all" || filterDateFrom || filterDateTo || search) && (
              <button
                className="btn btn-ghost"
                style={{ alignSelf: "flex-end" }}
                onClick={() => { setFilterService("all"); setFilterDateFrom(""); setFilterDateTo(""); setSearch(""); }}
              >
                ✕ Clear
              </button>
            )}
          </div>

          {/* ERROR */}
          {error && (
            <div style={{ color: "var(--danger)", fontFamily: "var(--mono)", fontSize: 12, marginBottom: 16 }}>
              ⚠ {error}
            </div>
          )}

          {/* TABLE */}
          <div className="table-wrap">
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Contact</th>
                    <th>Service</th>
                    <th>Message</th>
                    <th
                      className="sortable"
                      onClick={() => setSortDir((d) => d === "asc" ? "desc" : "asc")}
                    >
                      Date {sortDir === "asc" ? "↑" : "↓"}
                    </th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading && (
                    <tr className="empty-row">
                      <td colSpan={7}>Loading enquiries…</td>
                    </tr>
                  )}
                  {!isLoading && paged.length === 0 && (
                    <tr className="empty-row">
                      <td colSpan={7}>No enquiries found</td>
                    </tr>
                  )}
                  {!isLoading && paged.map((item, idx) => (
                    <tr key={item._id}>
                      <td style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--muted)" }}>
                        {(page - 1) * PAGE_SIZE + idx + 1}
                      </td>
                      <td className="td-name">{item.name}</td>
                      <td>
                        <div className="td-email">
                          {item.email}
                          <button
                            className={`copy-btn${copiedId === item._id ? " copied" : ""}`}
                            onClick={() => copyEmail(item)}
                          >
                            {copiedId === item._id ? "✓" : "copy"}
                          </button>
                        </div>
                        <div className="td-phone">{item.phone}</div>
                      </td>
                      <td>
                        <span className={badgeClass(item.service)}>{item.service}</span>
                      </td>
                      <td
                        className="td-msg"
                        onClick={() => { setActiveItem(item); setModalType("message"); }}
                      >
                        {item.message}
                      </td>
                      <td className="td-date">
                        {new Date(item.createdAt).toLocaleDateString("en-IN", {
                          day: "2-digit", month: "short", year: "numeric"
                        })}
                        <br />
                        <span style={{ fontSize: 10 }}>
                          {new Date(item.createdAt).toLocaleTimeString("en-IN", {
                            hour: "2-digit", minute: "2-digit"
                          })}
                        </span>
                      </td>
                      <td>
                        <div className="td-actions">
                          <button
                            className="icon-btn"
                            title="View message"
                            onClick={() => { setActiveItem(item); setModalType("message"); }}
                          >
                            👁
                          </button>
                          <button
                            className="icon-btn del"
                            title="Delete"
                            onClick={() => { setActiveItem(item); setModalType("delete"); }}
                          >
                            🗑
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* PAGINATION */}
            <div className="pagination">
              <span>
                {filtered.length === 0
                  ? "0 results"
                  : `${(page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, filtered.length)} of ${filtered.length}`}
              </span>
              <div className="page-btns">
                <button className="page-btn" disabled={page === 1} onClick={() => setPage(1)}>«</button>
                <button className="page-btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}>‹</button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const p = Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
                  return (
                    <button
                      key={p}
                      className={`page-btn${p === page ? " active" : ""}`}
                      onClick={() => setPage(p)}
                    >
                      {p}
                    </button>
                  );
                })}
                <button className="page-btn" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>›</button>
                <button className="page-btn" disabled={page === totalPages} onClick={() => setPage(totalPages)}>»</button>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── MODAL: Message ── */}
      {modalType === "message" && activeItem && (
        <div className="modal-overlay" onClick={() => setModalType(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">Enquiry Detail</span>
              <button className="modal-close" onClick={() => setModalType(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="msg-meta">
                <span className="msg-meta-key">Name</span>
                <span>{activeItem.name}</span>
                <span className="msg-meta-key">Email</span>
                <span style={{ fontFamily: "var(--mono)", fontSize: 12 }}>{activeItem.email}</span>
                <span className="msg-meta-key">Phone</span>
                <span style={{ fontFamily: "var(--mono)", fontSize: 12 }}>{activeItem.phone}</span>
                <span className="msg-meta-key">Service</span>
                <span><span className={badgeClass(activeItem.service)}>{activeItem.service}</span></span>
                <span className="msg-meta-key">Date</span>
                <span style={{ fontFamily: "var(--mono)", fontSize: 12 }}>
                  {new Date(activeItem.createdAt).toLocaleString("en-IN")}
                </span>
              </div>
              <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--muted)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.1em" }}>Message</div>
              <div className="msg-text">{activeItem.message}</div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => copyEmail(activeItem)}>
                {copiedId === activeItem._id ? "✓ Copied" : "Copy Email"}
              </button>
              <button
                className="btn btn-danger"
                onClick={() => setModalType("delete")}
              >
                Delete
              </button>
              <button className="btn btn-primary" onClick={() => setModalType(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: Delete Confirm ── */}
      {modalType === "delete" && activeItem && (
        <div className="modal-overlay" onClick={() => setModalType(null)}>
          <div className="modal" style={{ maxWidth: 420 }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title" style={{ color: "var(--danger)" }}>Confirm Delete</span>
              <button className="modal-close" onClick={() => setModalType(null)}>✕</button>
            </div>
            <div className="modal-body">
              <p className="confirm-text">
                Delete enquiry from <strong>{activeItem.name}</strong>?
              </p>
              <p className="confirm-sub">{activeItem.email} · {activeItem.service}</p>
              <p style={{ marginTop: 12, fontSize: 12, color: "var(--muted)" }}>This action cannot be undone.</p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setModalType(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: Change Password ── */}
      {modalType === "password" && (
        <div className="modal-overlay" onClick={() => setModalType(null)}>
          <div className="modal" style={{ maxWidth: 400 }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">Change Password</span>
              <button className="modal-close" onClick={() => setModalType(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="field">
                <label>New Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={newPw}
                  onChange={(e) => { setNewPw(e.target.value); setPwError(""); }}
                />
              </div>
              <div className="field">
                <label>Confirm Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPw}
                  onChange={(e) => { setConfirmPw(e.target.value); setPwError(""); }}
                  onKeyDown={(e) => e.key === "Enter" && handlePasswordChange()}
                />
                {pwError && <p className="field-error">{pwError}</p>}
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => { setModalType(null); setNewPw(""); setConfirmPw(""); setPwError(""); }}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handlePasswordChange}>
                Update Password
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast && (
        <div className="toast">
          <span className="toast-dot" style={{ background: toast.ok ? "var(--success)" : "var(--danger)" }} />
          {toast.msg}
        </div>
      )}
    </>
  );
}
