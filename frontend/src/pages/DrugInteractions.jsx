import { useState } from "react";
import {
  ShieldCheck,
  Plus,
  X,
  AlertCircle,
  Search,
  CheckCircle2,
} from "lucide-react";

function DrugInteractions() {
  const [medicineInput, setMedicineInput] = useState("");
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const addMedicine = () => {
    const medicine = medicineInput.trim();

    if (!medicine) return;

    if (
      medicines.some(
        (item) => item.toLowerCase() === medicine.toLowerCase()
      )
    ) {
      setError("This medicine has already been added.");
      return;
    }

    setMedicines([...medicines, medicine]);
    setMedicineInput("");
    setError("");
    setResult(null);
  };

  const removeMedicine = (medicineToRemove) => {
    setMedicines(
      medicines.filter((medicine) => medicine !== medicineToRemove)
    );
    setResult(null);
  };

  const checkInteractions = async () => {
    if (medicines.length < 2) {
      setError("Please add at least 2 medicines.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://127.0.0.1:8000/drug-interactions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            medicines: medicines,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Failed to check drug interactions."
        );
      }

      setResult(data);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      addMedicine();
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        padding: "30px 20px 50px",
      }}
    >
      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
        }}
      >
        {/* HEADER */}

        <div
          style={{
            background:
              "linear-gradient(135deg, #0F8377 0%, #3467F0 100%)",
            borderRadius: "24px",
            padding: "35px",
            color: "white",
            marginBottom: "25px",
            boxShadow: "0 10px 30px rgba(15, 131, 119, 0.15)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "15px",
              marginBottom: "12px",
            }}
          >
            <div
              style={{
                width: "52px",
                height: "52px",
                borderRadius: "15px",
                background: "rgba(255,255,255,0.18)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ShieldCheck size={28} />
            </div>

            <div>
              <h1
                style={{
                  margin: 0,
                  fontSize: "28px",
                  fontWeight: "700",
                }}
              >
                Drug Interaction Checker
              </h1>

              <p
                style={{
                  margin: "5px 0 0",
                  opacity: 0.9,
                  fontSize: "14px",
                }}
              >
                Check possible interactions between medicines
              </p>
            </div>
          </div>
        </div>

        {/* INPUT CARD */}

        <div
          style={{
            background: "white",
            border: "1px solid #e2e8f0",
            borderRadius: "20px",
            padding: "25px",
            marginBottom: "20px",
          }}
        >
          <h2
            style={{
              margin: "0 0 8px",
              color: "#1e293b",
              fontSize: "20px",
            }}
          >
            Add Medicines
          </h2>

          <p
            style={{
              margin: "0 0 20px",
              color: "#64748b",
              fontSize: "14px",
            }}
          >
            Enter the names of the medicines you want to check.
          </p>

          <div
            className="drug-interaction-input-row"
            style={{
              display: "flex",
              gap: "10px",
            }}
          >
            <div
              style={{
                flex: 1,
                position: "relative",
              }}
            >
              <Search
                size={19}
                style={{
                  position: "absolute",
                  left: "14px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#94a3b8",
                }}
              />

              <input
                type="text"
                value={medicineInput}
                onChange={(event) =>
                  setMedicineInput(event.target.value)
                }
                onKeyDown={handleKeyDown}
                placeholder="Enter medicine name..."
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "13px 15px 13px 42px",
                  border: "1px solid #cbd5e1",
                  borderRadius: "12px",
                  fontSize: "14px",
                  outline: "none",
                  color: "#1e293b",
                }}
              />
            </div>

            <button
              onClick={addMedicine}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "7px",
                padding: "0 18px",
                border: "none",
                borderRadius: "12px",
                background: "#0F8377",
                color: "white",
                fontWeight: "600",
                cursor: "pointer",
                minHeight: "46px",
              }}
            >
              <Plus size={18} />
              Add
            </button>
          </div>

          {/* SELECTED MEDICINES */}

          {medicines.length > 0 && (
            <div
              style={{
                marginTop: "20px",
              }}
            >
              <p
                style={{
                  margin: "0 0 10px",
                  color: "#475569",
                  fontSize: "13px",
                  fontWeight: "600",
                }}
              >
                Selected Medicines ({medicines.length})
              </p>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "10px",
                }}
              >
                {medicines.map((medicine) => (
                  <div
                    key={medicine}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      background: "#ecfdf5",
                      border: "1px solid #a7f3d0",
                      color: "#065f46",
                      borderRadius: "30px",
                      padding: "8px 12px",
                      fontSize: "13px",
                      fontWeight: "500",
                    }}
                  >
                    <span>{medicine}</span>

                    <button
                      onClick={() => removeMedicine(medicine)}
                      style={{
                        border: "none",
                        background: "transparent",
                        color: "#047857",
                        padding: "0",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                      }}
                      aria-label={`Remove ${medicine}`}
                    >
                      <X size={15} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ERROR */}

          {error && (
            <div
              style={{
                marginTop: "18px",
                padding: "12px 14px",
                borderRadius: "10px",
                background: "#fef2f2",
                border: "1px solid #fecaca",
                color: "#b91c1c",
                display: "flex",
                alignItems: "center",
                gap: "9px",
                fontSize: "14px",
              }}
            >
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          {/* CHECK BUTTON */}

          <button
            onClick={checkInteractions}
            disabled={loading || medicines.length < 2}
            style={{
              width: "100%",
              marginTop: "22px",
              padding: "14px",
              border: "none",
              borderRadius: "12px",
              background:
                loading || medicines.length < 2
                  ? "#cbd5e1"
                  : "#3467F0",
              color: "white",
              fontSize: "15px",
              fontWeight: "600",
              cursor:
                loading || medicines.length < 2
                  ? "not-allowed"
                  : "pointer",
              transition: "0.2s",
            }}
          >
            {loading ? "Checking Interactions..." : "Check Interactions"}
          </button>
        </div>

        {/* RESULTS */}

        {result && (
          <>
            {/* UNRECOGNIZED MEDICINES */}

            {result.unrecognized_medicines?.length > 0 && (
              <div
                style={{
                  background: "#fffbeb",
                  border: "1px solid #fde68a",
                  borderRadius: "16px",
                  padding: "18px",
                  marginBottom: "20px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "10px",
                  }}
                >
                  <AlertCircle
                    size={20}
                    style={{
                      color: "#d97706",
                      flexShrink: 0,
                      marginTop: "2px",
                    }}
                  />

                  <div>
                    <strong
                      style={{
                        color: "#92400e",
                        fontSize: "15px",
                      }}
                    >
                      Some medicines were not recognized
                    </strong>

                    <p
                      style={{
                        margin: "6px 0 0",
                        color: "#92400e",
                        fontSize: "13px",
                        lineHeight: "1.5",
                      }}
                    >
                      The following medicines were not found in the
                      selected DDInter dataset:
                    </p>

                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "8px",
                        marginTop: "10px",
                      }}
                    >
                      {result.unrecognized_medicines.map((medicine) => (
                        <span
                          key={medicine}
                          style={{
                            background: "#fef3c7",
                            border: "1px solid #fcd34d",
                            color: "#92400e",
                            borderRadius: "20px",
                            padding: "5px 10px",
                            fontSize: "12px",
                            fontWeight: "600",
                          }}
                        >
                          {medicine}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SUMMARY */}

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(180px, 1fr))",
                gap: "15px",
              }}
            >
              <SummaryCard
                title="Pairs Checked"
                value={result.summary.total_pairs_checked}
                color="#3467F0"
              />

              <SummaryCard
                title="Interactions Found"
                value={result.summary.interactions_found}
                color="#dc2626"
              />

              <SummaryCard
                title="No Interaction Found"
                value={result.summary.no_interaction_found}
                color="#0F8377"
              />
            </div>

            {/* INTERACTIONS FOUND */}

            <div
              style={{
                background: "white",
                border: "1px solid #e2e8f0",
                borderRadius: "20px",
                padding: "25px",
                marginTop: "20px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "20px",
                }}
              >
                <CheckCircle2
                  size={22}
                  color="#0F8377"
                />

                <h3
                  style={{
                    margin: 0,
                    color: "#1e293b",
                    fontSize: "19px",
                  }}
                >
                  Interactions Found
                </h3>
              </div>

              {result.interactions?.length > 0 ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  {result.interactions.map(
                    (interaction, index) => (
                      <div
                        key={`${interaction.drug_a}-${interaction.drug_b}-${index}`}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: "15px",
                          padding: "16px",
                          background: "#f8fafc",
                          border: "1px solid #e2e8f0",
                          borderRadius: "14px",
                          flexWrap: "wrap",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            flexWrap: "wrap",
                          }}
                        >
                          <span
                            style={{
                              fontWeight: "600",
                              color: "#1e293b",
                              fontSize: "14px",
                            }}
                          >
                            {interaction.drug_a}
                          </span>

                          <span
                            style={{
                              color: "#94a3b8",
                              fontSize: "18px",
                            }}
                          >
                            ↔
                          </span>

                          <span
                            style={{
                              fontWeight: "600",
                              color: "#1e293b",
                              fontSize: "14px",
                            }}
                          >
                            {interaction.drug_b}
                          </span>
                        </div>

                        <SeverityBadge
                          level={interaction.level}
                        />
                      </div>
                    )
                  )}
                </div>
              ) : (
                <div
                  style={{
                    padding: "20px",
                    background: "#f0fdf4",
                    border: "1px solid #bbf7d0",
                    borderRadius: "14px",
                    color: "#166534",
                    fontSize: "14px",
                  }}
                >
                  No interaction was found in the selected
                  DDInter dataset for the checked medicine pairs.
                </div>
              )}
            </div>

            {/* SEVERITY CHART */}

            <SeverityChart summary={result.summary} />

            {/* DISCLAIMER */}

            <div
              style={{
                marginTop: "20px",
                padding: "18px",
                background: "#eff6ff",
                border: "1px solid #bfdbfe",
                borderRadius: "16px",
                color: "#1e40af",
                fontSize: "13px",
                lineHeight: "1.6",
              }}
            >
              <strong>Important:</strong> This tool provides
              educational information based on the selected DDInter
              dataset. A result showing no interaction does not
              guarantee that two medicines are safe to take together.
              Always consult a qualified healthcare professional
              before making medication decisions.
            </div>
          </>
        )}
      </div>

      {/* RESPONSIVE STYLES */}

      <style>
        {`
          .drug-interaction-input-row {
            align-items: stretch;
          }

          @media (max-width: 600px) {
            .drug-interaction-input-row {
              flex-direction: column;
            }

            .drug-interaction-input-row button {
              width: 100%;
            }
          }
        `}
      </style>
    </div>
  );
}

/* SUMMARY CARD */

function SummaryCard({ title, value, color }) {
  return (
    <div
      style={{
        background: "white",
        border: "1px solid #e2e8f0",
        borderRadius: "16px",
        padding: "20px",
        borderTop: `4px solid ${color}`,
      }}
    >
      <p
        style={{
          margin: "0 0 8px",
          color: "#64748b",
          fontSize: "13px",
        }}
      >
        {title}
      </p>

      <strong
        style={{
          fontSize: "28px",
          color: "#1e293b",
        }}
      >
        {value}
      </strong>
    </div>
  );
}

/* SEVERITY BADGE */

function SeverityBadge({ level }) {
  const normalizedLevel = level?.toLowerCase();

  let background = "#f1f5f9";
  let color = "#475569";

  if (normalizedLevel === "major") {
    background = "#fee2e2";
    color = "#b91c1c";
  } else if (normalizedLevel === "moderate") {
    background = "#fef3c7";
    color = "#b45309";
  } else if (normalizedLevel === "minor") {
    background = "#dcfce7";
    color = "#15803d";
  }

  return (
    <span
      style={{
        background,
        color,
        padding: "6px 11px",
        borderRadius: "20px",
        fontSize: "12px",
        fontWeight: "700",
        whiteSpace: "nowrap",
      }}
    >
      {level}
    </span>
  );
}

/* SEVERITY DONUT CHART */

function SeverityChart({ summary }) {
  const major = summary.major || 0;
  const moderate = summary.moderate || 0;
  const minor = summary.minor || 0;
  const unknown = summary.unknown || 0;

  const total = major + moderate + minor + unknown;

  if (total === 0) {
    return (
      <div
        style={{
          background: "white",
          border: "1px solid #e2e8f0",
          borderRadius: "20px",
          padding: "25px",
          marginTop: "20px",
        }}
      >
        <h3
          style={{
            margin: "0 0 20px",
            color: "#1e293b",
            fontSize: "19px",
          }}
        >
          Interaction Severity
        </h3>

        <p
          style={{
            margin: 0,
            color: "#64748b",
            fontSize: "14px",
          }}
        >
          No interaction severity data is available.
        </p>
      </div>
    );
  }

  const majorPercent = (major / total) * 100;
  const moderatePercent = (moderate / total) * 100;
  const minorPercent = (minor / total) * 100;

  const moderateEnd = majorPercent + moderatePercent;
  const minorEnd = moderateEnd + minorPercent;

  const gradient = `
    conic-gradient(
      #dc2626 0% ${majorPercent}%,
      #f59e0b ${majorPercent}% ${moderateEnd}%,
      #22c55e ${moderateEnd}% ${minorEnd}%,
      #94a3b8 ${minorEnd}% 100%
    )
  `;

  return (
    <div
      style={{
        background: "white",
        border: "1px solid #e2e8f0",
        borderRadius: "20px",
        padding: "25px",
        marginTop: "20px",
      }}
    >
      <h3
        style={{
          margin: "0 0 20px",
          color: "#1e293b",
          fontSize: "19px",
        }}
      >
        Interaction Severity
      </h3>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "45px",
          flexWrap: "wrap",
        }}
      >
        {/* DONUT */}

        <div
          style={{
            width: "190px",
            height: "190px",
            borderRadius: "50%",
            background: gradient,
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: "105px",
              height: "105px",
              borderRadius: "50%",
              background: "white",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <strong
              style={{
                fontSize: "28px",
                color: "#1e293b",
              }}
            >
              {total}
            </strong>

            <span
              style={{
                fontSize: "11px",
                color: "#64748b",
              }}
            >
              interactions
            </span>
          </div>
        </div>

        {/* LEGEND */}

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "14px",
            minWidth: "180px",
          }}
        >
          <SeverityLegend
            label="Major"
            value={major}
            color="#dc2626"
          />

          <SeverityLegend
            label="Moderate"
            value={moderate}
            color="#f59e0b"
          />

          <SeverityLegend
            label="Minor"
            value={minor}
            color="#22c55e"
          />

          <SeverityLegend
            label="Unknown"
            value={unknown}
            color="#94a3b8"
          />
        </div>
      </div>
    </div>
  );
}

/* SEVERITY LEGEND */

function SeverityLegend({ label, value, color }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "25px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "9px",
        }}
      >
        <span
          style={{
            width: "11px",
            height: "11px",
            borderRadius: "50%",
            background: color,
          }}
        />

        <span
          style={{
            color: "#475569",
            fontSize: "14px",
          }}
        >
          {label}
        </span>
      </div>

      <strong
        style={{
          color: "#1e293b",
          fontSize: "14px",
        }}
      >
        {value}
      </strong>
    </div>
  );
}

export default DrugInteractions;