import {
    ArrowLeft,
    CalendarDays,
    Car,
    FileText,
    Link2,
    MapPin,
    UserRound,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { appStore } from "../data/appStore";

export function TNFDetail() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const record = id ? appStore.getTNF(id) : undefined;
    const investigation = record
        ? appStore.getInvestigationByVIN(record.sourceVin)
        : undefined;

    if (!record) {
        return (
            <>
                <button
                    className="back-link"
                    onClick={() => navigate("/tnf/search")}
                >
                    <ArrowLeft size={14} />
                    Back to TNF Search
                </button>

                <section className="content-card tnf-not-found">
                    <h2>TNF Not Found</h2>
                    <p>
                        The requested TNF record could not be found in the application
                        store.
                    </p>
                </section>
            </>
        );
    }

    return (
        <>
            <div className="detail-top">
                <button
                    className="back-link"
                    onClick={() => navigate("/tnf/search")}
                >
                    <ArrowLeft size={14} />
                    Back to TNF Search
                </button>
            </div>

            <section className="issue-hero-card">
                <div className="issue-hero-main">
                    <div className="eyebrow">TNF ISSUE</div>
                    <h1>{record.id}</h1>
                    <p>{record.title}</p>

                    <div className="issue-meta">
            <span>
              <Car size={12} />
                {record.modelYear} {record.vehicleLine}
            </span>

                        <span>
              <MapPin size={12} />
                            {record.city || "City not entered"}
            </span>

                        <span>
              <UserRound size={12} />
                            {record.owner}
            </span>

                        <span>
              <CalendarDays size={12} />
              Updated {record.updatedDate}
            </span>
                    </div>
                </div>

                <div className="hero-status">
          <span
              className={`status-pill ${record.status
                  .toLowerCase()
                  .replace(/ /g, "-")}`}
          >
            {record.status}
          </span>
                </div>
            </section>

            <div className="detail-grid">
                <div className="detail-main">
                    <DetailCard number="01" title="Vehicle Information">
                        <div className="vehicle-grid">
                            <DetailValue label="VIN" value={record.sourceVin} />
                            <DetailValue
                                label="Model Year / Vehicle Line"
                                value={`${record.modelYear} / ${record.vehicleLine}`}
                            />
                            <DetailValue label="Dealer" value={record.dealer} />
                            <DetailValue label="City" value={record.city} />
                            <DetailValue label="Owner" value={record.owner} />
                            <DetailValue label="Status" value={record.status} />
                        </div>
                    </DetailCard>

                    <DetailCard number="02" title="Issue Summary">
                        <div className="detail-copy">
                            <h3>Issue Bucket</h3>
                            <p>{record.issueBucket || "Not assigned"}</p>

                            <h3>Observed Concern</h3>
                            <p>{record.observedConcern || "No concern entered."}</p>
                        </div>
                    </DetailCard>

                    <DetailCard number="03" title="Investigation Findings">
                        <div className="detail-copy">
                            <p>{record.findings || "No findings entered."}</p>
                        </div>
                    </DetailCard>

                    <DetailCard number="04" title="Final Review">
                        <div className="detail-copy">
                            <p>{record.finalReview || "No final review entered."}</p>
                        </div>
                    </DetailCard>

                    {investigation && (
                        <DetailCard number="05" title="Related Vehicle Investigation">
                            <div className="vehicle-grid">
                                <DetailValue
                                    label="Review Status"
                                    value={investigation.reviewStatus}
                                />
                                <DetailValue
                                    label="Days Down"
                                    value={String(investigation.daysDown)}
                                />
                                <DetailValue
                                    label="Repair Count"
                                    value={String(investigation.repairCount)}
                                />
                                <DetailValue
                                    label="Investigation Status"
                                    value={investigation.status}
                                />
                                <DetailValue
                                    label="Most Recent Date"
                                    value={investigation.mostRecentDate}
                                />
                                <DetailValue
                                    label="Parts Being Monitored"
                                    value={
                                        investigation.parts.length
                                            ? investigation.parts.join(", ")
                                            : "None"
                                    }
                                />
                            </div>
                        </DetailCard>
                    )}
                </div>

                <aside className="detail-side">
                    <section className="detail-card">
                        <div className="side-title">
                            Related GIMs
                            <Link2 size={15} />
                        </div>

                        {record.gimIds.length > 0 ? (
                            <div className="gim-list">
                                {record.gimIds.map((gim) => (
                                    <div className="gim-item" key={gim}>
                                        <strong>{gim}</strong>
                                        {/*<span>Known issue reference</span>*/}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="empty-value">No related GIMs linked.</p>
                        )}
                    </section>

                    <section className="detail-card">
                        <div className="side-title">
                            Record Information
                            <FileText size={15} />
                        </div>

                        <div className="info-list">
                            <InfoRow label="Created" value={record.createdDate} />
                            <InfoRow label="Updated" value={record.updatedDate} />
                            <InfoRow label="Owner" value={record.owner} />
                            <InfoRow label="Vehicle Line" value={record.vehicleLine} />
                            <InfoRow label="Issue Bucket" value={record.issueBucket} />
                        </div>
                    </section>

                    {investigation && (
                        <section className="detail-card">
                            <div className="side-title">Risk / Aging</div>

                            <div className="info-list">
                                <InfoRow
                                    label="High Risk"
                                    value={
                                        investigation.daysDown > 30 &&
                                        !["Closed", "Resolved", "Complete"].includes(
                                            investigation.status,
                                        )
                                            ? "Yes"
                                            : "No"
                                    }
                                />
                                <InfoRow
                                    label="Days Down"
                                    value={String(investigation.daysDown)}
                                />
                                <InfoRow
                                    label="Repair Count"
                                    value={String(investigation.repairCount)}
                                />
                            </div>
                        </section>
                    )}
                </aside>
            </div>
        </>
    );
}

function DetailCard({
                        number,
                        title,
                        children,
                    }: {
    number: string;
    title: string;
    children: React.ReactNode;
}) {
    return (
        <section className="detail-card">
            <div className="detail-card-header">
                <div>
                    <span className="detail-index">{number}</span>
                    <h2>{title}</h2>
                </div>
            </div>

            {children}
        </section>
    );
}

function DetailValue({
                         label,
                         value,
                     }: {
    label: string;
    value?: string;
}) {
    return (
        <div>
            <span>{label}</span>
            <strong>{value || "Not entered"}</strong>
        </div>
    );
}

function InfoRow({ label, value }: { label: string; value?: string }) {
    return (
        <div>
            <span>{label}</span>
            <strong>{value || "Not entered"}</strong>
        </div>
    );
}
