"use client";
import { useState, useMemo } from "react";

const CATEGORIES = [
  {
    id: "military",
    label: "Military & Combat Clans",
    emoji: "⚔️",
    color: "var(--neon-green, #00f5a0)",
    bg: "rgba(0,245,160,0.1)",
    description: "Battle-hardened clan names for PvP, war games, and competitive squads. Popular in games like Blox Fruits and Arsenal.",
    names: [
      "Iron Legion", "Shadow Battalion", "Steel Corps", "Night Wolves", "Storm Raiders",
      "Void Soldiers", "Dark Brigade", "Ghost Squad", "Phantom Unit", "Crimson Guard",
      "Black Ops Elite", "Silent Strike", "Reaper Corps", "Death Squad", "Apex Predators",
      "Iron Fist Clan", "War Machine", "Battle Born", "Combat Ready", "Front Line",
      "Omega Force", "Alpha Team", "Delta Squad", "Echo Company", "Bravo Unit",
      "Shadow Force", "Night Raiders", "Storm Troopers", "Death March", "War Dogs",
      "Steel Wolves", "Iron Eagles", "Crimson Hawks", "Black Ravens", "Ghost Riders",
      "Silent Killers", "Void Hunters", "Dark Hunters", "Shadow Hunters", "Night Hunters",
      "Tactical Elite", "Combat Zone", "War Council", "Battle Squad", "Strike Force",
      "Elite Guard", "Royal Guard", "Imperial Guard", "Dark Guard", "Shadow Guard",
    ],
  },
  {
    id: "anime",
    label: "Anime & Manga Clans",
    emoji: "🌸",
    color: "#ff9ec8",
    bg: "rgba(255,158,200,0.1)",
    description: "Anime-inspired group names perfect for Shindo Life, Anime Fighting Simulator, and Jujutsu Infinite fans.",
    names: [
      "Akatsuki Rising", "Demon Slayer Guild", "Soul Society", "Hidden Leaf Order", "Uchiha Clan",
      "Phantom Troupe", "Survey Corps", "Straw Hat Crew", "Zero Division", "Espada Order",
      "Kage Alliance", "Bijuu Hunters", "Sannin Squad", "Genin Rising", "Jonin Elite",
      "Senju Bloodline", "Uzumaki Clan", "Hyuga Order", "Sharingan Corps", "Byakugan Guild",
      "Spirit Detectives", "Flame Hashira", "Water Breathing", "Thunder Clap", "Stone Pillars",
      "Hollow Hunters", "Soul Reapers", "Quincy Order", "Arrancar Guild", "Fullbring Clan",
      "Titan Slayers", "Colossal Guild", "Armored Corps", "Jaw Clan", "Beast Titan",
      "Plus Ultra Squad", "Hero Agency", "League of Villains", "Nomu Corps", "Shigaraki Clan",
      "Nen Masters", "Gon Squad", "Hunter Guild", "Phantom Brigade", "Zoldyck Order",
      "Demon Corps", "Hashira Order", "Pillars Alliance", "Breath Users", "Wisteria Guild",
    ],
  },
  {
    id: "roleplay",
    label: "Roleplay & Kingdom Groups",
    emoji: "👑",
    color: "var(--neon-yellow, #ffe347)",
    bg: "rgba(255,227,71,0.1)",
    description: "Noble-sounding names for kingdom roleplay, royal courts, and Brookhaven RP factions.",
    names: [
      "Kingdom of Aether", "House Valdris", "The Iron Throne", "Crimson Dynasty", "Silver Kingdom",
      "Order of the Dawn", "Court of Shadows", "House Stormwind", "Empire of Void", "Golden Realm",
      "The High Council", "Noble Alliance", "Royal Bloodline", "Ancient Order", "Sacred Guild",
      "House of Ravens", "Moonlit Court", "Starfall Kingdom", "Dawnbreaker Clan", "Twilight Order",
      "The Forgotten Realm", "Lost Kingdom", "Fallen Empire", "Shattered Crown", "Broken Throne",
      "Forest Keepers", "Mountain Clan", "River Folk", "Desert Wanderers", "Island Nation",
      "The Round Table", "Knights of Honor", "Paladin Order", "Crusader Guild", "Holy Knights",
      "Merchant Guild", "Trade Alliance", "Harbor Masters", "Sea Lords", "Port Authority",
      "The Resistance", "Rebel Alliance", "Freedom Fighters", "Liberation Front", "Uprising Guild",
      "The Enclave", "Safe Haven", "Last Refuge", "Hidden Sanctuary", "Secret Order",
    ],
  },
  {
    id: "cool",
    label: "Cool & Aesthetic Groups",
    emoji: "💎",
    color: "var(--neon-blue, #00d4ff)",
    bg: "rgba(0,212,255,0.1)",
    description: "Sleek, modern group names with serious style. Perfect as a general clan tag for any Roblox game.",
    names: [
      "Neon Collective", "Void Society", "Shadow Syndicate", "Apex Alliance", "Nova Guild",
      "Cipher Clan", "Eclipse Order", "Zenith Squad", "Prism Collective", "Flux Society",
      "Onyx Order", "Cobalt Clan", "Azure Alliance", "Obsidian Guild", "Phantom Society",
      "Digital Nomads", "Cyber Collective", "Pixel Squad", "Glitch Guild", "Binary Clan",
      "The Collective", "The Alliance", "The Order", "The Guild", "The Society",
      "Dark Matter", "Anti Matter", "Zero Point", "Null Space", "Void Space",
      "Midnight Collective", "Nocturn Guild", "Twilight Society", "Dusk Alliance", "Dawn Order",
      "Frozen Throne", "Ice Court", "Frost Guild", "Blizzard Clan", "Glacier Society",
      "Storm Collective", "Thunder Guild", "Lightning Clan", "Bolt Society", "Shock Alliance",
      "Inferno Guild", "Ember Clan", "Flame Society", "Blaze Alliance", "Cinder Order",
    ],
  },
  {
    id: "funny",
    label: "Funny & Meme Groups",
    emoji: "😂",
    color: "#ff79c6",
    bg: "rgba(255,121,198,0.1)",
    description: "Hilarious clan names that make everyone laugh. Best for casual friend groups and meme squads.",
    names: [
      "Potato Army", "Banana Republic", "Toast Lords", "Waffle Warriors", "Noodle Nation",
      "The Noobs", "Certified Noobs", "Professional Noobs", "Elite Noobs", "Noob Squad",
      "AFK Nation", "Lag City", "Ping Of Death", "404 Clan Not Found", "Error Squad",
      "We Try Sometimes", "Mostly Trying", "Sort Of Good", "Better Than Nothing", "Could Be Worse",
      "Accidental Winners", "Lucky Survivors", "Barely Made It", "Almost Champions", "Close Enough",
      "The Sleepy Ones", "Professional Nappers", "Lazy Legends", "Couch Clan", "Nap Squad",
      "Ctrl Z Guild", "Undo Button", "Delete Key", "Backspace Clan", "Tab Society",
      "Main Character Energy", "NPC Behavior", "Side Quest Gang", "Tutorial Stuck", "Easy Mode",
      "No Ragequit", "Calm and Rage", "Keyboard Smash", "Monitor Puncher", "Rage Reset",
      "Teamwork Maybe", "Coordination Zero", "Plan B Always", "Wing It Guild", "Figure It Out",
    ],
  },
  {
    id: "gaming",
    label: "Gaming & Esports Clans",
    emoji: "🎮",
    color: "#b84cff",
    bg: "rgba(184,76,255,0.1)",
    description: "Competitive clan names for serious gamers, esports teams, and ranked squads.",
    names: [
      "Ranked Legends", "Diamond Division", "Platinum Corps", "Gold Standard", "Silver Bullets",
      "Pro Circuit", "Main Stage", "Grand Finals", "World Series", "Championship Round",
      "Respawn Ready", "No Lives Lost", "Full HP Clan", "Max Stats Guild", "God Mode On",
      "Frame Perfect", "Pixel Perfect", "One Shot", "Headshot Only", "No Scope Nation",
      "Speed Runners", "Any Percent", "All Achievements", "Full Clear", "100 Percent",
      "Meta Breakers", "Off Meta Guild", "Cheese Strategy", "Exploit Clan", "Broken Build",
      "Carry Squad", "Boosted Army", "Elo Hell", "Hardstuck Guild", "Rank Reset",
      "Solo Queue", "Duo Queue", "Full Party", "Five Stack", "Stack Attack",
      "Clutch Kings", "Clutch Factor", "Clutch Mode", "Pressure Play", "Big Brain",
      "IQ 200 Clan", "5D Chess", "300 IQ Move", "Galaxy Brain", "Next Level",
    ],
  },
  {
    id: "aesthetic",
    label: "Aesthetic & Vibe Groups",
    emoji: "🌙",
    color: "#c084fc",
    bg: "rgba(192,132,252,0.1)",
    description: "Soft, dreamy group names for Royale High, Berry Avenue, and Dress to Impress communities.",
    names: [
      "Lunar Society", "Starlight Collective", "Moonbeam Guild", "Aurora Order", "Celestial Clan",
      "Cottagecore Collective", "Fairycore Guild", "Dreamcore Society", "Softcore Clan", "Coquette Order",
      "Pastel Nation", "Aesthetic Guild", "Vibe Collective", "Soft Society", "Gentle Order",
      "Garden Party", "Tea Time Clan", "Afternoon Society", "Brunch Guild", "Picnic Collective",
      "Cloud Nine Clan", "Sky High Society", "Above the Clouds", "Floating Guild", "Dream State",
      "Golden Hour", "Magic Hour", "Blue Hour", "Twilight Collective", "Dusk Society",
      "Wanderlust Guild", "Nomad Society", "Free Spirit Clan", "Wild Flower Order", "Bloom Collective",
      "Crystal Clear", "Prismatic Guild", "Rainbow Society", "Color Splash", "Pastel Dreams",
      "Midnight Garden", "Moonlit Meadow", "Starlit Forest", "Sunlit Grove", "Twilight Garden",
      "Soft Glow Guild", "Gentle Light", "Warm Tone Society", "Cool Tone Clan", "Neutral Aesthetic",
    ],
  },
  {
    id: "short",
    label: "Short Clan Tags",
    emoji: "⚡",
    color: "var(--neon-green, #00f5a0)",
    bg: "rgba(0,245,160,0.08)",
    description: "Short 1-3 word clan names that work great as group tags members add to their usernames like [TAG].",
    names: [
      "APEX", "VOID", "NOVA", "ZERO", "IRON",
      "DARK", "NEON", "FLUX", "ONYX", "CYAN",
      "BLAZE", "FROST", "STORM", "SHADE", "WRAITH",
      "ECHO", "OMEGA", "SIGMA", "DELTA", "ALPHA",
      "PRIME", "ELITE", "ULTRA", "HYPER", "TURBO",
      "Ghost", "Phantom", "Shadow", "Specter", "Wraith",
      "Viper", "Cobra", "Venom", "Toxin", "Plague",
      "Frost", "Blaze", "Storm", "Flash", "Surge",
      "Steel", "Iron", "Chrome", "Titanium", "Carbon",
      "Lunar", "Solar", "Astral", "Cosmic", "Nebula",
    ],
  },
];

const TOTAL = CATEGORIES.reduce((sum, c) => sum + c.names.length, 0);
const ENABLE_CLAUDE = process.env.NEXT_PUBLIC_ENABLE_CLAUDE_GENERATION === "true";

export default function GroupNameClient() {
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
            content: `Generate 10 creative Roblox group or clan names for the "${cat?.label ?? "general"}" style.
${keyword ? `The user wants names related to: "${keyword}".` : ""}
Rules:
- Max 50 characters each
- Spaces ARE allowed
- Match the vibe: ${cat?.description ?? "creative and memorable"}
- Each name must be unique and distinct
- Suitable for a Roblox group
- No offensive or inappropriate content
Respond with ONLY a JSON array of 10 strings, no markdown, no explanation. Example: ["Name One","Name Two"]`
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

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px", position: "relative", zIndex: 1 }}>

      {/* Breadcrumbs */}
      <nav aria-label="breadcrumb" style={{ marginBottom: 20 }}>
        <ol style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center", fontSize: 13, fontWeight: 700, color: "var(--text-dim)" }}>
          <li><a href="/" style={{ color: "var(--text-muted)", textDecoration: "none" }}>Home</a></li>
          <li>›</li>
          <li style={{ color: "var(--text)" }}>Roblox Group Name Generator</li>
        </ol>
      </nav>

      {/* Hero */}
      <div style={{ marginBottom: 40 }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 5vw, 52px)", marginBottom: 12, lineHeight: 1.1 }}>
          Roblox Group &amp; Clan Name Generator
        </h1>
        <p style={{ fontSize: 16, color: "var(--text-muted)", fontWeight: 600, lineHeight: 1.7, maxWidth: 700, marginBottom: 24 }}>
          Find the perfect name for your Roblox group or clan. Browse {TOTAL}+ ideas across military, anime, roleplay, gaming, and aesthetic categories — or generate fresh names instantly. All free to copy.
        </p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {[
            { label: "Group Names", value: TOTAL.toLocaleString() + "+", color: "var(--neon-blue, #00d4ff)" },
            { label: "Categories", value: CATEGORIES.length, color: "var(--neon-green, #00f5a0)" },
            { label: "Cost to Create", value: "100 Robux", color: "var(--neon-yellow, #ffe347)" },
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
            ? "Pick a category, add an optional keyword, and generate 10 fresh group names."
            : "Pick a category and get 10 random group name ideas instantly."}
        </p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
          {ENABLE_CLAUDE && (
            <input
              type="text"
              placeholder="Optional keyword (e.g. dragon, fire, ninja...)"
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
          placeholder="🔍 Search group name ideas..."
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
            Found {totalFiltered} names matching &ldquo;{search}&rdquo;
          </p>
        )}
      </div>

      {/* Tip box */}
      <div style={{ background: "rgba(0,212,255,0.06)", border: "1px solid rgba(0,212,255,0.2)", borderRadius: "var(--radius-sm)", padding: "16px 20px", marginBottom: 40, fontSize: 13, fontWeight: 600, color: "var(--text-muted)", lineHeight: 1.7 }}>
        💡 <strong style={{ color: "var(--text)" }}>Pro tip:</strong> Creating a Roblox group costs 100 Robux. Many clans also create a short 2-5 letter tag (like [APEX] or [VOID]) that members add to their username or display name so everyone knows they&apos;re in the same group.
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
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 8 }}>
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
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 24, marginBottom: 12 }}>How to Create a Roblox Group</h2>
          <p style={{ fontSize: 15, color: "var(--text-muted)", fontWeight: 600, lineHeight: 1.8 }}>
            Creating a Roblox group costs 100 Robux and takes about 2 minutes. Go to the Groups page on Roblox.com, click &ldquo;Create Group,&rdquo; pick your name, upload a group logo (minimum 256x256 pixels), write a description, and choose your group settings. You&apos;ll become the group owner automatically and can assign roles, ranks, and permissions to members.
          </p>
        </section>

        <section>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 24, marginBottom: 12 }}>What Makes a Good Roblox Clan Name?</h2>
          <p style={{ fontSize: 15, color: "var(--text-muted)", fontWeight: 600, lineHeight: 1.8 }}>
            The best Roblox clan names are short (2-3 words), easy to remember, and reflect your group&apos;s identity or main game. Avoid generic names like &ldquo;Best Clan&rdquo; or &ldquo;Elite Squad&rdquo; — they&apos;re overused and hard to find. Instead, pick something unique to your group&apos;s vibe. Many successful clans also create a short tag (like [VOID] or [NOVA]) that members voluntarily add to their display names to show group membership.
          </p>
        </section>

        <section>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 24, marginBottom: 12 }}>Group Names vs Clan Tags</h2>
          <p style={{ fontSize: 15, color: "var(--text-muted)", fontWeight: 600, lineHeight: 1.8 }}>
            Your <strong style={{ color: "var(--text)" }}>group name</strong> is the official name of your Roblox group (up to 50 characters). A <strong style={{ color: "var(--text)" }}>clan tag</strong> is a short abbreviation (usually 2-5 letters in brackets) that members add to their display names — for example, a group called &ldquo;Shadow Battalion&rdquo; might use the tag [SB] or [SHADOW]. Tags are not enforced by Roblox but are a community convention that makes members easy to identify in-game.
          </p>
        </section>

        {/* CTA */}
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "32px 28px", textAlign: "center" }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>🎮</div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, marginBottom: 8 }}>Ready to Test Your Roblox Knowledge?</h2>
          <p style={{ fontSize: 14, color: "var(--text-muted)", fontWeight: 600, lineHeight: 1.7, maxWidth: 500, margin: "0 auto 20px" }}>
            Got your group name? Now put your game knowledge to the test with free Roblox trivia quizzes for every game.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <a href="/browse" style={{ background: "var(--gradient-main)", color: "var(--bg)", fontWeight: 900, fontSize: 14, padding: "12px 28px", borderRadius: 100, textDecoration: "none", WebkitTextFillColor: "var(--bg)" }}>
              🎯 Take a Quiz
            </a>
            <a href="/roblox-display-name-generator" style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)", fontWeight: 800, fontSize: 14, padding: "12px 28px", borderRadius: 100, textDecoration: "none" }}>
              ✨ Display Name Generator
            </a>
          </div>
        </div>

        {/* FAQ */}
        <section>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 24, marginBottom: 16 }}>Frequently Asked Questions</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { q: "How much does it cost to create a Roblox group?", a: "Creating a Roblox group costs 100 Robux. This is a one-time fee that makes you the group owner. There is no monthly cost to maintain a group." },
              { q: "Can I change my Roblox group name?", a: "Yes, group owners can change their group name through the group settings page. Name changes may cost Robux and are subject to Roblox's moderation. Choose your name carefully before creating the group." },
              { q: "How long can a Roblox group name be?", a: "Roblox group names can be up to 50 characters long and can include spaces, letters, numbers, and some special characters. Names cannot contain inappropriate content." },
              { q: "How many members can a Roblox group have?", a: "Roblox groups can have up to 100,000 members. Large popular groups sometimes hit this limit and need to create secondary groups or manage membership carefully." },
              { q: "What is a good clan tag format?", a: "Most Roblox clans use 2-5 letter tags in brackets, like [VOID], [APEX], or [NOVA]. Members voluntarily add these to their display names. Keep tags short and memorable — they show up next to your name in-game." },
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