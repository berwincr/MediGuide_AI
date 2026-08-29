import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  UserPlus,
  HeartPulse,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    setError("");

    // Basic password validation
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://127.0.0.1:8000/users/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Registration failed. Please try again."
        );
      }

      // Registration successful
      alert("Registration successful! Please login.");

      navigate("/");
    } catch (err) {
      console.error("Registration error:", err);
      setError(
        err.message || "Unable to connect to the server."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f6f8fb",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "25px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1100px",
          minHeight: "680px",
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(350px, 1fr))",
          background: "white",
          borderRadius: "24px",
          overflow: "hidden",
          boxShadow:
            "0 20px 50px rgba(15, 23, 42, 0.12)",
        }}
      >
        {/* LEFT BRANDING SECTION */}

        <div
          style={{
            background:
              "linear-gradient(135deg, #0F8377 0%, #075f57 100%)",
            padding: "55px 45px",
            color: "white",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          {/* Logo */}

          <div
            style={{
              width: "65px",
              height: "65px",
              borderRadius: "18px",
              background: "rgba(255,255,255,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "25px",
            }}
          >
            <HeartPulse size={34} />
          </div>

          <p
            style={{
              fontSize: "14px",
              letterSpacing: "1px",
              fontWeight: "600",
              opacity: 0.8,
              marginBottom: "12px",
            }}
          >
            JOIN MEDIGUIDE AI
          </p>

          <h1
            style={{
              fontSize: "42px",
              margin: "0 0 20px",
              lineHeight: "1.15",
            }}
          >
            Your healthcare information companion
          </h1>

          <p
            style={{
              fontSize: "17px",
              lineHeight: "1.7",
              opacity: 0.9,
              maxWidth: "420px",
            }}
          >
            Create an account to explore medicines, understand
            medical conditions, and access AI-powered health
            education.
          </p>

          {/* Features */}

          <div
            style={{
              marginTop: "35px",
              display: "flex",
              flexDirection: "column",
              gap: "14px",
            }}
          >
            <Feature
              icon={<CheckCircle2 size={18} />}
              title="Medicine Explorer"
              text="Search verified medicine information."
            />

            <Feature
              icon={<CheckCircle2 size={18} />}
              title="Condition Explorer"
              text="Explore ICD-10 medical conditions."
            />

            <Feature
              icon={<CheckCircle2 size={18} />}
              title="AI Health Education"
              text="Understand medical information more easily."
            />
          </div>
        </div>

        {/* RIGHT REGISTER SECTION */}

        <div
          style={{
            padding: "50px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              maxWidth: "420px",
              width: "100%",
              margin: "0 auto",
            }}
          >
            <p
              style={{
                color: "#0F8377",
                fontSize: "14px",
                fontWeight: "700",
                letterSpacing: "0.7px",
                marginBottom: "10px",
              }}
            >
              CREATE ACCOUNT
            </p>

            <h2
              style={{
                fontSize: "32px",
                margin: "0 0 12px",
                color: "#1e293b",
              }}
            >
              Get started
            </h2>

            <p
              style={{
                color: "#64748b",
                marginBottom: "28px",
                lineHeight: "1.6",
              }}
            >
              Create your MediGuide AI account to continue.
            </p>

            {/* ERROR MESSAGE */}

            {error && (
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  alignItems: "center",
                  background: "#fff1f2",
                  color: "#b91c1c",
                  padding: "13px",
                  borderRadius: "10px",
                  marginBottom: "20px",
                  fontSize: "14px",
                }}
              >
                <AlertCircle
                  size={18}
                  style={{ flexShrink: 0 }}
                />

                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleRegister}>
              {/* NAME */}

              <label style={labelStyle}>
                Full Name
              </label>

              <div style={inputWrapperStyle}>
                <User size={19} color="#64748b" />

                <input
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  required
                  style={inputStyle}
                />
              </div>

              {/* EMAIL */}

              <label
                style={{
                  ...labelStyle,
                  marginTop: "18px",
                }}
              >
                Email Address
              </label>

              <div style={inputWrapperStyle}>
                <Mail size={19} color="#64748b" />

                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  required
                  style={inputStyle}
                />
              </div>

              {/* PASSWORD */}

              <label
                style={{
                  ...labelStyle,
                  marginTop: "18px",
                }}
              >
                Password
              </label>

              <div style={inputWrapperStyle}>
                <Lock size={19} color="#64748b" />

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  required
                  style={inputStyle}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  style={eyeButtonStyle}
                >
                  {showPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>
              </div>

              {/* CONFIRM PASSWORD */}

              <label
                style={{
                  ...labelStyle,
                  marginTop: "18px",
                }}
              >
                Confirm Password
              </label>

              <div style={inputWrapperStyle}>
                <Lock size={19} color="#64748b" />

                <input
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(e.target.value)
                  }
                  required
                  style={inputStyle}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                  style={eyeButtonStyle}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>
              </div>

              {/* REGISTER BUTTON */}

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  marginTop: "28px",
                  padding: "14px",
                  border: "none",
                  borderRadius: "10px",
                  background:
                    loading
                      ? "#94a3b8"
                      : "#0F8377",
                  color: "white",
                  cursor:
                    loading
                      ? "not-allowed"
                      : "pointer",
                  fontSize: "16px",
                  fontWeight: "700",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                }}
              >
                {loading ? (
                  "Creating account..."
                ) : (
                  <>
                    <UserPlus size={19} />
                    Create Account
                  </>
                )}
              </button>
            </form>

            {/* LOGIN LINK */}

            <p
              style={{
                textAlign: "center",
                marginTop: "25px",
                color: "#64748b",
              }}
            >
              Already have an account?{" "}

              <Link
                to="/"
                style={{
                  color: "#0F8377",
                  fontWeight: "700",
                  textDecoration: "none",
                }}
              >
                Sign in
              </Link>
            </p>

            {/* DISCLAIMER */}

            <p
              style={{
                marginTop: "30px",
                fontSize: "12px",
                color: "#94a3b8",
                lineHeight: "1.6",
                textAlign: "center",
              }}
            >
              MediGuide AI provides healthcare education and information.
              It does not replace professional medical advice, diagnosis,
              or treatment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


/* FEATURE COMPONENT */

function Feature({ icon, title, text }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "12px",
        padding: "14px 16px",
        background: "rgba(255,255,255,0.10)",
        borderRadius: "12px",
      }}
    >
      <div
        style={{
          marginTop: "2px",
          opacity: 0.9,
        }}
      >
        {icon}
      </div>

      <div>
        <strong
          style={{
            display: "block",
            marginBottom: "4px",
          }}
        >
          {title}
        </strong>

        <span
          style={{
            fontSize: "14px",
            opacity: 0.8,
          }}
        >
          {text}
        </span>
      </div>
    </div>
  );
}


/* COMMON STYLES */

const labelStyle = {
  display: "block",
  marginBottom: "8px",
  color: "#334155",
  fontSize: "14px",
  fontWeight: "600",
};

const inputWrapperStyle = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  border: "1px solid #dbe2ea",
  borderRadius: "10px",
  padding: "0 14px",
  height: "52px",
  background: "#ffffff",
};

const inputStyle = {
  flex: 1,
  border: "none",
  outline: "none",
  fontSize: "15px",
  color: "#1e293b",
  background: "transparent",
};

const eyeButtonStyle = {
  border: "none",
  background: "transparent",
  cursor: "pointer",
  color: "#64748b",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

export default Register;