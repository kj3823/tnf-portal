import {InvestigationRecord} from "./reportStore";

export type TNFStatus = "Draft" | "Submitted" | "Under Review" | "Resolved";

export type TNFRecord = {
  id: string;
  sourceVin: string;
  title: string;
  vehicleLine: string;
  modelYear: string;
  city: string;
  dealer: string;
  issueBucket: string;
  status: TNFStatus;
  gimIds: string[];
  observedConcern: string;
  findings: string;
  finalReview: string;
  owner: string;
  createdDate: string;
  updatedDate: string;
};

const STORAGE_KEY = "tnf.portal.records.tnf";
const INVESTIGATION_STORAGE_KEY = "tnf.portal.records.investigation";

const seedRecords: TNFRecord[] = [
  {
    id: "TNF-2026-00123",
    sourceVin: "1C4RJHBG1NC123456",
    title: "Intermittent camera unavailable",
    vehicleLine: "DT",
    modelYear: "2026",
    city: "Auburn Hills",
    dealer: "D214 - Auburn Hills Evaluation Fleet",
    issueBucket: "Camera / Vision",
    status: "Under Review",
    gimIds: ["GIM-12345"],
    observedConcern: "Camera unavailable message appears intermittently after an ignition cycle.",
    findings: "No active DTCs. Camera communication and power were normal. Logger installed.",
    finalReview: "Compare logger capture against GIM-12345 and continue SIRIUS review if repeated.",
    owner: "KJ Engineer",
    createdDate: "2026-08-21",
    updatedDate: "2026-08-21"
  },
  {
    id: "TNF-2026-00119",
    sourceVin: "1C4PJMMB8RW201774",
    title: "Cluster reboots after ignition cycle",
    vehicleLine: "RU",
    modelYear: "2026",
    city: "Detroit",
    dealer: "D088 - Metro CDJR",
    issueBucket: "Cluster",
    status: "Under Review",
    gimIds: [],
    observedConcern: "Cluster restarts shortly after startup.",
    findings: "Concern reproduced once. System logs and software levels were saved.",
    finalReview: "Monitor cluster part availability and preserve the original unit.",
    owner: "SP Engineer",
    createdDate: "2026-08-20",
    updatedDate: "2026-08-21"
  },
  {
    id: "TNF-2026-00107",
    sourceVin: "1C4RJKBG9R81631AA",
    title: "Audio dropout during hands-free call",
    vehicleLine: "WL",
    modelYear: "2025",
    city: "Toledo",
    dealer: "D141 - Toledo Jeep",
    issueBucket: "Infotainment",
    status: "Resolved",
    gimIds: ["GIM-11872"],
    observedConcern: "Audio drops during hands-free calls.",
    findings: "Concern duplicated and radio software level recorded.",
    finalReview: "Linked to GIM-11872. Software updated and validation passed.",
    owner: "KJ Engineer",
    createdDate: "2026-08-18",
    updatedDate: "2026-08-18"
  },
  {
    id: "TNF-2026-00102",
    sourceVin: "1C4PJMMB3RW201590",
    title: "Parking sensor unavailable",
    vehicleLine: "RU",
    modelYear: "2026",
    city: "Dearborn",
    dealer: "D267 - Dearborn CDJR",
    issueBucket: "PDC / Park Assist",
    status: "Submitted",
    gimIds: [],
    observedConcern: "Parking sensor unavailable during low-speed maneuvering.",
    findings: "No obstruction found. Network trace captured.",
    finalReview: "Front park assist sensor ordered. Update TNF after validation.",
    owner: "KJ Engineer",
    createdDate: "2026-08-17",
    updatedDate: "2026-08-18"
  }
];

export const investigationRecords: InvestigationRecord[] = [
  {
    vin: "1C4RJHBG1NC123456",
    family: "WL",
    issueBucket: "Camera / Vision",
    status: "Visit Scheduled",
    reviewStatus: "Final Review",
    daysDown: 103,
    repairCount: 3,
    owner: "Kevin Joseph",
    dealer: "D214",
    parts: ["Front Camera"],
    gimIds: ["GIM-12345"],
    tnfIds: ["TNF-2026-00123"],
    dateAdded: "2026-05-14",
    mostRecentDate: "2026-08-18"
  },

  {
    vin: "1C4PJMMB8RW201774",
    family: "RU",
    issueBucket: "Cluster",
    status: "Parts Monitor",
    reviewStatus: "Final Review",
    daysDown: 67,
    repairCount: 2,
    owner: "Spyros Politis",
    dealer: "D088",
    parts: ["Cluster Assembly"],
    gimIds: [],
    tnfIds: ["TNF-2026-00119"],
    dateAdded: "2026-06-20",
    mostRecentDate: "2026-08-16"
  },

  {
    vin: "1C6SRFFT5TN101908",
    family: "DT",
    issueBucket: "Diagnostics",
    status: "Visit Scheduled",
    reviewStatus: "Needs Visit",
    daysDown: 45,
    repairCount: 1,
    owner: "David Welker",
    dealer: "D355",
    parts: [],
    gimIds: [],
    tnfIds: ["TNF-2026-00131"],
    dateAdded: "2026-07-10",
    mostRecentDate: "2026-08-10"
  },

  {
    vin: "1C4HJXDG8MW551234",
    family: "JL",
    issueBucket: "Electrical",
    status: "Dealer Investigation",
    reviewStatus: "Under Review",
    daysDown: 33,
    repairCount: 2,
    owner: "John Messing",
    dealer: "D102",
    parts: [],
    gimIds: [],
    tnfIds: ["TNF-2026-00141"],
    dateAdded: "2026-07-22",
    mostRecentDate: "2026-08-19"
  },

  {
    vin: "1C4JJXP68NW771188",
    family: "WL",
    issueBucket: "PDC",
    status: "Closed",
    reviewStatus: "Complete",
    daysDown: 42,
    repairCount: 2,
    owner: "Rahul Raval",
    dealer: "D218",
    parts: [],
    gimIds: ["GIM-11872"],
    tnfIds: ["TNF-2026-00088"],
    dateAdded: "2026-06-05",
    mostRecentDate: "2026-08-08"
  }
];


function emitChange() {
  window.dispatchEvent(new CustomEvent("tnf-store-change"));
}

function safeParse<T>(
    raw: string | null
): T[] | null {
  if (!raw) return null;
  try {
    const value = JSON.parse(raw);

    return Array.isArray(value)
        ? (value as T[])
        : null;
  } catch {
    return null;
  }
}

export const appStore = {
  getTNFs(): TNFRecord[] {
    const saved = safeParse<TNFRecord>(localStorage.getItem(STORAGE_KEY));
    if (saved) return saved;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seedRecords));
    return [...seedRecords];
  },

  getInvestigationRecords(): InvestigationRecord[] {
    const saved =
        safeParse<InvestigationRecord>(
            localStorage.getItem(
                INVESTIGATION_STORAGE_KEY
            )
        );
    if (saved) {
      return saved;
    }
    localStorage.setItem(
        INVESTIGATION_STORAGE_KEY,
        JSON.stringify(investigationRecords)
    );

    return [...investigationRecords];
  },
  getTNF(id: string): TNFRecord | undefined {
    return this.getTNFs().find((record) => record.id === id);
  },

  saveTNF(record: TNFRecord): TNFRecord {
    const items = this.getTNFs();
    const index = items.findIndex((item) => item.id === record.id);
    if (index >= 0) items[index] = record;
    else items.unshift(record);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    emitChange();
    return record;
  },

  createTNF(input: Omit<TNFRecord, "id" | "createdDate" | "updatedDate">): TNFRecord {
    const items = this.getTNFs();
    const max = items.reduce((value, item) => {
      // @ts-ignore
      const parsed = Number(item.id.split("-").at(-1));
      return Number.isFinite(parsed) ? Math.max(value, parsed) : value;
    }, 0);
    const today = new Date().toISOString().slice(0, 10);
    const record: TNFRecord = {
      ...input,
      id: `TNF-${new Date().getFullYear()}-${String(max + 1).padStart(5, "0")}`,
      createdDate: today,
      updatedDate: today
    };
    return this.saveTNF(record);
  },

  resetDemoData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seedRecords));
    emitChange();
  },

  getInvestigationByVIN(
      vin: string
  ): InvestigationRecord | undefined {

    return this.getInvestigationRecords().find(
        record =>
            record.vin.trim().toLowerCase() ===
            vin.trim().toLowerCase()
    );
  },

  exportJSON() {
    return JSON.stringify(this.getTNFs(), null, 2);
  }
};
