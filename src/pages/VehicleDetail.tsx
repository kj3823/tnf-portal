import {
    ArrowLeft,
    ArrowUpRight,
    CarFront,
    ClipboardPlus,
    Link2,
    MapPin,
    PackageSearch,
    Phone,
    Star,
    UserRound,
    Wrench
} from "lucide-react";
import {useNavigate, useParams} from "react-router-dom";
import {vehicles} from "../mock/vehicles";
import {VehicleStatus} from "../components/VehicleStatus";

export function VehicleDetail() {
    const nav = useNavigate(), {vin} = useParams(), v = vehicles.find(x => x.vin === vin) || vehicles[0];
    return <>
        <div className="detail-top">
            <button className="back-link" onClick={() => nav('/vehicles')}><ArrowLeft size={14}/>Back to Investigation
                Queue
            </button>
            <button className="primary-button" onClick={() => nav(`/tnf/new?vin=${encodeURIComponent(v.vin)}`)}>
                <ClipboardPlus size={14}/>{v.tnfs.length ? 'Create another TNF' : 'Write TNF from vehicle'}</button>
        </div>
        <div className="vehicle-hero">
            <div className="vehicle-hero-icon"><CarFront size={24}/></div>
            <div className="vehicle-hero-main">
                <div className="eyebrow">FIELD INVESTIGATION VEHICLE</div>
                <h1>{v.my} {v.family} · {v.issueBucket}</h1><p className="mono">{v.vin}</p>
                <div className="issue-meta"><span><Wrench size={12}/>{v.engine} · {v.fuelType}</span><span><MapPin
                    size={12}/>{v.dealerName}, {v.city}</span><span><UserRound size={12}/>{v.owner}</span></div>
            </div>
            <div className="vehicle-hero-status"><VehicleStatus value={v.status}/></div>
        </div>
        <div className="vehicle-detail-grid">
            <div className="detail-main"><Card n="01" title="Vehicle & Repair Information">
                <div
                    className="vehicle-grid">{[["VIN", v.vin], ["MY / Family", `${v.my} / ${v.family}`], ["Engine / Fuel", `${v.engine} / ${v.fuelType}`], ["Odometer", v.odometer], ["RO Open Date", v.roOpenDate], ["Days Down / Repairs", `${v.daysDown} days / ${v.repairCount} repairs`]].map(x =>
                    <Datum key={x[0]} label={x[0]} value={x[1]}/>)}</div>
            </Card><Card n="02" title="Investigation Intake">
                <div
                    className="vehicle-grid">{[["Issue Bucket", v.issueBucket], ["Identified On", v.identifiedOn], ["Reason", v.reason], ["Date Added", v.dateAdded], ["Most Recent Date", v.mostRecentDate], ["Total Days", String(v.totalDays)]].map(x =>
                    <Datum key={x[0]} label={x[0]} value={x[1]}/>)}</div>
            </Card><Card n="03" title="Engineering Review">
                <div className="review-block">
                    <div><strong>INITIAL REVIEW</strong><small>Vehicle notes and first assessment</small></div>
                    <p>{v.initialReview}</p></div>
                <div className="review-block final">
                    <div><strong>FINAL REVIEW</strong><small>Further actions, GIMs and SIRIUS direction</small></div>
                    <p>{v.finalReview}</p></div>
            </Card><Card n="04" title="TNF & Known Issue Connections">
                <div className="connection-grid">
                    <div>
                        <div className="connection-title"><Wrench size={14}/>TNF Writeups <span>{v.tnfs.length}</span>
                        </div>
                        {v.tnfs.length ? v.tnfs.map(id => <button className="connection-row" key={id}
                                                                  onClick={() => nav(`/tnf/${id}`)}>
                            <div><strong>{id}</strong><span>Open TNF record</span></div>
                            <ArrowUpRight size={14}/></button>) : <div className="connection-empty">No TNF yet.</div>}
                    </div>
                    <div>
                        <div className="connection-title"><Link2 size={14}/>Linked GIMs <span>{v.gims.length}</span>
                        </div>
                        {v.gims.length ? v.gims.map(id => <div className="connection-row" key={id}>
                            <div><strong>{id}</strong><span>Known issue / SIRIUS action</span></div>
                        </div>) : <div className="connection-empty">No GIM linked.</div>}</div>
                </div>
            </Card></div>
            <aside className="detail-side"><Side title="Workflow Control">
                <div className="status-summary">
                    <div><span>Status</span><VehicleStatus value={v.status}/></div>
                    <div><span>Review Status</span><strong>{v.reviewStatus}</strong></div>
                    <div><span>Visit Dealer</span><strong>{v.visitDealer}</strong></div>
                    <div><span>SEAL</span><strong>{v.seal}</strong></div>
                </div>
            </Side><Side title="Dealer Information">
                <div className="info-list"><Datum label="Dealer" value={v.dealer}/><Datum label="Name"
                                                                                          value={v.dealerName}/><Datum
                    label="City" value={v.city}/><Datum label="Contact" value={v.dealerContact}/></div>
            </Side><Side title="Case Information">
                <div className="info-list"><Datum label="STAR Case ID" value={v.starCaseId || 'Not linked'}/><Datum
                    label="Owner" value={v.owner}/></div>
            </Side><Side title="Parts Monitoring">{v.parts.length ? v.parts.map(x => <div className="part-row" key={x}>
                    <PackageSearch size={14}/><strong>{x}</strong></div>) :
                <p className="empty-value">No parts being monitored.</p>}</Side></aside>
        </div>
    </>
}

function Card({n, title, children}: { n: string; title: string; children: React.ReactNode }) {
    return <section className="detail-card">
        <div className="detail-card-header">
            <div><span className="detail-index">{n}</span><h2>{title}</h2></div>
        </div>
        {children}</section>
}

function Side({title, children}: { title: string; children: React.ReactNode }) {
    return <section className="detail-card">
        <div className="side-title">{title}</div>
        {children}</section>
}

function Datum({label, value}: { label: string; value: string }) {
    return <div><span>{label}</span><strong>{value}</strong></div>
}