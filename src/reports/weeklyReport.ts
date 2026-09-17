import { Chart, type ChartConfiguration } from "chart.js/auto";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { TNFRecord } from "../data/appStore";
import type { InvestigationRecord, WeeklyReportNotes } from "../data/reportStore";

export type WeeklyReportModel = {
  start: Date;
  end: Date;
  tnfs: TNFRecord[];
  investigations: InvestigationRecord[];
  notes: WeeklyReportNotes;
};

const navy: [number, number, number] = [16, 27, 49];
const blue: [number, number, number] = [52, 103, 241];
const slate: [number, number, number] = [91, 104, 125];
const light: [number, number, number] = [244, 247, 252];
const border: [number, number, number] = [226, 232, 241];

const iso = (value: Date) => value.toISOString().slice(0, 10);
const display = (value: Date) =>
    value.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

const within = (date: string, start: Date, end: Date) => {
  const value = new Date(`${date}T12:00:00`);
  return value >= start && value <= end;
};

/**
 * Deterministic category mapping for the prototype.
 * Later, replace this helper with a stored issueCategory field.
 */
export function getIssueCategory(record: TNFRecord): string {
  const text = [
    record.issueBucket,
    record.title,
    record.observedConcern,
    record.findings,
  ]
      .join(" ")
      .toLowerCase();

  if (
      text.includes("adas") ||
      text.includes("camera") ||
      text.includes("vision") ||
      text.includes("park assist") ||
      text.includes("parking sensor") ||
      text.includes("pdc") ||
      text.includes("radar") ||
      text.includes("blind spot") ||
      text.includes("lane")
  ) {
    return "ADAS";
  }

  if (
      text.includes("electrical") ||
      text.includes("cluster") ||
      text.includes("rfh") ||
      text.includes("battery") ||
      text.includes("no start") ||
      text.includes("communication") ||
      text.includes("network") ||
      text.includes("diagnostic") ||
      text.includes("dtc")
  ) {
    return "Electrical";
  }

  if (
      text.includes("infotainment") ||
      text.includes("radio") ||
      text.includes("audio") ||
      text.includes("bluetooth") ||
      text.includes("hands-free") ||
      text.includes("display") ||
      text.includes("connectivity")
  ) {
    return "Infotainment";
  }

  if (
      text.includes("powertrain") ||
      text.includes("engine") ||
      text.includes("transmission") ||
      text.includes("driveline") ||
      text.includes("propulsion")
  ) {
    return "Powertrain";
  }

  if (
      text.includes("body") ||
      text.includes("door") ||
      text.includes("liftgate") ||
      text.includes("seat") ||
      text.includes("window") ||
      text.includes("roof")
  ) {
    return "Body";
  }

  if (
      text.includes("charging") ||
      text.includes("bev") ||
      text.includes("phev") ||
      text.includes("hybrid") ||
      text.includes("high voltage")
  ) {
    return "Electrified Propulsion";
  }

  return "Other";
}

function countBy<T>(items: T[], keySelector: (item: T) => string) {
  const counts = new Map<string, number>();

  items.forEach((item) => {
    const key = keySelector(item).trim() || "Unassigned";
    counts.set(key, (counts.get(key) || 0) + 1);
  });

  return [...counts.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .map(([label, value]) => ({ label, value }));
}

export function buildWeeklyMetrics(model: WeeklyReportModel) {
  const newTNFs = model.tnfs.filter((x) =>
      within(x.createdDate, model.start, model.end),
  );

  const updatedTNFs = model.tnfs.filter((x) =>
      within(x.updatedDate, model.start, model.end),
  );

  const resolved = updatedTNFs.filter((x) => x.status === "Resolved");
  const linked = model.tnfs.filter((x) => x.gimIds.length > 0);
  const activeInvestigations = model.investigations.filter(
      (x) => x.status !== "Resolved",
  );
  const partsMonitor = model.investigations.filter(
      (x) => Boolean(x.parts?.length) || x.status === "Parts Monitor",
  );


  const closedStatuses = [
    "Closed",
    "Resolved",
    "Complete"
  ];


  const riskVehicles = model.investigations
      .filter((x) =>
              x.daysDown > 30 && !closedStatuses.includes(x.status))
      .sort(
          (a, b) =>
              b.daysDown - a.daysDown ||
              b.repairCount - a.repairCount ||
              a.vin.localeCompare(b.vin),
      );

  const avgDaysDown = model.investigations.length
      ? model.investigations.reduce(
      (total, vehicle) => total + (vehicle.daysDown || 0),
      0,
  ) / model.investigations.length
      : 0;

  const gimRate = model.tnfs.length ? linked.length / model.tnfs.length : 0;

  // Use every stored TNF so charts remain populated even if the selected week is quiet.
  const issueCategoryBreakdown = countBy(model.tnfs, getIssueCategory);
  const vehicleLineBreakdown = countBy(
      model.tnfs,
      (record) => record.vehicleLine || "Unassigned",
  );

  return {
    newTNFs,
    updatedTNFs,
    resolved,
    linked,
    activeInvestigations,
    partsMonitor,
    riskVehicles,
    avgDaysDown,
    gimRate,
    issueCategoryBreakdown,
    vehicleLineBreakdown,
  };
}

async function createHorizontalBarChart(
    title: string,
    data: Array<{ label: string; value: number }>,
    color: string,
): Promise<string> {
  const safeData = data.length ? data.slice(0, 7) : [{ label: "No data", value: 0 }];
  const canvas = document.createElement("canvas");
  canvas.width = 900;
  canvas.height = 420;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error(`Unable to create chart canvas for ${title}.`);

  const config: ChartConfiguration<"bar"> = {
    type: "bar",
    data: {
      labels: safeData.map((item) => item.label),
      datasets: [
        {
          data: safeData.map((item) => item.value),
          backgroundColor: color,
          borderColor: color,
          borderWidth: 0,
          borderRadius: 5,
          barThickness: 22,
        },
      ],
    },
    options: {
      responsive: false,
      animation: false,
      indexAxis: "y",
      layout: {
        padding: { top: 6, right: 24, bottom: 4, left: 4 },
      },
      plugins: {
        legend: { display: false },
        title: {
          display: true,
          text: title,
          align: "start",
          color: "#101B31",
          font: { family: "Arial", size: 16, weight: "bold" },
          padding: { bottom: 14 },
        },
        tooltip: { enabled: false },
      },
      scales: {
        x: {
          beginAtZero: true,
          suggestedMax: Math.max(1, ...safeData.map((item) => item.value)) + 1,
          grid: { color: "#E7EBF2" },
          border: { display: false },
          ticks: {
            color: "#6D788C",
            precision: 0,
            font: { family: "Arial", size: 11 },
          },
        },
        y: {
          grid: { display: false },
          border: { display: false },
          ticks: {
            color: "#3E4A61",
            font: { family: "Arial", size: 12, weight: "bold" },
          },
        },
      },
    },
  };

  const chart = new Chart(ctx, config);
  await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
  const image = canvas.toDataURL("image/png", 1.0);
  chart.destroy();
  canvas.remove();
  return image;
}

export async function generateWeeklyReportPdf(model: WeeklyReportModel) {
  const metrics = buildWeeklyMetrics(model);

  const [issueCategoryChart, vehicleLineChart] = await Promise.all([
    createHorizontalBarChart(
        "Issue Category Breakdown",
        metrics.issueCategoryBreakdown,
        "#3467F1",
    ),
    createHorizontalBarChart(
        "Vehicle Line Breakdown",
        metrics.vehicleLineBreakdown,
        "#5E7FE0",
    ),
  ]);

  const doc = new jsPDF({
    orientation: "landscape",
    unit: "pt",
    format: "letter",
  });

  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 32;
  let y = 0;

  const footer = () => {
    doc.setDrawColor(...border);
    doc.line(margin, pageH - 24, pageW - margin, pageH - 24);
    doc.setFontSize(7);
    doc.setTextColor(...slate);
    doc.text(
        "TNF Field Investigation Portal | Team Weekly Report",
        margin,
        pageH - 12,
    );
    doc.text(
        `Generated ${new Date().toLocaleString("en-US")}`,
        pageW - margin,
        pageH - 12,
        { align: "right" },
    );
  };

  const section = (title: string) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(...navy);
    doc.text(title, margin, y);
    y += 16;
  };

  const paragraph = (text: string, maxWidth = pageW - margin * 2) => {
    if (!text.trim()) return;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(...slate);
    const lines = doc.splitTextToSize(text, maxWidth);
    doc.text(lines, margin, y);
    y += lines.length * 11 + 6;
  };

  const newPage = (title?: string) => {
    footer();
    doc.addPage();
    y = 35;
    if (title) section(title);
  };

  // ---------------------------------------------------------------------------
  // PAGE 1: One-look summary
  // ---------------------------------------------------------------------------
  doc.setFillColor(...navy);
  doc.rect(0, 0, pageW, 92, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(19);
  doc.setTextColor(255, 255, 255);
  doc.text("TNF FIELD INVESTIGATION", margin, 34);
  doc.setFontSize(12);
  doc.setTextColor(152, 174, 229);
  doc.text("TEAM WEEKLY REPORT", margin, 54);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(170, 184, 210);
  doc.text(`${display(model.start)} - ${display(model.end)}`, margin, 73);
  doc.text(
      "TNF and Vehicle investigation data",
      pageW - margin,
      54,
      { align: "right" },
  );
  // doc.text("One-look operating summary", pageW - margin, 73, {
  //   align: "right",
  // });

  y = 112;

  const cards: Array<[string, string | number, string]> = [
    ["NEW TNFs", metrics.newTNFs.length, "Created this week"],
    [
      "ACTIVE VEHICLES",
      metrics.activeInvestigations.length,
      "Open investigations",
    ],
    ["RESOLVED", metrics.resolved.length, "TNFs resolved this week"],
    [
      "GIM LINK RATE",
      `${Math.round(metrics.gimRate * 100)}%`,
      `${metrics.linked.length} linked TNFs`,
    ],
    ["PARTS MONITOR", metrics.partsMonitor.length, "Vehicles / parts"],
    [
      "AVG DAYS DOWN",
      metrics.avgDaysDown.toFixed(1),
      "Tracked vehicle average",
    ],
  ];

  const gap = 8;
  const cardW = (pageW - margin * 2 - gap * 5) / 6;
  const cardH = 62;

  cards.forEach((card, index) => {
    const x = margin + index * (cardW + gap);
    doc.setFillColor(...light);
    doc.setDrawColor(...border);
    doc.roundedRect(x, y, cardW, cardH, 6, 6, "FD");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(...slate);
    doc.text(String(card[0]), x + 9, y + 15);
    doc.setFontSize(18);
    doc.setTextColor(...navy);
    doc.text(String(card[1]), x + 9, y + 38);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    doc.setTextColor(...slate);
    doc.text(String(card[2]), x + 9, y + 53);
  });

  // Two charts directly below the KPI row.
  const chartTop = y + cardH + 13;
  const chartGap = 14;
  const chartW = (pageW - margin * 2 - chartGap) / 2;
  const chartH = 138;

  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(...border);
  doc.roundedRect(margin, chartTop, chartW, chartH, 6, 6, "FD");
  doc.roundedRect(
      margin + chartW + chartGap,
      chartTop,
      chartW,
      chartH,
      6,
      6,
      "FD",
  );

  doc.addImage(
      issueCategoryChart,
      "PNG",
      margin + 7,
      chartTop + 6,
      chartW - 14,
      chartH - 12,
  );
  doc.addImage(
      vehicleLineChart,
      "PNG",
      margin + chartW + chartGap + 7,
      chartTop + 6,
      chartW - 14,
      chartH - 12,
  );

  // Concise executive summary below charts.
  y = chartTop + chartH + 18;
  section("Executive Summary");
  paragraph(
      model.notes.executiveSummary ||
      `${metrics.newTNFs.length} TNFs were created and ${metrics.updatedTNFs.length} were updated during the reporting week. ${metrics.activeInvestigations.length} vehicle investigations remain active. ${metrics.riskVehicles.length} vehicles meet the attention rule of at least 5 days down or at least 3 repairs.`,
  );

  // High-risk vehicles are intentionally a table, not a third chart.
  y += 2;
  section("High Risk Vehicles");
  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    head: [["VIN", "Line", "Issue Category", "Days Down", "Repairs", "Status", "Owner"]],
    body: metrics.riskVehicles.slice(0, 5).map((vehicle) => [
      vehicle.vin,
      vehicle.family,
      vehicle.issueBucket,
      vehicle.daysDown,
      vehicle.repairCount,
      vehicle.status,
      vehicle.owner,
    ]),
    theme: "grid",
    styles: {
      fontSize: 6.6,
      cellPadding: 3.4,
      lineColor: border,
      valign: "middle",
    },
    headStyles: { fillColor: navy, textColor: [255, 255, 255] },
    alternateRowStyles: { fillColor: light },
    didDrawPage: () => {},
  });

  // ---------------------------------------------------------------------------
  // PAGE 2: Weekly TNF activity
  // ---------------------------------------------------------------------------
  newPage("Weekly TNF Activity");
  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    head: [[
      "TNF",
      "VIN",
      "Vehicle Line",
      "Issue Category",
      "Issue Bucket",
      "Status",
      "GIM",
      "Owner",
      "Updated",
    ]],
    body: metrics.updatedTNFs.map((record) => [
      record.id,
      record.sourceVin,
      record.vehicleLine,
      getIssueCategory(record),
      record.issueBucket,
      record.status,
      record.gimIds.join(", ") || "-",
      record.owner,
      record.updatedDate,
    ]),
    theme: "striped",
    styles: { fontSize: 6.5, cellPadding: 3.5, valign: "middle" },
    headStyles: { fillColor: navy, textColor: [255, 255, 255] },
    alternateRowStyles: { fillColor: light },
  });

  y = (doc as any).lastAutoTable.finalY + 18;
  if (y > pageH - 100) newPage();
  section("Team Highlights");
  paragraph(
      model.notes.teamHighlights ||
      "Add editable highlights in the report preview before generating the PDF.",
  );

  // ---------------------------------------------------------------------------
  // PAGE 3: Investigation queue and parts monitoring
  // ---------------------------------------------------------------------------
  newPage("Open Investigations and Parts Monitoring");
  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    head: [[
      "VIN",
      "Line",
      "Issue Bucket",
      "Status",
      "Review",
      "Days Down",
      "Repairs",
      "Parts",
      "Owner",
    ]],
    body: metrics.activeInvestigations.map((vehicle) => [
      vehicle.vin,
      vehicle.family,
      vehicle.issueBucket,
      vehicle.status,
      vehicle.reviewStatus,
      vehicle.daysDown,
      vehicle.repairCount,
      vehicle.parts?.join(", ") || "-",
      vehicle.owner,
    ]),
    theme: "grid",
    styles: {
      fontSize: 6.7,
      cellPadding: 3.5,
      lineColor: border,
      valign: "middle",
    },
    headStyles: { fillColor: navy, textColor: [255, 255, 255] },
    alternateRowStyles: { fillColor: light },
  });

  y = (doc as any).lastAutoTable.finalY + 18;
  if (y > pageH - 120) newPage();
  section("Decisions / Support Needed");
  paragraph(model.notes.decisionsNeeded || "No decisions entered.");
  section("Next Week Focus");
  paragraph(model.notes.nextWeekFocus || "No next-week priorities entered.");

  footer();
  doc.save(`TNF-Weekly-Report-${iso(model.end)}.pdf`);
}
