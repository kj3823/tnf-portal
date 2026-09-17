import {useMemo, useState} from "react";
import {
    ArrowUpRight,
    CalendarCheck,
    CarFront,
    ClipboardList,
    Clock3,
    Filter,
    PackageSearch,
    Search,
    Wrench
} from "lucide-react";
import {useNavigate} from "react-router-dom";
import {vehicles} from "../mock/vehicles";
import {VehicleStatus} from "../components/VehicleStatus";

export function VehicleTracker() {
    const nav = useNavigate(), [q, setQ] = useState(""), [line, setLine] = useState(""), [status, setStatus] = useState("");
    const rows = useMemo(() => vehicles.filter(v => (!q || [v.vin, v.city, v.dealerName, v.reason, v.starCaseId, ...v.gims, ...v.tnfs].join(" ").toLowerCase().includes(q.toLowerCase())) && (!line || v.family === line) && (!status || v.status === status)), [q, line, status]);
    return <>
        <div className="page-heading">
            <div>
                <div className="eyebrow">FIELD INVESTIGATION WORKFLOW</div>
                <h1>Investigation Queue</h1><p>Vehicles from intake through dealer visit, TNF writeup, GIM action, parts
                monitoring and closure.</p></div>
        </div>
        <div className="workflow-strip"><Flow icon={<ClipboardList size={15}/>} title="Vehicle identified"
                                              text="Added from vehicle list"/><i/><Flow
            icon={<CalendarCheck size={15}/>} title="Review & visit" text="Dealer investigation"/><i/><Flow
            icon={<Wrench size={15}/>} title="Write TNF" text="Findings and actions"/><i/><Flow
            icon={<PackageSearch size={15}/>} title="Monitor & close" text="Parts and final review"/></div>
        <div className="metric-grid"><Metric label="Vehicles in queue" value={rows.length}
                                             icon={<CarFront size={17}/>}/><Metric label="Visits required"
                                                                                   value={rows.filter(x => x.visitDealer === 'Yes').length}
                                                                                   icon={<CalendarCheck
                                                                                       size={17}/>}/><Metric
            label="Parts monitors" value={rows.filter(x => x.status === 'Parts Monitor').length}
            icon={<PackageSearch size={17}/>}/><Metric label="Avg. days down"
                                                       value={rows.length ? Math.round(rows.reduce((a, b) => a + b.daysDown, 0) / rows.length) : 0}
                                                       icon={<Clock3 size={17}/>}/></div>
        <section className="content-card tracker-card">
            <div className="card-header">
                <div><h2>Vehicle investigation queue</h2><p>Aligned to the current Excel tracking fields</p></div>
                <button className="ghost-button"><Filter size={13}/>Filters</button>
            </div>
            <div className="tracker-toolbar"><label className="search-box tracker-search"><Search size={14}/><input
                value={q} onChange={e => setQ(e.target.value)}
                placeholder="Search VIN, city, dealer, concern, STAR case, GIM, TNF..."/></label><select
                className="filter-select" value={line} onChange={e => setLine(e.target.value)}>
                <option value="">All families</option>
                <option>WL</option>
                <option>RU</option>
                <option>DT</option>
            </select><select className="filter-select" value={status} onChange={e => setStatus(e.target.value)}>
                <option value="">All statuses</option>
                {["Awaiting Review", "Dealer Contact", "Visit Scheduled", "Initial Review", "Final Review", "Parts Monitor", "Resolved"].map(x =>
                    <option key={x}>{x}</option>)}</select></div>
            <div className="vehicle-table">
                <div className="vehicle-row vehicle-head">
                    <div>VIN / ISSUE</div>
                    <div>FAMILY</div>
                    <div>DEALER / CITY</div>
                    <div>DAYS DOWN</div>
                    <div>REPAIRS</div>
                    <div>STATUS / REVIEW</div>
                    <div/>
                </div>
                {rows.map(v => <button className="vehicle-row" key={v.vin} onClick={() => nav(`/vehicles/${v.vin}`)}>
                    <div className="vehicle-primary">
                        <strong>{v.my} {v.family} · {v.issueBucket}</strong><span>{v.vin}</span><small>{v.reason}</small>
                    </div>
                    <div><strong>{v.family}</strong><small>{v.engine}</small></div>
                    <div><strong>{v.dealer}</strong><small>{v.dealerName} · {v.city}</small></div>
                    <div><strong
                        className={v.daysDown >= 5 ? 'attention-number' : ''}>{v.daysDown}</strong><small>RO {v.roOpenDate}</small>
                    </div>
                    <div><strong>{v.repairCount}</strong><small>{v.starCaseId || 'No STAR case'}</small></div>
                    <div><VehicleStatus value={v.status}/><small>{v.reviewStatus}</small></div>
                    <ArrowUpRight size={14}/></button>)}</div>
        </section>
    </>
};

function Flow({icon, title, text}: { icon: React.ReactNode; title: string; text: string }) {
    return <div className="flow-step">
        <div className="flow-icon">{icon}</div>
        <div><strong>{title}</strong><span>{text}</span></div>
    </div>
}

function Metric({label, value, icon}: { label: string; value: number; icon: React.ReactNode }) {
    return <div className="metric-card">
        <div className="metric-icon blue">{icon}</div>
        <div><span className="metric-label">{label}</span><strong>{value}</strong></div>
    </div>
}