"use client";

export function DuoPairCard({ nameA, nameB }: { nameA: string; nameB: string }) {
  function copy(name: string) {
    navigator.clipboard.writeText(name);
  }

  return (
    <div style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "14px 16px", display: "flex", alignItems: "center", gap: 8 }}>
      <button
        onClick={() => copy(nameA)}
        title={`Copy ${nameA}`}
        style={{ background: "none", border: "none", padding: 0, cursor: "pointer", fontFamily: "inherit" }}
      >
        <span style={{ fontSize: 13, fontWeight: 700, color: "#00f5a0" }}>{nameA}</span>
      </button>
      <span style={{ fontSize: 12, color: "rgba(255,255,255,0.2)", flexShrink: 0 }}>&</span>
      <button
        onClick={() => copy(nameB)}
        title={`Copy ${nameB}`}
        style={{ background: "none", border: "none", padding: 0, cursor: "pointer", fontFamily: "inherit" }}
      >
        <span style={{ fontSize: 13, fontWeight: 700, color: "#00f5a0" }}>{nameB}</span>
      </button>
    </div>
  );
}