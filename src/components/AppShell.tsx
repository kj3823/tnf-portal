import {NavLink, Outlet, useLocation, useNavigate} from "react-router-dom";
import {
    Activity,
    Bell,
    BarChart3,
    FilePlus2,
    LayoutDashboard,
    Search,
    Settings,
    ShieldCheck,
    Wrench,
    FileText,
    CarFront, LogOut
} from "lucide-react";


export function AppShell() {
    const navigate = useNavigate();
    const location = useLocation();

    function handleLogout(){
        navigate("/login")
    }

    const labels: Record<string, string> = {
        "/dashboard": "Dashboard",
        "/tnf/new": "Create TNF Issue",
        "/tnf/search": "Search TNFs",
        "/vehicles": "Vehicle Tracker",
        "/admin": "Administration",
        "/admin/analytics": "Analytics",
        "/admin/reports": "Reports"
    };
    const label = labels[location.pathname] || (location.pathname.startsWith('/tnf/') ? 'TNF Details' : location.pathname.startsWith('/vehicles/') ? 'Vehicle Details' : 'Workspace');
    return <div className="app-shell">
        <aside className="sidebar">
            {/*<NavLink*/}
            {/*    to="/reports"*/}
            {/*    className={({ isActive }) =>*/}
            {/*        `nav-item ${isActive ? "active" : ""}`*/}
            {/*    }*/}
            {/*>*/}
            {/*    <FileText size={17} />*/}
            {/*    Weekly Report*/}
            {/*</NavLink>*/}
            <div className="brand">
                <div className="brand-mark"><Wrench size={17}/></div>
                <div>
                    <div className="brand-name">TNF</div>
                    <div className="brand-subtitle">Trouble Not Found</div>
                </div>
            </div>
            <div className="sidebar-section">
                <div className="sidebar-label">Workspace</div>
                <NavLink to="/dashboard"
                         className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}><LayoutDashboard size={17}/>Dashboard</NavLink><NavLink
                to="/tnf/new" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}><FilePlus2 size={17}/>Create
                TNF</NavLink><NavLink to="/tnf/search"
                                      className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}><Search
                size={17}/>Search TNFs</NavLink><NavLink to="/vehicles"
                                                         className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}><CarFront
                size={17}/>Vehicle Tracker</NavLink></div>
            <div className="sidebar-section">
                <div className="sidebar-label">Management</div>
                <NavLink to="/admin" end className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}><ShieldCheck
                    size={17}/>Administration<span className="nav-badge">SUPER</span></NavLink><NavLink
                to="/admin/analytics" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}><BarChart3
                size={17}/>Analytics</NavLink><NavLink to="/admin/reports"
                                                       className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}><FileText
                size={17}/>Reports</NavLink>
                <button className="nav-item"><Settings size={17}/>Settings</button>
            </div>
            <div className="sidebar-footer"><span className="status-dot"/>
                <div>
                    <div className="footer-title">TNF Portal</div>
                    <div className="footer-subtitle">Frontend prototype • v0.2</div>
                </div>
            </div>
        </aside>
        <main className="main-area">
            <header className="topbar">
                <div className="breadcrumbs"><span>TNF</span><span
                    className="crumb-divider">/</span><strong>{label}</strong></div>
                <div className="topbar-actions">
                    <button className="icon-button" aria-label="Notifications"><Bell size={15}/></button>
                    <button className="logout-button" onClick={handleLogout}><LogOut size={14}/>Logout</button>
                    <div className="user-menu">
                        <div className="avatar">KJ</div>
                        <div className="user-copy"><strong>Kevin Joseph</strong><span>Engineer</span></div>
                    </div>
                </div>
            </header>
            <div className="page-content"><Outlet/></div>
        </main>
    </div>
}
