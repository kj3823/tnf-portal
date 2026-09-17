import {Routes, Route, Navigate} from "react-router-dom";
import {AppShell} from "./components/AppShell";
import {Login} from "./pages/Login";
import {Dashboard} from "./pages/Dashboard";
import {CreateTNF} from "./pages/CreateTNF";
import {TNFDetail} from "./pages/TNFDetail";
import {TNFSearch} from "./pages/TNFSearch";
import {SuperuserDashboard} from "./pages/SuperuserDashboard";
import {VehicleTracker} from "./pages/VehicleTracker";
import {VehicleDetail} from "./pages/VehicleDetail";
import { Reports } from "./pages/Reports";



export default function App() {
    return <Routes>
        <Route path="/login" element={<Login/>}/>
        <Route element={<AppShell/>}>
        <Route path="/" element={<Navigate to="/login" replace/>}/>
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/vehicles" element={<VehicleTracker/>}/>
        <Route path="/vehicles/:vin" element={<VehicleDetail/>}/>
        <Route path="/tnf/new" element={<CreateTNF/>}/>
        <Route path="/tnf/search" element={<TNFSearch/>}/>
        <Route path="/tnf/:id" element={<TNFDetail/>}/>
        <Route path="/admin" element={<SuperuserDashboard/>}/>
        <Route path="/tnf/search" element={<TNFSearch />} />
        <Route path="/admin/reports" element={<Reports />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace/>}/>

    </Routes>
}