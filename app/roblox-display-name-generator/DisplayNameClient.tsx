"use client";
import { useState, useMemo } from "react";

const CATEGORIES = [
  {
    id: "aesthetic",
    label: "Aesthetic Display Names",
    emoji: "🌸",
    color: "#ff9ec8",
    bg: "rgba(255,158,200,0.1)",
    description: "Soft, dreamy names with a beautiful, artistic vibe. Perfect for Royale High, Dress to Impress and Berry Avenue.",
    names: [
      "lunar bloom", "velvet nova", "dream petal", "crystal dawn", "aurora wisp",
      "silver mist", "stardust girl", "midnight rose", "silk moon", "cloud petal",
      "lavender haze", "peach blossom", "ivory dream", "rose quartz", "soft glow",
      "angel dust", "celestial ✨", "moon child", "petal soft", "glitter mist",
      "pastel nova", "dewdrop soul", "lily pad", "cherry blossom", "vanilla sky",
      "cottagecore 🌿", "fairycore 🧚", "dreamcore 💭", "softie mode", "coquette 🎀",
      "pink lemonade", "strawberry milk", "honey bee 🍯", "sugar plum", "candy floss",
      "stargazer", "moon dancer", "sun chaser", "cloud nine", "sky dreamer",
      "ocean mist", "sea foam", "tide pool", "pearl diver", "coral reef",
      "forest fairy", "moss keeper", "fern girl", "wildflower", "meadow soft",
    ],
  },
  {
    id: "cool",
    label: "Cool Display Names",
    emoji: "⚔️",
    color: "var(--neon-blue, #00d4ff)",
    bg: "rgba(0,212,255,0.1)",
    description: "Powerful, memorable names that command respect on any server.",
    names: [
      "Shadow Blade", "Nova Knight", "Void Walker", "Frost Reaper", "Storm Chaser",
      "Dark Matter", "Phantom Edge", "Crimson Wolf", "Steel Shadow", "Night Falcon",
      "Iron Veil", "Ghost Protocol", "Neon Reaper", "Cyber Knight", "Digital Ghost",
      "Zero Gravity", "Apex Hunter", "Silent Storm", "Venom Strike", "Wraith Blade",
      "Cold Blood", "Rogue Agent", "Black Ops", "Night Raid", "Dark Protocol",
      "Void Protocol", "Ghost Mode", "Shadow Mode", "Stealth Mode", "Night Mode",
      "Chaos Theory", "Dark Energy", "Void Energy", "Storm Energy", "Nova Energy",
      "Shadow Force", "Ghost Force", "Night Force", "Void Force", "Storm Force",
      "Neon Shadow", "Cyber Void", "Digital Storm", "Pixel Ghost", "Glitch Hunter",
      "Error 404", "System Ghost", "Dark System", "Void System", "Night System",
    ],
  },
  {
    id: "funny",
    label: "Funny Display Names",
    emoji: "😂",
    color: "var(--neon-yellow, #ffe347)",
    bg: "rgba(255,227,71,0.1)",
    description: "Hilarious names that make everyone in the server do a double take.",
    names: [
      "Potato Warlord", "Banana Mage", "Toast Knight", "Waffle Sword", "Noodle Ninja",
      "Burrito Blaze", "Taco Strike", "Pizza Reaper", "Sushi Slayer", "Donut Destroyer",
      "Angry Toaster", "Grumpy Cactus", "Sassy Potato", "Chunky Monkey", "Sleepy Assassin",
      "Lazy Slayer", "Fluffy Dark Lord", "Cuddle Reaper", "Tiny Destroyer", "Mighty Muffin",
      "AFK Again 💤", "Wrong Button", "Oops I Lied", "Trying My Best", "Not A Noob",
      "Send Help Plz", "Lag Master", "Ping Of 999", "Frame Dropper", "Buffer Forever",
      "Ctrl Z Warrior", "Delete Button", "Undo Everything", "Fat Fingers", "Mistyped Name",
      "NPC Behavior", "Main Character", "Side Quest Only", "Lore Accurate", "Plot Armor",
      "Final Boss 👹", "Tutorial Level", "Easy Mode On", "Cheat Code User", "God Mode",
      "Speedrun Any%", "Skip Cutscene", "No Commentary", "First Playthrough", "100% Complete",
    ],
  },
  {
    id: "edgy",
    label: "Edgy Display Names",
    emoji: "🖤",
    color: "#8b0000",
    bg: "rgba(139,0,0,0.1)",
    description: "Dark, mysterious names with an edge. Popular in horror games and PvP servers.",
    names: [
      "void within", "dark passenger", "silent killer", "shadow self", "night terror",
      "broken soul", "lost cause", "hollow eyes", "dead inside 🖤", "numb",
      "chaos incarnate", "void emperor", "shadow emperor", "dark emperor", "night emperor",
      "demon slayer", "soul reaper", "death bringer", "doom bringer", "curse bringer",
      "blood moon 🌑", "dark moon", "void moon", "shadow moon", "night moon",
      "cursed one", "damned soul", "fallen angel", "dark angel", "void angel",
      "silent void", "screaming void", "empty void", "endless void", "eternal void",
      "broken glass", "shattered soul", "fractured mind", "cracked mirror", "dark reflection",
      "lost in void", "drowning", "fading away", "gone dark", "no signal",
      "system error 🔴", "corrupted file", "deleted user", "null and void", "404 soul",
    ],
  },
  {
    id: "cute",
    label: "Cute Display Names",
    emoji: "🐾",
    color: "#ff79c6",
    bg: "rgba(255,121,198,0.1)",
    description: "Adorable, wholesome names that radiate good vibes.",
    names: [
      "bunny hop 🐰", "kitty purr 🐱", "puppy eyes 🐶", "baby fox 🦊", "tiny bear 🐻",
      "fluffy cloud", "soft kitty", "warm hugs", "sweet pea", "honey pot 🍯",
      "sugar cookie 🍪", "cupcake queen", "jellybean", "marshmallow", "gummy bear",
      "lil nova", "baby void", "smol shadow", "tiny storm", "wee knight",
      "precious", "adorable", "sweetie pie", "cutie patootie", "lil bean",
      "kawaii mode 🌸", "chibi style", "mochi soft", "dango sweet", "pocky stick",
      "pastel baby", "soft baby", "gentle soul", "kind heart", "warm soul",
      "sunshine 🌞", "rainbow 🌈", "starshine ⭐", "moonbeam 🌙", "dewdrop 💧",
      "blossom 🌸", "petal 🌷", "sprout 🌱", "seedling", "little leaf 🍃",
      "cozy vibes", "snuggle mode", "cuddle bug", "snuggle bear", "comfort zone",
    ],
  },
  {
    id: "couple",
    label: "Couple Display Names",
    emoji: "💑",
    color: "#ff6b9d",
    bg: "rgba(255,107,157,0.1)",
    description: "Matching display name ideas for Roblox couples. Use one each!",
    names: [
      "his nova 💙", "her nova 💗", "his shadow", "her shadow", "his storm",
      "her storm", "his void 🖤", "her void 🤍", "his frost ❄️", "her frost 🌸",
      "player one 🎮", "player two 🎮", "p1 forever", "p2 forever", "duo mode on",
      "sun ☀️", "moon 🌙", "stars ⭐", "sky 🌌", "cloud ☁️",
      "fire 🔥", "ice ❄️", "thunder ⚡", "rain 🌧️", "wind 🌬️",
      "day dreamer", "night owl", "sunrise boy", "sunset girl", "dawn seeker",
      "chaos boy 💙", "calm girl 💗", "loud one", "quiet one", "wild side",
      "soft side", "tough love", "gentle soul", "rough edge", "smooth talker",
      "ride or die", "till the end", "forever mine", "always yours", "meant to be",
      "better half", "other half", "missing piece", "found home", "safe place",
    ],
  },
  {
    id: "short",
    label: "Short Display Names",
    emoji: "⚡",
    color: "var(--neon-green, #00f5a0)",
    bg: "rgba(0,245,160,0.1)",
    description: "Clean, punchy display names under 8 characters. Rare and striking.",
    names: [
      "nova ✨", "void 🖤", "blaze 🔥", "frost ❄️", "storm ⚡",
      "shadow", "phantom", "ghost 👻", "wraith", "shade",
      "flare", "surge", "pulse", "flash ⚡", "bolt",
      "neon", "pixel", "glitch", "echo", "zero",
      "apex", "prime", "omega", "sigma", "delta",
      "lunar", "solar", "astral", "comet", "orbit",
      "myth", "lore", "fate", "doom", "void",
      "calm", "wild", "free", "lost", "found",
      "dark ✨", "light 🌟", "dawn 🌅", "dusk 🌆", "night 🌙",
      "soft 🌸", "cool 😎", "pure", "raw", "real",
    ],
  },
];

const TOTAL = CATEGORIES.reduce((sum, c) => sum + c.names.length, 0);
const ENABLE_CLAUDE = process.env.NEXT_PUBLIC_ENABLE_CLAUDE_GENERATION === "true";

export default function DisplayNameClient() {
  const [search, setSearch] = useState("");
  const [copied, setCopied] = useState<string>("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [keyword, setKeyword] = useState("");
  const [generated, setGenerated] = useState<string[]>([]);
  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState("");

  const filteredCategories = useMemo(() => {
    if (activeCategory !== "all") {
      const cat = CATEGORIES.find(c => c.id === activeCategory);
      if (!cat) return [];
      const filtered = search
        ? cat.names.filter(n => n.toLowerCase().includes(search.toLowerCase()))
        : cat.names;
      return [{ ...cat, names: filtered }];
    }
    if (!search) return CATEGORIES;
    return CATEGORIES.map(cat => ({
      ...cat,
      names: cat.names.filter(n => n.toLowerCase().includes(search.toLowerCase())),
    })).filter(cat => cat.names.length > 0);
  }, [search, activeCategory]);

  const totalFiltered = filteredCategories.reduce((sum, c) => sum + c.names.length, 0);

  function copyName(name: string) {
    navigator.clipboard.writeText(name).then(() => {
      setCopied(name);
      setTimeout(() => setCopied(""), 1500);
    });
  }

  async function generateNames() {
    const cat = CATEGORIES.find(c => c.id === activeCategory);
    setGenerating(true);
    setGenError("");
    setGenerated([]);

    if (!ENABLE_CLAUDE || activeCategory === "all") {
      // Static fallback — random sample from active or all categories
      const pool = cat ? cat.names : CATEGORIES.flatMap(c => c.names);
      const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, 10);
      setGenerated(shuffled);
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
            content: `Generate 10 creative Roblox display names for the "${cat?.label ?? "general"}" style.
${keyword ? `The user wants names related to: "${keyword}".` : ""}
Rules:
- Max 20 characters each including spaces
- Spaces ARE allowed (unlike usernames)
- Emojis are allowed but use sparingly (max 1 per name)
- Match the vibe: ${cat?.description ?? "creative and fun"}
- Each name must be unique and distinct
- No offensive or inappropriate content
Respond with ONLY a JSON array of 10 strings, no markdown, no explanation. Example: ["name one","name two"]`
          }]
        })
      });

      const data = await response.json();
      const text = data.content?.[0]?.text ?? "[]";
      const clean = text.replace(/```json|```/g, "").trim();
      const names = JSON.parse(clean);
      setGenerated(Array.isArray(names) ? names.slice(0, 10) : []);
    } catch {
      setGenError("Generation failed. Showing random names instead.");
      const pool = cat ? cat.names : CATEGORIES.flatMap(c => c.names);
      const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, 10);
      setGenerated(shuffled);
    }
    setGenerating(false);
  }

  const activeCat = CATEGORIES.find(c => c.id === activeCategory);

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px", position: "relative", zIndex: 1 }}>

      {/* Breadcrumbs */}
      <nav aria-label="breadcrumb" style={{ marginBottom: 20 }}>
        <ol style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center", fontSize: 13, fontWeight: 700, color: "var(--text-dim)" }}>
          <li><a href="/" style={{ color: "var(--text-muted)", textDecoration: "none" }}>Home</a></li>
          <li>›</li>
          <li style={{ color: "var(--text)" }}>Roblox Display Name Generator</li>
        </ol>
      </nav>

      {/* Hero */}
      <div style={{ marginBottom: 40 }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 5vw, 52px)", marginBottom: 12, lineHeight: 1.1 }}>
          Roblox Display Name Generator
        </h1>
        <p style={{ fontSize: 16, color: "var(--text-muted)", fontWeight: 600, lineHeight: 1.7, maxWidth: 700, marginBottom: 24 }}>
          Unlike usernames, Roblox display names can have spaces, emojis, and special characters — up to 20 characters. Change yours for free every 7 days. Browse {TOTAL}+ ideas below or generate fresh ones with AI.
        </p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {[
            { label: "Display Names", value: TOTAL.toLocaleString(), color: "var(--neon-blue, #00d4ff)" },
            { label: "Categories", value: CATEGORIES.length, color: "var(--neon-green, #00f5a0)" },
            { label: "Free to Change", value: "7 days", color: "var(--neon-yellow, #ffe347)" },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "12px 20px", textAlign: "center", minWidth: 80 }}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 24, color, marginBottom: 2 }}>{value}</div>
              <div style={{ fontSize: 11, fontWeight: 800, color: "var(--text-dim)", textTransform: "uppercase" }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Category filter pills */}
      <div style={{ marginBottom: 24, display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button
          onClick={() => setActiveCategory("all")}
          style={{
            padding: "8px 16px", borderRadius: 100, fontSize: 12, fontWeight: 800, cursor: "pointer",
            background: activeCategory === "all" ? "var(--gradient-main)" : "var(--surface)",
            color: activeCategory === "all" ? "var(--bg)" : "var(--text-muted)",
            border: "1px solid var(--border)", WebkitTextFillColor: activeCategory === "all" ? "var(--bg)" : undefined,
          }}
        >
          All ({TOTAL})
        </button>
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => { setActiveCategory(cat.id); setGenerated([]); }}
            style={{
              padding: "8px 16px", borderRadius: 100, fontSize: 12, fontWeight: 800, cursor: "pointer",
              background: activeCategory === cat.id ? cat.bg : "var(--surface)",
              color: activeCategory === cat.id ? cat.color : "var(--text-muted)",
              border: `1px solid ${activeCategory === cat.id ? cat.color : "var(--border)"}`,
            }}
          >
            {cat.emoji} {cat.label.split(" ")[0]} ({cat.names.length})
          </button>
        ))}
      </div>

      {/* Generator box */}
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "24px 28px", marginBottom: 40 }}>
        <div style={{ fontSize: 11, fontWeight: 900, textTransform: "uppercase", letterSpacing: 1.5, color: "var(--neon-green, #00f5a0)", marginBottom: 12 }}>
          {ENABLE_CLAUDE ? "✨ AI Generator" : "⚡ Quick Generator"}
        </div>
        <p style={{ fontSize: 14, color: "var(--text-muted)", fontWeight: 600, marginBottom: 16 }}>
          {ENABLE_CLAUDE
            ? "Pick a category, add an optional keyword, and generate 10 fresh display names."
            : "Pick a category and get 10 random display name ideas instantly."}
        </p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
          {ENABLE_CLAUDE && (
            <input
              type="text"
              placeholder="Optional keyword (e.g. dragon, pink, space...)"
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
              style={{
                flex: 1, minWidth: 200, padding: "12px 16px", fontSize: 14, fontWeight: 600,
                background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)",
                color: "var(--text)", outline: "none",
              }}
            />
          )}
          <button
            onClick={generateNames}
            disabled={generating}
            style={{
              padding: "12px 28px", borderRadius: 100, fontSize: 14, fontWeight: 900, cursor: generating ? "not-allowed" : "pointer",
              background: generating ? "var(--surface)" : "var(--gradient-main)",
              color: generating ? "var(--text-muted)" : "var(--bg)",
              border: "none", WebkitTextFillColor: generating ? "var(--text-muted)" : "var(--bg)",
              opacity: generating ? 0.7 : 1,
            }}
          >
            {generating ? "Generating..." : ENABLE_CLAUDE ? "✨ Generate Names" : "⚡ Get Random Names"}
          </button>
        </div>

        {genError && (
          <p style={{ fontSize: 13, color: "var(--neon-yellow, #ffe347)", fontWeight: 600, marginTop: 12 }}>{genError}</p>
        )}

        {generated.length > 0 && (
          <div style={{ marginTop: 20 }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: "var(--text-dim)", textTransform: "uppercase", marginBottom: 10 }}>
              Generated Names — click to copy
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 8 }}>
              {generated.map(name => (
                <button
                  key={name}
                  onClick={() => copyName(name)}
                  style={{
                    background: copied === name ? "rgba(0,245,160,0.1)" : "var(--surface)",
                    border: `1px solid ${copied === name ? "var(--neon-green, #00f5a0)" : "var(--border)"}`,
                    borderRadius: "var(--radius-sm)", padding: "10px 14px",
                    textAlign: "left", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8,
                  }}
                >
                  <span style={{ fontSize: 13, fontWeight: 700, color: copied === name ? "var(--neon-green, #00f5a0)" : "var(--text)", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {name}
                  </span>
                  <span style={{ fontSize: 11, color: copied === name ? "var(--neon-green, #00f5a0)" : "var(--text-dim)", fontWeight: 800, flexShrink: 0 }}>
                    {copied === name ? "✓" : "copy"}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Search */}
      <div style={{ marginBottom: 32 }}>
        <input
          type="text"
          placeholder="🔍 Search display name ideas..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: "100%", maxWidth: 500, padding: "14px 18px", fontSize: 15, fontWeight: 600,
            background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)",
            color: "var(--text)", outline: "none", boxSizing: "border-box",
          }}
        />
        {search && (
          <p style={{ fontSize: 13, color: "var(--text-dim)", fontWeight: 600, marginTop: 8 }}>
            Found {totalFiltered} names matching "{search}"
          </p>
        )}
      </div>

      {/* Tip box */}
      <div style={{ background: "rgba(0,212,255,0.06)", border: "1px solid rgba(0,212,255,0.2)", borderRadius: "var(--radius-sm)", padding: "16px 20px", marginBottom: 40, fontSize: 13, fontWeight: 600, color: "var(--text-muted)", lineHeight: 1.7 }}>
        💡 <strong style={{ color: "var(--text)" }}>Pro tip:</strong> Display names can be up to 20 characters including spaces. You can change your display name for free every 7 days — so experiment! Unlike usernames (which cost 1000 Robux to change), display names are totally free to update.
      </div>

      {/* Name sections */}
      {filteredCategories.length === 0 ? (
        <div style={{ textAlign: "center", padding: 60, color: "var(--text-muted)", fontWeight: 700 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
          <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>No names found</div>
          <div>Try a different search term</div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 48 }}>
          {filteredCategories.map(cat => (
            <section key={cat.id}>
              <div style={{ marginBottom: 16 }}>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: 26, marginBottom: 6, display: "flex", alignItems: "center", gap: 10 }}>
                  <span>{cat.emoji}</span>
                  <span>{cat.label}</span>
                  <span style={{ fontSize: 14, fontWeight: 700, padding: "3px 12px", borderRadius: 100, background: cat.bg, color: cat.color, fontFamily: "inherit" }}>
                    {cat.names.length}
                  </span>
                </h2>
                <p style={{ fontSize: 14, color: "var(--text-muted)", fontWeight: 600, margin: 0 }}>{cat.description}</p>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 8 }}>
                {cat.names.map(name => (
                  <button
                    key={name}
                    onClick={() => copyName(name)}
                    style={{
                      background: copied === name ? cat.bg : "var(--bg-card)",
                      border: `1px solid ${copied === name ? cat.color : "var(--border)"}`,
                      borderRadius: "var(--radius-sm)", padding: "10px 14px",
                      textAlign: "left", cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8,
                      transition: "all 0.15s",
                    }}
                  >
                    <span style={{ fontSize: 13, fontWeight: 700, color: copied === name ? cat.color : "var(--text)", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {name}
                    </span>
                    <span style={{ fontSize: 11, color: copied === name ? cat.color : "var(--text-dim)", fontWeight: 800, flexShrink: 0 }}>
                      {copied === name ? "✓" : "copy"}
                    </span>
                  </button>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      {/* SEO content */}
      <div style={{ marginTop: 64, display: "flex", flexDirection: "column", gap: 32 }}>
        <section>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 24, marginBottom: 12 }}>What Is a Roblox Display Name?</h2>
          <p style={{ fontSize: 15, color: "var(--text-muted)", fontWeight: 600, lineHeight: 1.8 }}>
            Your Roblox display name is the name that appears above your character in-game and on your profile page. Unlike your username, display names can include spaces, making them far more creative and expressive. You can change your display name for free once every 7 days, so there's no pressure to commit forever — experiment with different styles until you find one that fits.
          </p>
        </section>

        <section>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 24, marginBottom: 12 }}>Display Name Rules on Roblox</h2>
          <p style={{ fontSize: 15, color: "var(--text-muted)", fontWeight: 600, lineHeight: 1.8 }}>
            Roblox display names can be up to 20 characters long and can include letters, numbers, spaces, and some special characters. They cannot contain offensive or inappropriate content — Roblox moderates display names just like usernames. Unlike usernames, display names are not unique, so multiple players can have the same display name. This means popular names are always available to use.
          </p>
        </section>

        <section>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 24, marginBottom: 12 }}>Username vs Display Name</h2>
          <p style={{ fontSize: 15, color: "var(--text-muted)", fontWeight: 600, lineHeight: 1.8 }}>
            Your <strong style={{ color: "var(--text)" }}>username</strong> is permanent (costs 1000 Robux to change), appears in your profile URL, and cannot contain spaces. Your <strong style={{ color: "var(--text)" }}>display name</strong> is free to change every 7 days, can include spaces and some special characters, and is what most players see in-game. The best strategy is to lock in a solid username and use your display name to express your personality or current vibe.
          </p>
        </section>

        {/* CTA */}
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "32px 28px", textAlign: "center" }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>🎮</div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, marginBottom: 8 }}>Ready to Test Your Roblox Knowledge?</h2>
          <p style={{ fontSize: 14, color: "var(--text-muted)", fontWeight: 600, lineHeight: 1.7, maxWidth: 500, margin: "0 auto 20px" }}>
            Now that you have your perfect display name, put your game knowledge to the test with free Roblox trivia quizzes.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <a href="/browse" style={{ background: "var(--gradient-main)", color: "var(--bg)", fontWeight: 900, fontSize: 14, padding: "12px 28px", borderRadius: 100, textDecoration: "none", WebkitTextFillColor: "var(--bg)" }}>
              🎯 Take a Quiz
            </a>
            <a href="/roblox-username-ideas" style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)", fontWeight: 800, fontSize: 14, padding: "12px 28px", borderRadius: 100, textDecoration: "none" }}>
              👤 Username Ideas
            </a>
          </div>
        </div>

        {/* FAQ */}
        <section>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 24, marginBottom: 16 }}>Frequently Asked Questions</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { q: "Can Roblox display names have spaces?", a: "Yes! Roblox display names can include spaces, which is what makes them different from usernames. For example 'Shadow Blade' or 'lunar bloom 🌸' are both valid display names." },
              { q: "How often can I change my display name?", a: "You can change your Roblox display name for free once every 7 days. There's no Robux cost, so you can experiment with different names regularly." },
              { q: "Can two players have the same display name?", a: "Yes — display names are not unique on Roblox. Multiple players can use the same display name at the same time. Your username is still your unique identifier." },
              { q: "How long can a Roblox display name be?", a: "Roblox display names can be up to 20 characters long, including spaces. This is the same limit as usernames, but spaces count toward the character limit." },
              { q: "Can I use emojis in my Roblox display name?", a: "Roblox does support some special characters in display names, though emoji support can vary. It's worth trying your preferred emoji — if Roblox rejects it, choose a different style." },
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