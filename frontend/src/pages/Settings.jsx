
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, ShieldCheck, Bell, Info } from "lucide-react";

function Settings() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const styles = {
    page: {
      maxWidth: 900,
      margin: "0 auto",
      padding: "32px 24px",
      color: "#172B4D",
    },
    back: {
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      padding: "9px 0",
      border: 0,
      background: "transparent",
      color: "#0F8377",
      cursor: "pointer",
      fontWeight: 600,
    },
    heading: {
      margin: "20px 0 8px",
      fontSize: 30,
      fontWeight: 800,
    },
    description: {
      color: "#64748B",
      lineHeight: 1.7,
      marginBottom: 28,
    },
    card: {
      display: "flex",
      alignItems: "flex-start",
      gap: 16,
      padding: 22,
      marginBottom: 16,
      background: "#FFFFFF",
      border: "1px solid #E5EBF2",
      borderRadius: 16,
    },
    icon: {
      width: 44,
      height: 44,
      flexShrink: 0,
      display: "grid",
      placeItems: "center",
      color: "#0F8377",
      background: "#E8F7F5",
      borderRadius: 12,
    },
  };

  return (
    <main style={styles.page}>
      <button style={styles.back} onClick={() => navigate("/dashboard")}>
        <ArrowLeft size={18} />
        Back to Dashboard
      </button>

      <h1 style={styles.heading}>Settings</h1>
      <p style={styles.description}>
        Manage your account information and learn about MediGuide AI.
      </p>

      <section style={styles.card}>
        <div style={styles.icon}><User size={22} /></div>
        <div>
          <h3 style={{ margin: "0 0 8px" }}>Account information</h3>
          <p style={{ margin: 0, color: "#64748B", lineHeight: 1.7 }}>
            {user.email || user.name || "Your account details are managed through your signed-in account."}
          </p>
          <button
            onClick={() => navigate("/account")}
            style={{
              marginTop: 12,
              padding: "9px 13px",
              border: 0,
              borderRadius: 9,
              background: "#0F8377",
              color: "white",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            View My Account
          </button>
        </div>
      </section>

      <section style={styles.card}>
        <div style={styles.icon}><ShieldCheck size={22} /></div>
        <div>
          <h3 style={{ margin: "0 0 8px" }}>Privacy and security</h3>
          <p style={{ margin: 0, color: "#64748B", lineHeight: 1.7 }}>
            Keep your login credentials private. Sign out when you finish using a shared device.
          </p>
        </div>
      </section>

      <section style={styles.card}>
        <div style={styles.icon}><Bell size={22} /></div>
        <div>
          <h3 style={{ margin: "0 0 8px" }}>Reminders</h3>
          <p style={{ margin: "0 0 12px", color: "#64748B", lineHeight: 1.7 }}>
            Open your medicine reminder page to manage your reminders.
          </p>
          <button
            onClick={() => navigate("/reminders")}
            style={{
              padding: "9px 13px",
              border: "1px solid #DCE5EC",
              borderRadius: 9,
              background: "white",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Manage Reminders
          </button>
        </div>
      </section>

      <section style={styles.card}>
        <div style={styles.icon}><Info size={22} /></div>
        <div>
          <h3 style={{ margin: "0 0 8px" }}>About MediGuide AI</h3>
          <p style={{ margin: 0, color: "#64748B", lineHeight: 1.7 }}>
            MediGuide AI is a healthcare education assistant. Its information is
            for educational purposes and does not replace professional medical advice.
          </p>
        </div>
      </section>
    </main>
  );
}

export default Settings;
