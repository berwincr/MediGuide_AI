import { useNavigate } from "react-router-dom";
import {
  Pill,
  Stethoscope,
  ScanLine,
  Bell,
  Search,
  ArrowRight,
  Sparkles,
  Mic,
  ShieldCheck,
  LogOut,
  User,
  Activity,
  Clock,
  MessageCircle,
} from "lucide-react";

function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const features = [
    {
  title: "Ask MediGuide AI",
  description:
    "Ask questions about medicines and health conditions in simple language using our AI healthcare education assistant.",
  icon: <MessageCircle size={28} />,
  action: "Start AI Chat",
  path: "/ai-chat",
  color: "#3467F0",
  background: "#eef2ff",
},
  {
      title: "Medicine Search",
      description:
        "Search medicines and understand their uses, precautions, and verified medical information.",
      icon: <Pill size={28} />,
      action: "Search Medicines",
      path: "/medicines",
      color: "#0F8377",
      background: "#e8f7f5",
    },
    {
      title: "Condition Search",
      description:
        "Search medical conditions using names or ICD-10 codes and explore condition information.",
      icon: <Stethoscope size={28} />,
      action: "Search Conditions",
      path: "/conditions",
      color: "#3467F0",
      background: "#eef2ff",
    },
    {
      title: "Prescription Scanner",
      description:
        "Upload a prescription image and let MediGuide AI identify medicines using OCR technology.",
      icon: <ScanLine size={28} />,
      action: "Coming Soon",
      path: "/prescription-scanner",
      color: "#7c3aed",
      background: "#f3e8ff",
      comingSoon: true,
    },
    {
      title: "Medication Reminders",
      description:
        "Set reminders for your medicines and stay organized with your medication schedule.",
      icon: <Bell size={28} />,
      action: "Coming Soon",
      path: "/reminders",
      color: "#ea580c",
      background: "#fff7ed",
      comingSoon: true,
    },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f6f8fb",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* NAVBAR */}

      <nav
        style={{
          background: "white",
          borderBottom: "1px solid #e2e8f0",
          padding: "16px 30px",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Logo */}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <div
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "12px",
                background:
                  "linear-gradient(135deg, #0F8377, #075f57)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
              }}
            >
              <Activity size={22} />
            </div>

            <div>
              <h2
                style={{
                  margin: 0,
                  color: "#1e293b",
                  fontSize: "20px",
                }}
              >
                MediGuide AI
              </h2>

              <p
                style={{
                  margin: 0,
                  fontSize: "12px",
                  color: "#64748b",
                }}
              >
                Healthcare Education Platform
              </p>
            </div>
          </div>

          {/* Right side */}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: "#475569",
                fontSize: "14px",
              }}
            >
              <User size={18} />
              <span>My Account</span>
            </div>

            <button
              onClick={handleLogout}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "7px",
                padding: "10px 14px",
                border: "1px solid #e2e8f0",
                borderRadius: "9px",
                background: "white",
                color: "#475569",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              <LogOut size={17} />
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* MAIN */}

      <main
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "45px 25px 70px",
        }}
      >
        {/* HERO */}

        <div
          style={{
            background:
              "linear-gradient(135deg, #0F8377 0%, #075f57 100%)",
            borderRadius: "24px",
            padding: "45px",
            color: "white",
            position: "relative",
            overflow: "hidden",
            marginBottom: "35px",
          }}
        >
          <div
            style={{
              position: "relative",
              zIndex: 2,
              maxWidth: "700px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "15px",
                opacity: 0.9,
              }}
            >
              <Sparkles size={20} />
              <span
                style={{
                  fontWeight: "600",
                  fontSize: "14px",
                }}
              >
                AI-POWERED HEALTHCARE EDUCATION
              </span>
            </div>

            <h1
              style={{
                fontSize: "42px",
                margin: "0 0 15px",
                lineHeight: "1.15",
              }}
            >
              Welcome to MediGuide AI 👋
            </h1>

            <p
              style={{
                fontSize: "17px",
                lineHeight: "1.7",
                margin: 0,
                opacity: 0.9,
              }}
            >
              Explore medicine and health condition information through
              trusted datasets and AI-powered explanations designed for
              easy understanding.
            </p>
          </div>

          {/* Decorative circle */}

          <div
            style={{
              position: "absolute",
              width: "300px",
              height: "300px",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.08)",
              right: "-80px",
              top: "-100px",
            }}
          />
        </div>

        {/* QUICK ACCESS */}

        <div
          style={{
            marginBottom: "22px",
          }}
        >
          <h2
            style={{
              margin: "0 0 8px",
              color: "#1e293b",
              fontSize: "26px",
            }}
          >
            Explore MediGuide
          </h2>

          <p
            style={{
              margin: 0,
              color: "#64748b",
            }}
          >
            Choose a feature to get started.
          </p>
        </div>

        {/* FEATURE CARDS */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "20px",
          }}
        >
          {features.map((feature, index) => (
            <div
              key={index}
              style={{
                background: "white",
                borderRadius: "18px",
                padding: "25px",
                border: "1px solid #e8edf2",
                transition: "0.2s",
              }}
            >
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "15px",
                  background: feature.background,
                  color: feature.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "20px",
                }}
              >
                {feature.icon}
              </div>

              {feature.comingSoon && (
                <span
                  style={{
                    display: "inline-block",
                    background: "#f1f5f9",
                    color: "#64748b",
                    padding: "5px 10px",
                    borderRadius: "20px",
                    fontSize: "11px",
                    fontWeight: "700",
                    marginBottom: "12px",
                  }}
                >
                  COMING SOON
                </span>
              )}

              <h3
                style={{
                  margin: "0 0 10px",
                  color: "#1e293b",
                  fontSize: "20px",
                }}
              >
                {feature.title}
              </h3>

              <p
                style={{
                  color: "#64748b",
                  lineHeight: "1.6",
                  fontSize: "14px",
                  minHeight: "68px",
                }}
              >
                {feature.description}
              </p>

              <button
                onClick={() => {
                  if (!feature.comingSoon) {
                    navigate(feature.path);
                  }
                }}
                disabled={feature.comingSoon}
                style={{
                  width: "100%",
                  marginTop: "12px",
                  padding: "12px",
                  border: "none",
                  borderRadius: "10px",
                  background: feature.comingSoon
                    ? "#f1f5f9"
                    : feature.color,
                  color: feature.comingSoon
                    ? "#94a3b8"
                    : "white",
                  cursor: feature.comingSoon
                    ? "not-allowed"
                    : "pointer",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "8px",
                  fontWeight: "600",
                  fontSize: "14px",
                }}
              >
                {feature.action}

                {!feature.comingSoon && (
                  <ArrowRight size={17} />
                )}
              </button>
            </div>
          ))}
        </div>

        {/* QUICK ACTIONS */}

        <div
          style={{
            marginTop: "40px",
            background: "white",
            border: "1px solid #e8edf2",
            borderRadius: "20px",
            padding: "30px",
          }}
        >
          <h2
            style={{
              margin: "0 0 25px",
              color: "#1e293b",
              fontSize: "23px",
            }}
          >
            Quick Actions
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "15px",
            }}
          >
            <QuickAction
  icon={<MessageCircle size={20} />}
  title="Ask MediGuide AI"
  description="Chat with your AI assistant"
  color="#3467F0"
  onClick={() => navigate("/ai-chat")}
/>
            <QuickAction
              icon={<Search size={20} />}
              title="Search Medicine"
              description="Find medicine information"
              color="#0F8377"
              onClick={() => navigate("/medicines")}
            />

            <QuickAction
              icon={<Stethoscope size={20} />}
              title="Search Condition"
              description="Search ICD-10 conditions"
              color="#3467F0"
              onClick={() => navigate("/conditions")}
            />

            <QuickAction
              icon={<ScanLine size={20} />}
              title="Scan Prescription"
              description="OCR medicine detection"
              color="#7c3aed"
              comingSoon
            />

            <QuickAction
              icon={<Clock size={20} />}
              title="Set Reminder"
              description="Manage medication schedules"
              color="#ea580c"
              comingSoon
            />
           
          </div>
        </div>

        {/* FUTURE FEATURES */}

        <div
          style={{
            marginTop: "30px",
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "20px",
          }}
        >
          <FutureCard
            icon={<Mic size={25} />}
            title="Voice Interaction"
            description="Interact with MediGuide AI using voice for a more accessible experience."
          />

          <FutureCard
            icon={<ShieldCheck size={25} />}
            title="Drug Interaction Awareness"
            description="Check educational information about possible medicine interactions."
          />
        </div>

        {/* DISCLAIMER */}

        <div
          style={{
            marginTop: "35px",
            padding: "22px",
            borderRadius: "15px",
            background: "#fff8e8",
            border: "1px solid #fde7b0",
            color: "#78350f",
            lineHeight: "1.6",
            fontSize: "14px",
          }}
        >
          <strong>Educational Notice:</strong> MediGuide AI provides
          healthcare education and informational assistance only. It does
          not replace professional medical advice, diagnosis, or treatment.
        </div>
      </main>
    </div>
  );
}

/* QUICK ACTION COMPONENT */

function QuickAction({
  icon,
  title,
  description,
  color,
  onClick,
  comingSoon,
}) {
  return (
    <button
      onClick={onClick}
      disabled={comingSoon}
      style={{
        padding: "18px",
        background: "#f8fafc",
        border: "1px solid #e8edf2",
        borderRadius: "14px",
        textAlign: "left",
        cursor: comingSoon ? "not-allowed" : "pointer",
        opacity: comingSoon ? 0.7 : 1,
      }}
    >
      <div
        style={{
          color: color,
          marginBottom: "10px",
        }}
      >
        {icon}
      </div>

      <strong
        style={{
          display: "block",
          color: "#1e293b",
          marginBottom: "5px",
        }}
      >
        {title}
      </strong>

      <span
        style={{
          color: "#64748b",
          fontSize: "13px",
        }}
      >
        {description}
      </span>

      {comingSoon && (
        <span
          style={{
            display: "block",
            marginTop: "8px",
            fontSize: "11px",
            fontWeight: "700",
            color: "#94a3b8",
          }}
        >
          COMING SOON
        </span>
      )}
    </button>
  );
}

/* FUTURE FEATURE COMPONENT */

function FutureCard({ icon, title, description }) {
  return (
    <div
      style={{
        background: "white",
        border: "1px solid #e8edf2",
        borderRadius: "18px",
        padding: "25px",
      }}
    >
      <div
        style={{
          color: "#0F8377",
          marginBottom: "15px",
        }}
      >
        {icon}
      </div>

      <h3
        style={{
          margin: "0 0 10px",
          color: "#1e293b",
        }}
      >
        {title}
      </h3>

      <p
        style={{
          margin: 0,
          color: "#64748b",
          lineHeight: "1.6",
          fontSize: "14px",
        }}
      >
        {description}
      </p>
    </div>
  );
}

export default Dashboard;