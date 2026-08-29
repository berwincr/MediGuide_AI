import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  HeartPulse,
  AlertCircle,
} from "lucide-react";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://127.0.0.1:8000/users/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Unable to login. Please try again."
        );
      }

      // Save JWT token
      localStorage.setItem("token", data.access_token);

      // Save user information if returned by backend
      if (data.user) {
        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );
      }

      // Go to dashboard after login
      navigate("/dashboard");

    } catch (err) {
      console.error("Login error:", err);
      setError(err.message);
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
          maxWidth: "1050px",
          minHeight: "620px",
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
            WELCOME TO
          </p>

          <h1
            style={{
              fontSize: "42px",
              margin: "0 0 20px",
              lineHeight: "1.15",
            }}
          >
            MediGuide AI
          </h1>

          <p
            style={{
              fontSize: "17px",
              lineHeight: "1.7",
              opacity: 0.9,
              maxWidth: "400px",
            }}
          >
            Your intelligent healthcare education companion for exploring
            medicines, medical conditions, and reliable health information.
          </p>

          {/* Feature Cards */}

          <div
            style={{
              marginTop: "35px",
              display: "flex",
              flexDirection: "column",
              gap: "14px",
            }}
          >
            <Feature
              title="Medicine Information"
              text="Explore medicines using verified healthcare data."
            />

            <Feature
              title="Condition Explorer"
              text="Understand ICD-10 medical conditions clearly."
            />

            <Feature
              title="AI Health Education"
              text="Get simple explanations powered by AI."
            />
          </div>
        </div>

        {/* RIGHT LOGIN SECTION */}

        <div
          style={{
            padding: "55px 50px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div style={{ maxWidth: "400px", width: "100%" }}>
            <p
              style={{
                color: "#0F8377",
                fontSize: "14px",
                fontWeight: "700",
                letterSpacing: "0.7px",
                marginBottom: "10px",
              }}
            >
              ACCOUNT ACCESS
            </p>

            <h2
              style={{
                fontSize: "32px",
                margin: "0 0 12px",
                color: "#1e293b",
              }}
            >
              Welcome back
            </h2>

            <p
              style={{
                color: "#64748b",
                marginBottom: "30px",
                lineHeight: "1.6",
              }}
            >
              Sign in to continue using MediGuide AI.
            </p>

            {/* ERROR */}

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
                <AlertCircle size={18} />
                {error}
              </div>
            )}

            <form onSubmit={handleLogin}>

              {/* EMAIL */}

              <label style={labelStyle}>
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
                  marginTop: "20px",
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
                  placeholder="Enter your password"
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
                  style={{
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    color: "#64748b",
                    display: "flex",
                  }}
                >
                  {showPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>
              </div>

              {/* LOGIN BUTTON */}

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
                {loading
                  ? "Signing in..."
                  : (
                    <>
                      <LogIn size={19} />
                      Sign In
                    </>
                  )}
              </button>
            </form>

            {/* REGISTER */}

            <p
              style={{
                textAlign: "center",
                marginTop: "28px",
                color: "#64748b",
              }}
            >
              Don't have an account?{" "}

              <Link
                to="/register"
                style={{
                  color: "#0F8377",
                  fontWeight: "700",
                  textDecoration: "none",
                }}
              >
                Create an account
              </Link>
            </p>

            {/* EDUCATIONAL NOTICE */}

            <p
              style={{
                marginTop: "35px",
                fontSize: "12px",
                color: "#94a3b8",
                lineHeight: "1.6",
                textAlign: "center",
              }}
            >
              MediGuide AI provides healthcare education and information.
              It does not replace professional medical advice.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


/* FEATURE COMPONENT */

function Feature({ title, text }) {
  return (
    <div
      style={{
        padding: "14px 16px",
        background:
          "rgba(255,255,255,0.10)",
        borderRadius: "12px",
      }}
    >
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
  );
}


/* STYLES */

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

export default Login;