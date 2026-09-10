import { useState } from "react";
import {
  ScanLine,
  Upload,
  FileText,
  AlertTriangle,
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function OCR() {
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [text, setText] = useState("");
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleScan = async () => {
    if (!file) {
      setError("Please select a prescription image first.");
      return;
    }

    setLoading(true);
    setError("");
    setText("");
    setMedicines([]);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/ocr",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("OCR request failed");
      }

      const data = await response.json();

      setText(data.text);
      setMedicines(data.medicines || []);
    } catch (err) {
      console.error("OCR error:", err);
      setError("Unable to process the prescription.");
    } finally {
      setLoading(false);
    }
  };

  const viewMedicineDetails = (rxCui) => {
    navigate(`/medicines/${rxCui}`);
  };

  return (
    <div
      style={{
        maxWidth: "1100px",
        margin: "0 auto",
        padding: "30px 20px 60px",
      }}
    >
      {/* BACK TO DASHBOARD */}

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

      {/* HEADER */}

      <div style={{ marginBottom: "30px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "8px",
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              background: "#f3e8ff",
              color: "#7c3aed",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ScanLine size={25} />
          </div>

          <div>
            <h1
              style={{
                margin: 0,
                color: "#1e293b",
                fontSize: "28px",
              }}
            >
              Prescription Scanner
            </h1>

            <p
              style={{
                margin: "5px 0 0",
                color: "#64748b",
              }}
            >
              Upload a prescription and identify possible medicines using OCR.
            </p>
          </div>
        </div>
      </div>

      {/* UPLOAD CARD */}

      <div
        style={{
          background: "white",
          border: "1px solid #e8edf2",
          borderRadius: "18px",
          padding: "30px",
          marginBottom: "25px",
        }}
      >
        <div
          style={{
            textAlign: "center",
            padding: "35px 20px",
            border: "2px dashed #d8dee8",
            borderRadius: "14px",
          }}
        >
          <Upload
            size={38}
            color="#7c3aed"
            style={{ marginBottom: "12px" }}
          />

          <h3
            style={{
              margin: "0 0 8px",
              color: "#1e293b",
            }}
          >
            Upload Prescription
          </h3>

          <p
            style={{
              margin: "0 0 25px",
              color: "#64748b",
              fontSize: "14px",
            }}
          >
            Upload a clear image of your prescription.
          </p>

          {/* HIDDEN FILE INPUT */}

          <input
            id="prescription-upload"
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => {
              setFile(e.target.files[0]);
              setError("");
              setText("");
              setMedicines([]);
            }}
          />

          {/* BUTTONS */}

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "15px",
            }}
          >
            {/* CHOOSE PRESCRIPTION IMAGE */}

            <label
              htmlFor="prescription-upload"
              style={{
                width: "280px",
                height: "46px",
                boxSizing: "border-box",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                border: "1px solid #c4b5fd",
                borderRadius: "10px",
                background: "#f5f3ff",
                color: "#7c3aed",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "14px",
              }}
            >
              <Upload size={18} />
              Choose Prescription Image
            </label>

            {/* SCAN PRESCRIPTION */}

            <button
              onClick={handleScan}
              disabled={loading}
              style={{
                width: "280px",
                height: "46px",
                boxSizing: "border-box",
                padding: "0",
                border: "none",
                borderRadius: "10px",
                background: "#7c3aed",
                color: "white",
                cursor: loading ? "not-allowed" : "pointer",
                fontWeight: "600",
                fontSize: "14px",
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading
                ? "Scanning Prescription..."
                : "Scan Prescription"}
            </button>
          </div>

          {/* SELECTED FILE */}

          {file && (
            <p
              style={{
                marginTop: "18px",
                marginBottom: 0,
                color: "#475569",
                fontSize: "14px",
              }}
            >
              Selected: <strong>{file.name}</strong>
            </p>
          )}

          {/* ERROR */}

          {error && (
            <p
              style={{
                marginTop: "15px",
                marginBottom: 0,
                color: "#dc2626",
                fontSize: "14px",
              }}
            >
              {error}
            </p>
          )}
        </div>
      </div>

      {/* MEDICINE RESULTS */}

      {medicines.length > 0 && (
        <div
          style={{
            background: "white",
            border: "1px solid #e8edf2",
            borderRadius: "18px",
            padding: "30px",
            marginBottom: "25px",
          }}
        >
          <h2
            style={{
              margin: "0 0 8px",
              color: "#1e293b",
              fontSize: "22px",
            }}
          >
            Possible Medicines Detected
          </h2>

          <p
            style={{
              margin: "0 0 20px",
              color: "#64748b",
              fontSize: "14px",
            }}
          >
            These are possible matches identified from the prescription.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "15px",
            }}
          >
            {medicines.map((medicine, index) => (
              <div
                key={index}
                style={{
                  border: "1px solid #e8edf2",
                  borderRadius: "14px",
                  padding: "20px",
                  background: "#f8fafc",
                }}
              >
                <h3
                  style={{
                    margin: "0 0 15px",
                    color: "#1e293b",
                  }}
                >
                  {medicine.ocr_name}
                </h3>

                {medicine.matches.length > 0 ? (
                  <>
                    <p
                      style={{
                        margin: "0 0 8px",
                        color: "#64748b",
                        fontSize: "14px",
                      }}
                    >
                      Possible match
                    </p>

                    <p
                      style={{
                        margin: "0 0 8px",
                        color: "#1e293b",
                        fontWeight: "700",
                        fontSize: "18px",
                      }}
                    >
                      {medicine.matches[0].name}
                    </p>

                    <p
                      style={{
                        margin: "0 0 15px",
                        color: "#64748b",
                        fontSize: "13px",
                      }}
                    >
                      RxCUI: {medicine.matches[0].rx_cui}
                    </p>

                    <button
                      onClick={() =>
                        viewMedicineDetails(
                          medicine.matches[0].rx_cui
                        )
                      }
                      style={{
                        width: "100%",
                        padding: "10px",
                        border: "none",
                        borderRadius: "9px",
                        background: "#3467F0",
                        color: "white",
                        cursor: "pointer",
                        fontWeight: "600",
                      }}
                    >
                      View Medicine Details
                    </button>
                  </>
                ) : (
                  <p
                    style={{
                      color: "#64748b",
                      fontSize: "14px",
                    }}
                  >
                    No database match found.
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* WARNING */}

          <div
            style={{
              display: "flex",
              gap: "10px",
              alignItems: "flex-start",
              marginTop: "20px",
              padding: "15px",
              borderRadius: "10px",
              background: "#fff8e8",
              border: "1px solid #fde7b0",
              color: "#78350f",
              fontSize: "13px",
              lineHeight: "1.5",
            }}
          >
            <AlertTriangle size={18} />

            <span>
              OCR results are only possible matches. Please verify the
              medicine name against the original prescription and consult
              a healthcare professional when needed.
            </span>
          </div>
        </div>
      )}

      {/* EXTRACTED TEXT */}

      {text && (
        <div
          style={{
            background: "white",
            border: "1px solid #e8edf2",
            borderRadius: "18px",
            padding: "30px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "15px",
            }}
          >
            <FileText size={21} color="#0F8377" />

            <h2
              style={{
                margin: 0,
                color: "#1e293b",
                fontSize: "22px",
              }}
            >
              Extracted Text
            </h2>
          </div>

          <pre
            style={{
              margin: 0,
              padding: "20px",
              background: "#f8fafc",
              borderRadius: "10px",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              color: "#475569",
              lineHeight: "1.6",
              fontSize: "13px",
            }}
          >
            {text}
          </pre>
        </div>
      )}
    </div>
  );
}

export default OCR;