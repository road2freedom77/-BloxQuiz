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

export default function AdminGuidesClient() {
  const { user, isLoaded } = useUser();
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Guide | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [expandedContent, setExpandedContent] = useState(false);

  const isAdmin = ADMIN_USER_IDS.includes(user?.id || "");

  useEffect(() => {
    if (!isLoaded || !isAdmin) return;
    fetch("/api/admin/guides")
      .then(r => r.json())
      .then(data => { setGuides(data.guides ?? []); setLoading(false); });
  }, [isLoaded, isAdmin]);

  function openEdit(guide: Guide) {
    setSelected({ ...guide });
    setExpandedContent(false);
    setSaveMsg("");
  }

  function closeEdit() {
    setSelected(null);
    setSaveMsg("");
  }

  async function save(newStatus?: string) {
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

  if (!isLoaded) return null;
  if (!isAdmin) return <div style={{ padding: 40, color: "#fff" }}>Access denied.</div>;

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "32px 24px 80px", color: "#fff", fontFamily: "var(--font-body)" }}>
      <div style={{ marginBottom: 32 }}>
        <a href="/admin" style={{ fontSize: 13, color: "var(--text-dim)", textDecoration: "none" }}>← Admin</a>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 28, margin: "8px 0 4px" }}>📖 Game Guides</h1>
        <p style={{ fontSize: 14, color: "var(--text-muted)", fontWeight: 600, margin: 0 }}>
          Review drafts, edit content, and publish guides.
        </p>
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
                  <span style={{ fontSize: 11, fontWeight: 800, padding: "2px 10px", borderRadius: 100, background: `${STATUS_COLORS[guide.status] || "#fff"}20`, color: STATUS_COLORS[guide.status] || "#fff", border: `1px solid ${STATUS_COLORS[guide.status] || "#fff"}40`, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    {guide.status}
                  </span>
                  <span style={{ fontSize: 12, color: "var(--text-dim)", fontWeight: 600 }}>{guide.game_name} · {guide.difficulty}</span>
                  {guide.word_count && <span style={{ fontSize: 12, color: "var(--text-dim)", fontWeight: 600 }}>~{guide.word_count} words</span>}
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 4 }}>{guide.title}</div>
                <div style={{ fontSize: 12, color: "var(--text-dim)", fontWeight: 600 }}>/{guide.slug}</div>
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {/* Preview in new tab — works for published; for drafts open edit first then use preview button */}
                <a
                  href={`/guides/${guide.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: 12, fontWeight: 700, padding: "7px 14px", borderRadius: 100, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "var(--text-muted)", textDecoration: "none" }}
                >
                  👁 Preview
                </a>
                <button
                  onClick={() => openEdit(guide)}
                  style={{ fontSize: 12, fontWeight: 700, padding: "7px 14px", borderRadius: 100, background: "rgba(0,180,216,0.1)", border: "1px solid rgba(0,180,216,0.3)", color: "#00b4d8", cursor: "pointer", fontFamily: "inherit" }}
                >
                  ✏️ Edit
                </button>
                {guide.status === "draft" ? (
                  <button
                    onClick={async () => { setSelected(guide); await save("published"); setSelected(null); }}
                    style={{ fontSize: 12, fontWeight: 800, padding: "7px 14px", borderRadius: 100, background: "rgba(0,245,160,0.15)", border: "1px solid rgba(0,245,160,0.4)", color: "#00f5a0", cursor: "pointer", fontFamily: "inherit" }}
                  >
                    🚀 Publish
                  </button>
                ) : (
                  <button
                    onClick={async () => { setSelected(guide); await save("draft"); setSelected(null); }}
                    style={{ fontSize: 12, fontWeight: 700, padding: "7px 14px", borderRadius: 100, background: "rgba(255,227,71,0.1)", border: "1px solid rgba(255,227,71,0.3)", color: "#ffd700", cursor: "pointer", fontFamily: "inherit" }}
                  >
                    ↩️ Unpublish
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit modal */}
      {selected && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 1000, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "40px 24px", overflowY: "auto" }}>
          <div style={{ background: "#0d1117", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, width: "100%", maxWidth: 720, padding: "32px" }}>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: 20, margin: 0 }}>Edit Guide</h2>
              <button onClick={closeEdit} style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: 20, cursor: "pointer" }}>✕</button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

              {/* Status badge */}
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <span style={{ fontSize: 11, fontWeight: 800, padding: "3px 12px", borderRadius: 100, background: `${STATUS_COLORS[selected.status] || "#fff"}20`, color: STATUS_COLORS[selected.status] || "#fff", border: `1px solid ${STATUS_COLORS[selected.status] || "#fff"}40`, textTransform: "uppercase" }}>
                  {selected.status}
                </span>
                <span style={{ fontSize: 12, color: "var(--text-dim)", fontWeight: 600 }}>{selected.game_name} · {selected.slug}</span>
              </div>

              {/* Title */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>Title</label>
                <input
                  value={selected.title}
                  onChange={e => setSelected(s => s ? { ...s, title: e.target.value } : s)}
                  style={{ width: "100%", background: "#1a1f35", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "10px 14px", color: "#fff", fontSize: 14, fontFamily: "inherit", boxSizing: "border-box" }}
                />
              </div>

              {/* Difficulty */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>Difficulty</label>
                <select
                  value={selected.difficulty}
                  onChange={e => setSelected(s => s ? { ...s, difficulty: e.target.value } : s)}
                  style={{ background: "#1a1f35", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "10px 14px", color: "#fff", fontSize: 14, fontFamily: "inherit" }}
                >
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
              </div>

              {/* Excerpt */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>Excerpt (shown on hub + homepage)</label>
                <textarea
                  value={selected.excerpt || ""}
                  onChange={e => setSelected(s => s ? { ...s, excerpt: e.target.value } : s)}
                  rows={3}
                  style={{ width: "100%", background: "#1a1f35", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "10px 14px", color: "#fff", fontSize: 14, fontFamily: "inherit", resize: "vertical", boxSizing: "border-box" }}
                />
              </div>

              {/* Meta title */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>Meta Title</label>
                <input
                  value={selected.meta_title || ""}
                  onChange={e => setSelected(s => s ? { ...s, meta_title: e.target.value } : s)}
                  style={{ width: "100%", background: "#1a1f35", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "10px 14px", color: "#fff", fontSize: 14, fontFamily: "inherit", boxSizing: "border-box" }}
                />
              </div>

              {/* Meta description */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>Meta Description</label>
                <textarea
                  value={selected.meta_description || ""}
                  onChange={e => setSelected(s => s ? { ...s, meta_description: e.target.value } : s)}
                  rows={2}
                  style={{ width: "100%", background: "#1a1f35", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "10px 14px", color: "#fff", fontSize: 14, fontFamily: "inherit", resize: "vertical", boxSizing: "border-box" }}
                />
              </div>

              {/* Review notes */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>Review Notes (internal)</label>
                <textarea
                  value={selected.review_notes || ""}
                  onChange={e => setSelected(s => s ? { ...s, review_notes: e.target.value } : s)}
                  rows={2}
                  placeholder="e.g. 'Checked fruit names against wiki — accurate as of April 2026'"
                  style={{ width: "100%", background: "#1a1f35", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "10px 14px", color: "#fff", fontSize: 14, fontFamily: "inherit", resize: "vertical", boxSizing: "border-box" }}
                />
              </div>

              {/* Content preview (read-only, collapsible) */}
              <div>
                <button
                  onClick={() => setExpandedContent(!expandedContent)}
                  style={{ background: "none", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "8px 14px", color: "var(--text-muted)", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}
                >
                  {expandedContent ? "▲ Hide Content JSON" : "▾ View Content JSON (read-only)"}
                </button>
                {expandedContent && (
                  <pre style={{ marginTop: 12, background: "#0a0a14", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 8, padding: "16px", fontSize: 11, color: "rgba(255,255,255,0.5)", overflowX: "auto", maxHeight: 400, overflowY: "auto" }}>
                    {JSON.stringify(selected.content, null, 2)}
                  </pre>
                )}
                <p style={{ fontSize: 11, color: "var(--text-dim)", fontWeight: 600, margin: "8px 0 0" }}>
                  To edit section content, update the JSON directly in Supabase → game_guides → content column.
                </p>
              </div>

              {/* Source notes (read-only) */}
              {selected.source_notes && (
                <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 8, padding: "12px 14px" }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "var(--text-dim)", display: "block", marginBottom: 4 }}>Source Notes</span>
                  <span style={{ fontSize: 12, color: "var(--text-dim)", fontWeight: 600 }}>{selected.source_notes}</span>
                </div>
              )}

            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: 10, marginTop: 28, flexWrap: "wrap", alignItems: "center" }}>
              <button
                onClick={() => save()}
                disabled={saving}
                style={{ fontSize: 13, fontWeight: 800, padding: "10px 24px", borderRadius: 100, background: "rgba(0,180,216,0.15)", border: "1px solid rgba(0,180,216,0.4)", color: "#00b4d8", cursor: "pointer", fontFamily: "inherit", opacity: saving ? 0.6 : 1 }}
              >
                {saving ? "Saving..." : "💾 Save Changes"}
              </button>

              {selected.status === "draft" ? (
                <button
                  onClick={() => save("published")}
                  disabled={saving}
                  style={{ fontSize: 13, fontWeight: 800, padding: "10px 24px", borderRadius: 100, background: "rgba(0,245,160,0.15)", border: "1px solid rgba(0,245,160,0.4)", color: "#00f5a0", cursor: "pointer", fontFamily: "inherit", opacity: saving ? 0.6 : 1 }}
                >
                  🚀 Save & Publish
                </button>
              ) : (
                <button
                  onClick={() => save("draft")}
                  disabled={saving}
                  style={{ fontSize: 13, fontWeight: 700, padding: "10px 24px", borderRadius: 100, background: "rgba(255,227,71,0.1)", border: "1px solid rgba(255,227,71,0.3)", color: "#ffd700", cursor: "pointer", fontFamily: "inherit", opacity: saving ? 0.6 : 1 }}
                >
                  ↩️ Unpublish
                </button>
              )}

              <a
                href={`/guides/${selected.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: 13, fontWeight: 700, padding: "10px 20px", borderRadius: 100, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "var(--text-muted)", textDecoration: "none" }}
              >
                👁 Preview Page
              </a>

              {saveMsg && <span style={{ fontSize: 13, fontWeight: 700, color: saveMsg.startsWith("✅") ? "#00f5a0" : saveMsg.startsWith("↩️") ? "#ffd700" : "#ff3cac" }}>{saveMsg}</span>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}