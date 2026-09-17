import {mockTNFs} from "../mock/tnfs";
import type {TNF, TNFStatus} from "../types";

let records = [...mockTNFs];
const pause = <T, >(v: T) => new Promise<T>(r => setTimeout(() => r(v), 180));
export const tnfService = {
    list: () => pause([...records]),
    get: (id: string) => pause(records.find(x => x.id === id) ?? records[0]),
    create: (input: Partial<TNF>, status: TNFStatus) => {
        const next = `TNF-2026-${String(124 + records.length).padStart(5, "0")}`;
        const item: TNF = {
            ...records[0], ...input,
            id: next,
            status,
            date: "Aug 21, 2026",
            updated: "Just now",
            attachments: input.attachments ?? [],
            activity: [{
                title: status === "Draft" ? "Draft saved" : "TNF created",
                detail: status === "Draft" ? "Writeup saved as draft" : "Issue documented and submitted",
                time: "Just now",
                initials: "KJ"
            }],
            similarIds: []
        };
        records = [item, ...records];
        return pause(item)
    },
    search: (query: string, status: string, line: string) => pause(records.filter(x => {
        const q = query.toLowerCase();
        return (!q || [x.id, x.title, x.vin, x.vehicle, x.area, x.observedConcern].join(" ").toLowerCase().includes(q)) && (!status || x.status === status) && (!line || x.line === line)
    }))
};
