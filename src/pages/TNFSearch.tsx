import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { appStore, type TNFRecord } from "../data/appStore";

export function TNFSearch() {
    const navigate = useNavigate();
    const [query, setQuery] = useState("");
    const [vehicleLine, setVehicleLine] = useState("");
    const [status, setStatus] = useState("");
    const [records, setRecords] = useState<TNFRecord[]>(() => appStore.getTNFs());

    useEffect(() => {
        const refreshRecords = () => setRecords(appStore.getTNFs());

        window.addEventListener("tnf-store-change", refreshRecords);
        return () => window.removeEventListener("tnf-store-change", refreshRecords);
    }, []);

    const vehicleLines = useMemo(
        () => [...new Set(records.map((record) => record.vehicleLine))].sort(),
        [records],
    );

    const filteredRecords = useMemo(() => {
        const normalizedQuery = query.trim().toLowerCase();

        return records
            .filter((record) => {
                const searchableText = [
                    record.id,
                    record.sourceVin,
                    record.title,
                    record.vehicleLine,
                    record.modelYear,
                    record.city,
                    record.dealer,
                    record.issueBucket,
                    record.status,
                    record.owner,
                    record.observedConcern,
                    record.findings,
                    record.finalReview,
                    ...record.gimIds,
                ]
                    .join(" ")
                    .toLowerCase();

                return (
                    (!normalizedQuery || searchableText.includes(normalizedQuery)) &&
                    (!vehicleLine || record.vehicleLine === vehicleLine) &&
                    (!status || record.status === status)
                );
            })
            .sort((a, b) => b.updatedDate.localeCompare(a.updatedDate));
    }, [records, query, vehicleLine, status]);

    const hasFilters = Boolean(query || vehicleLine || status);

    function clearFilters() {
        setQuery("");
        setVehicleLine("");
        setStatus("");
    }

    return (
        <>
            <div className="page-heading">
                <div>
                    <div className="eyebrow">SEARCH</div>
                    <h1>TNF Knowledge Library</h1>
                    <p>Search application-owned TNFs by VIN, GIM, issue, vehicle line, dealer, owner, concern, or findings.</p>
                </div>
            </div>

            <div className="search-panel tnf-search-controls">
                <label className="search-large">
                    <Search size={16} />
                    <input
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="Search TNF, VIN, GIM, concern, dealer..."
                    />
                    {query && (
                        <button
                            type="button"
                            className="clear-search-button"
                            onClick={() => setQuery("")}
                            aria-label="Clear search"
                        >
                            <X size={13} />
                        </button>
                    )}
                </label>

                <select
                    className="filter-select"
                    value={vehicleLine}
                    onChange={(event) => setVehicleLine(event.target.value)}
                >
                    <option value="">All vehicle lines</option>
                    {vehicleLines.map((line) => (
                        <option key={line} value={line}>{line}</option>
                    ))}
                </select>

                <select
                    className="filter-select"
                    value={status}
                    onChange={(event) => setStatus(event.target.value)}
                >
                    <option value="">All statuses</option>
                    <option value="Draft">Draft</option>
                    <option value="Submitted">Submitted</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Resolved">Resolved</option>
                </select>
            </div>

            <div className="tnf-search-summary">
                <div>
                    <strong>{filteredRecords.length}</strong>
                    <span>{filteredRecords.length === 1 ? "result" : "results"}</span>
                </div>

                {hasFilters && (
                    <button type="button" className="ghost-button" onClick={clearFilters}>
                        <X size={12} />
                        Clear filters
                    </button>
                )}
            </div>

            <section className="content-card tnf-search-results">
                <div className="tnf-search-row tnf-search-head">
                    <div>TNF / ISSUE</div>
                    <div>VIN / LINE</div>
                    <div>BUCKET / GIM</div>
                    <div>STATUS</div>
                    <div>UPDATED</div>
                    <div />
                </div>

                {filteredRecords.map((record) => (
                    <button
                        key={record.id}
                        type="button"
                        className="tnf-search-row tnf-search-result"
                        onClick={() => navigate(`/tnf/${record.id}`)}
                    >
                        <div className="issue-cell">
                            <strong>{record.id}</strong>
                            <span>{record.title}</span>
                            <small>{record.observedConcern}</small>
                        </div>

                        <div className="tnf-search-stack">
                            <strong className="mono">{record.sourceVin}</strong>
                            <span>{record.modelYear} {record.vehicleLine} · {record.city}</span>
                        </div>

                        <div className="tnf-search-stack">
                            <strong>{record.issueBucket}</strong>
                            <span>{record.gimIds.length ? record.gimIds.join(", ") : "No GIM linked"}</span>
                        </div>

                        <div>
              <span className={`status-pill ${record.status.toLowerCase().replace(/ /g, "-")}`}>
                {record.status}
              </span>
                        </div>

                        <div className="tnf-search-stack">
                            <strong>{record.updatedDate}</strong>
                            <span>{record.owner}</span>
                        </div>

                        <ArrowUpRight size={14} />
                    </button>
                ))}

                {filteredRecords.length === 0 && (
                    <div className="tnf-search-empty">
                        <Search size={22} />
                        <strong>No matching TNFs found</strong>
                        <span>Try a VIN fragment, TNF number, GIM, vehicle line, issue bucket, or concern keyword.</span>
                    </div>
                )}
            </section>
        </>
    );
}
