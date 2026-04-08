"use client";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";

const ADMIN_USER_IDS = [
  "user_3ALlHJlXwNoezsy7eoC7qAp6yTO",
  "user_3AM3VzXy7LGvyivPbtHeNak7BDT",
  "user_3APPYs0LjMfWCIt6lBfIiYyVteU",
];

interface Guide {
  id: string;
  slug: string;
  title: string;
  game_name: string;
  game_slug: string;
  difficulty: string;
  status: string;
  word_count: number | null;
  excerpt: string | null;
  meta_title: string | null;
  meta_description: string | null;
  review_notes: string | null;
  source_notes: string | null;
  last_verified_at: string | null;
  updated_at: string;
  content: any;
}

const STATUS_COLORS: Record<string, string> = {
  draft: "#ffd700",
  published: "#00f5a0",
};

const ta: React.CSSProperties = {
  width: "100%",
  background: "#1a1f35",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 8,
  padding: "10px 14px",
  color: "#fff",
  fontSize: 13,
  fontFamily: "inherit",
  resize: "vertical",
  boxSizing: "border-box",
  lineHeight: 1.6,
};

const inp: React.CSSProperties = {
  width: "100%",
  background: "#1a1f35",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 8,
  padding: "10px 14px",
  color: "#fff",
  fontSize: 13,
  fontFamily: "inherit",
  boxSizing: "border-box",
};

const lbl: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  color: "rgba(255,255,255,0.4)",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  display: "block",
  marginBottom: 6,
};

type EditTab = "meta" | "content";

export default function AdminGuidesClient() {
  const { user, isLoaded } = useUser();
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Guide | null>(null);
  const [editTab, setEditTab] = useState<EditTab>("meta");
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  // Content editor state
  const [cIntro, setCIntro] = useState("");
  const [cWho, setCWho] = useState("");
  const [cSections, setCsections] = useState<{ heading: string; body: string }[]>([]);
  const [cTips, setCTips] = useState<string[]>([]);
  const [cFaqs, setCFaqs] = useState<{ q: string; a: string }[]>([]);

  const isAdmin = ADMIN_USER_IDS.includes(user?.id || "");

  useEffect(() => {
    if (!isLoaded || !isAdmin) return;
    fetch("/api/admin/guides")
      .then(r => r.json())
      .then(data => { setGuides(data.guides ?? []); setLoading(false); });
  }, [isLoaded, isAdmin]);

  function openEdit(guide: Guide) {
    setSelected({ ...guide });
    setEditTab("meta");
    setSaveMsg("");
    const c = guide.content || {};
    setCIntro(c.intro || "");
    setCWho(c.who_this_is_for || "");
    setCsections(c.sections?.length ? c.sections : [{ heading: "", body: "" }]);
    setCTips(c.tips?.length ? c.tips : [""]);
    setCFaqs(c.faqs?.length ? c.faqs : [{ q: "", a: "" }]);
  }

  function closeEdit() {
    setSelected(null);
    setSaveMsg("");
  }

  async function saveMeta(newStatus?: string) {
    if (!selected) return;
    setSaving(true);
    setSaveMsg("");
    const payload = {
      title: selected.title,
      meta_title: selected.meta_title,
      meta_description: selected.meta_description,
      excerpt: selected.excerpt,
      difficulty: selected.difficulty,
      review_notes: selected.review_notes,
      status: newStatus ?? selected.status,
      last_verified_at: newStatus === "published" ? new Date().toISOString() : selected.last_verified_at,
    };
    const res = await fetch(`/api/admin/guides/${selected.slug}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (data.success) {
      setSaveMsg(newStatus === "published" ? "✅ Published!" : newStatus === "draft" ? "↩️ Reverted to draft" : "✅ Saved");
      setGuides(prev => prev.map(g => g.slug === selected.slug ? { ...g, ...payload } : g));
      setSelected(prev => prev ? { ...prev, ...payload } : null);
    } else {
      setSaveMsg("❌ Save failed");
    }
    setSaving(false);
  }

  async function saveContent() {
    if (!selected) return;
    setSaving(true);
    setSaveMsg("");
    const content = {
      intro: cIntro,
      who_this_is_for: cWho,
      sections: cSections,
      tips: cTips.filter(t => t.trim()),
      faqs: cFaqs.filter(f => f.q.trim()),
    };
    const res = await fetch(`/api/admin/guides/${selected.slug}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });
    const data = await res.json();
    if (data.success) {
      setSaveMsg("✅ Content saved");
      setGuides(prev => prev.map(g => g.slug === selected.slug ? { ...g, content } : g));
      setSelected(prev => prev ? { ...prev, content } : null);
    } else {
      setSaveMsg("❌ Save failed");
    }
    setSaving(false);
  }

  if (!isLoaded) return null;
  if (!isAdmin) return <div style={{ padding: 40, color: "#fff" }}>Access denied.</div>;

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "32px 24px 80px", color: "#fff", fontFamily: "var(--font-body)" }}>
      <div style={{ marginBottom: 32 }}>
        <a href="/admin" style={{ fontSize: 13, color: "var(--text-dim)", textDecoration: "none" }}>← Admin</a>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 28, margin: "8px 0 4px" }}>📖 Game Guides</h1>
        <p style={{ fontSize: 14, color: "var(--text-muted)", fontWeight: 600, margin: 0 }}>Review drafts, edit content, and publish guides.</p>
      </div>

      {loading ? (
        <p style={{ color: "var(--text-dim)", fontWeight: 600 }}>Loading guides...</p>
      ) : guides.length === 0 ? (
        <p style={{ color: "var(--text-dim)", fontWeight: 600 }}>No guides found. Run the generation script first.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {guides.map(guide => (
            <div key={guide.slug} style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 11, fontWeight: 800, padding: "2px 10px", borderRadius: 100, background: `${STATUS_COLORS[guide.status] || "#fff"}20`, color: STATUS_COLORS[guide.status] || "#fff", border: `1px solid ${STATUS_COLORS[guide.status] || "#fff"}40`, textTransform: "uppercase" as const }}>
                    {guide.status}
                  </span>
                  <span style={{ fontSize: 12, color: "var(--text-dim)", fontWeight: 600 }}>{guide.game_name} · {guide.difficulty}</span>
                  {guide.word_count && <span style={{ fontSize: 12, color: "var(--text-dim)", fontWeight: 600 }}>~{guide.word_count} words</span>}
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 4 }}>{guide.title}</div>
                <div style={{ fontSize: 12, color: "var(--text-dim)", fontWeight: 600 }}>/{guide.slug}</div>
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <a href={`/guides/${guide.slug}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, fontWeight: 700, padding: "7px 14px", borderRadius: 100, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "var(--text-muted)", textDecoration: "none" }}>👁 Preview</a>
                <button onClick={() => openEdit(guide)} style={{ fontSize: 12, fontWeight: 700, padding: "7px 14px", borderRadius: 100, background: "rgba(0,180,216,0.1)", border: "1px solid rgba(0,180,216,0.3)", color: "#00b4d8", cursor: "pointer", fontFamily: "inherit" }}>✏️ Edit</button>
                {guide.status === "draft" ? (
                  <button onClick={async () => { const g = guide; setSelected(g); setTimeout(async () => { await saveMeta("published"); setSelected(null); }, 10); }} style={{ fontSize: 12, fontWeight: 800, padding: "7px 14px", borderRadius: 100, background: "rgba(0,245,160,0.15)", border: "1px solid rgba(0,245,160,0.4)", color: "#00f5a0", cursor: "pointer", fontFamily: "inherit" }}>🚀 Publish</button>
                ) : (
                  <button onClick={async () => { const g = guide; setSelected(g); setTimeout(async () => { await saveMeta("draft"); setSelected(null); }, 10); }} style={{ fontSize: 12, fontWeight: 700, padding: "7px 14px", borderRadius: 100, background: "rgba(255,227,71,0.1)", border: "1px solid rgba(255,227,71,0.3)", color: "#ffd700", cursor: "pointer", fontFamily: "inherit" }}>↩️ Unpublish</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit modal */}
      {selected && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 1000, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "32px 16px", overflowY: "auto" }}>
          <div style={{ background: "#0d1117", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, width: "100%", maxWidth: 800, padding: "32px" }}>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: 20, margin: 0 }}>Edit Guide</h2>
              <button onClick={closeEdit} style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: 20, cursor: "pointer" }}>✕</button>
            </div>
            <div style={{ fontSize: 13, color: "var(--text-dim)", fontWeight: 600, marginBottom: 24 }}>{selected.game_name} · {selected.slug}</div>

            {/* Tab switcher */}
            <div style={{ display: "flex", gap: 8, marginBottom: 28 }}>
              {(["meta", "content"] as EditTab[]).map(t => (
                <button key={t} onClick={() => setEditTab(t)} style={{ padding: "8px 20px", borderRadius: 100, border: "none", cursor: "pointer", fontFamily: "inherit", fontWeight: 800, fontSize: 13, background: editTab === t ? "linear-gradient(135deg,#00f5a0,#b84cff)" : "rgba(255,255,255,0.06)", color: editTab === t ? "#0a0a14" : "var(--text-muted)", WebkitTextFillColor: editTab === t ? "#0a0a14" : "var(--text-muted)" }}>
                  {t === "meta" ? "📋 Metadata" : "✏️ Content"}
                </button>
              ))}
            </div>

            {/* META TAB */}
            {editTab === "meta" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div>
                  <label style={lbl}>Title</label>
                  <input value={selected.title} onChange={e => setSelected(s => s ? { ...s, title: e.target.value } : s)} style={inp} />
                </div>
                <div>
                  <label style={lbl}>Difficulty</label>
                  <select value={selected.difficulty} onChange={e => setSelected(s => s ? { ...s, difficulty: e.target.value } : s)} style={{ ...inp, cursor: "pointer" }}>
                    <option>Beginner</option><option>Intermediate</option><option>Advanced</option>
                  </select>
                </div>
                <div>
                  <label style={lbl}>Excerpt</label>
                  <textarea value={selected.excerpt || ""} onChange={e => setSelected(s => s ? { ...s, excerpt: e.target.value } : s)} rows={3} style={ta} />
                </div>
                <div>
                  <label style={lbl}>Meta Title</label>
                  <input value={selected.meta_title || ""} onChange={e => setSelected(s => s ? { ...s, meta_title: e.target.value } : s)} style={inp} />
                </div>
                <div>
                  <label style={lbl}>Meta Description</label>
                  <textarea value={selected.meta_description || ""} onChange={e => setSelected(s => s ? { ...s, meta_description: e.target.value } : s)} rows={2} style={ta} />
                </div>
                <div>
                  <label style={lbl}>Review Notes (internal)</label>
                  <textarea value={selected.review_notes || ""} onChange={e => setSelected(s => s ? { ...s, review_notes: e.target.value } : s)} rows={2} placeholder="e.g. Fact-checked April 2026" style={ta} />
                </div>
                {selected.source_notes && (
                  <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 8, padding: "12px 14px" }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "var(--text-dim)", display: "block", marginBottom: 4 }}>Source Notes</span>
                    <span style={{ fontSize: 12, color: "var(--text-dim)", fontWeight: 600 }}>{selected.source_notes}</span>
                  </div>
                )}
              </div>
            )}

            {/* CONTENT TAB */}
            {editTab === "content" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>

                <div>
                  <label style={{ ...lbl, color: "#00b4d8" }}>Intro</label>
                  <textarea value={cIntro} onChange={e => setCIntro(e.target.value)} rows={6} style={ta} placeholder="3 paragraphs introducing the game and what this guide covers..." />
                </div>

                <div>
                  <label style={{ ...lbl, color: "#00b4d8" }}>Who This Guide Is For</label>
                  <textarea value={cWho} onChange={e => setCWho(e.target.value)} rows={2} style={ta} placeholder="2 sentences describing who benefits most..." />
                </div>

                {/* Sections */}
                <div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                    <label style={{ ...lbl, color: "#00b4d8", margin: 0 }}>Sections ({cSections.length})</label>
                    <button onClick={() => setCsections(s => [...s, { heading: "", body: "" }])} style={{ fontSize: 12, fontWeight: 700, padding: "5px 14px", borderRadius: 100, background: "rgba(0,180,216,0.1)", border: "1px solid rgba(0,180,216,0.3)", color: "#00b4d8", cursor: "pointer", fontFamily: "inherit" }}>+ Add Section</button>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {cSections.map((section, i) => (
                      <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: 16 }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                          <span style={{ fontSize: 11, fontWeight: 800, color: "#b84cff", textTransform: "uppercase" as const }}>Section {i + 1}</span>
                          <button onClick={() => setCsections(s => s.filter((_, idx) => idx !== i))} style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 100, background: "rgba(255,60,172,0.1)", border: "none", color: "#ff3cac", cursor: "pointer", fontFamily: "inherit" }}>Remove</button>
                        </div>
                        <div style={{ marginBottom: 10 }}>
                          <label style={lbl}>Heading</label>
                          <input value={section.heading} onChange={e => setCsections(s => s.map((sec, idx) => idx === i ? { ...sec, heading: e.target.value } : sec))} style={inp} placeholder="e.g. Getting Started" />
                        </div>
                        <div>
                          <label style={lbl}>Body ({section.body.split(/\s+/).filter(Boolean).length} words)</label>
                          <textarea value={section.body} onChange={e => setCsections(s => s.map((sec, idx) => idx === i ? { ...sec, body: e.target.value } : sec))} rows={8} style={ta} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tips */}
                <div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                    <label style={{ ...lbl, color: "#00b4d8", margin: 0 }}>Pro Tips ({cTips.length})</label>
                    <button onClick={() => setCTips(t => [...t, ""])} style={{ fontSize: 12, fontWeight: 700, padding: "5px 14px", borderRadius: 100, background: "rgba(0,245,160,0.1)", border: "1px solid rgba(0,245,160,0.3)", color: "#00f5a0", cursor: "pointer", fontFamily: "inherit" }}>+ Add Tip</button>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {cTips.map((tip, i) => (
                      <div key={i} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <span style={{ color: "#00f5a0", fontWeight: 900, fontSize: 14, flexShrink: 0 }}>✓</span>
                        <input value={tip} onChange={e => setCTips(t => t.map((v, idx) => idx === i ? e.target.value : v))} style={{ ...inp, flex: 1 }} placeholder={`Tip ${i + 1}...`} />
                        <button onClick={() => setCTips(t => t.filter((_, idx) => idx !== i))} style={{ fontSize: 11, fontWeight: 700, padding: "6px 10px", borderRadius: 100, background: "rgba(255,60,172,0.1)", border: "none", color: "#ff3cac", cursor: "pointer", fontFamily: "inherit", flexShrink: 0 }}>✕</button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* FAQs */}
                <div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                    <label style={{ ...lbl, color: "#00b4d8", margin: 0 }}>FAQs ({cFaqs.length})</label>
                    <button onClick={() => setCFaqs(f => [...f, { q: "", a: "" }])} style={{ fontSize: 12, fontWeight: 700, padding: "5px 14px", borderRadius: 100, background: "rgba(0,180,216,0.1)", border: "1px solid rgba(0,180,216,0.3)", color: "#00b4d8", cursor: "pointer", fontFamily: "inherit" }}>+ Add FAQ</button>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    {cFaqs.map((faq, i) => (
                      <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: 14 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                          <span style={{ fontSize: 11, fontWeight: 800, color: "#00b4d8", textTransform: "uppercase" as const }}>FAQ {i + 1}</span>
                          <button onClick={() => setCFaqs(f => f.filter((_, idx) => idx !== i))} style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 100, background: "rgba(255,60,172,0.1)", border: "none", color: "#ff3cac", cursor: "pointer", fontFamily: "inherit" }}>Remove</button>
                        </div>
                        <div style={{ marginBottom: 8 }}>
                          <label style={lbl}>Question</label>
                          <input value={faq.q} onChange={e => setCFaqs(f => f.map((v, idx) => idx === i ? { ...v, q: e.target.value } : v))} style={inp} placeholder="e.g. How do I level up fast?" />
                        </div>
                        <div>
                          <label style={lbl}>Answer</label>
                          <textarea value={faq.a} onChange={e => setCFaqs(f => f.map((v, idx) => idx === i ? { ...v, a: e.target.value } : v))} rows={3} style={ta} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* Actions */}
            <div style={{ display: "flex", gap: 10, marginTop: 28, flexWrap: "wrap", alignItems: "center" }}>
              {editTab === "meta" ? (
                <>
                  <button onClick={() => saveMeta()} disabled={saving} style={{ fontSize: 13, fontWeight: 800, padding: "10px 24px", borderRadius: 100, background: "rgba(0,180,216,0.15)", border: "1px solid rgba(0,180,216,0.4)", color: "#00b4d8", cursor: "pointer", fontFamily: "inherit", opacity: saving ? 0.6 : 1 }}>
                    {saving ? "Saving..." : "💾 Save Metadata"}
                  </button>
                  {selected.status === "draft" ? (
                    <button onClick={() => saveMeta("published")} disabled={saving} style={{ fontSize: 13, fontWeight: 800, padding: "10px 24px", borderRadius: 100, background: "rgba(0,245,160,0.15)", border: "1px solid rgba(0,245,160,0.4)", color: "#00f5a0", cursor: "pointer", fontFamily: "inherit", opacity: saving ? 0.6 : 1 }}>
                      🚀 Save & Publish
                    </button>
                  ) : (
                    <button onClick={() => saveMeta("draft")} disabled={saving} style={{ fontSize: 13, fontWeight: 700, padding: "10px 24px", borderRadius: 100, background: "rgba(255,227,71,0.1)", border: "1px solid rgba(255,227,71,0.3)", color: "#ffd700", cursor: "pointer", fontFamily: "inherit", opacity: saving ? 0.6 : 1 }}>
                      ↩️ Unpublish
                    </button>
                  )}
                </>
              ) : (
                <button onClick={saveContent} disabled={saving} style={{ fontSize: 13, fontWeight: 800, padding: "10px 24px", borderRadius: 100, background: "rgba(0,245,160,0.15)", border: "1px solid rgba(0,245,160,0.4)", color: "#00f5a0", cursor: "pointer", fontFamily: "inherit", opacity: saving ? 0.6 : 1 }}>
                  {saving ? "Saving..." : "💾 Save Content"}
                </button>
              )}
              <a href={`/guides/${selected.slug}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, fontWeight: 700, padding: "10px 20px", borderRadius: 100, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "var(--text-muted)", textDecoration: "none" }}>👁 Preview</a>
              {saveMsg && <span style={{ fontSize: 13, fontWeight: 700, color: saveMsg.startsWith("✅") ? "#00f5a0" : saveMsg.startsWith("↩️") ? "#ffd700" : "#ff3cac" }}>{saveMsg}</span>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}