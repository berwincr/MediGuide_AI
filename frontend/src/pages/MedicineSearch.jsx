import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Pill,
  Search,
  LoaderCircle,
  AlertCircle,
  Database,
  FileText,
  ChevronRight,
} from "lucide-react";

function MedicineSearch() {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const searchMedicine = async (e) => {
    e.preventDefault();

    if (!searchTerm.trim()) {
      setMessage("Please enter a medicine name.");
      setMedicines([]);
      return;
    }

    try {
      setLoading(true);
      setMessage("");
      setMedicines([]);

      const response = await fetch(
        `http://127.0.0.1:8000/medicines/search/${encodeURIComponent(
          searchTerm.trim()
        )}`
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.detail || "Unable to search medicines.");
        return;
      }

      if (!data.results || data.results.length === 0) {
        setMessage(`No medicines found for "${searchTerm}".`);
        return;
      }

      setMedicines(data.results);
    } catch (error) {
      console.error("Search error:", error);
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
      {/* Back Button */}
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
            "linear-gradient(135deg, #0F8377 0%, #0a665d 100%)",
          padding: "35px",
          borderRadius: "18px",
          color: "white",
          marginBottom: "25px",
          boxShadow: "0 10px 25px rgba(15,131,119,0.18)",
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
            <Pill size={30} />
          </div>

          <div>
            <p
              style={{
                margin: 0,
                opacity: 0.75,
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
              Medicine Information
            </h1>
          </div>
        </div>

        <p
          style={{
            margin: "18px 0 0",
            opacity: 0.85,
            maxWidth: "650px",
            lineHeight: "1.6",
          }}
        >
          Search our medicine database to access available medicine information
          and educational resources.
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
        <h2
          style={{
            marginTop: 0,
            color: "#1e293b",
          }}
        >
          Search Medicine
        </h2>

        <p
          style={{
            color: "#64748b",
            marginBottom: "20px",
          }}
        >
          Enter a medicine name to search the available database.
        </p>

        <form
          onSubmit={searchMedicine}
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
              placeholder="Enter medicine name (e.g. Acetaminophen)"
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
              backgroundColor: loading ? "#94a3b8" : "#0F8377",
              color: "white",
              border: "none",
              borderRadius: "10px",
              cursor: loading ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              fontSize: "15px",
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
      {medicines.length > 0 && (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "18px",
            }}
          >
            <h2
              style={{
                margin: 0,
                color: "#1e293b",
              }}
            >
              Search Results
            </h2>

            <span
              style={{
                backgroundColor: "#e6f4f2",
                color: "#0F8377",
                padding: "6px 12px",
                borderRadius: "20px",
                fontSize: "14px",
                fontWeight: "600",
              }}
            >
              {medicines.length} found
            </span>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "18px",
            }}
          >
            {medicines.map((medicine) => {
              const source = Array.isArray(medicine.source)
                ? medicine.source.join(", ")
                : medicine.source || "Not available";

              return (
                <div
                  key={medicine.rx_cui}
                  style={{
                    backgroundColor: "white",
                    padding: "24px",
                    borderRadius: "16px",
                    border: "1px solid #e2e8f0",
                    transition: "0.2s",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      gap: "15px",
                    }}
                  >
                    <div
                      style={{
                        width: "45px",
                        height: "45px",
                        borderRadius: "12px",
                        backgroundColor: "#e6f4f2",
                        color: "#0F8377",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Pill size={23} />
                    </div>

                    <button
                      onClick={() =>
                        navigate(`/medicines/${medicine.rx_cui}`)
                      }
                      style={{
                        border: "none",
                        background: "#f1f5f9",
                        borderRadius: "8px",
                        padding: "7px",
                        cursor: "pointer",
                        color: "#475569",
                      }}
                      title="View details"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>

                  <h3
                    style={{
                      margin: "18px 0 8px",
                      color: "#1e293b",
                      fontSize: "20px",
                    }}
                  >
                    {medicine.name}
                  </h3>

                  <div
                    style={{
                      display: "grid",
                      gap: "10px",
                      marginTop: "18px",
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
                      <Database size={16} />
                      <span>RxCUI: {medicine.rx_cui}</span>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <FileText size={16} />
                      <span>Type: {medicine.term_type}</span>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <Database size={16} />
                      <span>{source}</span>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      navigate(`/medicines/${medicine.rx_cui}`)
                    }
                    style={{
                      width: "100%",
                      marginTop: "22px",
                      padding: "12px",
                      backgroundColor: "#0F8377",
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
              );
            })}
          </div>
        </>
      )}

      {/* Educational Notice */}
      <div
        style={{
          marginTop: "30px",
          padding: "20px",
          backgroundColor: "#eff6ff",
          border: "1px solid #bfdbfe",
          borderRadius: "12px",
          display: "flex",
          gap: "12px",
        }}
      >
        <AlertCircle
          size={22}
          color="#2563eb"
          style={{ flexShrink: 0 }}
        />

        <div>
          <strong style={{ color: "#1e40af" }}>
            Educational Information
          </strong>

          <p
            style={{
              marginBottom: 0,
              color: "#475569",
              lineHeight: "1.6",
            }}
          >
            Medicine information is provided for educational purposes and
            should not replace advice from a qualified healthcare professional.
          </p>
        </div>
      </div>
    </div>
  );
}

export default MedicineSearch;