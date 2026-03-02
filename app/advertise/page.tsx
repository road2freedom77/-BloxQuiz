export const metadata = {
    title: "Advertise on BloxQuiz — Reach Roblox Players",
    description: "Advertise on BloxQuiz and reach thousands of Roblox players. Sponsored quizzes, banner ads, and email sponsorships available.",
  };
  
  export default function AdvertisePage() {
    const stats = [
      { num: "380M+", label: "Roblox Monthly Players" },
      { num: "13-24", label: "Core Age Demographic" },
      { num: "Daily", label: "New Quizzes Added" },
      { num: "6", label: "Top Games Covered" },
    ];
  
    const options = [
      {
        emoji: "📧",
        title: "Email Sponsorship",
        desc: "Reach our subscribers directly in their inbox. Weekly newsletter sponsorship slots available.",
        price: "Contact for pricing"
      },
      {
        emoji: "🎯",
        title: "Sponsored Quiz",
        desc: "We create a custom branded quiz about your game, product, or service. Promoted on our homepage.",
        price: "Contact for pricing"
      },
      {
        emoji: "🖥️",
        title: "Display Ads",
        desc: "Banner and display ad placements across all quiz and game pages.",
        price: "Contact for pricing"
      },
    ];
  
    return (
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "60px 24px", position: "relative", zIndex: 1 }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(32px, 5vw, 52px)", marginBottom: 16 }}>
          {"Advertise on BloxQuiz 📢"}
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: 18, fontWeight: 600, marginBottom: 48, lineHeight: 1.7, maxWidth: 600 }}>
          Reach thousands of engaged Roblox players daily. Our audience is passionate, young, and highly engaged with Roblox content.
        </p>
  
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 16, marginBottom: 56 }}>
          {stats.map(({ num, label }) => (
            <div key={label} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 24, textAlign: "center" }}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 32, color: "var(--neon-green)", marginBottom: 8 }}>{num}</div>
              <div style={{ fontSize: 12, fontWeight: 800, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 1 }}>{label}</div>
            </div>
          ))}
        </div>
  
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: 28, marginBottom: 24 }}>{"Advertising Options"}</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 48 }}>
          {options.map(({ emoji, title, desc, price }) => (
            <div key={title} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 28, display: "flex", alignItems: "flex-start", gap: 20 }}>
              <div style={{ fontSize: 40, flexShrink: 0 }}>{emoji}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 900, fontSize: 18, marginBottom: 6 }}>{title}</div>
                <div style={{ color: "var(--text-muted)", fontSize: 15, fontWeight: 600, marginBottom: 8, lineHeight: 1.6 }}>{desc}</div>
                <div style={{ fontSize: 13, fontWeight: 800, color: "var(--neon-yellow)" }}>{price}</div>
              </div>
            </div>
          ))}
        </div>
  
        <div style={{ background: "var(--bg-card)", border: "1px solid rgba(0,245,160,0.3)", borderRadius: "var(--radius)", padding: 40, textAlign: "center" }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 28, marginBottom: 12 }}>{"Ready to reach Roblox players?"}</div>
          <p style={{ color: "var(--text-muted)", fontWeight: 600, marginBottom: 24 }}>Get in touch and we will put together a custom package for you.</p>
          <a href="mailto:ads@bloxquiz.gg" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "var(--gradient-main)", color: "var(--bg)", fontWeight: 900, fontSize: 16, padding: "16px 36px", borderRadius: 100, textDecoration: "none", WebkitTextFillColor: "var(--bg)" }}>
            {"📧 Contact Us"}
          </a>
        </div>
      </div>
    );
  }