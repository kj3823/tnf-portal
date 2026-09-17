import { useMemo, useState } from "react";
import {  BarChart3,  CalendarDays,  Download,  Edit3,  FileText,  Link2,  PackageSearch,  ShieldAlert,  Wrench,} from "lucide-react";
import {  reportStore,  type WeeklyReportNotes,} from "../data/reportStore";
import {  buildWeeklyMetrics,  generateWeeklyReportPdf,} from "../reports/weeklyReport";

export function Reports() {
  const [range, setRange] = useState(() => reportStore.getWeekRange());
  const [notes, setNotes] = useState<WeeklyReportNotes>(() =>      reportStore.getNotes(),  );
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  const tnfs = reportStore.getTNFs();
  const investigations = reportStore.getInvestigations();

  const model = useMemo(
      () => ({ ...range, tnfs, investigations, notes }),
      [range, tnfs, investigations, notes],
  );

  const metrics = useMemo(() => buildWeeklyMetrics(model), [model]);

  function editNote(key: keyof WeeklyReportNotes, value: string) {
    const next = { ...notes, [key]: value };
    setNotes(next);
    reportStore.saveNotes(next);
  }

  async function generate() {
    setGenerating(true);
    setError("");

    try {
      await generateWeeklyReportPdf(model);
    } catch (caught) {
      console.error(caught);
      setError(
          caught instanceof Error
              ? caught.message
              : "The weekly PDF could not be generated.",
      );
    } finally {
      setGenerating(false);
    }
  }

  return (
      <>
        <div className="page-heading">
          <div>
            <div className="eyebrow">TEAM REPORTING</div>
            <h1>Weekly Team Report</h1>
            <p>
              Review the one-look indicators, add team commentary, and generate
              the weekly PDF.
            </p>
          </div>

          <button
              className="primary-button"
              onClick={generate}
              disabled={generating}
          >
            <Download size={14} />
            {generating ? "Building charts and PDF..." : "Generate Weekly PDF"}
          </button>
        </div>

        {error && (
            <div className="report-error">
              <ShieldAlert size={15} />
              <span>{error}</span>
            </div>
        )}

        <div className="report-control-bar">
          <CalendarDays size={15} />
          <span>Reporting week</span>
          <input
              type="date"
              value={range.start.toISOString().slice(0, 10)}
              onChange={(event) =>
                  setRange((current) => ({
                    ...current,
                    start: new Date(`${event.target.value}T00:00:00`),
                  }))
              }
          />
          <span>to</span>
          <input
              type="date"
              value={range.end.toISOString().slice(0, 10)}
              onChange={(event) =>
                  setRange((current) => ({
                    ...current,
                    end: new Date(`${event.target.value}T23:59:59`),
                  }))
              }
          />
          <small>Generated from application data.</small>
        </div>

        <div className="metric-grid report-kpis">
          <Metric
              icon={<Wrench size={17} />}
              label="New TNFs"
              value={metrics.newTNFs.length}
              note="Created in reporting week"
          />
          <Metric
              icon={<FileText size={17} />}
              label="Updated TNFs"
              value={metrics.updatedTNFs.length}
              note="Changed in reporting week"
          />
          <Metric
              icon={<Link2 size={17} />}
              label="GIM link rate"
              value={`${Math.round(metrics.gimRate * 100)}%`}
              note={`${metrics.linked.length} linked TNFs`}
          />
          <Metric
              icon={<PackageSearch size={17} />}
              label="Parts monitors"
              value={metrics.partsMonitor.length}
              note="Tracked vehicles / parts"
          />
          <Metric
              icon={<ShieldAlert size={17} />}
              label="High risk vehicles"
              value={metrics.riskVehicles.length}
              note="5+ days down or 3+ repairs"
          />
          <Metric
              icon={<CalendarDays size={17} />}
              label="Avg days down"
              value={metrics.avgDaysDown.toFixed(1)}
              note="Current tracked average"
          />
        </div>

        <div className="report-preview-grid">
          <section className="content-card report-editor">
            <div className="card-header">
              <div>
                <h2>Editable Team Commentary</h2>
                <p>Saved in the browser and inserted into the weekly PDF.</p>
              </div>
              <Edit3 size={15} />
            </div>

            <Editor
                label="Executive Summary"
                value={notes.executiveSummary}
                onChange={(value) => editNote("executiveSummary", value)}
                placeholder="Summarize the week in 2-4 sentences..."
            />
            <Editor
                label="Team Highlights"
                value={notes.teamHighlights}
                onChange={(value) => editNote("teamHighlights", value)}
                placeholder="Key wins, visits, TNFs, GIM progress..."
            />
            <Editor
                label="Decisions / Support Needed"
                value={notes.decisionsNeeded}
                onChange={(value) => editNote("decisionsNeeded", value)}
                placeholder="Leadership decisions, engineering support, dealer escalation..."
            />
            <Editor
                label="Next Week Focus"
                value={notes.nextWeekFocus}
                onChange={(value) => editNote("nextWeekFocus", value)}
                placeholder="Planned visits, reviews, parts follow-up and TNFs..."
            />
          </section>

          <section className="content-card report-outline">
            <div className="card-header">
              <div>
                <h2>PDF Layout</h2>
                <p>Landscape letter format for fast weekly report-out.</p>
              </div>
            </div>

            <div className="outline-page">
              <strong>Page 1 - One-Look Summary</strong>
              <span>Six KPI cards</span>
              <span>Issue Category horizontal bar chart</span>
              <span>Vehicle Line horizontal bar chart</span>
              <span>Executive summary</span>
              <span>High Risk Vehicles table</span>
            </div>

            <div className="outline-page">
              <strong>Page 2 - TNF Activity</strong>
              <span>Weekly TNF table</span>
              <span>Vehicle line, category, bucket, GIM and owner</span>
              <span>Team highlights</span>
            </div>

            <div className="outline-page">
              <strong>Page 3 - Investigation Queue</strong>
              <span>Open investigations</span>
              <span>Parts monitors</span>
              <span>Days down and repeat repair indicators</span>
              <span>Decisions and next-week focus</span>
            </div>

            <div className="report-data-note">
              <BarChart3 size={14} />
              <div>
                <strong>Chart data source</strong>
                <span>
                Category and vehicle-line charts use all TNFs currently stored
                in the application.
              </span>
              </div>
            </div>
          </section>
        </div>
      </>
  );
}

function Metric({
                  icon,
                  label,
                  value,
                  note,
                }: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  note: string;
}) {
  return (
      <div className="metric-card">
        <div className="metric-icon blue">{icon}</div>
        <div>
          <span className="metric-label">{label}</span>
          <strong>{value}</strong>
          <small>{note}</small>
        </div>
      </div>
  );
}

function Editor({
                  label,
                  value,
                  onChange,
                  placeholder,
                }: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
      <label className="report-note">
        <span>{label}</span>
        <textarea
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder={placeholder}
            rows={4}
        />
      </label>
  );
}
