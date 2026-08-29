import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Send,
  Bot,
  User,
  Sparkles,
  LoaderCircle,
  Languages,
  MessageCircle,
  ShieldAlert,
} from "lucide-react";

function AIChat() {
  const navigate = useNavigate();

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

  const suggestedQuestions = [
    "What is paracetamol used for?",
    "Explain diabetes in simple language",
    "What are common precautions for medicines?",
    "What is hypertension?",
  ];

  // --------------------------------------------------
  // SEND MESSAGE TO FASTAPI + GEMINI
  // --------------------------------------------------

  const sendMessage = async (question = input) => {
    const trimmedQuestion = question.trim();

    if (!trimmedQuestion || loading) return;

    // Add user's message to chat
    const userMessage = {
      role: "user",
      content: trimmedQuestion,
    };

    setMessages((previousMessages) => [
      ...previousMessages,
      userMessage,
    ]);

    setInput("");
    setLoading(true);

    try {
      // Connect to FastAPI backend
      const response = await fetch(
        "http://127.0.0.1:8000/ai-chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: trimmedQuestion,
            language: language,
          }),
        }
      );

      // Read backend response
      const data = await response.json();

      // Handle backend errors
      if (!response.ok) {
        throw new Error(
          data.detail || "Unable to get AI response."
        );
      }

      // Add Gemini AI response
      const aiMessage = {
        role: "assistant",
        content:
          data.response ||
          "Sorry, I could not generate a response.",
      };

      setMessages((previousMessages) => [
        ...previousMessages,
        aiMessage,
      ]);

    } catch (error) {
      console.error("AI chat error:", error);

      // Display error in chat
      setMessages((previousMessages) => [
        ...previousMessages,
        {
          role: "assistant",
          content:
            "Sorry, I was unable to connect to MediGuide AI. Please make sure the backend server is running and try again.",
          error: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // ENTER KEY
  // --------------------------------------------------

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
        fontFamily: "Arial, sans-serif",
        padding: "30px 20px",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        {/* BACK BUTTON */}

        <button
          onClick={() => navigate("/dashboard")}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 16px",
            border: "1px solid #e2e8f0",
            borderRadius: "10px",
            background: "white",
            color: "#475569",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "600",
            marginBottom: "22px",
          }}
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </button>

        {/* HEADER */}

        <div
          style={{
            background:
              "linear-gradient(135deg, #0F8377 0%, #075f57 100%)",
            padding: "32px",
            borderRadius: "22px",
            color: "white",
            marginBottom: "22px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "15px",
            }}
          >
            <div
              style={{
                width: "58px",
                height: "58px",
                borderRadius: "16px",
                background: "rgba(255,255,255,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Bot size={30} />
            </div>

            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "5px",
                  opacity: 0.9,
                }}
              >
                <Sparkles size={16} />

                <span
                  style={{
                    fontSize: "13px",
                    fontWeight: "700",
                    letterSpacing: "0.5px",
                  }}
                >
                  AI HEALTHCARE EDUCATION ASSISTANT
                </span>
              </div>

              <h1
                style={{
                  margin: 0,
                  fontSize: "30px",
                }}
              >
                Ask MediGuide AI
              </h1>

              <p
                style={{
                  margin: "8px 0 0",
                  opacity: 0.85,
                  lineHeight: "1.5",
                }}
              >
                Ask questions about medicines and health conditions in
                simple, easy-to-understand language.
              </p>
            </div>
          </div>
        </div>

        {/* MAIN CHAT AREA */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "280px 1fr",
            gap: "22px",
          }}
        >
          {/* SIDEBAR */}

          <div>
            {/* LANGUAGE */}

            <div
              style={{
                background: "white",
                borderRadius: "16px",
                padding: "20px",
                border: "1px solid #e2e8f0",
                marginBottom: "18px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "15px",
                  color: "#1e293b",
                  fontWeight: "700",
                }}
              >
                <Languages size={19} color="#0F8377" />
                Response Language
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "8px",
                }}
              >
                <button
                  onClick={() => setLanguage("en")}
                  style={{
                    flex: 1,
                    padding: "10px",
                    border:
                      language === "en"
                        ? "2px solid #0F8377"
                        : "1px solid #e2e8f0",
                    borderRadius: "9px",
                    background:
                      language === "en"
                        ? "#e8f7f5"
                        : "white",
                    color:
                      language === "en"
                        ? "#0F8377"
                        : "#64748b",
                    cursor: "pointer",
                    fontWeight: "600",
                  }}
                >
                  English
                </button>

                <button
                  onClick={() => setLanguage("ta")}
                  style={{
                    flex: 1,
                    padding: "10px",
                    border:
                      language === "ta"
                        ? "2px solid #0F8377"
                        : "1px solid #e2e8f0",
                    borderRadius: "9px",
                    background:
                      language === "ta"
                        ? "#e8f7f5"
                        : "white",
                    color:
                      language === "ta"
                        ? "#0F8377"
                        : "#64748b",
                    cursor: "pointer",
                    fontWeight: "600",
                  }}
                >
                  தமிழ்
                </button>
              </div>
            </div>

            {/* SUGGESTED QUESTIONS */}

            <div
              style={{
                background: "white",
                borderRadius: "16px",
                padding: "20px",
                border: "1px solid #e2e8f0",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "15px",
                  fontWeight: "700",
                  color: "#1e293b",
                }}
              >
                <MessageCircle size={19} color="#3467F0" />
                Try asking
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                {suggestedQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => sendMessage(question)}
                    disabled={loading}
                    style={{
                      padding: "12px",
                      textAlign: "left",
                      border: "1px solid #e2e8f0",
                      borderRadius: "10px",
                      background: "#f8fafc",
                      color: "#475569",
                      cursor: loading
                        ? "not-allowed"
                        : "pointer",
                      fontSize: "13px",
                      lineHeight: "1.5",
                    }}
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* CHAT */}

          <div
            style={{
              background: "white",
              borderRadius: "18px",
              border: "1px solid #e2e8f0",
              display: "flex",
              flexDirection: "column",
              minHeight: "650px",
              overflow: "hidden",
            }}
          >
            {/* CHAT HEADER */}

            <div
              style={{
                padding: "18px 22px",
                borderBottom: "1px solid #e2e8f0",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    background: "#e8f7f5",
                    color: "#0F8377",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Bot size={21} />
                </div>

                <div>
                  <strong style={{ color: "#1e293b" }}>
                    MediGuide AI Assistant
                  </strong>

                  <p
                    style={{
                      margin: "3px 0 0",
                      fontSize: "12px",
                      color: "#16a34a",
                    }}
                  >
                    ● Ready to help
                  </p>
                </div>
              </div>

              <span
                style={{
                  padding: "6px 10px",
                  background: "#f1f5f9",
                  borderRadius: "20px",
                  color: "#64748b",
                  fontSize: "12px",
                }}
              >
                {language === "en" ? "English" : "தமிழ்"}
              </span>
            </div>

            {/* MESSAGES */}

            <div
              style={{
                flex: 1,
                padding: "25px",
                overflowY: "auto",
                background: "#fcfdfd",
              }}
            >
              {messages.map((message, index) => {
                const isUser = message.role === "user";

                return (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      justifyContent: isUser
                        ? "flex-end"
                        : "flex-start",
                      marginBottom: "20px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        gap: "10px",
                        maxWidth: "80%",
                        flexDirection: isUser
                          ? "row-reverse"
                          : "row",
                      }}
                    >
                      <div
                        style={{
                          width: "38px",
                          height: "38px",
                          minWidth: "38px",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: isUser
                            ? "#3467F0"
                            : "#0F8377",
                          color: "white",
                        }}
                      >
                        {isUser ? (
                          <User size={18} />
                        ) : (
                          <Bot size={19} />
                        )}
                      </div>

                      <div
                        style={{
                          padding: "14px 17px",
                          borderRadius: isUser
                            ? "16px 4px 16px 16px"
                            : "4px 16px 16px 16px",
                          background: isUser
                            ? "#3467F0"
                            : "white",
                          color: isUser
                            ? "white"
                            : message.error
                            ? "#dc2626"
                            : "#334155",
                          border: isUser
                            ? "none"
                            : message.error
                            ? "1px solid #fecaca"
                            : "1px solid #e2e8f0",
                          lineHeight: "1.7",
                          fontSize: "14px",
                          whiteSpace: "pre-wrap",
                          boxShadow: isUser
                            ? "none"
                            : "0 3px 10px rgba(15,23,42,0.04)",
                        }}
                      >
                        {message.content}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* LOADING */}

              {loading && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <div
                    style={{
                      width: "38px",
                      height: "38px",
                      borderRadius: "50%",
                      background: "#0F8377",
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Bot size={19} />
                  </div>

                  <div
                    style={{
                      padding: "13px 17px",
                      background: "white",
                      border: "1px solid #e2e8f0",
                      borderRadius: "14px",
                      color: "#64748b",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <LoaderCircle
                      size={17}
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

            {/* INPUT */}

            <div
              style={{
                padding: "18px",
                borderTop: "1px solid #e2e8f0",
                background: "white",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  gap: "12px",
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  borderRadius: "14px",
                  padding: "10px",
                }}
              >
                <textarea
                  value={input}
                  onChange={(event) =>
                    setInput(event.target.value)
                  }
                  onKeyDown={handleKeyDown}
                  placeholder="Ask a healthcare education question..."
                  rows={1}
                  style={{
                    flex: 1,
                    resize: "none",
                    border: "none",
                    outline: "none",
                    background: "transparent",
                    fontFamily: "Arial, sans-serif",
                    fontSize: "14px",
                    padding: "10px",
                    minHeight: "24px",
                    maxHeight: "120px",
                  }}
                />

                <button
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || loading}
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "11px",
                    border: "none",
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
                  <Send size={19} />
                </button>
              </div>

              <p
                style={{
                  margin: "10px 5px 0",
                  fontSize: "11px",
                  color: "#94a3b8",
                }}
              >
                Press Enter to send • Shift + Enter for a new line
              </p>
            </div>
          </div>
        </div>

        {/* DISCLAIMER */}

        <div
          style={{
            marginTop: "22px",
            padding: "20px",
            borderRadius: "14px",
            background: "#fff8e8",
            border: "1px solid #fde7b0",
            display: "flex",
            gap: "12px",
          }}
        >
          <ShieldAlert
            size={23}
            color="#b45309"
            style={{ minWidth: "23px" }}
          />

          <div>
            <strong
              style={{
                color: "#92400e",
              }}
            >
              Educational Information Only
            </strong>

            <p
              style={{
                margin: "6px 0 0",
                color: "#78350f",
                fontSize: "13px",
                lineHeight: "1.6",
              }}
            >
              MediGuide AI provides healthcare education and general
              information. It does not provide medical diagnosis,
              prescriptions, or personalized treatment advice. Consult a
              qualified healthcare professional for medical concerns.
            </p>
          </div>
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

          @media (max-width: 800px) {
            .chat-layout {
              grid-template-columns: 1fr;
            }
          }
        `}
      </style>
    </div>
  );
}

export default AIChat;