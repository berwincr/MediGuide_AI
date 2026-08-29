import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  LoaderCircle,
  AlertCircle,
  FileText,
  Hash,
  ChevronRight,
  HeartPulse,
} from "lucide-react";

function ConditionSearch() {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [conditions, setConditions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const searchCondition = async (e) => {
    e.preventDefault();

    if (!searchTerm.trim()) {
      setMessage("Please enter a condition name or ICD-10 code.");
      setConditions([]);
      return;
    }

    try {
      setLoading(true);
      setMessage("");
      setConditions([]);
      
const response = await fetch(
  `http://127.0.0.1:8000/icd10/search/${encodeURIComponent(searchTerm.trim())}`
);

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.detail || "Unable to search conditions.");
        return;
      }

      if (!data.results || data.results.length === 0) {
        setMessage(`No conditions found for "${searchTerm}".`);
        return;
      }

      setConditions(data.results);
    } catch (error) {
      console.error("Condition search error:", error);
      setMessage("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: "1100px",
        margin: "0 auto",
        padding: "30px 20px 60px",
      }}
    >
      {/* Back */}
      <button
        onClick={() => navigate("/dashboard")}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          border: "none",
          background: "transparent",
          color: "#475569",
          cursor: "pointer",
          fontSize: "15px",
          marginBottom: "25px",
          padding: "8px 0",
        }}
      >
        <ArrowLeft size={18} />
        Back to Dashboard
      </button>

      {/* Header */}
      <div
        style={{
          background:
            "linear-gradient(135deg, #3467F0 0%, #244bc2 100%)",
          padding: "35px",
          borderRadius: "18px",
          color: "white",
          marginBottom: "25px",
          boxShadow: "0 10px 25px rgba(52,103,240,0.18)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <div
            style={{
              width: "55px",
              height: "55px",
              borderRadius: "15px",
              backgroundColor: "rgba(255,255,255,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <HeartPulse size={30} />
          </div>

          <div>
            <p
              style={{
                margin: 0,
                opacity: 0.8,
                fontSize: "14px",
              }}
            >
              MediGuide AI
            </p>

            <h1
              style={{
                margin: "5px 0 0",
                fontSize: "32px",
              }}
            >
              Condition Information
            </h1>
          </div>
        </div>

        <p
          style={{
            margin: "18px 0 0",
            opacity: 0.9,
            maxWidth: "650px",
            lineHeight: "1.6",
          }}
        >
          Search health conditions using their name, description, or ICD-10
          code to access available educational information.
        </p>
      </div>

      {/* Search Card */}
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "16px",
          padding: "28px",
          border: "1px solid #e2e8f0",
          marginBottom: "25px",
        }}
      >
        <h2 style={{ marginTop: 0, color: "#1e293b" }}>
          Search Conditions
        </h2>

        <p
          style={{
            color: "#64748b",
            marginBottom: "20px",
          }}
        >
          Enter a condition name or ICD-10 code.
        </p>

        <form
          onSubmit={searchCondition}
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              flex: 1,
              minWidth: "250px",
              position: "relative",
            }}
          >
            <Search
              size={20}
              color="#94a3b8"
              style={{
                position: "absolute",
                left: "15px",
                top: "50%",
                transform: "translateY(-50%)",
              }}
            />

            <input
              type="text"
              placeholder="e.g. Diabetes or E11"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "14px 15px 14px 45px",
                border: "1px solid #cbd5e1",
                borderRadius: "10px",
                fontSize: "15px",
                outline: "none",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "14px 24px",
              backgroundColor: loading ? "#94a3b8" : "#3467F0",
              color: "white",
              border: "none",
              borderRadius: "10px",
              cursor: loading ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontWeight: "600",
            }}
          >
            {loading ? (
              <>
                <LoaderCircle size={19} />
                Searching...
              </>
            ) : (
              <>
                <Search size={19} />
                Search
              </>
            )}
          </button>
        </form>
      </div>

      {/* Message */}
      {message && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "18px",
            backgroundColor: "#fff7ed",
            border: "1px solid #fed7aa",
            borderRadius: "12px",
            color: "#9a3412",
            marginBottom: "25px",
          }}
        >
          <AlertCircle size={22} />
          {message}
        </div>
      )}

      {/* Results */}
      {conditions.length > 0 && (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "18px",
            }}
          >
            <h2 style={{ margin: 0, color: "#1e293b" }}>
              Search Results
            </h2>

            <span
              style={{
                backgroundColor: "#eef2ff",
                color: "#3467F0",
                padding: "6px 12px",
                borderRadius: "20px",
                fontSize: "14px",
                fontWeight: "600",
              }}
            >
              {conditions.length} found
            </span>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "18px",
            }}
          >
            {conditions.map((condition, index) => (
              <div
                key={condition.code || index}
                style={{
                  backgroundColor: "white",
                  padding: "24px",
                  borderRadius: "16px",
                  border: "1px solid #e2e8f0",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: "15px",
                  }}
                >
                  <div
                    style={{
                      width: "45px",
                      height: "45px",
                      borderRadius: "12px",
                      backgroundColor: "#eef2ff",
                      color: "#3467F0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <HeartPulse size={23} />
                  </div>

                  <button
                    onClick={() =>
                      navigate(
                        `/conditions/${encodeURIComponent(condition.code)}`
                      )
                    }
                    style={{
                      border: "none",
                      backgroundColor: "#f1f5f9",
                      borderRadius: "8px",
                      padding: "7px",
                      cursor: "pointer",
                      color: "#475569",
                    }}
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>

                <h3
                  style={{
                    margin: "18px 0 10px",
                    color: "#1e293b",
                    lineHeight: "1.4",
                  }}
                >
                  {condition.description}
                </h3>

                <div
                  style={{
                    display: "grid",
                    gap: "10px",
                    color: "#64748b",
                    fontSize: "14px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <Hash size={16} />
                    ICD-10: {condition.code}
                  </div>

                  {condition.chapter && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <FileText size={16} />
                      {condition.chapter}
                    </div>
                  )}
                </div>

                <button
                  onClick={() =>
                    navigate(
                      `/conditions/${encodeURIComponent(condition.code)}`
                    )
                  }
                  style={{
                    width: "100%",
                    marginTop: "22px",
                    padding: "12px",
                    backgroundColor: "#3467F0",
                    color: "white",
                    border: "none",
                    borderRadius: "9px",
                    cursor: "pointer",
                    fontWeight: "600",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                  }}
                >
                  View Details
                  <ChevronRight size={18} />
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default ConditionSearch;