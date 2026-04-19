"use client";
import { useEffect, useState } from "react";

const AMAZON_URL = "https://www.amazon.com/s?k=roblox+gift+card&tag=bloxquiz-20";

const DESKTOP_VARIANTS = ["coin-stack", "gift-card-strip", "side-sticker", "floating-bubble"] as const;
const MOBILE_VARIANTS = ["gift-card-strip", "floating-bubble", "bottom-bar", "half-sheet", "inline-card"] as const;

type DesktopVariant = typeof DESKTOP_VARIANTS[number];
type MobileVariant = typeof MOBILE_VARIANTS[number];
type Variant = DesktopVariant | MobileVariant;

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

function trackEvent(action: string, variant: Variant, label?: string) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", action, {
      event_category: "robux_affiliate",
      event_label: label || variant,
      variant,
    });
  }
}

function getOrAssignVariant(mobile: boolean): Variant {
  if (typeof window === "undefined") return "gift-card-strip";
  const key = mobile ? "robux_variant_mobile" : "robux_variant_desktop";
  const stored = sessionStorage.getItem(key);
  const pool = mobile ? MOBILE_VARIANTS : DESKTOP_VARIANTS;
  if (stored && (pool as readonly string[]).includes(stored)) return stored as Variant;
  const fresh = pool[Math.floor(Math.random() * pool.length)];
  sessionStorage.setItem(key, fresh);
  return fresh;
}

function isMobile(): boolean {
  if (typeof window === "undefined") return false;
  return window.innerWidth < 768;
}

function isHomePage(): boolean {
  if (typeof window === "undefined") return false;
  return window.location.pathname === "/";
}

export default function RobuxAffiliateOverlay() {
  const [variant, setVariant] = useState<Variant | null>(null);
  const [mobile, setMobile] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const m = isMobile();
    setMobile(m);
    const v = getOrAssignVariant(m);

    // inline-card only works on homepage — fall back to bottom-bar
    const effectiveVariant: Variant = (v === "inline-card" && !isHomePage()) ? "bottom-bar" : v;
    setVariant(effectiveVariant);
    trackEvent("variant_impression", effectiveVariant);

    const dismissedKey = `robux_dismissed_${m ? "m" : "d"}_${effectiveVariant}`;
    if (sessionStorage.getItem(dismissedKey) === "1") setDismissed(true);
  }, []);

  // Scroll trigger for half-sheet
  useEffect(() => {
    if (variant !== "half-sheet") return;
    const handleScroll = () => {
      const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight);
      if (pct > 0.6) setScrolled(true);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [variant]);

  if (!variant || dismissed) return null;

  // half-sheet waits for scroll trigger
  if (variant === "half-sheet" && !scrolled) return null;

  const handleClick = () => trackEvent("affiliate_click", variant);

  const handleDismiss = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const dismissedKey = `robux_dismissed_${mobile ? "m" : "d"}_${variant}`;
    sessionStorage.setItem(dismissedKey, "1");
    setDismissed(true);
    trackEvent("variant_dismissed", variant);
  };

  // Desktop variants
  if (variant === "coin-stack") return <CoinStack onClick={handleClick} onDismiss={handleDismiss} />;
  if (variant === "side-sticker") return <SideSticker onClick={handleClick} onDismiss={handleDismiss} />;

  // Shared variants
  if (variant === "gift-card-strip") return <GiftCardStrip onClick={handleClick} onDismiss={handleDismiss} />;
  if (variant === "floating-bubble") return <FloatingBubble onClick={handleClick} onDismiss={handleDismiss} />;

  // Mobile-only variants
  if (variant === "bottom-bar") return <BottomBar onClick={handleClick} onDismiss={handleDismiss} />;
  if (variant === "half-sheet") return <HalfSheet onClick={handleClick} onDismiss={handleDismiss} />;
  if (variant === "inline-card") return <InlineCard onClick={handleClick} onDismiss={handleDismiss} />;

  return null;
}

/* ─────────────────────── VARIANT A: Coin Stack (desktop) ─────────────────────── */
function CoinStack({ onClick, onDismiss }: { onClick: () => void; onDismiss: (e: React.MouseEvent) => void }) {
  return (
    <>
      <div aria-hidden style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 1, overflow: "hidden" }}>
        {[
          { top: "8%", left: "3%", size: 48, delay: "0s" },
          { top: "22%", right: "4%", size: 36, delay: "1.2s" },
          { top: "45%", left: "2%", size: 28, delay: "0.6s" },
          { top: "68%", right: "3%", size: 42, delay: "1.8s" },
          { top: "85%", left: "5%", size: 32, delay: "0.3s" },
          { top: "12%", right: "12%", size: 24, delay: "2.1s" },
        ].map((c, i) => (
          <div key={i} style={{
            position: "absolute", top: c.top, left: (c as any).left, right: (c as any).right,
            width: c.size, height: c.size, borderRadius: "50%",
            background: "radial-gradient(circle at 30% 30%, #ffe066, #d4a017)",
            boxShadow: "0 4px 16px rgba(212,160,23,0.4), inset 0 -3px 6px rgba(0,0,0,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 900, color: "#5c3d00", fontSize: c.size * 0.5,
            animation: `coin-float 4s ease-in-out infinite`, animationDelay: c.delay, opacity: 0.85,
          }}>R$</div>
        ))}
      </div>
      <a href={AMAZON_URL} target="_blank" rel="noopener sponsored" onClick={onClick}
        style={{ position: "fixed", bottom: 24, right: 24, zIndex: 9999, display: "flex", alignItems: "center", gap: 10, background: "linear-gradient(135deg, #ffd700 0%, #d4a017 100%)", color: "#1a1a1a", padding: "14px 22px", borderRadius: 100, textDecoration: "none", fontWeight: 900, fontSize: 14, boxShadow: "0 8px 24px rgba(212,160,23,0.5)", border: "2px solid rgba(255,255,255,0.3)" }}>
        <span style={{ fontSize: 18 }}>💰</span>
        Get Robux on Amazon →
        <button onClick={onDismiss} style={{ background: "transparent", border: "none", color: "#1a1a1a", cursor: "pointer", padding: "0 0 0 8px", fontSize: 18, opacity: 0.6, lineHeight: 1 }} aria-label="Dismiss">×</button>
      </a>
      <style>{`@keyframes coin-float{0%,100%{transform:translateY(0) rotate(0deg)}50%{transform:translateY(-12px) rotate(8deg)}}`}</style>
    </>
  );
}

/* ─────────────────────── VARIANT B: Gift Card Strip ─────────────────────── */
function GiftCardStrip({ onClick, onDismiss }: { onClick: () => void; onDismiss: (e: React.MouseEvent) => void }) {
  return (
    <a href={AMAZON_URL} target="_blank" rel="noopener sponsored" onClick={onClick}
      style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", gap: 16, background: "linear-gradient(90deg, #00a86b 0%, #00d084 50%, #00a86b 100%)", color: "#fff", padding: "10px 20px", textDecoration: "none", fontWeight: 800, fontSize: 13, boxShadow: "0 2px 12px rgba(0,168,107,0.3)", flexWrap: "wrap" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 48, height: 30, background: "linear-gradient(135deg, #1a1a1a, #333)", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 900, color: "#fff", flexShrink: 0 }}>R$</div>
        <span>🎁 Roblox Gift Cards on Amazon — Free shipping with Prime</span>
      </div>
      <span style={{ background: "#fff", color: "#00a86b", padding: "6px 16px", borderRadius: 100, fontWeight: 900, fontSize: 12, whiteSpace: "nowrap" }}>Shop Now →</span>
      <button onClick={onDismiss} style={{ background: "transparent", border: "none", color: "#fff", cursor: "pointer", padding: 4, fontSize: 18, opacity: 0.7, lineHeight: 1 }} aria-label="Dismiss">×</button>
    </a>
  );
}

/* ─────────────────────── VARIANT C: Side Sticker (desktop) ─────────────────────── */
function SideSticker({ onClick, onDismiss }: { onClick: () => void; onDismiss: (e: React.MouseEvent) => void }) {
  return (
    <a href={AMAZON_URL} target="_blank" rel="noopener sponsored" onClick={onClick}
      style={{ position: "fixed", bottom: 24, right: 24, zIndex: 9999, display: "flex", alignItems: "center", gap: 10, background: "linear-gradient(135deg, #ff9500, #ff6b00)", color: "#fff", padding: "12px 18px", borderRadius: 100, textDecoration: "none", fontWeight: 900, fontSize: 13, boxShadow: "0 8px 24px rgba(255,149,0,0.45)", border: "2px solid rgba(255,255,255,0.2)" }}>
      <span style={{ fontSize: 20 }}>💰</span>
      <div>
        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.8)", fontWeight: 700, lineHeight: 1.2 }}>Amazon</div>
        <div style={{ fontSize: 13, fontWeight: 900, lineHeight: 1.2 }}>Buy Robux →</div>
      </div>
      <button onClick={onDismiss} style={{ background: "rgba(0,0,0,0.15)", border: "none", color: "#fff", cursor: "pointer", padding: 0, fontSize: 14, lineHeight: 1, width: 20, height: 20, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", marginLeft: 4 }} aria-label="Dismiss">×</button>
    </a>
  );
}

/* ─────────────────────── VARIANT D: Floating Bubble ─────────────────────── */
function FloatingBubble({ onClick, onDismiss }: { onClick: () => void; onDismiss: (e: React.MouseEvent) => void }) {
  return (
    <>
      <a href={AMAZON_URL} target="_blank" rel="noopener sponsored" onClick={onClick}
        style={{ position: "fixed", bottom: 24, right: 24, zIndex: 9999, display: "flex", alignItems: "center", gap: 10, background: "#fff", color: "#1a1a1a", padding: "14px 18px 14px 14px", borderRadius: 100, textDecoration: "none", fontWeight: 800, fontSize: 13, boxShadow: "0 8px 28px rgba(0,0,0,0.25), 0 0 0 4px rgba(0,245,160,0.2)", border: "2px solid #00f5a0" }}>
        <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, #ffd700, #d4a017)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 900, color: "#5c3d00", flexShrink: 0, animation: "bubble-pulse 2s ease-in-out infinite" }}>R$</div>
        <div>
          <div style={{ fontSize: 11, color: "#888", fontWeight: 700, lineHeight: 1.2 }}>Need Robux?</div>
          <div style={{ fontSize: 13, fontWeight: 900, color: "#1a1a1a", lineHeight: 1.2 }}>Buy on Amazon →</div>
        </div>
        <button onClick={onDismiss} style={{ background: "transparent", border: "none", color: "#888", cursor: "pointer", padding: "0 4px", fontSize: 18, opacity: 0.6, lineHeight: 1 }} aria-label="Dismiss">×</button>
      </a>
      <style>{`@keyframes bubble-pulse{0%,100%{box-shadow:0 0 0 0 rgba(0,245,160,0.5)}50%{box-shadow:0 0 0 8px rgba(0,245,160,0)}}`}</style>
    </>
  );
}

/* ─────────────────────── VARIANT E: Bottom Bar (mobile) ─────────────────────── */
function BottomBar({ onClick, onDismiss }: { onClick: () => void; onDismiss: (e: React.MouseEvent) => void }) {
  return (
    <a href={AMAZON_URL} target="_blank" rel="noopener sponsored" onClick={onClick}
      style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, background: "linear-gradient(135deg, #ffd700, #d4a017)", color: "#1a1a1a", padding: "12px 20px", textDecoration: "none", fontWeight: 900, fontSize: 14, boxShadow: "0 -4px 16px rgba(212,160,23,0.4)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 22 }}>🎁</span>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, opacity: 0.7, lineHeight: 1 }}>Amazon</div>
          <div style={{ fontSize: 14, fontWeight: 900, lineHeight: 1.2 }}>Get Robux Gift Cards →</div>
        </div>
      </div>
      <button onClick={onDismiss} style={{ background: "rgba(0,0,0,0.12)", border: "none", color: "#1a1a1a", cursor: "pointer", padding: 0, fontSize: 16, lineHeight: 1, width: 24, height: 24, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }} aria-label="Dismiss">×</button>
    </a>
  );
}

/* ─────────────────────── VARIANT F: Half Sheet (mobile, scroll-triggered) ─────────────────────── */
function HalfSheet({ onClick, onDismiss }: { onClick: () => void; onDismiss: (e: React.MouseEvent) => void }) {
  return (
    <>
      <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 9998 }} onClick={onDismiss} />
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 9999, background: "#0f1a2e", borderRadius: "20px 20px 0 0", padding: "24px 24px 40px", animation: "slide-up 0.3s ease-out" }}>
        <div style={{ width: 40, height: 4, background: "rgba(255,255,255,0.2)", borderRadius: 2, margin: "0 auto 20px" }} />
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>🎁</div>
          <div style={{ fontFamily: "var(--font-display, 'Lilita One', cursive)", fontSize: 22, color: "#FFD700", fontWeight: 900, marginBottom: 8 }}>
            Get Robux Gift Cards
          </div>
          <div style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", fontWeight: 600, lineHeight: 1.6 }}>
            Buy Roblox gift cards on Amazon with free Prime shipping. Perfect for topping up Robux anytime.
          </div>
        </div>
        <a href={AMAZON_URL} target="_blank" rel="noopener sponsored" onClick={onClick}
          style={{ display: "block", textAlign: "center", background: "linear-gradient(135deg, #ffd700, #d4a017)", color: "#1a1a1a", fontWeight: 900, fontSize: 16, padding: "16px", borderRadius: 100, textDecoration: "none", marginBottom: 12, boxShadow: "0 4px 16px rgba(212,160,23,0.4)" }}>
          Shop on Amazon →
        </a>
        <button onClick={onDismiss}
          style={{ display: "block", width: "100%", background: "transparent", border: "none", color: "rgba(255,255,255,0.4)", fontWeight: 700, fontSize: 14, cursor: "pointer", padding: "8px" }}>
          No thanks
        </button>
      </div>
      <style>{`@keyframes slide-up{from{transform:translateY(100%)}to{transform:translateY(0)}}`}</style>
    </>
  );
}

/* ─────────────────────── VARIANT G: Inline Card (mobile, homepage only) ─────────────────────── */
function InlineCard({ onClick, onDismiss }: { onClick: () => void; onDismiss: (e: React.MouseEvent) => void }) {
  return (
    <div style={{ position: "fixed", bottom: 80, left: 16, right: 16, zIndex: 9999, background: "linear-gradient(135deg, #1a2440, #0f1a2e)", border: "1px solid rgba(255,215,0,0.3)", borderRadius: 16, padding: "16px 20px", boxShadow: "0 8px 32px rgba(0,0,0,0.4)" }}>
      <button onClick={onDismiss} style={{ position: "absolute", top: 10, right: 12, background: "transparent", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: 18, lineHeight: 1 }} aria-label="Dismiss">×</button>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 48, height: 48, borderRadius: 12, background: "linear-gradient(135deg, #ffd700, #d4a017)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 900, color: "#5c3d00", flexShrink: 0 }}>R$</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: "rgba(255,215,0,0.8)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 2 }}>Sponsored</div>
          <div style={{ fontSize: 14, fontWeight: 900, color: "#fff", lineHeight: 1.3, marginBottom: 2 }}>Roblox Gift Cards on Amazon</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", fontWeight: 600 }}>Free shipping with Prime</div>
        </div>
      </div>
      <a href={AMAZON_URL} target="_blank" rel="noopener sponsored" onClick={onClick}
        style={{ display: "block", textAlign: "center", background: "linear-gradient(135deg, #ffd700, #d4a017)", color: "#1a1a1a", fontWeight: 900, fontSize: 13, padding: "10px", borderRadius: 100, textDecoration: "none", marginTop: 14 }}>
        Shop Amazon →
      </a>
    </div>
  );
}