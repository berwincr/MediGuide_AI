import { useState } from "react";
import {
  Sparkles,
  Send,
  Bot,
  User,
  LoaderCircle,
  AlertCircle,
  Languages,
} from "lucide-react";

function AIAssistant() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hello! I'm MediGuide AI. I can help explain medicines and health conditions in simple language. What would you like to know?",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState("en");
  const [error, setError] = useState("");

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = {
      role: "user",
      content: input.trim(),
    };

    setMessages((previous) => [
      ...previous,
      userMessage,
    ]);

    const question = input.trim();

    setInput("");
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/ai-chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: question,
            language: language,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Unable to get AI response."
        );
      }

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content: data.response,
        },
      ]);
    } catch (err) {
      console.error("AI chat error:", err);

      setError(
        err.message || "Unable to connect to MediGuide AI."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f6f8fb",
        padding: "30px 20px",
        fontFamily: "Arial, sans-serif",
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
              "linear-gradient(135deg, #0F8377 0%, #075f57 100%)",
            borderRadius: "20px",
            padding: "32px",
            color: "white",
            marginBottom: "25px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
            }}
          >
            <div
              style={{
                width: "55px",
                height: "55px",
                borderRadius: "16px",
                background: "rgba(255,255,255,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Sparkles size={28} />
            </div>

            <div>
              <h1
                style={{
                  margin: 0,
                  fontSize: "30px",
                }}
              >
                MediGuide AI Assistant
              </h1>

              <p
                style={{
                  margin: "6px 0 0",
                  opacity: 0.85,
                }}
              >
                Ask questions about medicines and health conditions.
              </p>
            </div>
          </div>
        </div>

        {/* LANGUAGE SELECTOR */}

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: "10px",
            marginBottom: "15px",
          }}
        >
          <Languages size={19} color="#475569" />

          <button
            onClick={() => setLanguage("en")}
            style={{
              padding: "8px 14px",
              borderRadius: "8px",
              border: "1px solid #e2e8f0",
              background:
                language === "en"
                  ? "#0F8377"
                  : "white",
              color:
                language === "en"
                  ? "white"
                  : "#475569",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            English
          </button>

          <button
            onClick={() => setLanguage("ta")}
            style={{
              padding: "8px 14px",
              borderRadius: "8px",
              border: "1px solid #e2e8f0",
              background:
                language === "ta"
                  ? "#0F8377"
                  : "white",
              color:
                language === "ta"
                  ? "white"
                  : "#475569",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            தமிழ்
          </button>
        </div>

        {/* CHAT AREA */}

        <div
          style={{
            background: "white",
            borderRadius: "20px",
            border: "1px solid #e2e8f0",
            overflow: "hidden",
          }}
        >
          {/* MESSAGES */}

          <div
            style={{
              height: "500px",
              overflowY: "auto",
              padding: "25px",
              display: "flex",
              flexDirection: "column",
              gap: "18px",
            }}
          >
            {messages.map((message, index) => {
              const isUser =
                message.role === "user";

              return (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    gap: "10px",
                    alignItems: "flex-start",
                    flexDirection: isUser
                      ? "row-reverse"
                      : "row",
                  }}
                >
                  {/* AVATAR */}

                  <div
                    style={{
                      width: "38px",
                      height: "38px",
                      minWidth: "38px",
                      borderRadius: "50%",
                      background: isUser
                        ? "#3467F0"
                        : "#0F8377",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                    }}
                  >
                    {isUser ? (
                      <User size={19} />
                    ) : (
                      <Bot size={20} />
                    )}
                  </div>

                  {/* MESSAGE */}

                  <div
                    style={{
                      maxWidth: "75%",
                      padding: "14px 17px",
                      borderRadius: "15px",
                      background: isUser
                        ? "#3467F0"
                        : "#f1f5f9",
                      color: isUser
                        ? "white"
                        : "#334155",
                      lineHeight: "1.6",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {message.content}
                  </div>
                </div>
              );
            })}

            {/* LOADING */}

            {loading && (
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    width: "38px",
                    height: "38px",
                    borderRadius: "50%",
                    background: "#0F8377",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                  }}
                >
                  <Bot size={20} />
                </div>

                <div
                  style={{
                    padding: "13px 17px",
                    background: "#f1f5f9",
                    borderRadius: "15px",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    color: "#64748b",
                  }}
                >
                  <LoaderCircle
                    size={18}
                    style={{
                      animation:
                        "spin 1s linear infinite",
                    }}
                  />

                  MediGuide AI is thinking...
                </div>
              </div>
            )}
          </div>

          {/* ERROR */}

          {error && (
            <div
              style={{
                margin: "0 20px 15px",
                padding: "12px",
                background: "#fff1f2",
                color: "#dc2626",
                borderRadius: "10px",
                display: "flex",
                gap: "8px",
              }}
            >
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          {/* INPUT */}

          <div
            style={{
              borderTop: "1px solid #e2e8f0",
              padding: "18px",
              display: "flex",
              gap: "12px",
            }}
          >
            <textarea
              value={input}
              onChange={(event) =>
                setInput(event.target.value)
              }
              onKeyDown={handleKeyDown}
              placeholder="Ask MediGuide AI something..."
              rows={2}
              style={{
                flex: 1,
                resize: "none",
                padding: "12px 15px",
                borderRadius: "12px",
                border: "1px solid #cbd5e1",
                outline: "none",
                fontFamily: "Arial, sans-serif",
                fontSize: "15px",
              }}
            />

            <button
              onClick={sendMessage}
              disabled={!input.trim() || loading}
              style={{
                width: "52px",
                border: "none",
                borderRadius: "12px",
                background:
                  !input.trim() || loading
                    ? "#cbd5e1"
                    : "#0F8377",
                color: "white",
                cursor:
                  !input.trim() || loading
                    ? "not-allowed"
                    : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Send size={21} />
            </button>
          </div>
        </div>

        {/* DISCLAIMER */}

        <div
          style={{
            marginTop: "20px",
            padding: "18px",
            background: "#fff8e8",
            border: "1px solid #fde7b0",
            borderRadius: "14px",
            color: "#78350f",
            fontSize: "14px",
            lineHeight: "1.6",
          }}
        >
          <strong>Educational Use Only:</strong> MediGuide AI
          provides general educational information and does not
          diagnose medical conditions or replace professional
          medical advice.
        </div>
      </div>

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

export default AIAssistant;