"use client";

const AMAZON_URL = "https://www.amazon.com/s?k=roblox+gift+card&tag=bloxquiz-20";

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

function trackClick(position: "left" | "right") {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "affiliate_click", {
      event_category: "robux_affiliate",
      event_label: `skyscraper_${position}`,
      variant: "skyscraper",
    });
  }
}

function Skyscraper({ position }: { position: "left" | "right" }) {
  return (
    <a
      href={AMAZON_URL}
      target="_blank"
      rel="noopener sponsored"
      onClick={() => trackClick(position)}
      style={{
        position: "fixed",
        top: "50%",
        transform: "translateY(-50%)",
        [position]: 0,
        width: 150,
        height: 600,
        zIndex: 50,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textDecoration: "none",
        overflow: "hidden",
        borderRadius: position === "left" ? "0 12px 12px 0" : "12px 0 0 12px",
      }}
    >
      {/* Background image */}
      <div style={{
        position: "absolute",
        inset: 0,
        backgroundImage: "url('/robux-bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }} />

      {/* Dark overlay for readability */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: "linear-gradient(180deg, rgba(10,10,20,0.55) 0%, rgba(10,10,20,0.7) 100%)",
      }} />

      {/* Content */}
      <div style={{
        position: "relative",
        zIndex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
        padding: "0 12px",
        textAlign: "center",
      }}>
        <div style={{
          fontSize: 36,
          filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.5))",
        }}>💰</div>

        <div style={{
          fontFamily: "var(--font-display, 'Lilita One', cursive)",
          fontSize: 18,
          fontWeight: 900,
          color: "#FFD700",
          lineHeight: 1.2,
          textShadow: "0 2px 8px rgba(0,0,0,0.8)",
        }}>
          Get Robux Gift Cards
        </div>

        <div style={{
          fontSize: 12,
          fontWeight: 700,
          color: "rgba(255,255,255,0.8)",
          lineHeight: 1.5,
        }}>
          Free shipping with Prime
        </div>

        <div style={{
          background: "linear-gradient(135deg, #FFD700, #FF8A00)",
          color: "#1a1a1a",
          fontWeight: 900,
          fontSize: 12,
          padding: "8px 16px",
          borderRadius: 100,
          marginTop: 4,
          boxShadow: "0 4px 12px rgba(255, 215, 0, 0.4)",
        }}>
          Shop Amazon →
        </div>

        <div style={{
          fontSize: 9,
          color: "rgba(255,255,255,0.35)",
          marginTop: 8,
          fontWeight: 600,
          letterSpacing: "0.05em",
        }}>
          AD
        </div>
      </div>
    </a>
  );
}

export default function RobuxBackground() {
  return (
    <>
      {/* Background image — decorative, non-clickable */}
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          backgroundImage: "url('/robux-bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat",
          opacity: 0.28,
          mixBlendMode: "screen",
        }}
      />

      {/* Side skyscrapers — only on wide screens */}
      <style>{`
        .robux-skyscraper { display: none; }
        @media (min-width: 1400px) {
          .robux-skyscraper { display: flex; }
        }
      `}</style>

      <div className="robux-skyscraper">
        <Skyscraper position="left" />
      </div>
      <div className="robux-skyscraper">
        <Skyscraper position="right" />
      </div>
    </>
  );
}