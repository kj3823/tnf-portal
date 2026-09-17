import {
  Activity, ArrowDownRight, ArrowUpRight, BarChart3, CalendarDays,
  CheckCircle2, Download, FileText, Filter, Link2, RefreshCw,
  ShieldCheck, TrendingUp, Users
} from "lucide-react";

const lines = [
  { name: "Line X", count: 42, pct: 84 },
  { name: "Line Y", count: 31, pct: 62 },
  { name: "Line Z", count: 18, pct: 36 },
  { name: "Line A", count: 11, pct: 22 },
];

const recent = [
  ["TNF-2026-00123", "Intermittent camera unavailable", "Line X", "Submitted", "4:32 PM"],
  ["TNF-2026-00122", "Cluster reboots after ignition cycle", "Line Y", "Under Review", "3:48 PM"],
  ["TNF-2026-00121", "Audio dropout during hands-free call", "Line Z", "Resolved", "2:17 PM"],
  ["TNF-2026-00120", "Parking sensor unavailable", "Line X", "Submitted", "1:54 PM"],
];

const trend = [36, 48, 42, 61, 53, 72, 58];

function Status({ value }: { value: string }) {
  return <span className={`status-pill ${value.toLowerCase().replace(" ", "-")}`}>{value}</span>;
}

export function SuperuserDashboard() {
  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">SUPERUSER / OPERATIONS</div>
          <h1>TNF Overview</h1>
          <p>Weekly activity, issue trends, and engineering workload across the TNF portal.</p>
        </div>
        <div className="heading-actions">
          <button className="ghost-button"><CalendarDays size={15} /> Aug 17 – Aug 23, 2026</button>
          <button className="primary-button"><Download size={16} /> Generate Weekly Report</button>
        </div>
      </div>

      <div className="admin-banner">
        <div className="admin-banner-icon"><ShieldCheck size={18} /></div>
        <div><strong>Superuser view</strong><span>You have access to aggregate activity, reporting, and system-level TNF metrics.</span></div>
        <button><RefreshCw size={14} /> Refresh data</button>
      </div>

      <section className="metric-grid admin-metrics">
        <div className="metric-card"><div className="metric-icon blue"><FileText size={18} /></div><span>Total TNFs</span><strong>147</strong><small className="up"><ArrowUpRight size={12} /> 18.4% vs last week</small></div>
        <div className="metric-card"><div className="metric-icon orange"><Activity size={18} /></div><span>New this week</span><strong>32</strong><small className="up"><ArrowUpRight size={12} /> 6 more than last week</small></div>
        <div className="metric-card"><div className="metric-icon purple"><TrendingUp size={18} /></div><span>Under review</span><strong>19</strong><small><ArrowDownRight size={12} /> 3 fewer than last week</small></div>
        <div className="metric-card"><div className="metric-icon green"><CheckCircle2 size={18} /></div><span>Resolved this week</span><strong>24</strong><small className="up"><ArrowUpRight size={12} /> 12.5% vs last week</small></div>
      </section>

      <div className="admin-grid">
        <section className="content-card chart-card">
          <div className="admin-card-header">
            <div><h2>Weekly TNF activity</h2><p>Submitted and updated writeups over the selected period.</p></div>
            <button className="ghost-button compact"><Filter size={14} /> All activity</button>
          </div>
          <div className="chart-summary"><strong>32</strong><span>new TNFs this week</span><b><ArrowUpRight size={12}/> 18.4%</b></div>
          <div className="bar-chart">
            {trend.map((value, i) => (
              <div className="bar-column" key={i}><div className="bar-value">{value}</div><div className="bar" style={{height:`${value}%`}}></div><span>{["Mon","Tue","Wed","Thu","Fri","Sat","Sun"][i]}</span></div>
            ))}
          </div>
        </section>

        <section className="content-card">
          <div className="admin-card-header"><div><h2>TNFs by vehicle line</h2><p>Current reporting period</p></div><BarChart3 size={17} className="muted-icon"/></div>
          <div className="line-list">
            {lines.map((line) => <div className="line-item" key={line.name}><div className="line-top"><strong>{line.name}</strong><span>{line.count}</span></div><div className="progress-track"><div className="progress-fill" style={{width:`${line.pct}%`}}></div></div></div>)}
          </div>
        </section>
      </div>

      <div className="admin-grid lower">
        <section className="content-card">
          <div className="admin-card-header"><div><h2>Existing issue linkage</h2><p>How often TNFs reference an existing issue.</p></div><Link2 size={17} className="muted-icon"/></div>
          <div className="linkage-number"><strong>68%</strong><span>of TNFs linked to an existing issue</span></div>
          <div className="donut-wrap"><div className="donut"><div><strong>100%</strong><span>TNFs</span></div></div><div className="legend"><span><i className="dot linked"></i> Linked <b>100</b></span><span><i className="dot unlinked"></i> New issue <b>47</b></span></div></div>
        </section>

        <section className="content-card">
          <div className="admin-card-header"><div><h2>Most active issue areas</h2><p>Top issue categories this week.</p></div><span className="tiny-label">TOP 5</span></div>
          <div className="rank-list">
            {["Camera / Vision","Infotainment","Diagnostics","Connectivity","Driver Assistance"].map((name,i)=><div className="rank-row" key={name}><span className="rank">{String(i+1).padStart(2,"0")}</span><strong>{name}</strong><span>{[14,9,7,6,4][i]} TNFs</span></div>)}
          </div>
        </section>
      </div>

      <section className="content-card recent-admin">
        <div className="admin-card-header"><div><h2>Recent activity</h2><p>Latest TNF submissions and status changes.</p></div><button className="ghost-button compact">View all <ArrowUpRight size={13}/></button></div>
        <div className="issue-table">
          <div className="table-row table-head"><span>TNF / ISSUE</span><span>LINE</span><span>STATUS</span><span>TIME</span><span /></div>
          {recent.map(([id,title,line,status,time])=><div className="table-row result-row" key={id}><div className="issue-cell"><strong>{id}</strong><span>{title}</span></div><span>{line}</span><Status value={status}/><span>{time}</span><span className="row-action"><ArrowUpRight size={17}/></span></div>)}
        </div>
      </section>

      <section className="report-callout">
        <div className="report-icon"><FileText size={20}/></div>
        <div><strong>Weekly TNF report</strong><span>Generate a summarized report containing activity, vehicle-line distribution, status changes, and issue linkage for Aug 17 – Aug 23.</span></div>
        <button className="primary-button"><Download size={16} /> Generate report</button>
      </section>
    </>
  );
}
