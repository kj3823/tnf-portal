import {
  ArrowUpRight,
  Clock3,
  FileCheck2,
  FilePlus2,
  Filter,
  MoreHorizontal,
  Plus,
  Search,
  TriangleAlert,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const issues = [
  { id: "TNF-2026-00123", title: "Intermittent camera unavailable", vehicle: "V-1842", line: "Line X", status: "Submitted", date: "Aug 21, 2026" },
  { id: "TNF-2026-00119", title: "Cluster reboots after ignition cycle", vehicle: "V-1774", line: "Line Y", status: "Under Review", date: "Aug 20, 2026" },
  { id: "TNF-2026-00114", title: "Unexpected diagnostic warning", vehicle: "V-1908", line: "Line X", status: "Draft", date: "Aug 19, 2026" },
  { id: "TNF-2026-00107", title: "Audio dropout during hands-free call", vehicle: "V-1631", line: "Line Z", status: "Resolved", date: "Aug 18, 2026" },
];

function Status({ value }: { value: string }) {
  return <span className={`status-pill ${value.toLowerCase().replace(" ", "-")}`}>{value}</span>;
}

export function Dashboard() {
  const navigate = useNavigate();

  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">OVERVIEW</div>
          <h1>Good evening, KJ.</h1>
          <p>Here’s what’s happening with your TNF writeups.</p>
        </div>
        <button className="primary-button" onClick={() => navigate("/tnf/new")}>
          <Plus size={18} /> Create TNF
        </button>
      </div>

      <div className="metric-grid">
        <div className="metric-card">
          <div className="metric-icon blue"><FilePlus2 size={20} /></div>
          <div><span className="metric-label">Total created</span><strong>24</strong><small><ArrowUpRight size={13} /> 18% this month</small></div>
        </div>
        <div className="metric-card">
          <div className="metric-icon amber"><Clock3 size={20} /></div>
          <div><span className="metric-label">In progress</span><strong>5</strong><small>2 need your attention</small></div>
        </div>
        <div className="metric-card">
          <div className="metric-icon green"><FileCheck2 size={20} /></div>
          <div><span className="metric-label">Resolved</span><strong>17</strong><small>71% resolution rate</small></div>
        </div>
        <div className="metric-card">
          <div className="metric-icon red"><TriangleAlert size={20} /></div>
          <div><span className="metric-label">Existing issues</span><strong>8</strong><small>Linked to other system</small></div>
        </div>
      </div>

      <section className="content-card">
        <div className="card-header">
          <div>
            <h2>Recent TNF writeups</h2>
            <p>Your latest issue documentation</p>
          </div>
          <button className="ghost-button"><Filter size={16} /> Filter</button>
        </div>

        <div className="table-toolbar">
          <div className="search-box"><Search size={17} /><input placeholder="Search by TNF, vehicle or issue..." /></div>
          <button className="ghost-button"><MoreHorizontal size={18} /></button>
        </div>

        <div className="issue-table">
          <div className="table-row table-head">
            <span>TNF / ISSUE</span><span>VEHICLE</span><span>LINE</span><span>STATUS</span><span>DATE</span><span />
          </div>
          {issues.map((issue) => (
            <div className="table-row" key={issue.id}>
              <div className="issue-cell"><strong>{issue.id}</strong><span>{issue.title}</span></div>
              <span className="mono">{issue.vehicle}</span>
              <span>{issue.line}</span>
              <Status value={issue.status} />
              <span>{issue.date}</span>
              <button className="row-action" onClick={() => navigate("/tnf/123")}><ArrowUpRight size={17} /></button>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
