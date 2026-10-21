
import { useNavigate } from "react-router-dom";
import { User, Mail, ArrowLeft } from "lucide-react";

function Account() {
  const navigate = useNavigate();

  let user = {};

  try {
    user = JSON.parse(localStorage.getItem("user") || "{}");
  } catch {
    user = {};
  }

  const name = user.name || user.username || "User";
  const email = user.email || "Not available";

  return (
    <div style={{ padding: "32px", maxWidth: "900px", margin: "0 auto" }}>
      <button
        type="button"
        onClick={() => navigate("/dashboard")}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          border: "none",
          background: "transparent",
          color: "#0F8377",
          cursor: "pointer",
          fontSize: "14px",
          marginBottom: "24px",
        }}
      >
        <ArrowLeft size={18} />
        Back to Dashboard
      </button>

      <h1 style={{ color: "#16302D", marginBottom: "8px" }}>
        My Account
      </h1>

      <p style={{ color: "#64748b", marginBottom: "28px" }}>
        View your account information.
      </p>

      <div
        style={{
          background: "#ffffff",
          border: "1px solid #e2e8f0",
          borderRadius: "18px",
          padding: "28px",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
        }}
      >
        <div
          style={{
            width: "72px",
            height: "72px",
            borderRadius: "50%",
            background: "#e8f7f5",
            color: "#0F8377",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <User size={34} />
        </div>

        <div>
          <p style={{ color: "#64748b", fontSize: "13px" }}>
            Full Name
          </p>
          <h3 style={{ color: "#16302D", marginTop: "6px" }}>
            {name}
          </h3>
        </div>

        <div>
          <p
            style={{
              color: "#64748b",
              fontSize: "13px",
              marginBottom: "8px",
            }}
          >
            Email Address
          </p>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              color: "#334155",
            }}
          >
            <Mail size={18} color="#0F8377" />
            <span>{email}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Account;
