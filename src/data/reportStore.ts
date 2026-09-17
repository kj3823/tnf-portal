import { appStore, TNFRecord } from "./appStore"

export type InvestigationRecord = {
  vin: string;
  family: string;
  issueBucket: string;
  status: string;
  reviewStatus: string;
  daysDown: number;
  repairCount: number;
  owner: string;
  dealer: string;
  parts: string[];
  gimIds: string[];
  tnfIds: string[];
  dateAdded: string;
  mostRecentDate: string;
};

const VEHICLE_KEY = "tnf.portal.vehicles.v1";
const NOTES_KEY = "tnf.portal.weekly-report-notes.v1";

function safeArray<T>(raw: string | null): T[] {
  if (!raw) return [];
  try { const value = JSON.parse(raw); return Array.isArray(value) ? value : []; }
  catch { return []; }
}

export type WeeklyReportNotes = {
  executiveSummary: string;
  teamHighlights: string;
  decisionsNeeded: string;
  nextWeekFocus: string;
};

export const reportStore = {
  getTNFs(): TNFRecord[] { return appStore.getTNFs(); },
  getInvestigations(): InvestigationRecord[] { return appStore.getInvestigationRecords() },
  getNotes(): WeeklyReportNotes {
    const saved = localStorage.getItem(NOTES_KEY);
    if (saved) { try { return JSON.parse(saved); } catch {} }
    return { executiveSummary: "", teamHighlights: "", decisionsNeeded: "", nextWeekFocus: "" };
  },
  saveNotes(notes: WeeklyReportNotes) { localStorage.setItem(NOTES_KEY, JSON.stringify(notes)); },
  getWeekRange(reference = new Date()) {
    const end = new Date(reference);
    const day = end.getDay();
    const daysFromFriday = (day + 2) % 7;
    end.setDate(end.getDate() - daysFromFriday);
    end.setHours(23, 59, 59, 999);
    const start = new Date(end);
    start.setDate(end.getDate() - 6);
    start.setHours(0, 0, 0, 0);
    return { start, end };
  }
};
