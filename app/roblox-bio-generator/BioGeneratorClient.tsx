"use client";
import { useState } from "react";

const ENABLE_CLAUDE = process.env.NEXT_PUBLIC_ENABLE_CLAUDE_BIO_GENERATION === "true";

const CATEGORIES = [
  {
    id: "aesthetic",
    label: "Aesthetic",
    emoji: "🌸",
    color: "#ff9ec8",
    bg: "rgba(255,158,200,0.1)",
    description: "Soft, dreamy bios with a beautiful vibe.",
    bios: [
      "soft girl era 🌸 | collector of sunsets & good vibes | she/her | blox fruits main | add me if you're chill ✨",
      "aesthetic only 💭 | moon child 🌙 | royale high addict | looking for people who match my energy | not accepting random frs",
      "living in my own little world 🌷 | dress to impress queen 👗 | vibes > everything | she/her | mutuals only",
      "cottagecore soul in a blocky world 🌿 | adopt me trader | slow replies | find me in the aesthetic servers ☁️",
      "✨ just here for the vibes ✨ | berry avenue regular | soft & sweet | don't be weird | she/her 🎀",
      "daydreamer 💭 | petal collector 🌸 | royale high main | aesthetic builds only | add me if you vibe",
      "moonlit soul 🌙 | fairy lights & good games | she/her | slow replies but i care | royale high & dress to impress",
      "soft hours only ☁️ | lavender haze | adopt me & berry avenue | mutuals only | don't be a stranger 🌷",
    ],
  },
  {
    id: "funny",
    label: "Funny",
    emoji: "😂",
    color: "var(--neon-yellow, #ffe347)",
    bg: "rgba(255,227,71,0.1)",
    description: "Hilarious bios that make people stop scrolling.",
    bios: [
      "professional noob since 2018 🎮 | dies first every round | blame the lag not me | my aim is terrible and i'm proud",
      "i told myself just one more game... that was 6 hours ago | send help | also send robux 💀",
      "warning: will accidentally team kill | not on purpose i promise | my mouse slipped | okay maybe on purpose once",
      "currently losing at every game i play | skill issue? probably | still having fun tho | add me if you also have skill issue",
      "certified AFK champion 🏆 | world record holder in dying first | robux broke | will trade for snacks",
      "i peaked in tutorial island | everything went downhill from there | still here tho | pls be my friend",
      "404 skill not found | lag is my personality | i swear i'm better than this | (i'm not) | add me anyway",
      "my strategy is vibes based | no plan just chaos | somehow still alive | blox fruits but make it comedy",
    ],
  },
  {
    id: "edgy",
    label: "Edgy",
    emoji: "🖤",
    color: "#a855f7",
    bg: "rgba(168,85,247,0.1)",
    description: "Dark, mysterious bios for the edgy Roblox player.",
    bios: [
      "not here to make friends 🖤 | void walker | blox fruits pvp | i don't lose i just run out of time | add if you can keep up",
      "darkness is my aesthetic | silent but deadly | don't test me in pvp | 🖤 no randoms | blox fruits god",
      "they sleep i grind 🌑 | level max everything | no time for small talk | results only | pvp me if you dare",
      "shadow realm regular 🖤 | murder mystery 2 main | trust nobody | i already know your next move | stay out of my way",
      "born in the void 🌑 | chaos is peace | doors veteran | survived every monster | don't @ me unless pvp",
      "cold exterior warm interior (jk just cold) 🖤 | arsenal sweater | no randoms | earned every rank | respect is earned",
      "the quiet ones are always dangerous 🖤 | pvp only | no drama | max stats | come find me if you're brave",
      "void touched 🌑 | blox fruits awakening main | silence is power | i let my gameplay speak | add me if you're serious",
    ],
  },
  {
    id: "chill",
    label: "Chill",
    emoji: "😎",
    color: "var(--neon-green, #00f5a0)",
    bg: "rgba(0,245,160,0.1)",
    description: "Relaxed, easygoing bios for laid-back players.",
    bios: [
      "just here to have fun 😎 | no drama | all games | slow replies | add me if you're chill, i don't bite",
      "vibes only zone 🌊 | playing whatever's fun | no tryhard energy here | come hang out | open to randoms",
      "taking it easy one game at a time | not in a rush | adopt me & brookhaven | friendly player | add me anytime",
      "here for a good time not a long time 😎 | all games welcome | chill server only | no beef | just gaming",
      "neutral alignment 😌 | plays everything | no main game | no drama ever | add me if you need a chill teammate",
      "low effort high enjoyment 😎 | blox fruits casual | not competitive | just having fun | open frs welcome",
      "easy going player 🌊 | good vibes mandatory | tower of hell for fun | adopt me for chill | no pressure gaming",
      "not taking anything seriously 😎 | here to relax | all games casual mode | slow replies | add me anytime",
    ],
  },
  {
    id: "gamer",
    label: "Gamer",
    emoji: "⚔️",
    color: "var(--neon-blue, #00d4ff)",
    bg: "rgba(0,212,255,0.1)",
    description: "Serious gamer bios that mean business.",
    bios: [
      "blox fruits max level 🗡️ | third sea veteran | all fruits awakened | pvp record speaks for itself | no randoms unless skilled",
      "tower of hell speedrunner ⚡ | sub 2min on most towers | grinding daily | looking for competitive teammates | no quitters",
      "murder mystery 2 detective main 🔍 | 90% win rate | reads the lobby | veteran player since day one | add if competitive",
      "adopt me veteran trader 🐾 | know every pet value | fair trades only | been playing since 2019 | scammers get reported",
      "doors speedrunner 🚪 | floor 100 multiple times | solo and duo | entity knowledge maxed | add for runs",
      "arsenal diamond rank 🎯 | aim training daily | flick shot specialist | looking for comp team | serious players only",
      "blox fruits grinder ⚔️ | online every day | all raids cleared | helping newbies sometimes | pvp on request",
      "multi-game veteran 🎮 | top rank in 3 games | grinding since 2018 | competitive only | carry available for friends",
    ],
  },
  {
    id: "cute",
    label: "Cute",
    emoji: "🐾",
    color: "#ff79c6",
    bg: "rgba(255,121,198,0.1)",
    description: "Adorable bios full of wholesome energy.",
    bios: [
      "adopt me addict 🐾 | pet collector | trading always open | friendly only | pls be nice i'm sensitive 🥺",
      "here to make friends 🌸 | no drama ever | royale high daily | i give compliments freely | add me pls 🥺",
      "wholesome player only 💕 | adopt me & berry avenue | will hype you up | kind energy only | bff applications open",
      "soft gamer 🌸 | dress to impress main | always compliment outfits | here for good vibes | add me if you're sweet",
      "collecting pets & making memories 🐾 | adopt me veteran | every trade fair | i remember all my friends | add me 💕",
      "sunshine in blocky form ☀️ | royale high dreamer | here to spread joy | compliment > criticism | mutuals welcome 🌸",
      "friend shaped 🥺 | adopt me & brookhaven | i'll remember your username | loyal friend | add me if you're kind",
      "perpetually excited about everything 🌸 | adopt me main | celebrate small wins | hype person | add me for good times",
    ],
  },
];

export default function BioGeneratorClient() {
  const [activeCategory, setActiveCategory] = useState("aesthetic");
  const [keyword, setKeyword] = useState("");
  const [generated, setGenerated] = useState<string[]>([]);
  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState("");
  const [copied, setCopied] = useState<string>("");

  const activeCat = CATEGORIES.find(c => c.id === activeCategory)!;

  function copyBio(bio: string) {
    navigator.clipboard.writeText(bio).then(() => {
      setCopied(bio);
      setTimeout(() => setCopied(""), 2000);
    });
  }

  async function generateBios() {
    setGenerating(true);
    setGenError("");
    setGenerated([]);

    if (!ENABLE_CLAUDE) {
      const pool = [...activeCat.bios].sort(() => Math.random() - 0.5).slice(0, 5);
      setGenerated(pool);
      setGenerating(false);
      return;
    }

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: `Generate 5 creative Roblox profile bios for the "${activeCat.label}" vibe.
${keyword ? `The user wants bios related to: "${keyword}".` : ""}
Rules:
- Max 200 characters each
- Match the vibe: ${activeCat.description}
- Can include emojis (1-3 per bio)
- Should sound like a real Roblox player wrote it
- Natural, not cringe or overly formal
- No offensive content
Respond with ONLY a JSON array of 5 strings, no markdown, no explanation. Example: ["bio one","bio two"]`
          }]
        })
      });

      const data = await response.json();
      const text = data.content?.[0]?.text ?? "[]";
      const clean = text.replace(/```json|```/g, "").trim();
      const bios = JSON.parse(clean);
      setGenerated(Array.isArray(bios) ? bios.slice(0, 5) : []);
    } catch {
      setGenError("Generation failed. Showing random bios instead.");
      const pool = [...activeCat.bios].sort(() => Math.random() - 0.5).slice(0, 5);
      setGenerated(pool);
    }
    setGenerating(false);
  }

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px", position: "relative", zIndex: 1 }}>

      {/* Breadcrumbs */}
      <nav aria-label="breadcrumb" style={{ marginBottom: 20 }}>
        <ol style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center", fontSize: 13, fontWeight: 700, color: "var(--text-dim)" }}>
          <li><a href="/" style={{ color: "var(--text-muted)", textDecoration: "none" }}>Home</a></li>
          <li>›</li>
          <li style={{ color: "var(--text)" }}>Roblox Bio Generator</li>
        </ol>
      </nav>

      {/* Hero */}
      <div style={{ marginBottom: 40 }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 5vw, 52px)", marginBottom: 12, lineHeight: 1.1 }}>
          Roblox Bio Generator
        </h1>
        <p style={{ fontSize: 16, color: "var(--text-muted)", fontWeight: 600, lineHeight: 1.7, maxWidth: 700, marginBottom: 24 }}>
          Your Roblox About Me section is your first impression. Pick a vibe, hit generate, and copy a bio that actually sounds like you — no cringe, no filler.
        </p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {[
            { label: "Bio Styles", value: CATEGORIES.length.toString(), color: "var(--neon-green, #00f5a0)" },
            { label: "Bios per Style", value: "8", color: "var(--neon-blue, #00d4ff)" },
            { label: "Max Bio Length", value: "1,000", color: "var(--neon-yellow, #ffe347)" },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "12px 20px", textAlign: "center", minWidth: 80 }}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 24, color, marginBottom: 2 }}>{value}</div>
              <div style={{ fontSize: 11, fontWeight: 800, color: "var(--text-dim)", textTransform: "uppercase" }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Category pills */}
      <div style={{ marginBottom: 24, display: "flex", gap: 8, flexWrap: "wrap" }}>
        {CATEGORIES.map(cat => (
          <button key={cat.id} onClick={() => { setActiveCategory(cat.id); setGenerated([]); }} style={{ padding: "8px 16px", borderRadius: 100, fontSize: 12, fontWeight: 800, cursor: "pointer", background: activeCategory === cat.id ? cat.bg : "var(--surface)", color: activeCategory === cat.id ? cat.color : "var(--text-muted)", border: `1px solid ${activeCategory === cat.id ? cat.color : "var(--border)"}` }}>
            {cat.emoji} {cat.label}
          </button>
        ))}
      </div>

      {/* Generator box */}
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "24px 28px", marginBottom: 48 }}>
        <div style={{ fontSize: 11, fontWeight: 900, textTransform: "uppercase", letterSpacing: 1.5, color: activeCat.color, marginBottom: 8 }}>
          {activeCat.emoji} {activeCat.label} Bio Generator
        </div>
        <p style={{ fontSize: 14, color: "var(--text-muted)", fontWeight: 600, marginBottom: 20 }}>
          {activeCat.description} {ENABLE_CLAUDE ? "Add an optional keyword to personalize your bio." : "Hit generate for 5 random bio ideas."}
        </p>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center", marginBottom: 20 }}>
          {ENABLE_CLAUDE && (
            <input type="text" placeholder="Optional keyword (e.g. blox fruits, cat lover, pvp...)" value={keyword} onChange={e => setKeyword(e.target.value)} style={{ flex: 1, minWidth: 200, padding: "12px 16px", fontSize: 14, fontWeight: 600, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", color: "var(--text)", outline: "none" }} />
          )}
          <button onClick={generateBios} disabled={generating} style={{ padding: "12px 28px", borderRadius: 100, fontSize: 14, fontWeight: 900, cursor: generating ? "not-allowed" : "pointer", background: generating ? "var(--surface)" : "var(--gradient-main)", color: generating ? "var(--text-muted)" : "var(--bg)", border: "none", WebkitTextFillColor: generating ? "var(--text-muted)" : "var(--bg)", opacity: generating ? 0.7 : 1 }}>
            {generating ? "Generating..." : ENABLE_CLAUDE ? "✨ Generate Bios" : "⚡ Get Bio Ideas"}
          </button>
        </div>

        {genError && <p style={{ fontSize: 13, color: "var(--neon-yellow, #ffe347)", fontWeight: 600, marginBottom: 12 }}>{genError}</p>}

        {generated.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: "var(--text-dim)", textTransform: "uppercase", marginBottom: 4 }}>
              Generated Bios — click to copy
            </div>
            {generated.map((bio, i) => (
              <button key={i} onClick={() => copyBio(bio)} style={{ background: copied === bio ? activeCat.bg : "var(--surface)", border: `1px solid ${copied === bio ? activeCat.color : "var(--border)"}`, borderRadius: "var(--radius-sm)", padding: "14px 16px", textAlign: "left", cursor: "pointer", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: copied === bio ? activeCat.color : "var(--text)", lineHeight: 1.6, flex: 1 }}>{bio}</span>
                <span style={{ fontSize: 11, fontWeight: 800, color: copied === bio ? activeCat.color : "var(--text-dim)", flexShrink: 0, marginTop: 2 }}>{copied === bio ? "✓ copied" : "copy"}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* All bios by category */}
      <div style={{ display: "flex", flexDirection: "column", gap: 48 }}>
        {CATEGORIES.map(cat => (
          <section key={cat.id}>
            <div style={{ marginBottom: 16 }}>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: 26, marginBottom: 6, display: "flex", alignItems: "center", gap: 10 }}>
                <span>{cat.emoji}</span>
                <span>{cat.label} Roblox Bios</span>
                <span style={{ fontSize: 14, fontWeight: 700, padding: "3px 12px", borderRadius: 100, background: cat.bg, color: cat.color }}>{cat.bios.length}</span>
              </h2>
              <p style={{ fontSize: 14, color: "var(--text-muted)", fontWeight: 600, margin: 0 }}>{cat.description}</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {cat.bios.map((bio, i) => (
                <button key={i} onClick={() => copyBio(bio)} style={{ background: copied === bio ? cat.bg : "var(--bg-card)", border: `1px solid ${copied === bio ? cat.color : "var(--border)"}`, borderRadius: "var(--radius-sm)", padding: "14px 16px", textAlign: "left", cursor: "pointer", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, transition: "all 0.15s" }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: copied === bio ? cat.color : "var(--text)", lineHeight: 1.6, flex: 1 }}>{bio}</span>
                  <span style={{ fontSize: 11, fontWeight: 800, color: copied === bio ? cat.color : "var(--text-dim)", flexShrink: 0, marginTop: 2 }}>{copied === bio ? "✓ copied" : "copy"}</span>
                </button>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* SEO content */}
      <div style={{ marginTop: 64, display: "flex", flexDirection: "column", gap: 32 }}>
        <section>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 24, marginBottom: 12 }}>What Should You Put in Your Roblox Bio?</h2>
          <p style={{ fontSize: 15, color: "var(--text-muted)", fontWeight: 600, lineHeight: 1.8 }}>Your Roblox About Me section is one of the first things people see when they visit your profile. A good bio tells people who you are as a player — your favorite games, your playstyle, whether you're open to friend requests, and a bit of your personality. The best Roblox bios are short, specific, and authentic. Avoid generic phrases like "I like Roblox" and instead mention the actual games you play, your main character type, or a funny line that reflects how you actually play.</p>
        </section>

        <section>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 24, marginBottom: 12 }}>How to Add a Bio on Roblox</h2>
          <p style={{ fontSize: 15, color: "var(--text-muted)", fontWeight: 600, lineHeight: 1.8 }}>To add or edit your Roblox bio, go to your profile page and click the pencil icon next to the About section. Type your bio in the text box — you have up to 1,000 characters to work with. Once you're happy with it, click Save. You can update your bio as often as you like, so don't stress about getting it perfect on the first try. Many players change their bio regularly to reflect what they're currently playing or their current mood.</p>
        </section>

        <section>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 24, marginBottom: 12 }}>Tips for Writing a Great Roblox Bio</h2>
          <p style={{ fontSize: 15, color: "var(--text-muted)", fontWeight: 600, lineHeight: 1.8 }}>Keep it short — most players won't read a wall of text. Lead with your main game or playstyle so people know what to expect. Use emojis to break up text and add personality. Be clear about whether you accept random friend requests. If you're a trader, mention your main trade items. If you're competitive, mention your rank or specialty. The goal is for someone to read your bio and immediately know if you'd vibe as friends or teammates.</p>
        </section>

        {/* CTA */}
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "32px 28px", textAlign: "center" }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>🎮</div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, marginBottom: 8 }}>Ready to Test Your Roblox Knowledge?</h2>
          <p style={{ fontSize: 14, color: "var(--text-muted)", fontWeight: 600, lineHeight: 1.7, maxWidth: 500, margin: "0 auto 20px" }}>Now that your profile is sorted, put your game knowledge to the test with free Roblox trivia quizzes.</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <a href="/browse" style={{ background: "var(--gradient-main)", color: "var(--bg)", fontWeight: 900, fontSize: 14, padding: "12px 28px", borderRadius: 100, textDecoration: "none", WebkitTextFillColor: "var(--bg)" }}>🎯 Take a Quiz</a>
            <a href="/roblox-username-ideas" style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)", fontWeight: 800, fontSize: 14, padding: "12px 28px", borderRadius: 100, textDecoration: "none" }}>👤 Username Ideas</a>
          </div>
        </div>

        {/* FAQ */}
        <section>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 24, marginBottom: 16 }}>Frequently Asked Questions</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { q: "What should I put in my Roblox bio?", a: "Your Roblox bio should reflect your personality and playstyle. Include your favorite games, whether you accept friend requests, your trading status if relevant, and something that shows your vibe — funny, aesthetic, competitive, or chill." },
              { q: "How long can a Roblox bio be?", a: "Roblox bios can be up to 1,000 characters long. Most players keep theirs to 1-3 short lines. Quality beats quantity — a punchy two-line bio is more memorable than a wall of text." },
              { q: "Can I use emojis in my Roblox bio?", a: "Yes! Emojis work great in Roblox bios and help break up text. Most standard emojis display correctly on Roblox profiles. Use them to add personality without using extra characters." },
              { q: "How do I add a bio on Roblox?", a: "Go to your Roblox profile, click the pencil/edit icon next to your About section, type your bio, and click Save. You can update it as often as you like for free." },
              { q: "Should I put my favorite game in my Roblox bio?", a: "Yes — mentioning your main game helps people know if you'd be a good match as friends or teammates. It also makes your profile feel more personal and specific rather than generic." },
            ].map((faq, i) => (
              <div key={i} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "18px 22px" }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: "var(--text)", marginBottom: 8 }}>{faq.q}</div>
                <div style={{ fontSize: 14, color: "var(--text-muted)", fontWeight: 600, lineHeight: 1.7 }}>{faq.a}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
