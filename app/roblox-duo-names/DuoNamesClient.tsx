"use client";
import { useState, useMemo } from "react";
import type { DuoTheme, DuoPair } from "./page";

const STYLES = [
  { id: "all", label: "All Styles" },
  { id: "cute", label: "🌸 Cute" },
  { id: "tryhard", label: "⚔️ Tryhard" },
  { id: "funny", label: "😂 Funny" },
  { id: "clean", label: "✨ Clean" },
];

const MAX_LENGTHS = [
  { id: "any", label: "Any Length" },
  { id: "16", label: "Under 16 chars" },
  { id: "12", label: "Under 12 chars" },
];

function charCount(name: string): number {
  return name.length;
}

function charColor(len: number): string {
  if (len <= 12) return "#00f5a0";
  if (len <= 16) return "#ffd700";
  return "#ff6b6b";
}

function DuoPairCard({ nameA, nameB }: { nameA: string; nameB: string }) {
  const [copiedA, setCopiedA] = useState(false);
  const [copiedB, setCopiedB] = useState(false);
  const [copiedBoth, setCopiedBoth] = useState(false);

  function copy(name: string, which: "a" | "b" | "both") {
    navigator.clipboard.writeText(name);
    if (which === "a") { setCopiedA(true); setTimeout(() => setCopiedA(false), 1500); }
    if (which === "b") { setCopiedB(true); setTimeout(() => setCopiedB(false), 1500); }
    if (which === "both") { setCopiedBoth(true); setTimeout(() => setCopiedBoth(false), 1500); }
  }

  const lenA = charCount(nameA);
  const lenB = charCount(nameB);

  return (
    <div style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "14px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
      {/* Names row */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <button
          onClick={() => copy(nameA, "a")}
          title={`Copy ${nameA}`}
          style={{ background: copiedA ? "rgba(0,245,160,0.1)" : "none", border: copiedA ? "1px solid rgba(0,245,160,0.3)" : "1px solid transparent", borderRadius: 6, padding: "4px 8px", cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s" }}
        >
          <span style={{ fontSize: 13, fontWeight: 700, color: copiedA ? "#fff" : "#00f5a0" }}>
            {copiedA ? "✓ Copied" : nameA}
          </span>
        </button>

        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", flexShrink: 0 }}>&</span>

        <button
          onClick={() => copy(nameB, "b")}
          title={`Copy ${nameB}`}
          style={{ background: copiedB ? "rgba(0,245,160,0.1)" : "none", border: copiedB ? "1px solid rgba(0,245,160,0.3)" : "1px solid transparent", borderRadius: 6, padding: "4px 8px", cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s" }}
        >
          <span style={{ fontSize: 13, fontWeight: 700, color: copiedB ? "#fff" : "#00f5a0" }}>
            {copiedB ? "✓ Copied" : nameB}
          </span>
        </button>
      </div>

      {/* Bottom row: char counts + copy both */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", gap: 8 }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: charColor(lenA) }}>{lenA} chars</span>
          <span style={{ fontSize: 10, color: "rgba(255,255,255,0.2)" }}>·</span>
          <span style={{ fontSize: 10, fontWeight: 700, color: charColor(lenB) }}>{lenB} chars</span>
        </div>
        <button
          onClick={() => copy(`${nameA} & ${nameB}`, "both")}
          style={{ background: copiedBoth ? "rgba(0,245,160,0.1)" : "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 100, padding: "3px 10px", fontSize: 10, fontWeight: 700, color: copiedBoth ? "#00f5a0" : "rgba(255,255,255,0.4)", cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s", whiteSpace: "nowrap" }}
        >
          {copiedBoth ? "✓ Copied!" : "Copy Both"}
        </button>
      </div>
    </div>
  );
}

export default function DuoNamesClient({ themes }: { themes: DuoTheme[] }) {
  const [activeThemes, setActiveThemes] = useState<string[]>([]);
  const [activeStyle, setActiveStyle] = useState("all");
  const [maxLength, setMaxLength] = useState("any");

  function toggleTheme(theme: string) {
    setActiveThemes(prev =>
      prev.includes(theme) ? prev.filter(t => t !== theme) : [...prev, theme]
    );
  }

  const filteredThemes = useMemo(() => {
    return themes
      .filter(t => activeThemes.length === 0 || activeThemes.includes(t.theme))
      .map(t => ({
        ...t,
        pairs: t.pairs.filter(p => {
          const styleMatch = activeStyle === "all" || p.style === activeStyle;
          const lenLimit = maxLength === "any" ? 99 : parseInt(maxLength);
          const lenMatch = p.nameA.length < lenLimit && p.nameB.length < lenLimit;
          return styleMatch && lenMatch;
        }),
      }))
      .filter(t => t.pairs.length > 0);
  }, [themes, activeThemes, activeStyle, maxLength]);

  const totalPairs = filteredThemes.reduce((sum, t) => sum + t.pairs.length, 0);

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 20px 0" }}>

      {/* Filters */}
      <div style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "20px 24px", marginBottom: 32 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Theme filter */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "rgba(255,255,255,0.35)", marginBottom: 10 }}>Theme</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {themes.map(t => {
                const active = activeThemes.includes(t.theme);
                return (
                  <button
                    key={t.theme}
                    onClick={() => toggleTheme(t.theme)}
                    style={{ background: active ? "rgba(0,245,160,0.12)" : "rgba(255,255,255,0.04)", border: active ? "1px solid rgba(0,245,160,0.4)" : "1px solid rgba(255,255,255,0.08)", borderRadius: 100, padding: "6px 14px", fontSize: 12, fontWeight: 700, color: active ? "#00f5a0" : "rgba(255,255,255,0.5)", cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s" }}
                  >
                    {t.emoji} {t.theme}
                  </button>
                );
              })}
              {activeThemes.length > 0 && (
                <button onClick={() => setActiveThemes([])} style={{ background: "none", border: "none", fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.3)", cursor: "pointer", fontFamily: "inherit", padding: "6px 8px" }}>
                  Clear
                </button>
              )}
            </div>
          </div>

          <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
            {/* Style filter */}
            <div>
              <div style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "rgba(255,255,255,0.35)", marginBottom: 10 }}>Style</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {STYLES.map(s => (
                  <button
                    key={s.id}
                    onClick={() => setActiveStyle(s.id)}
                    style={{ background: activeStyle === s.id ? "rgba(0,180,216,0.12)" : "rgba(255,255,255,0.04)", border: activeStyle === s.id ? "1px solid rgba(0,180,216,0.4)" : "1px solid rgba(255,255,255,0.08)", borderRadius: 100, padding: "5px 12px", fontSize: 12, fontWeight: 700, color: activeStyle === s.id ? "#00b4d8" : "rgba(255,255,255,0.5)", cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s" }}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Max length filter */}
            <div>
              <div style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "rgba(255,255,255,0.35)", marginBottom: 10 }}>Max Length</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {MAX_LENGTHS.map(l => (
                  <button
                    key={l.id}
                    onClick={() => setMaxLength(l.id)}
                    style={{ background: maxLength === l.id ? "rgba(184,76,255,0.12)" : "rgba(255,255,255,0.04)", border: maxLength === l.id ? "1px solid rgba(184,76,255,0.4)" : "1px solid rgba(255,255,255,0.08)", borderRadius: 100, padding: "5px 12px", fontSize: 12, fontWeight: 700, color: maxLength === l.id ? "#b84cff" : "rgba(255,255,255,0.5)", cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s" }}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Results count */}
        <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.06)", fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.3)" }}>
          Showing {totalPairs} pair{totalPairs !== 1 ? "s" : ""}
          {activeThemes.length > 0 || activeStyle !== "all" || maxLength !== "any" ? " — " : ""}
          {activeThemes.length > 0 && activeThemes.join(", ")}
          {activeStyle !== "all" && ` · ${STYLES.find(s => s.id === activeStyle)?.label}`}
          {maxLength !== "any" && ` · Under ${maxLength} chars`}
        </div>
      </div>

      {/* Results */}
      {filteredThemes.length === 0 ? (
        <div style={{ textAlign: "center", padding: "48px 0", color: "rgba(255,255,255,0.3)", fontWeight: 600, fontSize: 14 }}>
          No pairs match your filters — try adjusting the style or length.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 40, marginBottom: 56 }}>
          {filteredThemes.map(section => (
            <div key={section.theme}>
              <div style={{ marginBottom: 16 }}>
                <h2 style={{ fontSize: 18, fontWeight: 800, color: "#fff", margin: "0 0 8px", display: "flex", alignItems: "center", gap: 10 }}>
                  <span>{section.emoji}</span>
                  <span>{section.theme}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.3)", fontFamily: "inherit" }}>{section.pairs.length} pairs</span>
                </h2>
                <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 1.6, fontWeight: 600, maxWidth: 640 }}>
                  {section.intro}
                </p>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 10 }}>
                {section.pairs.map((pair, i) => (
                  <DuoPairCard key={i} nameA={pair.nameA} nameB={pair.nameB} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}