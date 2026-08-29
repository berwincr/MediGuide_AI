import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Pill,
  Hash,
  FileText,
  Database,
  Info,
  AlertTriangle,
  LoaderCircle,
  Sparkles,
} from "lucide-react";

function MedicineDetails() {
  const { rx_cui } = useParams();
  const navigate = useNavigate();

  const [medicine, setMedicine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // AI states
  const [aiExplanation, setAiExplanation] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [aiError, setAiError] = useState("");

  // --------------------------------------------------
  // FETCH MEDICINE
  // --------------------------------------------------

  useEffect(() => {
    const fetchMedicine = async () => {
      try {
        setLoading(true);
        setMessage("");

        const response = await fetch(
          `http://127.0.0.1:8000/medicines/${encodeURIComponent(rx_cui)}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.detail || "Medicine not found.");
        }

        setMedicine(data);
      } catch (error) {
        console.error("Medicine fetch error:", error);
        setMessage(
          error.message || "Unable to connect to the server."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMedicine();
  }, [rx_cui]);

  // --------------------------------------------------
  // AI EXPLANATION
  // --------------------------------------------------

  const getAIExplanation = async () => {
    try {
      setAiLoading(true);
      setAiError("");
      setAiExplanation("");

      const response = await fetch(
        `http://127.0.0.1:8000/medicine-ai-explanation/${encodeURIComponent(
          rx_cui
        )}?language=${selectedLanguage}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Unable to generate AI explanation."
        );
      }

      setAiExplanation(data.ai_explanation);
    } catch (error) {
      console.error("AI explanation error:", error);

      setAiError(
        error.message || "Unable to generate AI explanation."
      );
    } finally {
      setAiLoading(false);
    }
  };

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------

  if (loading) {
    return (
      <div
        style={{
          minHeight: "70vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "15px",
        }}
      >
        <LoaderCircle
          size={35}
          style={{
            color: "#0F8377",
          }}
        />

        <p
          style={{
            color: "#64748b",
          }}
        >
          Loading medicine information...
        </p>
      </div>
    );
  }

  // --------------------------------------------------
  // ERROR
  // --------------------------------------------------

  if (message || !medicine) {
    return (
      <div
        style={{
          padding: "40px",
          textAlign: "center",
        }}
      >
        <h2>{message || "Medicine not found"}</h2>

        <button
          onClick={() => navigate("/medicines")}
          style={buttonStyle}
        >
          ← Back to Medicine Search
        </button>
      </div>
    );
  }

  // --------------------------------------------------
  // PREPARE DATA
  // --------------------------------------------------

  const source = Array.isArray(medicine.source)
    ? medicine.source.join(", ")
    : medicine.source || "Not available";

  const medicalInfo =
    medicine.medical_information || {};

  // --------------------------------------------------
  // PREVIEW LONG TEXT
  // --------------------------------------------------

  const getPreview = (data, maxLength = 500) => {
    if (!data) return null;

    const text = Array.isArray(data)
      ? data.join(" ")
      : String(data);

    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    }

    return text;
  };

  return (
    <div
      style={{
        maxWidth: "1000px",
        margin: "0 auto",
        padding: "30px 20px 60px",
      }}
    >
      {/* BACK BUTTON */}

      <button
        onClick={() => navigate("/medicines")}
        style={{
          background: "transparent",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "25px",
          color: "#475569",
          fontSize: "15px",
        }}
      >
        <ArrowLeft size={18} />
        Back to Medicine Search
      </button>

      {/* HEADER */}

      <div
        style={{
          background:
            "linear-gradient(135deg, #0F8377 0%, #0a665d 100%)",
          padding: "32px",
          borderRadius: "18px",
          color: "white",
          marginBottom: "25px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "15px",
          }}
        >
          <Pill size={35} />

          <div>
            <p
              style={{
                margin: 0,
                opacity: 0.8,
              }}
            >
              Medicine Information
            </p>

            <h1
              style={{
                margin: "5px 0",
              }}
            >
              {medicine.name}
            </h1>
          </div>
        </div>
      </div>

      {/* BASIC DETAILS */}

      <Section
        title="Medicine Details"
        icon={<Info size={22} />}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "15px",
          }}
        >
          <InfoCard
            icon={<Hash size={20} />}
            label="RxCUI"
            value={medicine.rx_cui}
          />

          <InfoCard
            icon={<FileText size={20} />}
            label="Type"
            value={
              medicine.term_type || "Not available"
            }
          />

          <InfoCard
            icon={<Database size={20} />}
            label="Source"
            value={source}
          />
        </div>
      </Section>

      {/* AI EXPLANATION */}

      <div
        style={{
          background:
            "linear-gradient(135deg, #eefcf9 0%, #f0f7ff 100%)",
          padding: "28px",
          borderRadius: "16px",
          marginBottom: "22px",
          border: "1px solid #cceee8",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "20px",
            flexWrap: "wrap",
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <Sparkles
                size={24}
                style={{
                  color: "#0F8377",
                }}
              />

              <h2
                style={{
                  margin: 0,
                  color: "#1e293b",
                }}
              >
                AI Medicine Explanation
              </h2>
            </div>

            <p
              style={{
                color: "#64748b",
                marginBottom: 0,
              }}
            >
              Get a simple explanation powered by AI.
            </p>
          </div>

          <div
            style={{
              display: "flex",
              gap: "10px",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            {/* LANGUAGE SELECT */}

            <select
              value={selectedLanguage}
              onChange={(e) => {
                setSelectedLanguage(e.target.value);
                setAiExplanation("");
                setAiError("");
              }}
              style={{
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #cbd5e1",
                cursor: "pointer",
              }}
            >
              <option value="en">
                English
              </option>

              <option value="ta">
                தமிழ்
              </option>
            </select>

            {/* AI BUTTON */}

            <button
              onClick={getAIExplanation}
              disabled={aiLoading}
              style={{
                padding: "11px 18px",
                backgroundColor: "#0F8377",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: aiLoading
                  ? "not-allowed"
                  : "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                opacity: aiLoading ? 0.7 : 1,
              }}
            >
              {aiLoading ? (
                <LoaderCircle size={18} />
              ) : (
                <Sparkles size={18} />
              )}

              {aiLoading
                ? "Generating..."
                : "Explain with AI"}
            </button>
          </div>
        </div>

        {/* AI ERROR */}

        {aiError && (
          <div
            style={{
              marginTop: "20px",
              padding: "15px",
              backgroundColor: "#fee2e2",
              color: "#b91c1c",
              borderRadius: "8px",
            }}
          >
            {aiError}
          </div>
        )}

        {/* AI RESULT */}

        {aiExplanation && (
          <div
            style={{
              marginTop: "25px",
              padding: "25px",
              backgroundColor: "white",
              borderRadius: "12px",
              border: "1px solid #d1fae5",
            }}
          >
            <h3
              style={{
                color: "#0F8377",
                marginTop: 0,
              }}
            >
              ✨ AI Explanation
            </h3>

            <div
              style={{
                whiteSpace: "pre-wrap",
                lineHeight: "1.8",
                color: "#334155",
              }}
            >
              {aiExplanation}
            </div>

            <div
              style={{
                marginTop: "20px",
                padding: "12px",
                backgroundColor: "#fff7ed",
                borderRadius: "8px",
                fontSize: "14px",
                color: "#9a3412",
              }}
            >
              <strong>
                Educational Notice:
              </strong>{" "}
              AI-generated information is provided for
              educational purposes and is not a substitute
              for professional medical advice.
            </div>
          </div>
        )}
      </div>

      {/* OPENFDA INFORMATION */}

      {medicine.openfda && (
        <Section title="Medicine Information">
          {medicine.openfda.generic_names?.length > 0 && (
            <InfoRow
              label="Generic Name"
              value={medicine.openfda.generic_names.join(
                ", "
              )}
            />
          )}

          {medicine.openfda.brand_names?.length > 0 && (
            <InfoRow
              label="Brand Names"
              value={medicine.openfda.brand_names.join(
                ", "
              )}
            />
          )}

          {medicine.openfda.routes?.length > 0 && (
            <InfoRow
              label="Route"
              value={medicine.openfda.routes.join(", ")}
            />
          )}

          {medicine.openfda.manufacturers?.length > 0 && (
            <InfoRow
              label="Manufacturer"
              value={medicine.openfda.manufacturers.join(
                ", "
              )}
            />
          )}
        </Section>
      )}

      {/* USES AND INDICATIONS */}

      {getPreview(
        medicalInfo.indications_and_usage
      ) && (
        <Section title="Uses and Indications">
          <p style={textStyle}>
            {getPreview(
              medicalInfo.indications_and_usage
            )}
          </p>
        </Section>
      )}

      {/* WARNINGS */}

      {getPreview(
        medicalInfo.warnings_and_cautions
      ) && (
        <Section
          title="Warnings and Precautions"
          icon={<AlertTriangle size={22} />}
        >
          <div
            style={{
              backgroundColor: "#fff7ed",
              padding: "18px",
              borderRadius: "10px",
            }}
          >
            <p style={textStyle}>
              {getPreview(
                medicalInfo.warnings_and_cautions,
                600
              )}
            </p>
          </div>
        </Section>
      )}

      {/* MEDLINEPLUS */}

      {medicine.medlineplus?.entries?.length > 0 && (
        <Section title="Additional Educational Information">
          {medicine.medlineplus.entries.map(
            (entry, index) => (
              <div
                key={index}
                style={{
                  padding: "18px",
                  backgroundColor: "#f8fafc",
                  borderRadius: "10px",
                  marginBottom: "15px",
                }}
              >
                <h3>{entry.title}</h3>

                <p style={textStyle}>
                  {getPreview(
                    entry.summary,
                    500
                  )}
                </p>

                {entry.url && (
                  <a
                    href={entry.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: "#0F8377",
                      fontWeight: "bold",
                    }}
                  >
                    Learn more →
                  </a>
                )}
              </div>
            )
          )}
        </Section>
      )}

      {/* EDUCATIONAL NOTICE */}

      <div
        style={{
          marginTop: "25px",
          padding: "20px",
          backgroundColor: "#eff6ff",
          borderRadius: "12px",
          border: "1px solid #bfdbfe",
        }}
      >
        <strong
          style={{
            color: "#1e40af",
          }}
        >
          Educational Notice
        </strong>

        <p style={textStyle}>
          This information is provided for educational
          purposes only. It should not be used as a
          substitute for professional medical advice,
          diagnosis, or treatment.
        </p>
      </div>
    </div>
  );
}

/* --------------------------------------------------
   REUSABLE COMPONENTS
-------------------------------------------------- */

function Section({ title, icon, children }) {
  return (
    <div
      style={{
        backgroundColor: "white",
        padding: "28px",
        borderRadius: "16px",
        marginBottom: "22px",
        border: "1px solid #e2e8f0",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "20px",
          color: "#0F8377",
        }}
      >
        {icon}

        <h2
          style={{
            margin: 0,
            color: "#1e293b",
          }}
        >
          {title}
        </h2>
      </div>

      {children}
    </div>
  );
}

function InfoCard({ icon, label, value }) {
  return (
    <div
      style={{
        padding: "18px",
        backgroundColor: "#f8fafc",
        borderRadius: "12px",
      }}
    >
      <div
        style={{
          color: "#0F8377",
          marginBottom: "8px",
        }}
      >
        {icon}
      </div>

      <p
        style={{
          color: "#64748b",
          fontSize: "13px",
          marginBottom: "5px",
        }}
      >
        {label}
      </p>

      <strong
        style={{
          color: "#1e293b",
          wordBreak: "break-word",
        }}
      >
        {value}
      </strong>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div
      style={{
        marginBottom: "15px",
      }}
    >
      <strong>{label}:</strong>

      <p
        style={{
          color: "#475569",
          marginTop: "5px",
          lineHeight: "1.6",
        }}
      >
        {value}
      </p>
    </div>
  );
}

/* --------------------------------------------------
   STYLES
-------------------------------------------------- */

const textStyle = {
  lineHeight: "1.7",
  color: "#475569",
};

const buttonStyle = {
  marginTop: "15px",
  padding: "10px 18px",
  backgroundColor: "#0F8377",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
};

export default MedicineDetails;