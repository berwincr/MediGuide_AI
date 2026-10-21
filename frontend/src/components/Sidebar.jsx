import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Pill,
  HeartPulse,
  LogOut,
  Menu,
  X,
  ScanLine,
  Bell,
  Settings,
  Activity,
} from "lucide-react";
import { useState } from "react";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard",
    },
    {
      name: "Medicines",
      icon: Pill,
      path: "/medicines",
    },
    {
      name: "Conditions",
      icon: HeartPulse,
      path: "/conditions",
    },
    {
      name: "Symptom Tracker",
      icon: Activity,
      path: "/symptoms",
    },
    {
      name: "Prescription Scan",
      icon: ScanLine,
      path: "/ocr",
    },
    {
      name: "Reminders",
      icon: Bell,
      path: "/reminders",
    },
    {
  name: "Drug Interaction Checker",
  icon: Pill,
  path: "/drug-interactions",
},
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="mobile-menu-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        {isOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`sidebar ${isOpen ? "sidebar-open" : ""}`}>
        {/* Logo */}
        <div className="sidebar-logo">
  <div className="logo-icon">
    <svg
      width="23"
      height="23"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M12 21S3 15.5 3 9.5C3 5.5 8 3 12 7C16 3 21 5.5 21 9.5C21 15.5 12 21 12 21Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.5 12H9L11 8.5L14 15L16 11.5H18.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>

  <div>
    <h2>MediGuide</h2>
    <span>AI Healthcare Assistant</span>
  </div>
</div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <p className="nav-label">MAIN MENU</p>

          {menuItems.map((item) => {
            const Icon = item.icon;

            const active =
              location.pathname === item.path ||
              (item.path !== "/dashboard" &&
                location.pathname.startsWith(`${item.path}/`));

            return (
              <button
                key={item.name}
                className={`nav-item ${
                  active ? "nav-item-active" : ""
                }`}
                onClick={() => {
                  navigate(item.path);
                  setIsOpen(false);
                }}
              >
                <Icon size={20} />
                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>

        {/* Bottom navigation */}
        <div className="sidebar-bottom">
          <button
  className={`nav-item ${
    location.pathname === "/settings" ? "nav-item-active" : ""
  }`}
  onClick={() => {
    navigate("/settings");
    setIsOpen(false);
  }}
>
  <Settings size={20} />
  <span>Settings</span>
</button>

          <button
            className="nav-item logout-btn"
            onClick={handleLogout}
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;