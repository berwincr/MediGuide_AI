import React, {
  useEffect,
  useState,
  useRef,
} from "react";

import { useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  Send,
  Sparkles,
  User,
  Stethoscope,
  LoaderCircle,
  Plus,
  MessageCircle,
  Trash2,
  ChevronDown,
} from "lucide-react";

import ReactMarkdown from "react-markdown";


function AIChat() {

  const navigate = useNavigate();

  // --------------------------------------------------
  // STATE
  // --------------------------------------------------

  const [question, setQuestion] = useState("");

  const [messages, setMessages] = useState([]);

  const [sessionId, setSessionId] = useState(null);

  const [sessions, setSessions] = useState([]);

  const [loading, setLoading] = useState(false);

  const [historyLoading, setHistoryLoading] =
    useState(false);

  const [error, setError] = useState("");

  const [languageOpen, setLanguageOpen] =
    useState(false);

  const languageDropdownRef = useRef(null);

  const [language, setLanguage] = useState(
    localStorage.getItem("language") || "en"
  );


  // --------------------------------------------------
  // GET CURRENT TOKEN
  // --------------------------------------------------

  const getToken = () => {
    return localStorage.getItem("token");
  };


  // --------------------------------------------------
  // LOAD CHAT HISTORY
  // --------------------------------------------------

  const loadSessions = async () => {

    const currentToken = getToken();

    if (!currentToken) {

      console.log(
        "No authentication token found."
      );

      return;
    }

    try {

      setHistoryLoading(true);

      const response = await fetch(
        "http://127.0.0.1:8000/chat/sessions",
        {
          method: "GET",

          headers: {
            Authorization: `Bearer ${currentToken}`,
          },
        }
      );


      const data = await response.json();


      console.log(
        "CHAT SESSIONS RESPONSE:",
        data
      );


      if (!response.ok) {

        throw new Error(
          data.detail ||
          "Unable to load chat history."
        );
      }


      if (!Array.isArray(data)) {

        throw new Error(
          "Invalid chat history response."
        );
      }


      setSessions(data);

    } catch (error) {

      console.error(
        "Chat history error:",
        error
      );

      setSessions([]);

    } finally {

      setHistoryLoading(false);

    }
  };


  // --------------------------------------------------
  // LOAD SESSIONS WHEN PAGE OPENS
  // --------------------------------------------------

  useEffect(() => {

    loadSessions();

  }, []);


  // --------------------------------------------------
  // LANGUAGE DROPDOWN
  // --------------------------------------------------

  useEffect(() => {

    const handleClickOutside = (event) => {

      if (
        languageDropdownRef.current &&
        !languageDropdownRef.current.contains(
          event.target
        )
      ) {

        setLanguageOpen(false);

      }

    };


    document.addEventListener(
      "mousedown",
      handleClickOutside
    );


    return () => {

      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );

    };

  }, []);


  // --------------------------------------------------
  // SAVE LANGUAGE
  // --------------------------------------------------

  useEffect(() => {

    localStorage.setItem(
      "language",
      language
    );

  }, [language]);


  // --------------------------------------------------
  // LOAD MESSAGES FROM A SESSION
  // --------------------------------------------------

  const loadConversation = async (id) => {

    const currentToken = getToken();

    if (!currentToken) {

      setError(
        "Please log in to load your chat history."
      );

      return;
    }


    try {

      setLoading(true);

      setError("");


      const response = await fetch(
        `http://127.0.0.1:8000/chat/sessions/${id}/messages`,
        {
          method: "GET",

          headers: {
            Authorization: `Bearer ${currentToken}`,
          },
        }
      );


      const data = await response.json();


      if (!response.ok) {

        throw new Error(
          data.detail ||
          "Unable to load conversation."
        );
      }


      const formattedMessages =
        Array.isArray(data.messages)
          ? data.messages.map((message) => ({
              role: message.sender,
              content: message.message_text,
            }))
          : [];


      setMessages(formattedMessages);

      setSessionId(id);

    } catch (error) {

      console.error(
        "Conversation loading error:",
        error
      );


      setError(
        error.message ||
        "Unable to load conversation."
      );

    } finally {

      setLoading(false);

    }
  };


  // --------------------------------------------------
  // NEW CHAT
  // --------------------------------------------------

  const startNewChat = () => {

    setSessionId(null);

    setMessages([]);

    setQuestion("");

    setError("");

  };


  // --------------------------------------------------
  // SEND MESSAGE
  // --------------------------------------------------

  const sendMessage = async () => {

    const trimmedQuestion =
      question.trim();


    if (
      !trimmedQuestion ||
      loading
    ) {

      return;

    }


    const currentToken = getToken();


    if (!currentToken) {

      setError(
        "Please log in to use AI Chat."
      );

      return;

    }


    const userMessage = {
      role: "user",
      content: trimmedQuestion,
    };


    // ----------------------------------------------
    // SHOW USER MESSAGE IMMEDIATELY
    // ----------------------------------------------

    setMessages((previous) => [
      ...previous,
      userMessage,
    ]);


    setQuestion("");

    setLoading(true);

    setError("");


    try {

      // --------------------------------------------
      // SEND MESSAGE TO BACKEND
      // --------------------------------------------

      const response = await fetch(
        "http://127.0.0.1:8000/ai-chat",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${currentToken}`,
          },

          body: JSON.stringify({
            message: trimmedQuestion,
            language: language,
            session_id: sessionId,
          }),
        }
      );


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data.detail ||
          "Unable to get AI response."
        );

      }


      // --------------------------------------------
      // SAVE SESSION ID
      // --------------------------------------------

      setSessionId(
        data.session_id
      );


      // --------------------------------------------
      // SHOW AI RESPONSE
      // --------------------------------------------

      setMessages((previous) => [
        ...previous,

        {
          role: "assistant",
          content: data.response,
        },
      ]);


      // --------------------------------------------
      // REFRESH CHAT HISTORY
      // --------------------------------------------

      await loadSessions();

    } catch (error) {

      console.error(
        "AI Chat error:",
        error
      );


      setError(
        error.message ||
        "Unable to get AI response."
      );

    } finally {

      setLoading(false);

    }
  };


  // --------------------------------------------------
  // ENTER KEY
  // --------------------------------------------------

  const handleKeyDown = (event) => {

    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {

      event.preventDefault();

      sendMessage();

    }

  };


  // --------------------------------------------------
  // DELETE CHAT
  // --------------------------------------------------

  const deleteSession = async (
    id,
    event
  ) => {

    event.stopPropagation();


    const currentToken = getToken();


    if (!currentToken) {

      setError(
        "Please log in to delete chat."
      );

      return;

    }


    try {

      const response = await fetch(
        `http://127.0.0.1:8000/chat/sessions/${id}`,
        {
          method: "DELETE",

          headers: {
            Authorization:
              `Bearer ${currentToken}`,
          },
        }
      );


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data.detail ||
          "Unable to delete chat."
        );

      }


      // --------------------------------------------
      // REMOVE FROM SIDEBAR
      // --------------------------------------------

      setSessions((previous) =>
        previous.filter(
          (session) =>
            session.session_id !== id
        )
      );


      // --------------------------------------------
      // IF CURRENT CHAT WAS DELETED
      // --------------------------------------------

      if (sessionId === id) {

        startNewChat();

      }

    } catch (error) {

      console.error(
        "Delete chat error:",
        error
      );


      setError(
        error.message ||
        "Unable to delete chat."
      );

    }

  };


  // ==================================================
  // UI
  // ==================================================

  return (

    <div
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        display: "flex",
        flexDirection: "column",
      }}
    >

      {/* ==================================================
          HEADER
      ================================================== */}

      <div
        style={{
          background: "#ffffff",
          borderBottom:
            "1px solid #e2e8f0",
          padding: "16px 24px",
          display: "flex",
          alignItems: "center",
          gap: "14px",
        }}
      >

        <button
          onClick={() => navigate(-1)}
          style={{
            border: "none",
            background: "transparent",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
          }}
        >

          <ArrowLeft
            size={20}
            color="#334155"
          />

        </button>


        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "12px",
            background: "#e6f7f4",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >

          <Stethoscope
            size={21}
            color="#0F8377"
          />

        </div>


        <div
          style={{
            flex: 1,
          }}
        >

          <h2
            style={{
              margin: 0,
              fontSize: "19px",
              color: "#0f172a",
            }}
          >
            MediGuide AI
          </h2>


          <p
            style={{
              margin: "3px 0 0",
              fontSize: "12px",
              color: "#64748b",
            }}
          >
            Healthcare education assistant
          </p>

        </div>


        <button
          onClick={startNewChat}
          style={{
            border:
              "1px solid #0F8377",
            background: "#ffffff",
            color: "#0F8377",
            borderRadius: "9px",
            padding: "9px 13px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontWeight: "600",
          }}
        >

          <Plus size={17} />

          New Chat

        </button>

      </div>


      {/* ==================================================
          MAIN CONTENT
      ================================================== */}

      <div
        style={{
          flex: 1,
          display: "flex",
          maxWidth: "1400px",
          width: "100%",
          margin: "0 auto",
        }}
      >


        {/* ==================================================
            CHAT HISTORY
        ================================================== */}

        <div
          style={{
            width: "270px",
            background: "#ffffff",
            borderRight:
              "1px solid #e2e8f0",
            padding: "18px 12px",
            overflowY: "auto",
          }}
        >

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "0 8px 14px",
            }}
          >

            <MessageCircle
              size={18}
              color="#0F8377"
            />

            <h3
              style={{
                margin: 0,
                fontSize: "15px",
                color: "#1e293b",
              }}
            >
              Chat History
            </h3>

          </div>


          {/* LOADING */}

          {historyLoading ? (

            <div
              style={{
                textAlign: "center",
                padding: "20px",
                color: "#64748b",
                fontSize: "13px",
              }}
            >
              Loading...
            </div>

          ) : sessions.length === 0 ? (

            /* NO CHATS */

            <div
              style={{
                textAlign: "center",
                padding: "25px 12px",
                color: "#94a3b8",
                fontSize: "13px",
                lineHeight: "1.5",
              }}
            >
              No previous chats yet.
            </div>

          ) : (

            /* CHAT LIST */

            sessions.map((session) => (

              <div
                key={session.session_id}
                onClick={() =>
                  loadConversation(
                    session.session_id
                  )
                }
                style={{
                  padding: "10px",
                  borderRadius: "9px",
                  marginBottom: "6px",
                  cursor: "pointer",
                  background:
                    sessionId ===
                    session.session_id
                      ? "#e6f7f4"
                      : "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >

                <MessageCircle
                  size={16}
                  color="#0F8377"
                />


                <span
                  style={{
                    flex: 1,
                    fontSize: "13px",
                    color: "#334155",
                    overflow: "hidden",
                    textOverflow:
                      "ellipsis",
                    whiteSpace:
                      "nowrap",
                  }}
                >

                  {session.title}

                </span>


                <button
                  onClick={(event) =>
                    deleteSession(
                      session.session_id,
                      event
                    )
                  }
                  style={{
                    border: "none",
                    background:
                      "transparent",
                    cursor: "pointer",
                    padding: "3px",
                    display: "flex",
                  }}
                >

                  <Trash2
                    size={15}
                    color="#94a3b8"
                  />

                </button>

              </div>

            ))

          )}

        </div>


        {/* ==================================================
            CHAT AREA
        ================================================== */}

        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            minWidth: 0,
          }}
        >


          {/* ==================================================
              MESSAGES
          ================================================== */}

          <div
            style={{
              flex: 1,
              padding: "28px",
              overflowY: "auto",
            }}
          >

            {/* EMPTY CHAT */}

            {messages.length === 0 &&
              !loading && (

                <div
                  style={{
                    maxWidth: "650px",
                    margin: "70px auto",
                    textAlign: "center",
                  }}
                >

                  <Sparkles
                    size={42}
                    color="#0F8377"
                  />


                  <h2
                    style={{
                      color: "#0f172a",
                      marginTop: "16px",
                    }}
                  >
                    How can I help you?
                  </h2>


                  <p
                    style={{
                      color: "#64748b",
                      lineHeight: "1.6",
                    }}
                  >
                    Ask MediGuide AI about
                    medicines, conditions,
                    symptoms, or general
                    healthcare information.
                  </p>

                </div>

              )}


            {/* MESSAGE LIST */}

            {messages.map(
              (message, index) => {

                const isUser =
                  message.role ===
                  "user";


                return (

                  <div
                    key={index}
                    style={{
                      display: "flex",
                      justifyContent:
                        isUser
                          ? "flex-end"
                          : "flex-start",
                      marginBottom:
                        "18px",
                    }}
                  >

                    <div
                      style={{
                        maxWidth:
                          "760px",
                        display:
                          "flex",
                        gap: "10px",
                        flexDirection:
                          isUser
                            ? "row-reverse"
                            : "row",
                      }}
                    >


                      {/* AVATAR */}

                      <div
                        style={{
                          width: "34px",
                          height: "34px",
                          borderRadius:
                            "50%",
                          background:
                            isUser
                              ? "#dbeafe"
                              : "#e6f7f4",
                          display:
                            "flex",
                          alignItems:
                            "center",
                          justifyContent:
                            "center",
                          flexShrink: 0,
                        }}
                      >

                        {isUser ? (

                          <User
                            size={17}
                            color="#3467F0"
                          />

                        ) : (

                          <Stethoscope
                            size={17}
                            color="#0F8377"
                          />

                        )}

                      </div>


                      {/* MESSAGE */}

                      <div
                        style={{
                          background:
                            isUser
                              ? "#3467F0"
                              : "#ffffff",

                          color:
                            isUser
                              ? "#ffffff"
                              : "#334155",

                          padding:
                            "13px 16px",

                          borderRadius:
                            "14px",

                          lineHeight:
                            "1.7",

                          fontSize:
                            "14px",

                          boxShadow:
                            "0 2px 8px rgba(15,23,42,0.06)",
                        }}
                      >

                        {isUser ? (

                          message.content

                        ) : (

                          <ReactMarkdown
                            components={{

                              h3:
                                ({
                                  children,
                                }) => (

                                  <h3
                                    style={{
                                      fontSize:
                                        "18px",
                                      fontWeight:
                                        "700",
                                      color:
                                        "#0F8377",
                                      marginTop:
                                        "18px",
                                      marginBottom:
                                        "9px",
                                    }}
                                  >
                                    {children}
                                  </h3>

                                ),


                              p:
                                ({
                                  children,
                                }) => (

                                  <p
                                    style={{
                                      marginTop:
                                        "0",
                                      marginBottom:
                                        "12px",
                                      lineHeight:
                                        "1.7",
                                    }}
                                  >
                                    {children}
                                  </p>

                                ),


                              ul:
                                ({
                                  children,
                                }) => (

                                  <ul
                                    style={{
                                      paddingLeft:
                                        "22px",
                                      marginTop:
                                        "8px",
                                      marginBottom:
                                        "14px",
                                    }}
                                  >
                                    {children}
                                  </ul>

                                ),


                              ol:
                                ({
                                  children,
                                }) => (

                                  <ol
                                    style={{
                                      paddingLeft:
                                        "22px",
                                      marginTop:
                                        "8px",
                                      marginBottom:
                                        "14px",
                                    }}
                                  >
                                    {children}
                                  </ol>

                                ),


                              li:
                                ({
                                  children,
                                }) => (

                                  <li
                                    style={{
                                      marginBottom:
                                        "6px",
                                      lineHeight:
                                        "1.6",
                                    }}
                                  >
                                    {children}
                                  </li>

                                ),


                              strong:
                                ({
                                  children,
                                }) => (

                                  <strong
                                    style={{
                                      fontWeight:
                                        "700",
                                      color:
                                        "#1e293b",
                                    }}
                                  >
                                    {children}
                                  </strong>

                                ),

                            }}
                          >

                            {message.content}

                          </ReactMarkdown>

                        )}

                      </div>

                    </div>

                  </div>

                );

              }
            )}


            {/* LOADING */}

            {loading && (

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  color: "#64748b",
                  fontSize: "14px",
                  padding: "10px",
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

            )}


            {/* ERROR */}

            {error && (

              <div
                style={{
                  background: "#fef2f2",
                  color: "#b91c1c",
                  padding:
                    "12px 14px",
                  borderRadius: "9px",
                  marginTop: "10px",
                  fontSize: "13px",
                }}
              >

                {error}

              </div>

            )}

          </div>


          {/* ==================================================
              INPUT AREA
          ================================================== */}

          <div
            style={{
              padding:
                "16px 28px 24px",
              background:
                "#f8fafc",
            }}
          >

            <div
              style={{
                maxWidth:
                  "850px",
                margin:
                  "0 auto",
              }}
            >


              {/* LANGUAGE SELECTOR */}

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  marginBottom:
                    "10px",
                }}
              >

                <div
                  ref={
                    languageDropdownRef
                  }
                  style={{
                    position:
                      "relative",
                  }}
                >

                  <button
                    type="button"
                    onClick={() =>
                      setLanguageOpen(
                        !languageOpen
                      )
                    }
                    onMouseEnter={(
                      event
                    ) => {

                      event.currentTarget.style.borderColor =
                        "#0F8377";

                      event.currentTarget.style.background =
                        "#f0fdfa";

                    }}
                    onMouseLeave={(
                      event
                    ) => {

                      event.currentTarget.style.borderColor =
                        "#cbd5e1";

                      event.currentTarget.style.background =
                        "#ffffff";

                    }}
                    style={{
                      display:
                        "flex",
                      alignItems:
                        "center",
                      gap: "8px",
                      padding:
                        "9px 12px",
                      borderRadius:
                        "10px",
                      border:
                        "1px solid #cbd5e1",
                      background:
                        "#ffffff",
                      color:
                        "#334155",
                      fontSize:
                        "14px",
                      fontWeight:
                        "500",
                      cursor:
                        "pointer",
                      minWidth:
                        "120px",
                      justifyContent:
                        "space-between",
                    }}
                  >

                    <span>
                      {language ===
                      "en"
                        ? "English"
                        : "Tamil"}
                    </span>


                    <ChevronDown
                      size={16}
                      style={{
                        transform:
                          languageOpen
                            ? "rotate(180deg)"
                            : "rotate(0deg)",
                        transition:
                          "transform 0.2s ease",
                      }}
                    />

                  </button>


                  {languageOpen && (

                    <div
                      style={{
                        position:
                          "absolute",
                        top:
                          "calc(100% + 6px)",
                        right: 0,
                        width:
                          "120px",
                        background:
                          "#ffffff",
                        border:
                          "1px solid #e2e8f0",
                        borderRadius:
                          "10px",
                        boxShadow:
                          "0 8px 20px rgba(15, 23, 42, 0.12)",
                        overflow:
                          "hidden",
                        zIndex:
                          100,
                      }}
                    >


                      {/* ENGLISH */}

                      <button
                        type="button"
                        onClick={() => {

                          setLanguage(
                            "en"
                          );

                          setLanguageOpen(
                            false
                          );

                        }}
                        onMouseEnter={(
                          event
                        ) => {

                          event.currentTarget.style.background =
                            "#f0fdfa";

                        }}
                        onMouseLeave={(
                          event
                        ) => {

                          event.currentTarget.style.background =
                            language ===
                            "en"
                              ? "#f0fdfa"
                              : "#ffffff";

                        }}
                        style={{
                          width:
                            "100%",
                          padding:
                            "10px 12px",
                          border:
                            "none",
                          background:
                            language ===
                            "en"
                              ? "#f0fdfa"
                              : "#ffffff",
                          fontWeight:
                            language ===
                            "en"
                              ? "600"
                              : "400",
                          color:
                            "#334155",
                          textAlign:
                            "left",
                          cursor:
                            "pointer",
                          fontSize:
                            "14px",
                        }}
                      >
                        English
                      </button>


                      {/* TAMIL */}

                      <button
                        type="button"
                        onClick={() => {

                          setLanguage(
                            "ta"
                          );

                          setLanguageOpen(
                            false
                          );

                        }}
                        onMouseEnter={(
                          event
                        ) => {

                          event.currentTarget.style.background =
                            "#f0fdfa";

                        }}
                        onMouseLeave={(
                          event
                        ) => {

                          event.currentTarget.style.background =
                            language ===
                            "ta"
                              ? "#f0fdfa"
                              : "#ffffff";

                        }}
                        style={{
                          width:
                            "100%",
                          padding:
                            "10px 12px",
                          border:
                            "none",
                          background:
                            language ===
                            "ta"
                              ? "#f0fdfa"
                              : "#ffffff",
                          fontWeight:
                            language ===
                            "ta"
                              ? "600"
                              : "400",
                          color:
                            "#334155",
                          textAlign:
                            "left",
                          cursor:
                            "pointer",
                          fontSize:
                            "14px",
                        }}
                      >
                        Tamil
                      </button>

                    </div>

                  )}

                </div>

              </div>


              {/* MESSAGE INPUT */}

              <div
                style={{
                  display:
                    "flex",
                  gap: "10px",
                  background:
                    "#ffffff",
                  border:
                    "1px solid #cbd5e1",
                  borderRadius:
                    "12px",
                  padding:
                    "8px",
                }}
              >

                <textarea
                  value={question}
                  onChange={(
                    event
                  ) =>
                    setQuestion(
                      event.target.value
                    )
                  }
                  onKeyDown={
                    handleKeyDown
                  }
                  placeholder="Ask a healthcare question..."
                  rows={2}
                  style={{
                    flex: 1,
                    resize:
                      "none",
                    border:
                      "none",
                    outline:
                      "none",
                    padding:
                      "9px",
                    fontSize:
                      "14px",
                    fontFamily:
                      "inherit",
                  }}
                />


                <button
                  onClick={
                    sendMessage
                  }
                  disabled={
                    loading ||
                    !question.trim()
                  }
                  style={{
                    width:
                      "46px",
                    height:
                      "46px",
                    border:
                      "none",
                    borderRadius:
                      "10px",
                    background:
                      "#0F8377",
                    color:
                      "#ffffff",
                    cursor:
                      loading ||
                      !question.trim()
                        ? "not-allowed"
                        : "pointer",
                    opacity:
                      loading ||
                      !question.trim()
                        ? 0.6
                        : 1,
                    display:
                      "flex",
                    alignItems:
                      "center",
                    justifyContent:
                      "center",
                    alignSelf:
                      "flex-end",
                  }}
                >

                  <Send
                    size={18}
                  />

                </button>

              </div>


              {/* DISCLAIMER */}

              <p
                style={{
                  textAlign:
                    "center",
                  fontSize:
                    "11px",
                  color:
                    "#94a3b8",
                  marginTop:
                    "9px",
                }}
              >
                MediGuide AI provides
                educational
                information and does
                not replace
                professional medical
                advice.
              </p>

            </div>

          </div>

        </div>

      </div>

    </div>

  );
}


export default AIChat;