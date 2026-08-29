import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  FileText,
  Stethoscope,
  BookOpen,
  Database,
  AlertCircle,
  LoaderCircle,
  ShieldAlert,
  Hash,
  Sparkles,
} from "lucide-react";

function ConditionDetails() {
  const { code } = useParams();

  const [condition, setCondition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // AI states
  const [aiExplanation, setAiExplanation] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [aiError, setAiError] = useState("");

  const navigate = useNavigate();

  // --------------------------------------------------
  // FETCH CONDITION DETAILS
  // --------------------------------------------------

  useEffect(() => {
    const fetchCondition = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `http://127.0.0.1:8000/condition-details/${encodeURIComponent(
            code
          )}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.detail || "Failed to load condition details"
          );
        }

        setCondition(data);
      } catch (err) {
        console.error("Condition fetch error:", err);
        setError(
          err.message || "Unable to connect to the server."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCondition();
  }, [code]);

  // --------------------------------------------------
  // GET AI EXPLANATION
  // --------------------------------------------------

  const getAIExplanation = async () => {
    try {
      setAiLoading(true);
      setAiError("");
      setAiExplanation("");

      const response = await fetch(
        `http://127.0.0.1:8000/condition-ai-explanation/${encodeURIComponent(
          code
        )}?language=${selectedLanguage}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Unable to generate AI explanation."
        );
      }

      setAiExplanation(data.ai_explanation);

    } catch (err) {
      console.error(
        "Condition AI explanation error:",
        err
      );

      setAiError(
        err.message || "Unable to generate AI explanation."
      );
    } finally {
      setAiLoading(false);
    }
  };

  // --------------------------------------------------
  // LOADING SCREEN
  // --------------------------------------------------

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#f6f8fb",
          fontFamily: "Arial, sans-serif",
          color: "#475569",
        }}
      >
        <LoaderCircle
          size={42}
          style={{
            color: "#0F8377",
            animation: "spin 1s linear infinite",
          }}
        />

        <h2
          style={{
            marginTop: "20px",
            color: "#1e293b",
          }}
        >
          Loading condition details
        </h2>

        <p>
          Please wait while we retrieve the medical information.
        </p>

        <style>
          {`
            @keyframes spin {
              from {
                transform: rotate(0deg);
              }

              to {
                transform: rotate(360deg);
              }
            }
          `}
        </style>
      </div>
    );
  }

  // --------------------------------------------------
  // ERROR SCREEN
  // --------------------------------------------------

  if (error || !condition) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#f6f8fb",
          padding: "40px 20px",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            maxWidth: "700px",
            margin: "80px auto",
            background: "white",
            borderRadius: "18px",
            padding: "40px",
            textAlign: "center",
            boxShadow:
              "0 10px 30px rgba(15, 23, 42, 0.08)",
          }}
        >
          <div
            style={{
              width: "65px",
              height: "65px",
              borderRadius: "50%",
              background: "#fff1f2",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
            }}
          >
            <AlertCircle size={32} color="#dc2626" />
          </div>

          <h2 style={{ color: "#1e293b" }}>
            Unable to Load Condition
          </h2>

          <p
            style={{
              color: "#64748b",
              marginBottom: "25px",
            }}
          >
            {error || "Condition not found"}
          </p>

          <button
            onClick={() => navigate("/conditions")}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 20px",
              border: "none",
              borderRadius: "10px",
              background: "#0F8377",
              color: "white",
              cursor: "pointer",
              fontSize: "15px",
              fontWeight: "600",
            }}
          >
            <ArrowLeft size={18} />
            Back to Condition Search
          </button>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // MAIN PAGE
  // --------------------------------------------------

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f6f8fb",
        padding: "30px 20px 60px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
        }}
      >
        {/* BACK BUTTON */}

        <button
          onClick={() => navigate("/conditions")}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "28px",
            padding: "10px 16px",
            border: "1px solid #e2e8f0",
            borderRadius: "10px",
            background: "white",
            color: "#475569",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "600",
          }}
        >
          <ArrowLeft size={18} />
          Back to Condition Search
        </button>

        {/* MAIN HEADER */}

        <div
          style={{
            background:
              "linear-gradient(135deg, #0F8377 0%, #075f57 100%)",
            borderRadius: "20px",
            padding: "40px",
            color: "white",
            boxShadow:
              "0 15px 35px rgba(15, 131, 119, 0.2)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "18px",
              opacity: 0.9,
            }}
          >
            <Stethoscope size={20} />

            <span
              style={{
                fontSize: "14px",
                fontWeight: "600",
                letterSpacing: "0.5px",
              }}
            >
              ICD-10 CONDITION INFORMATION
            </span>
          </div>

          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 14px",
              borderRadius: "8px",
              background: "rgba(255,255,255,0.15)",
              marginBottom: "18px",
              fontWeight: "700",
            }}
          >
            <Hash size={18} />
            {condition.code}
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: "36px",
              lineHeight: "1.2",
            }}
          >
            {condition.description}
          </h1>
        </div>

        {/* INFORMATION CARDS */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "20px",
            marginTop: "25px",
          }}
        >
          {/* ICD CODE */}

          <div
            style={{
              background: "white",
              padding: "24px",
              borderRadius: "16px",
              border: "1px solid #e8edf2",
            }}
          >
            <div
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "10px",
                background: "#e8f7f5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "16px",
              }}
            >
              <Hash size={21} color="#0F8377" />
            </div>

            <p
              style={{
                margin: "0 0 8px",
                color: "#64748b",
                fontSize: "13px",
                fontWeight: "600",
                textTransform: "uppercase",
              }}
            >
              ICD-10 Code
            </p>

            <h3
              style={{
                margin: 0,
                color: "#1e293b",
                fontSize: "22px",
              }}
            >
              {condition.code || "Not available"}
            </h3>
          </div>

          {/* CHAPTER */}

          <div
            style={{
              background: "white",
              padding: "24px",
              borderRadius: "16px",
              border: "1px solid #e8edf2",
            }}
          >
            <div
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "10px",
                background: "#eef2ff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "16px",
              }}
            >
              <BookOpen size={21} color="#3467F0" />
            </div>

            <p
              style={{
                margin: "0 0 8px",
                color: "#64748b",
                fontSize: "13px",
                fontWeight: "600",
                textTransform: "uppercase",
              }}
            >
              ICD Chapter
            </p>

            <h3
              style={{
                margin: 0,
                color: "#1e293b",
                fontSize: "18px",
                lineHeight: "1.4",
              }}
            >
              {condition.chapter || "Not available"}
            </h3>
          </div>

          {/* SOURCE */}

          <div
            style={{
              background: "white",
              padding: "24px",
              borderRadius: "16px",
              border: "1px solid #e8edf2",
            }}
          >
            <div
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "10px",
                background: "#fff7ed",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "16px",
              }}
            >
              <Database size={21} color="#ea580c" />
            </div>

            <p
              style={{
                margin: "0 0 8px",
                color: "#64748b",
                fontSize: "13px",
                fontWeight: "600",
                textTransform: "uppercase",
              }}
            >
              Data Source
            </p>

            <h3
              style={{
                margin: 0,
                color: "#1e293b",
                fontSize: "18px",
              }}
            >
              {condition.source || "ICD-10 Database"}
            </h3>
          </div>
        </div>

        {/* CONDITION INFORMATION */}

        <div
          style={{
            background: "white",
            marginTop: "25px",
            padding: "30px",
            borderRadius: "18px",
            border: "1px solid #e8edf2",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "18px",
            }}
          >
            <FileText size={22} color="#0F8377" />

            <h2
              style={{
                margin: 0,
                color: "#1e293b",
                fontSize: "22px",
              }}
            >
              Condition Information
            </h2>
          </div>

          <p
            style={{
              color: "#475569",
              lineHeight: "1.8",
              fontSize: "16px",
              margin: 0,
            }}
          >
            <strong>{condition.description}</strong> is classified
            under ICD-10 code <strong>{condition.code}</strong>.
          </p>
        </div>

        {/* AI EXPLANATION */}

        <div
          style={{
            background: "white",
            marginTop: "25px",
            padding: "30px",
            borderRadius: "18px",
            border: "1px solid #e8edf2",
          }}
        >
          {/* AI HEADER */}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "20px",
            }}
          >
            <Sparkles size={24} color="#3467F0" />

            <div>
              <h2
                style={{
                  margin: 0,
                  color: "#1e293b",
                  fontSize: "22px",
                }}
              >
                Explain with AI
              </h2>

              <p
                style={{
                  margin: "5px 0 0",
                  color: "#64748b",
                  fontSize: "14px",
                }}
              >
                Get a simple educational explanation of this condition.
              </p>
            </div>
          </div>

          {/* LANGUAGE SELECTOR */}

          <div
            style={{
              display: "flex",
              gap: "10px",
              marginBottom: "20px",
            }}
          >
            <button
              onClick={() => setSelectedLanguage("en")}
              disabled={aiLoading}
              style={{
                padding: "9px 18px",
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
                cursor: aiLoading
                  ? "not-allowed"
                  : "pointer",
                background:
                  selectedLanguage === "en"
                    ? "#0F8377"
                    : "white",
                color:
                  selectedLanguage === "en"
                    ? "white"
                    : "#475569",
                fontWeight: "600",
                opacity: aiLoading ? 0.7 : 1,
              }}
            >
              English
            </button>

            <button
              onClick={() => setSelectedLanguage("ta")}
              disabled={aiLoading}
              style={{
                padding: "9px 18px",
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
                cursor: aiLoading
                  ? "not-allowed"
                  : "pointer",
                background:
                  selectedLanguage === "ta"
                    ? "#0F8377"
                    : "white",
                color:
                  selectedLanguage === "ta"
                    ? "white"
                    : "#475569",
                fontWeight: "600",
                opacity: aiLoading ? 0.7 : 1,
              }}
            >
              தமிழ்
            </button>
          </div>

          {/* GENERATE BUTTON */}

          <button
            onClick={getAIExplanation}
            disabled={aiLoading}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 20px",
              border: "none",
              borderRadius: "10px",
              background:
                aiLoading ? "#94a3b8" : "#3467F0",
              color: "white",
              cursor:
                aiLoading ? "not-allowed" : "pointer",
              fontSize: "15px",
              fontWeight: "600",
            }}
          >
            {aiLoading ? (
              <>
                <LoaderCircle
                  size={18}
                  style={{
                    animation:
                      "spin 1s linear infinite",
                  }}
                />
                Generating explanation...
              </>
            ) : (
              <>
                <Sparkles size={18} />
                Explain with AI
              </>
            )}
          </button>

          {/* AI ERROR */}

          {aiError && (
            <div
              style={{
                marginTop: "20px",
                padding: "15px",
                background: "#fff1f2",
                color: "#dc2626",
                borderRadius: "10px",
              }}
            >
              {aiError}
            </div>
          )}

          {/* AI RESPONSE */}

          {aiExplanation && (
            <div
              style={{
                marginTop: "25px",
                padding: "25px",
                borderRadius: "14px",
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "15px",
                  color: "#3467F0",
                }}
              >
                <Sparkles size={20} />

                <strong>
                  MediGuide AI Explanation
                </strong>
              </div>

              <div
                style={{
                  color: "#334155",
                  lineHeight: "1.8",
                  whiteSpace: "pre-wrap",
                }}
              >
                {aiExplanation}
              </div>
            </div>
          )}
        </div>

        {/* EDUCATIONAL NOTICE */}

        <div
          style={{
            marginTop: "25px",
            padding: "25px",
            borderRadius: "16px",
            background: "#fff8e8",
            border: "1px solid #fde7b0",
            display: "flex",
            gap: "16px",
          }}
        >
          <div>
            <ShieldAlert size={28} color="#b45309" />
          </div>

          <div>
            <h3
              style={{
                margin: "0 0 8px",
                color: "#92400e",
              }}
            >
              Educational Information Only
            </h3>

            <p
              style={{
                margin: 0,
                color: "#78350f",
                lineHeight: "1.6",
              }}
            >
              The information displayed in MediGuide AI is intended
              for educational purposes. It should not be used as a
              substitute for professional medical advice, diagnosis,
              or treatment. Please consult a qualified healthcare
              professional for medical concerns.
            </p>
          </div>
        </div>

        {/* SPINNER ANIMATION */}

        <style>
          {`
            @keyframes spin {
              from {
                transform: rotate(0deg);
              }

              to {
                transform: rotate(360deg);
              }
            }
          `}
        </style>
      </div>
    </div>
  );
}

export default ConditionDetails;