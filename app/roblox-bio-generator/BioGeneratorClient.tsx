"use client";
import { useState, useMemo } from "react";

const CATEGORIES = [
  {
    id: "aesthetic",
    label: "Aesthetic Bios",
    emoji: "🌸",
    color: "#ff9ec8",
    bg: "rgba(255,158,200,0.1)",
    description: "Soft, dreamy bios with a beautiful artistic vibe. Perfect for Royale High, Dress to Impress and Berry Avenue players.",
    bios: [
      "✨ chasing stars and collecting dreams 🌙",
      "soft vibes only 🌸 | living in my own world",
      "moon child 🌙 | aesthetic soul | not from here",
      "🌷 bloom where you are planted 🌷",
      "lost in daydreams ☁️ | found in stardust ✨",
      "petal soft 🌸 | heart of gold | head in the clouds",
      "cottagecore energy 🌿 | fairy vibes | magic everywhere",
      "aurora dreams 🌌 | lavender haze | celestial girl",
      "✨ manifesting good vibes and good games ✨",
      "soft aesthetic | pastel world 🎀 | rose quartz heart",
      "🌙 night owl with a heart full of stars",
      "dreaming in color 🌈 | living in soft light",
      "fairy tale protagonist 🧚 | main character energy",
      "🍃 gentle soul in a chaotic world 🍃",
      "cloud nine resident ☁️ | permanent daydream mode",
      "crystal clear intentions 💎 | velvet energy",
      "moonbeam collector 🌙 | stardust believer ✨",
      "🌸 blooming slowly but surely 🌸",
      "aesthetic creature | soft hours only 🕯️",
      "sugar and stardust ✨ | pastel and proud",
    ],
  },
  {
    id: "cool",
    label: "Cool Bios",
    emoji: "⚔️",
    color: "#00d4ff",
    bg: "rgba(0,212,255,0.1)",
    description: "Powerful bios that command respect. Perfect for PvP players, speedrunners, and competitive gamers.",
    bios: [
      "Shadow Blade main 🗡️ | no mercy in PvP",
      "built different | trained harder | hits different",
      "top ranked 🏆 | grind never stops | legend status",
      "void walker | digital ghost | untouchable",
      "silent killer | zero lag | full send always",
      "apex predator 🎯 | no aim assist needed",
      "neon reaper ⚡ | cyber knight | glass cannon",
      "dark matter energy | unstoppable force",
      "frost reaper ❄️ | cold precision | clean kills",
      "ghost protocol 👻 | you won't see me coming",
      "iron will | steel mind | unbreakable",
      "storm chaser ⚡ | thrill seeker | risk taker",
      "void protocol | zero tolerance | max efficiency",
      "crimson wolf 🐺 | hunt or be hunted",
      "shadow mode: on | ghost mode: always",
      "elite class | S tier | no exceptions",
      "born to grind | forced to carry | still winning",
      "chaos controller 🌀 | system override",
      "night falcon 🦅 | eyes on the prize | always",
      "pressure makes diamonds 💎 | I am proof",
    ],
  },
  {
    id: "funny",
    label: "Funny Bios",
    emoji: "😂",
    color: "#ffe347",
    bg: "rgba(255,227,71,0.1)",
    description: "Hilarious bios that make everyone on your profile smile. Great icebreakers.",
    bios: [
      "professional AFK champion 💤 | undefeated",
      "I joined for Blox Fruits. I stayed for the memes.",
      "99% lag 1% skill | still somehow winning",
      "my ping is my personality trait 📶",
      "warning: may spontaneously go AFK at any moment",
      "I press random buttons and call it a strategy",
      "officially certified Roblox expert (self-certified)",
      "died 47 times today | new personal best",
      "carried by teammates I will never thank 🫡",
      "NPC behavior detected | initiating main character arc",
      "ctrl + z is my most used ability",
      "404: skill not found | still having fun tho",
      "speedrunning bad decisions since 2019",
      "potato PC player | still outplaying you",
      "technically a veteran player | strategically terrible",
      "I don't rage quit I just close the app 🙂",
      "final boss vibes | tutorial level performance",
      "plot armor equipped | common sense unequipped",
      "my build is garbage but my confidence is maxed",
      "joined every server once and never came back",
    ],
  },
  {
    id: "edgy",
    label: "Edgy Bios",
    emoji: "🖤",
    color: "#c084fc",
    bg: "rgba(192,132,252,0.1)",
    description: "Dark and mysterious bios. Popular in horror games, PvP, and among players who like a dramatic aesthetic.",
    bios: [
      "void within 🖤 | darkness is comfortable",
      "broken but still standing | numb to the noise",
      "chaos incarnate | order is boring",
      "dead inside but at least the Wi-Fi works",
      "shadow self | no light gets in 🌑",
      "corrupted file 🔴 | system damage: irreparable",
      "fallen angel with a bad Wi-Fi connection",
      "silence speaks louder | I speak in actions",
      "hollow eyes | empty halls | still here",
      "void emperor 👁️ | ruled by nothing | rules nothing",
      "404 soul not found | searching... | error",
      "dark passenger | always watching | never leaving",
      "the darkness called | I said already here",
      "built from broken pieces | still sharp",
      "neon ghost in a dead city 🌑",
      "entropy is my aesthetic | chaos is my comfort",
      "null and void | deleted from reality",
      "screaming into the void | the void screams back",
      "system error 🖤 | reboot failed | still running",
      "eternal night energy | dawn is overrated",
    ],
  },
  {
    id: "gamer",
    label: "Gamer Bios",
    emoji: "🎮",
    color: "#00f5a0",
    bg: "rgba(0,245,160,0.1)",
    description: "Bios built for true Roblox players. Show off your games, playstyle, and grind mentality.",
    bios: [
      "Blox Fruits main ⚔️ | grinding sea 3 | send help",
      "Doors floor 100 survivor 🚪 | no deaths (mostly)",
      "Adopt Me! trader 🐾 | looking for legendary pets",
      "Tower of Hell addict 🗼 | no checkpoints needed",
      "Murder Mystery 2 veteran 🔫 | godly collector",
      "Bee Swarm grinder 🐝 | hive never sleeps",
      "Royale High halo hunter 👑 | fountain never forgets",
      "Arsenal top fragger 🎯 | consistent headshots",
      "full send on every game | zero fear | max grind",
      "collector 📦 | trader 💰 | builder 🏗️ | gamer 🎮",
      "I have too many games and not enough time",
      "early access veteran | been here since the start",
      "if it's on Roblox I've probably tried it once",
      "grinding solo | carrying randoms | enjoying chaos",
      "one more round | one more game | one more hour",
      "the grind is the goal 🏆 | no days off",
      "Roblox lifer 🎮 | no plans to quit anytime soon",
      "F2P legend | no Robux needed | still winning",
      "100% completion chaser | achievement hunter",
      "cross-platform player | all devices | always online",
    ],
  },
  {
    id: "cute",
    label: "Cute Bios",
    emoji: "🐾",
    color: "#ff79c6",
    bg: "rgba(255,121,198,0.1)",
    description: "Wholesome and adorable bios that radiate positive energy. Perfect for social Roblox players.",
    bios: [
      "bunny main 🐰 | collecting cute pets | spreading joy",
      "✨ here to vibe and make friends ✨",
      "soft player | kind heart | always friendly 🌸",
      "baby gamer with max cute energy 🐾",
      "fluffy vibes only | no toxicity allowed 💗",
      "kawaii mode: permanently on 🌸",
      "collecting pets and making memories 🐶",
      "sunshine player ☀️ | brightening every server",
      "cuddle bug energy | wholesome grinder 🍀",
      "tiny but mighty 💪 | cute but competitive",
      "mochi soft | dango sweet | gaming daily 🎮",
      "positive vibes | good energy | happy gaming 🌈",
      "here for the fun | staying for the friends 💗",
      "precious cargo 🧸 | handle with care",
      "sugar rush gamer 🍭 | sweet and unstoppable",
      "cozy player | warm server | good times only ☕",
      "lil nova ✨ | tiny storm | big heart",
      "spreading kindness one game at a time 🌸",
      "snuggle mode: on | gaming mode: also on 🎮",
      "cute aesthetic | serious grind | big smile 😊",
    ],
  },
  {
    id: "short",
    label: "Short Bios",
    emoji: "⚡",
    color: "#00f5a0",
    bg: "rgba(0,245,160,0.1)",
    description: "Clean, minimal bios under 3 lines. Less is more.",
    bios: [
      "just vibing 🎮",
      "grind mode: on ⚡",
      "no cap. just gaming.",
      "built different. period.",
      "void energy only 🖤",
      "main character. always.",
      "here for the W 🏆",
      "elite or nothing.",
      "soft hours. always. 🌸",
      "chaos first. ask later.",
      "loading... please wait.",
      "npc? never heard of her.",
      "legendary. obviously. 💎",
      "game on. always. 🎮",
      "touched grass once. didn't like it.",
      "pro gamer. amateur sleeper.",
      "wins only. losses optional.",
      "log off? what's that?",
      "roblox is my cardio.",
      "certified W chaser 🏆",
    ],
  },
];

const TOTAL = CATEGORIES.reduce((sum, c) => sum + c.bios.length, 0);
const ENABLE_CLAUDE = process.env.NEXT_PUBLIC_ENABLE_CLAUDE_BIO_GENERATION === "true";

export default function BioGeneratorClient() {
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
        ? cat.bios.filter(b => b.toLowerCase().includes(search.toLowerCase()))
        : cat.bios;
      return [{ ...cat, bios: filtered }];
    }
    if (!search) return CATEGORIES;
    return CATEGORIES.map(cat => ({
      ...cat,
      bios: cat.bios.filter(b => b.toLowerCase().includes(search.toLowerCase())),
    })).filter(cat => cat.bios.length > 0);
  }, [search, activeCategory]);

  const totalFiltered = filteredCategories.reduce((sum, c) => sum + c.bios.length, 0);

  function copyBio(bio: string) {
    navigator.clipboard.writeText(bio).then(() => {
      setCopied(bio);
      setTimeout(() => setCopied(""), 2000);
    });
  }

  async function generateBios() {
    const cat = CATEGORIES.find(c => c.id === activeCategory);
    setGenerating(true);
    setGenError("");
    setGenerated([]);

    if (!ENABLE_CLAUDE || activeCategory === "all") {
      const pool = cat ? cat.bios : CATEGORIES.flatMap(c => c.bios);
      const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, 8);
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
            content: `Generate 8 creative Roblox profile bios for the "${cat?.label ?? "general"}" style.
${keyword ? `The user wants bios related to: "${keyword}".` : ""}
Rules:
- Each bio should be 1-3 lines max
- Max 200 characters each
- Emojis are encouraged but keep them tasteful
- Match the vibe: ${cat?.description ?? "creative and fun"}
- Each bio must be unique and distinct
- No offensive or inappropriate content
- Write them as if a real Roblox player would use them on their profile
Respond with ONLY a JSON array of 8 strings, no markdown, no explanation. Example: ["bio one","bio two"]`,
          }],
        }),
      });

      const data = await response.json();
      const text = data.content?.[0]?.text ?? "[]";
      const clean = text.replace(/```json|```/g, "").trim();
      const bios = JSON.parse(clean);
      setGenerated(Array.isArray(bios) ? bios.slice(0, 8) : []);
    } catch {
      setGenError("Generation failed. Showing random bios instead.");
      const pool = cat ? cat.bios : CATEGORIES.flatMap(c => c.bios);
      const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, 8);
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
          <li style={{ color: "var(--text)" }}>Roblox Bio Generator</li>
        </ol>
      </nav>

      {/* Hero */}
      <div style={{ marginBottom: 40 }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 5vw, 52px)", marginBottom: 12, lineHeight: 1.1 }}>
          Roblox Bio Generator
        </h1>
        <p style={{ fontSize: 16, color: "var(--text-muted)", fontWeight: 600, lineHeight: 1.7, maxWidth: 700, marginBottom: 24 }}>
          Your Roblox profile bio is the first thing people see when they visit your page. Make it count. Browse {TOTAL}+ bio ideas below or generate fresh ones — aesthetic, cool, funny, edgy, cute, and more.
        </p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {[
            { label: "Bio Ideas", value: TOTAL.toLocaleString(), color: "#ff9ec8" },
            { label: "Categories", value: CATEGORIES.length, color: "#00f5a0" },
            { label: "Max Length", value: "1000 chars", color: "#ffe347" },
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
            {cat.emoji} {cat.label.split(" ")[0]} ({cat.bios.length})
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
            ? "Pick a category, add an optional keyword, and generate 8 fresh bios."
            : "Pick a category and get 8 random bio ideas instantly."}
        </p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
          {ENABLE_CLAUDE && (
            <input
              type="text"
              placeholder="Optional keyword (e.g. dragon, pink, Blox Fruits...)"
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
            onClick={generateBios}
            disabled={generating}
            style={{
              padding: "12px 28px", borderRadius: 100, fontSize: 14, fontWeight: 900, cursor: generating ? "not-allowed" : "pointer",
              background: generating ? "var(--surface)" : "var(--gradient-main)",
              color: generating ? "var(--text-muted)" : "var(--bg)",
              border: "none", WebkitTextFillColor: generating ? "var(--text-muted)" : "var(--bg)",
              opacity: generating ? 0.7 : 1,
            }}
          >
            {generating ? "Generating..." : ENABLE_CLAUDE ? "✨ Generate Bios" : "⚡ Get Random Bios"}
          </button>
        </div>

        {genError && (
          <p style={{ fontSize: 13, color: "var(--neon-yellow, #ffe347)", fontWeight: 600, marginTop: 12 }}>{genError}</p>
        )}

        {generated.length > 0 && (
          <div style={{ marginTop: 20 }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: "var(--text-dim)", textTransform: "uppercase", marginBottom: 10 }}>
              Generated Bios — click to copy
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {generated.map(bio => (
                <button
                  key={bio}
                  onClick={() => copyBio(bio)}
                  style={{
                    background: copied === bio ? "rgba(0,245,160,0.1)" : "var(--surface)",
                    border: `1px solid ${copied === bio ? "var(--neon-green, #00f5a0)" : "var(--border)"}`,
                    borderRadius: "var(--radius-sm)", padding: "12px 16px",
                    textAlign: "left", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
                  }}
                >
                  <span style={{ fontSize: 13, fontWeight: 700, color: copied === bio ? "var(--neon-green, #00f5a0)" : "var(--text)", flex: 1, lineHeight: 1.5 }}>
                    {bio}
                  </span>
                  <span style={{ fontSize: 11, color: copied === bio ? "var(--neon-green, #00f5a0)" : "var(--text-dim)", fontWeight: 800, flexShrink: 0 }}>
                    {copied === bio ? "✓ copied" : "copy"}
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
          placeholder="🔍 Search bio ideas..."
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
            Found {totalFiltered} bios matching "{search}"
          </p>
        )}
      </div>

      {/* Tip box */}
      <div style={{ background: "rgba(0,212,255,0.06)", border: "1px solid rgba(0,212,255,0.2)", borderRadius: "var(--radius-sm)", padding: "16px 20px", marginBottom: 40, fontSize: 13, fontWeight: 600, color: "var(--text-muted)", lineHeight: 1.7 }}>
        💡 <strong style={{ color: "var(--text)" }}>Pro tip:</strong> Roblox bios can be up to 1000 characters — way more than most people use. Use line breaks, emojis, and separators like · or | to make your bio easy to read. Update it whenever your vibe changes.
      </div>

      {/* Bio sections */}
      {filteredCategories.length === 0 ? (
        <div style={{ textAlign: "center", padding: 60, color: "var(--text-muted)", fontWeight: 700 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
          <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>No bios found</div>
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
                    {cat.bios.length}
                  </span>
                </h2>
                <p style={{ fontSize: 14, color: "var(--text-muted)", fontWeight: 600, margin: 0 }}>{cat.description}</p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {cat.bios.map(bio => (
                  <button
                    key={bio}
                    onClick={() => copyBio(bio)}
                    style={{
                      background: copied === bio ? cat.bg : "var(--bg-card)",
                      border: `1px solid ${copied === bio ? cat.color : "var(--border)"}`,
                      borderRadius: "var(--radius-sm)", padding: "12px 16px",
                      textAlign: "left", cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
                      transition: "all 0.15s",
                    }}
                  >
                    <span style={{ fontSize: 13, fontWeight: 700, color: copied === bio ? cat.color : "var(--text)", flex: 1, lineHeight: 1.5 }}>
                      {bio}
                    </span>
                    <span style={{ fontSize: 11, color: copied === bio ? cat.color : "var(--text-dim)", fontWeight: 800, flexShrink: 0 }}>
                      {copied === bio ? "✓ copied" : "copy"}
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
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 24, marginBottom: 12 }}>What Should I Put in My Roblox Bio?</h2>
          <p style={{ fontSize: 15, color: "var(--text-muted)", fontWeight: 600, lineHeight: 1.8 }}>
            Your Roblox bio is the first impression you make on anyone who visits your profile. The best bios are short, personal, and reflect your actual playstyle or personality. You could mention your favorite games, your main account activity (trading, building, PvP), your timezone for friends who want to play together, or just a short quote that fits your vibe. Don't overthink it — even a single line with a few emojis can make your profile stand out.
          </p>
        </section>

        <section>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 24, marginBottom: 12 }}>How to Add a Bio to Your Roblox Profile</h2>
          <p style={{ fontSize: 15, color: "var(--text-muted)", fontWeight: 600, lineHeight: 1.8 }}>
            Go to your Roblox profile page and click the pencil icon or Edit Profile button. Find the About section and type or paste your bio. You can use line breaks by pressing Enter to format your bio across multiple lines. Click Save when you're done. Your bio is visible to everyone who visits your profile, so make it something you're happy to show off.
          </p>
        </section>

        <section>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 24, marginBottom: 12 }}>Roblox Bio Rules and Character Limit</h2>
          <p style={{ fontSize: 15, color: "var(--text-muted)", fontWeight: 600, lineHeight: 1.8 }}>
            Roblox bios support up to 1000 characters, which gives you a lot of room to express yourself. Emojis are supported and count toward your character limit. Line breaks, spaces, and most special characters like · | and — all work in bios. Roblox moderates bio content, so keep it appropriate — no links, no personal info, and nothing that violates the Roblox community guidelines.
          </p>
        </section>

        {/* CTA */}
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "32px 28px", textAlign: "center" }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>🎮</div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, marginBottom: 8 }}>Profile Looking Good — Now Test Your Knowledge</h2>
          <p style={{ fontSize: 14, color: "var(--text-muted)", fontWeight: 600, lineHeight: 1.7, maxWidth: 500, margin: "0 auto 20px" }}>
            Bio sorted. Now back it up with actual Roblox knowledge. Take a free quiz for your favorite game.
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
              { q: "How long can a Roblox bio be?", a: "Roblox profile bios can be up to 1000 characters long, including spaces, emojis, and line breaks. This gives you plenty of room to express yourself." },
              { q: "Can I use emojis in my Roblox bio?", a: "Yes — Roblox bios support emojis. They're a great way to add personality and visual flair without using up many characters." },
              { q: "How do I add a bio on Roblox?", a: "Go to your profile, click the Edit button, find the About section, type or paste your bio, and click Save. It's visible to everyone who visits your profile." },
              { q: "Can I put links in my Roblox bio?", a: "No — Roblox does not allow links in profile bios. Adding links may get your bio removed or your account flagged by Roblox moderation." },
              { q: "How often can I change my Roblox bio?", a: "You can change your Roblox bio as often as you want. Unlike display names (which have a 7-day cooldown), there's no limit on how frequently you can update your profile bio." },
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