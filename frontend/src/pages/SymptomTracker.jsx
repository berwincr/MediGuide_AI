
import { useState } from "react";
import {
  Activity,
  Mic,
  MicOff,
  Send,
  AlertCircle,
  CalendarDays,
  FileText,
} from "lucide-react";

function SymptomTracker() {
  const [symptomText, setSymptomText] = useState("");
  const [severity, setSeverity] = useState(5);
  const [onsetDate, setOnsetDate] = useState("");
  const [notes, setNotes] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [results, setResults] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const startVoiceInput = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setErrorMessage(
        "Voice input is not supported in this browser. Please type your symptoms."
      );
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);

    recognition.onerror = () => {
      setIsListening(false);
      setErrorMessage(
        "Voice recognition failed. Please try again or type your symptoms."
      );
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;

      setSymptomText((previous) =>
        previous.trim()
          ? `${previous.trim()}, ${transcript}`
          : transcript
      );

      setErrorMessage("");
    };

    try {
      recognition.start();
    } catch {
      setIsListening(false);
      setErrorMessage("Unable to start voice input. Please try again.");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setErrorMessage("");
    setResults(null);

    if (!symptomText.trim()) {
      setErrorMessage("Please describe your symptoms first.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setErrorMessage("Please log in again to continue.");
      return;
    }

    setIsSubmitting(true);

    try {
      const recordResponse = await fetch(
        "http://localhost:8000/symptoms/record",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            text: symptomText.trim(),
            severity: Number(severity),
            onset_date: onsetDate || null,
            notes: notes.trim() || null,
          }),
        }
      );

      const recordData = await recordResponse.json();

      if (!recordResponse.ok) {
        throw new Error(
          recordData.detail || "Failed to save symptoms."
        );
      }

      if (!Array.isArray(recordData.processed_symptoms)) {
        throw new Error("The server returned an invalid symptom response.");
      }

      if (recordData.processed_symptoms.length === 0) {
        throw new Error(
          "No recognizable symptoms were found. Please describe them more clearly."
        );
      }

      const analysisResponse = await fetch(
        "http://localhost:8000/symptoms/analyze",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            symptoms: recordData.processed_symptoms.map((name) => ({
              name,
              severity: Number(severity),
            })),
            onset_date: onsetDate || null,
            notes: notes.trim() || null,
          }),
        }
      );

      const analysisData = await analysisResponse.json();

      if (!analysisResponse.ok) {
        throw new Error(
          analysisData.detail || "Failed to analyze symptoms."
        );
      }

      setResults(analysisData);
    } catch (error) {
      console.error("Symptom tracker error:", error);
      setErrorMessage(
        error.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="page-container">
      <div className="symptom-tracker">
        <header className="page-header">
          <div className="symptom-page-heading">
            <div className="symptom-heading-icon">
              <Activity size={30} />
            </div>

            <div>
              <h1 className="page-title">Symptom Tracker</h1>
              <p className="page-subtitle">
                Record your symptoms and explore informational matches.
              </p>
            </div>
          </div>
        </header>

        <form className="symptom-form" onSubmit={handleSubmit}>
          <div className="symptom-field">
            <label htmlFor="symptomText">
              What symptoms are you experiencing?
            </label>

            <textarea
              id="symptomText"
              className="symptom-textarea"
              value={symptomText}
              onChange={(event) => setSymptomText(event.target.value)}
              placeholder="For example: I have a fever, a cough, and a headache..."
              required
              maxLength={2000}
              rows={5}
            />

            <div className="symptom-input-footer">
              <button
                type="button"
                className="symptom-voice-btn"
                onClick={startVoiceInput}
                disabled={isListening || isSubmitting}
              >
                {isListening ? (
                  <MicOff size={18} />
                ) : (
                  <Mic size={18} />
                )}
                {isListening ? "Listening..." : "Speak symptoms"}
              </button>

              <span className="symptom-character-count">
                {symptomText.length}/2000 characters
              </span>
            </div>
          </div>

          <div className="symptom-field severity-field">
            <label htmlFor="severity">
              How severe do your symptoms feel?
            </label>

            <div className="severity-control">
              <input
                id="severity"
                type="range"
                min="1"
                max="10"
                value={severity}
                onChange={(event) =>
                  setSeverity(Number(event.target.value))
                }
              />

              <strong className="severity-value">
                {severity}/10
              </strong>
            </div>

            <div className="severity-labels">
              <span>1 — Mild</span>
              <span>10 — Very severe</span>
            </div>
          </div>

          <div className="symptom-details-grid">
            <div className="symptom-field">
              <label htmlFor="onsetDate">
                <CalendarDays size={17} />
                When did it start?
              </label>

              <input
                id="onsetDate"
                type="date"
                value={onsetDate}
                onChange={(event) => setOnsetDate(event.target.value)}
                max={new Date().toLocaleDateString("en-CA")}
              />
            </div>

            <div className="symptom-field">
              <label htmlFor="notes">
                <FileText size={17} />
                Additional notes (optional)
              </label>

              <input
                id="notes"
                type="text"
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                maxLength={500}
                placeholder="Any additional details"
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary symptom-submit-btn"
            disabled={isSubmitting}
          >
            <Send size={19} />
            {isSubmitting ? "Analyzing..." : "Analyze Symptoms"}
          </button>

          <p className="symptom-form-disclaimer">
            <AlertCircle size={17} />
            <span>
              Results are informational matches, not a diagnosis. Seek
              urgent medical care for severe or rapidly worsening symptoms.
            </span>
          </p>
        </form>

        {errorMessage && (
          <div className="error-message symptom-error" role="alert">
            <AlertCircle size={20} />
            <p>{errorMessage}</p>
          </div>
        )}

        {isSubmitting && (
          <p className="symptom-loading" role="status">
            Saving symptoms and analyzing...
          </p>
        )}

        {results && (
          <section className="analysis-results" aria-live="polite">
            <div className="analysis-heading">
              <div className="symptom-heading-icon">
                <Activity size={24} />
              </div>

              <div>
                <h2>Symptom Analysis Results</h2>
                <p className="page-subtitle">
                  Informational matches based on the symptoms you entered.
                </p>
              </div>
            </div>

            <div className="analyzed-symptoms">
              <strong>Symptoms analyzed</strong>
              <p>
                {Array.isArray(results.symptoms)
                  ? results.symptoms.join(", ")
                  : "Symptom information was not returned."}
              </p>
            </div>

            {Array.isArray(results.possible_conditions) &&
            results.possible_conditions.length > 0 ? (
              <div className="condition-list">
                {results.possible_conditions.map((condition, index) => (
                  <article
                    className="condition-card"
                    key={condition.condition_id || index}
                  >
                    <h3>
                      {condition.condition_name ||
                        "Unnamed condition"}
                    </h3>

                    <p>
                      <strong>Matched symptoms:</strong>{" "}
                      {Array.isArray(condition.matched_symptoms) &&
                      condition.matched_symptoms.length > 0
                        ? condition.matched_symptoms.join(", ")
                        : "Not specified"}
                    </p>

                    <p>
                      <strong>Number of matched symptoms:</strong>{" "}
                      {condition.match_count ?? "Not available"}
                    </p>
                  </article>
                ))}
              </div>
            ) : (
              <div className="symptom-no-matches">
                <AlertCircle size={22} />
                <div>
                  <h3>No matching conditions found</h3>
                  <p>
                    No matches were found in the current symptom database.
                    This does not rule out a medical condition.
                  </p>
                </div>
              </div>
            )}

            <p className="medical-disclaimer">
              <AlertCircle size={18} />
              <span>
                {results.disclaimer ||
                  "These results are informational matches, not a medical diagnosis."}
              </span>
            </p>
          </section>
        )}
      </div>
    </main>
  );
}

export default SymptomTracker;
