export type VehicleStatus =
    "Awaiting Review"
    | "Dealer Contact"
    | "Visit Scheduled"
    | "Initial Review"
    | "Final Review"
    | "Parts Monitor"
    | "Resolved";
export type Vehicle = {
    vin: string;
    city: string;
    dateAdded: string;
    mostRecentDate: string;
    totalDays: number;
    my: string;
    family: string;
    engine: string;
    fuelType: string;
    dealer: string;
    dealerName: string;
    dealerContact: string;
    odometer: string;
    roOpenDate: string;
    daysDown: number;
    repairCount: number;
    starCaseId?: string;
    issueBucket: string;
    status: VehicleStatus;
    reason: string;
    identifiedOn: string;
    visitDealer: "Yes" | "No" | "TBD";
    reviewStatus: string;
    seal: string;
    initialReview: string;
    finalReview: string;
    owner: string;
    tnfs: string[];
    gims: string[];
    parts: string[]
};