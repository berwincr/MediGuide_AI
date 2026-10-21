import { useNavigate } from "react-router-dom";
import {
  Pill,
  Stethoscope,
  ScanLine,
  Bell,
  Search,
  ArrowRight,
  Sparkles,
  Mic,
  ShieldCheck,
  LogOut,
  User,
  Activity,
  Clock,
  MessageCircle,
  HeartPulse,
  ChevronRight,
  ClipboardList,
} from "lucide-react";

const C = {
  teal: "#0F8377",
  tealDark: "#075E56",
  tealLight: "#E8F7F5",
  blue: "#3467F0",
  blueLight: "#EEF2FF",
  purple: "#7C3AED",
  purpleLight: "#F3E8FF",
  orange: "#EA580C",
  orangeLight: "#FFF2E8",
  ink: "#172B4D",
  muted: "#64748B",
  border: "#E5EBF2",
  page: "#F5F8FC",
  white: "#FFFFFF",
};

const features = [
  {
    title: "Ask MediGuide AI",
    description:
      "Get easy-to-understand explanations about medicines and health conditions.",
    action: "Start AI Chat",
    path: "/ai-chat",
    icon: MessageCircle,
    color: C.blue,
    tint: C.blueLight,
    tag: "AI ASSISTANT",
  },
  {
    title: "Medicine Search",
    description:
      "Explore medicine uses, precautions, and available medical information.",
    action: "Explore medicines",
    path: "/medicines",
    icon: Pill,
    color: C.teal,
    tint: C.tealLight,
  },
  {
    title: "Condition Search",
    description:
      "Look up medical conditions by name or ICD-10 code.",
    action: "Explore conditions",
    path: "/conditions",
    icon: Stethoscope,
    color: C.blue,
    tint: C.blueLight,
  },
  {
    title: "Prescription Scanner",
    description:
      "Upload a prescription image to extract possible medicine names using OCR.",
    action: "Scan prescription",
    path: "/ocr",
    icon: ScanLine,
    color: C.purple,
    tint: C.purpleLight,
  },
  {
    title: "Medicine Reminders",
    description:
      "Manage your saved medication reminders in one place.",
    action: "Manage reminders",
    path: "/reminders",
    icon: Bell,
    color: C.purple,
    tint: C.purpleLight,
  },
];

function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const quickActions = [
    {
      title: "AI Assistant",
      description: "Ask a health question",
      icon: MessageCircle,
      color: C.blue,
      tint: C.blueLight,
      path: "/ai-chat",
    },
    {
      title: "Find a medicine",
      description: "Explore medicine information",
      icon: Search,
      color: C.teal,
      tint: C.tealLight,
      path: "/medicines",
    },
    {
      title: "Explore conditions",
      description: "Browse condition details",
      icon: Stethoscope,
      color: C.blue,
      tint: C.blueLight,
      path: "/conditions",
    },
    {
      title: "Scan a prescription",
      description: "Extract medicine names",
      icon: ScanLine,
      color: C.purple,
      tint: C.purpleLight,
      path: "/ocr",
    },
    {
      title: "Medicine reminders",
      description: "View your reminders",
      icon: Clock,
      color: C.orange,
      tint: C.orangeLight,
      path: "/reminders",
    },
  ];

  const styles = {
    page: {
      minHeight: "100vh",
      background: C.page,
      color: C.ink,
      fontFamily:
        "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    },
    nav: {
      position: "sticky",
      top: 0,
      zIndex: 20,
      background: "rgba(255,255,255,0.94)",
      backdropFilter: "blur(16px)",
      borderBottom: `1px solid ${C.border}`,
    },
    navInner: {
      maxWidth: 1440,
      minHeight: 78,
      padding: "12px 32px",
      margin: "0 auto",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 16,
    },
    brand: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      minWidth: 0,
    },
    logo: {
      width: 46,
      height: 46,
      borderRadius: 15,
      flexShrink: 0,
      background: `linear-gradient(145deg, ${C.teal}, ${C.tealDark})`,
      display: "grid",
      placeItems: "center",
      color: C.white,
      boxShadow: "0 5px 14px rgba(15,131,119,0.2)",
    },
    brandName: {
      margin: 0,
      fontSize: 20,
      fontWeight: 750,
      letterSpacing: "-0.6px",
    },
    brandSubtitle: {
      margin: "3px 0 0",
      color: C.muted,
      fontSize: 12,
    },
    accountActions: {
      display: "flex",
      alignItems: "center",
      gap: 12,
    },
    account: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      color: C.muted,
      fontSize: 14,
    },
    logout: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      padding: "10px 14px",
      border: `1px solid ${C.border}`,
      borderRadius: 11,
      background: C.white,
      color: C.ink,
      fontWeight: 650,
      fontSize: 13,
      cursor: "pointer",
    },
    main: {
      maxWidth: 1440,
      margin: "0 auto",
      padding: "30px 32px 48px",
    },
    hero: {
      position: "relative",
      overflow: "hidden",
      isolation: "isolate",
      display: "grid",
      gridTemplateColumns: "minmax(0, 1fr) auto",
      alignItems: "center",
      gap: 28,
      padding: "clamp(28px, 4vw, 54px)",
      minHeight: 255,
      borderRadius: 28,
      background:
        "linear-gradient(115deg, #087F73 0%, #096B64 52%, #064E52 100%)",
      color: C.white,
      boxShadow: "0 16px 36px rgba(7,95,87,0.15)",
      marginBottom: 38,
    },
    eyebrow: {
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      color: "#D6FBF2",
      fontWeight: 750,
      fontSize: 11,
      letterSpacing: "1.2px",
      marginBottom: 17,
    },
    heroTitle: {
      margin: "0 0 15px",
      maxWidth: 700,
      fontSize: "clamp(30px, 4vw, 45px)",
      lineHeight: 1.13,
      letterSpacing: "-1.5px",
      fontWeight: 800,
    },
    heroDescription: {
      margin: 0,
      maxWidth: 640,
      color: "#E2F5F1",
      lineHeight: 1.8,
      fontSize: 15,
    },
    heroActions: {
      display: "flex",
      flexWrap: "wrap",
      gap: 12,
      marginTop: 25,
    },
    primaryButton: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 9,
      padding: "12px 17px",
      border: 0,
      borderRadius: 11,
      background: C.white,
      color: C.tealDark,
      fontWeight: 750,
      fontSize: 13,
      cursor: "pointer",
    },
    secondaryButton: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 9,
      padding: "12px 17px",
      border: "1px solid rgba(255,255,255,0.35)",
      borderRadius: 11,
      background: "rgba(255,255,255,0.08)",
      color: C.white,
      fontWeight: 650,
      fontSize: 13,
      cursor: "pointer",
    },
    heroArtwork: {
      position: "relative",
      zIndex: 1,
      width: 158,
      height: 158,
      marginRight: 12,
      borderRadius: 38,
      border: "1px solid rgba(255,255,255,0.23)",
      background: "rgba(255,255,255,0.09)",
      display: "grid",
      placeItems: "center",
      color: "#E6FFFA",
      transform: "rotate(-5deg)",
    },
    sectionHeading: {
      display: "flex",
      alignItems: "end",
      justifyContent: "space-between",
      flexWrap: "wrap",
      gap: 12,
      marginBottom: 21,
    },
    sectionTitle: {
      margin: 0,
      fontSize: 24,
      fontWeight: 800,
      letterSpacing: "-0.7px",
    },
    sectionDescription: {
      margin: "7px 0 0",
      fontSize: 14,
      lineHeight: 1.6,
      color: C.muted,
    },
    sectionLabel: {
      color: C.teal,
      fontSize: 11,
      letterSpacing: "1.3px",
      fontWeight: 800,
      marginBottom: 9,
    },
    featureGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 245px), 1fr))",
      gap: 18,
    },
    featureCard: {
      display: "flex",
      flexDirection: "column",
      alignItems: "stretch",
      minWidth: 0,
      padding: 23,
      border: `1px solid ${C.border}`,
      borderRadius: 19,
      background: C.white,
      boxShadow: "0 3px 12px rgba(25,45,75,0.025)",
      transition: "transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease",
    },
    iconBox: {
      width: 50,
      height: 50,
      display: "grid",
      placeItems: "center",
      borderRadius: 15,
      marginBottom: 20,
    },
    featureTitle: {
      margin: "0 0 10px",
      fontSize: 17,
      fontWeight: 750,
      letterSpacing: "-0.3px",
    },
    featureDescription: {
      margin: 0,
      color: C.muted,
      fontSize: 13,
      lineHeight: 1.8,
      flex: 1,
      minHeight: 70,
    },
    featureButton: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 8,
      width: "100%",
      marginTop: 22,
      padding: "12px 13px",
      border: 0,
      borderRadius: 10,
      color: C.white,
      fontSize: 12,
      fontWeight: 750,
      cursor: "pointer",
    },
    quickPanel: {
      marginTop: 37,
      padding: "27px",
      border: `1px solid ${C.border}`,
      borderRadius: 22,
      background: C.white,
    },
    quickGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 185px), 1fr))",
      gap: 13,
    },
    quickButton: {
      display: "flex",
      alignItems: "flex-start",
      gap: 12,
      width: "100%",
      minWidth: 0,
      textAlign: "left",
      padding: 15,
      border: `1px solid ${C.border}`,
      borderRadius: 14,
      background: "#FAFCFE",
      cursor: "pointer",
      transition: "transform 180ms ease, border-color 180ms ease",
    },
    quickIcon: {
      width: 39,
      height: 39,
      flexShrink: 0,
      borderRadius: 12,
      display: "grid",
      placeItems: "center",
    },
    quickTitle: {
      display: "block",
      margin: "2px 0 5px",
      color: C.ink,
      fontSize: 12,
      fontWeight: 750,
      lineHeight: 1.4,
    },
    quickDescription: {
      display: "block",
      color: C.muted,
      fontSize: 11,
      lineHeight: 1.55,
    },
    supportGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 290px), 1fr))",
      gap: 17,
      marginTop: 22,
    },
    supportCard: {
      display: "flex",
      alignItems: "flex-start",
      gap: 15,
      padding: 22,
      border: `1px solid ${C.border}`,
      borderRadius: 18,
      background: C.white,
    },
    supportIcon: {
      width: 45,
      height: 45,
      flexShrink: 0,
      borderRadius: 13,
      display: "grid",
      placeItems: "center",
      color: C.teal,
      background: C.tealLight,
    },
    supportTitle: {
      margin: "1px 0 7px",
      fontSize: 15,
      fontWeight: 750,
    },
    supportDescription: {
      margin: 0,
      color: C.muted,
      fontSize: 12,
      lineHeight: 1.7,
    },
    notice: {
      display: "flex",
      alignItems: "flex-start",
      gap: 12,
      marginTop: 25,
      padding: "17px 19px",
      borderRadius: 14,
      border: "1px solid #F5DFAB",
      background: "#FFFAED",
      color: "#80521B",
      fontSize: 12,
      lineHeight: 1.8,
    },
    footer: {
      marginTop: 23,
      paddingTop: 19,
      borderTop: `1px solid ${C.border}`,
      display: "flex",
      flexWrap: "wrap",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 10,
      color: C.muted,
      fontSize: 11,
    },
  };

  return (
    <div style={styles.page}>
      <style>{`
        * { box-sizing: border-box; }
        .mg-feature:hover {
          transform: translateY(-4px);
          border-color: #C7E6E1 !important;
          box-shadow: 0 13px 28px rgba(25, 65, 80, 0.08) !important;
        }
        .mg-feature:focus-within {
          outline: 2px solid #0F8377;
          outline-offset: 3px;
        }
        .mg-quick:hover {
          transform: translateY(-2px);
          border-color: #B8DDD7 !important;
        }
        .mg-action:hover { filter: brightness(0.96); }
        .mg-action:focus-visible, .mg-quick:focus-visible, .mg-logout:focus-visible {
          outline: 3px solid #93C5FD;
          outline-offset: 3px;
        }
        @media (max-width: 640px) {
          .mg-nav-inner { padding: 12px 16px !important; }
          .mg-account-label { display: none !important; }
          .mg-main { padding: 22px 16px 32px !important; }
          .mg-hero { grid-template-columns: minmax(0, 1fr) !important; padding: 27px !important; }
          .mg-hero-art { display: none !important; }
          .mg-hero-title { font-size: 32px !important; }
          .mg-quick-panel { padding: 19px !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          .mg-feature, .mg-quick, .mg-action { transition: none !important; }
        }
      `}</style>

      <nav style={styles.nav}>
        <div className="mg-nav-inner" style={styles.navInner}>
          <div style={styles.brand}>
            <div style={styles.logo}>
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M3 12H7L10 5L14 19L17 12H21"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
</div>
            <div>
              <h2 style={styles.brandName}>MediGuide AI</h2>
              <p style={styles.brandSubtitle}>Healthcare Education Platform</p>
            </div>
          </div>

          <div style={styles.accountActions}>
            <button
  type="button"
  onClick={() => navigate("/account")}
  style={{
    display: "flex",
    alignItems: "center",
    gap: "8px",
    color: "#475569",
    fontSize: "14px",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    fontFamily: "inherit",
    padding: "8px",
    borderRadius: "8px",
  }}
>
  <User size={18} />
  <span>My Account</span>
</button>
            <button
              type="button"
              className="mg-logout"
              onClick={handleLogout}
              style={styles.logout}
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="mg-main" style={styles.main}>
        <section className="mg-hero" style={styles.hero}>
          <div style={{ position: "relative", zIndex: 2 }}>
            <div style={styles.eyebrow}>
              <Sparkles size={16} />
              YOUR HEALTH INFORMATION COMPANION
            </div>

            <h1 className="mg-hero-title" style={styles.heroTitle}>
              Understand your health.
              <br />
              One step at a time.
            </h1>

            <p style={styles.heroDescription}>
              Explore medicine information, learn about health conditions,
              and use AI-powered educational tools in one simple place.
            </p>

            <div style={styles.heroActions}>
              <button
                type="button"
                className="mg-action"
                style={styles.primaryButton}
                onClick={() => navigate("/ai-chat")}
              >
                <MessageCircle size={17} />
                Ask MediGuide AI
                <ArrowRight size={16} />
              </button>

              <button
                type="button"
                className="mg-action"
                style={styles.secondaryButton}
                onClick={() => navigate("/medicines")}
              >
                <Search size={16} />
                Explore medicines
              </button>
            </div>
          </div>

          <div className="mg-hero-art" style={styles.heroArtwork}>
            <div
              style={{
                position: "absolute",
                inset: 13,
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: 29,
              }}
            />
            <HeartPulse size={79} strokeWidth={1.35} />
            <div
              style={{
                position: "absolute",
                right: -10,
                bottom: 15,
                width: 47,
                height: 47,
                display: "grid",
                placeItems: "center",
                borderRadius: 15,
                background: "#FFFFFF",
                color: C.teal,
                boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
              }}
            >
              <ShieldCheck size={25} />
            </div>
          </div>

          <div
            style={{
              position: "absolute",
              zIndex: -1,
              width: 310,
              height: 310,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.055)",
              right: -120,
              top: -170,
            }}
          />
        </section>

        <section>
          <div style={styles.sectionHeading}>
            <div>
              <div style={styles.sectionLabel}>DISCOVER YOUR TOOLS</div>
              <h2 style={styles.sectionTitle}>Explore MediGuide</h2>
              <p style={styles.sectionDescription}>
                Everything you need to explore health information, all in one place.
              </p>
            </div>
          </div>

          <div style={styles.featureGrid}>
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <article
                  key={feature.title}
                  className="mg-feature"
                  style={styles.featureCard}
                >
                  <div
                    style={{
                      ...styles.iconBox,
                      background: feature.tint,
                      color: feature.color,
                    }}
                  >
                    <Icon size={24} strokeWidth={1.9} />
                  </div>

                  {feature.tag && (
                    <span
                      style={{
                        alignSelf: "flex-start",
                        marginBottom: 10,
                        color: feature.color,
                        fontSize: 9,
                        letterSpacing: "1px",
                        fontWeight: 800,
                      }}
                    >
                      {feature.tag}
                    </span>
                  )}

                  <h3 style={styles.featureTitle}>{feature.title}</h3>
                  <p style={styles.featureDescription}>
                    {feature.description}
                  </p>

                  <button
                    type="button"
                    className="mg-action"
                    onClick={() => navigate(feature.path)}
                    style={{
                      ...styles.featureButton,
                      background: feature.color,
                    }}
                  >
                    {feature.action}
                    <ArrowRight size={16} />
                  </button>
                </article>
              );
            })}
          </div>
        </section>

        <section className="mg-quick-panel" style={styles.quickPanel}>
          <div style={styles.sectionHeading}>
            <div>
              <div style={styles.sectionLabel}>YOUR SHORTCUTS</div>
              <h2 style={{ ...styles.sectionTitle, fontSize: 21 }}>
                Quick Actions
              </h2>
              <p style={styles.sectionDescription}>
                Jump straight to a tool you use often.
              </p>
            </div>
          </div>

          <div style={styles.quickGrid}>
            {quickActions.map((action) => {
              const Icon = action.icon;

              return (
                <button
                  key={action.title}
                  type="button"
                  className="mg-quick"
                  style={styles.quickButton}
                  onClick={() => navigate(action.path)}
                >
                  <span
                    style={{
                      ...styles.quickIcon,
                      color: action.color,
                      background: action.tint,
                    }}
                  >
                    <Icon size={19} />
                  </span>
                  <span style={{ minWidth: 0, flex: 1 }}>
                    <strong style={styles.quickTitle}>{action.title}</strong>
                    <span style={styles.quickDescription}>
                      {action.description}
                    </span>
                  </span>
                  <ChevronRight
                    size={16}
                    style={{ flexShrink: 0, marginTop: 10, color: "#94A3B8" }}
                  />
                </button>
              );
            })}
          </div>
        </section>

        <section style={styles.supportGrid}>
          <button
  type="button"
  onClick={() => navigate("/symptoms")}
  style={{
    ...styles.supportCard,
    width: "100%",
    textAlign: "left",
    fontFamily: "inherit",
    cursor: "pointer",
    border: "1px solid #e2e8f0",
  }}
>
  <div style={styles.supportIcon}>
    <Mic size={22} />
  </div>

  <div>
    <h3 style={styles.supportTitle}>Voice Interaction</h3>
    <p style={styles.supportDescription}>
      Explore voice-based interaction for a more accessible
      experience. Availability depends on your current implementation.
    </p>
  </div>
</button>
          <button
            type="button"
            className="mg-quick"
            onClick={() => navigate("/drug-interactions")}
            style={{
              ...styles.supportCard,
              width: "100%",
              textAlign: "left",
              cursor: "pointer",
              color: "inherit",
              fontFamily: "inherit",
            }}
          >
            <div
              style={{
                ...styles.supportIcon,
                color: C.blue,
                background: C.blueLight,
              }}
            >
              <ShieldCheck size={22} />
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={styles.supportTitle}>Drug Interaction Check</h3>
              <p style={styles.supportDescription}>
                Explore possible interactions between medicines.
              </p>
            </div>
            <ArrowRight size={17} color={C.muted} />
          </button>
        </section>

        <aside style={styles.notice}>
          <ShieldCheck size={19} style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <strong>Educational notice</strong>
            <br />
            MediGuide AI provides healthcare education and informational
            assistance only. It does not replace professional medical advice,
            diagnosis, or treatment.
          </div>
        </aside>

        <footer style={styles.footer}>
          <span style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <Activity size={15} color={C.teal} />
            <strong style={{ color: C.ink }}>MediGuide AI</strong>
            <span>· Healthcare education made simpler</span>
          </span>
          <span>For informational purposes only</span>
        </footer>
      </main>
    </div>
  );
}

export default Dashboard;
