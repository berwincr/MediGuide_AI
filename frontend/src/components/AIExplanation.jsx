import { useState } from "react";
import {
  Sparkles,
  Languages,
  Send,
  LoaderCircle,
  Bot,
} from "lucide-react";

function AIExplanation({
  title = "AI Health Explanation",
  onGenerate,
}) {
  const [language, setLanguage] = useState("en");
  const [loading, setLoading] = useState(false);
  const [explanation, setExplanation] = useState("");
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    try {
      setLoading(true);
      setError("");
      setExplanation("");

      if (!onGenerate) {
        setExplanation(
          "AI explanation will appear here once the backend is connected."
        );
        return;
      }

      const result = await onGenerate(language);

      setExplanation(result);
    } catch (err) {
      console.error(err);
      setError(
        err.message || "Unable to generate AI explanation."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        background: "white",
        border: "1px solid #e2e8f0",
        borderRadius: "18px",
        padding: "30px",
        marginTop: "25px",
      }}
    >
      {/* HEADER */}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "20px",
        }}
      >
        <div
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "12px",
            background:
              "linear-gradient(135deg, #3467F0, #0F8377)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Sparkles size={24} color="white" />
        </div>

        <div>
          <h2
            style={{
              margin: 0,
              color: "#1e293b",
              fontSize: "22px",
            }}
          >
            {title}
          </h2>

          <p
            style={{
              margin: "5px 0 0",
              color: "#64748b",
              fontSize: "14px",
            }}
          >
            Get a simple AI-generated explanation
          </p>
        </div>
      </div>

      {/* LANGUAGE SELECTOR */}

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "15px",
          alignItems: "center",
          marginBottom: "20px",
          padding: "16px",
          background: "#f8fafc",
          borderRadius: "12px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            color: "#475569",
            fontWeight: "600",
          }}
        >
          <Languages size={19} />
          Language
        </div>

        <button
          onClick={() => setLanguage("en")}
          style={{
            padding: "8px 16px",
            borderRadius: "8px",
            border:
              language === "en"
                ? "2px solid #0F8377"
                : "1px solid #cbd5e1",
            background:
              language === "en"
                ? "#e8f7f5"
                : "white",
            color:
              language === "en"
                ? "#0F8377"
                : "#475569",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          English
        </button>

        <button
          onClick={() => setLanguage("ta")}
          style={{
            padding: "8px 16px",
            borderRadius: "8px",
            border:
              language === "ta"
                ? "2px solid #0F8377"
                : "1px solid #cbd5e1",
            background:
              language === "ta"
                ? "#e8f7f5"
                : "white",
            color:
              language === "ta"
                ? "#0F8377"
                : "#475569",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          தமிழ்
        </button>
      </div>

      {/* GENERATE BUTTON */}

      <button
        onClick={handleGenerate}
        disabled={loading}
        style={{
          width: "100%",
          padding: "14px 20px",
          border: "none",
          borderRadius: "10px",
          background: loading
            ? "#94a3b8"
            : "linear-gradient(135deg, #3467F0, #0F8377)",
          color: "white",
          fontSize: "15px",
          fontWeight: "700",
          cursor: loading ? "not-allowed" : "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
        }}
      >
        {loading ? (
          <>
            <LoaderCircle
              size={20}
              style={{
                animation: "spin 1s linear infinite",
              }}
            />
            Generating explanation...
          </>
        ) : (
          <>
            <Sparkles size={20} />
            Generate AI Explanation
          </>
        )}
      </button>

      {/* ERROR */}

      {error && (
        <div
          style={{
            marginTop: "18px",
            padding: "15px",
            background: "#fff1f2",
            color: "#b91c1c",
            borderRadius: "10px",
          }}
        >
          {error}
        </div>
      )}

      {/* AI RESPONSE */}

      {explanation && (
        <div
          style={{
            marginTop: "22px",
            padding: "25px",
            background: "#f8fafc",
            borderRadius: "14px",
            border: "1px solid #e2e8f0",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "15px",
              color: "#0F8377",
            }}
          >
            <Bot size={22} />

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
            {explanation}
          </div>
        </div>
      )}

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

export default AIExplanation;