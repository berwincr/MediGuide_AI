import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Pill,
  HeartPulse,
  Search,
  LogOut,
  Menu,
  X,
  ScanLine,
  Bell,
  Settings,
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
  ];

  const upcomingItems = [
    {
      name: "Prescription Scan",
      icon: ScanLine,
      disabled: true,
    },
    {
      name: "Reminders",
      icon: Bell,
      disabled: true,
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="mobile-menu-btn"
        onClick={() => setIsOpen(!isOpen)}
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
            <HeartPulse size={23} />
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
            const active = location.pathname === item.path;

            return (
              <button
                key={item.name}
                className={`nav-item ${active ? "nav-item-active" : ""}`}
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

          <p className="nav-label nav-label-spaced">COMING SOON</p>

          {upcomingItems.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.name}
                className="nav-item nav-item-disabled"
                disabled
              >
                <Icon size={20} />
                <span>{item.name}</span>
                <small>Soon</small>
              </button>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="sidebar-bottom">
          <button className="nav-item nav-item-disabled" disabled>
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