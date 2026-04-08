import { notFound } from "next/navigation";
import { supabaseAdmin } from "../../lib/supabase";
import RobuxCTA from "../../components/RobuxCTA";

export const dynamic = "force-dynamic";

async function getGuide(slug: string) {
  const { data } = await supabaseAdmin
    .from("game_guides")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();
  return data;
}

async function getRelatedGuides(currentSlug: string) {
  const { data } = await supabaseAdmin
    .from("game_guides")
    .select("slug, title, game_name, difficulty")
    .eq("status", "published")
    .neq("slug", currentSlug)
    .limit(3);
  return data ?? [];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = await getGuide(slug);
  if (!guide) return { title: "Guide Not Found | BloxQuiz" };
  return {
    title: guide.meta_title || `${guide.title} | BloxQuiz`,
    description: guide.meta_description || guide.excerpt,
    alternates: { canonical: `https://www.bloxquiz.gg/guides/${slug}` },
    openGraph: {
      title: guide.meta_title || guide.title,
      description: guide.meta_description || guide.excerpt,
      url: `https://www.bloxquiz.gg/guides/${slug}`,
      siteName: "BloxQuiz",
      type: "article",
    },
  };
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = await getGuide(slug);
  if (!guide) notFound();

  const relatedGuides = await getRelatedGuides(slug);
  const content = guide.content as any;
  const gameSlug = guide.game_slug;

  const lastVerified = guide.last_verified_at
    ? new Date(guide.last_verified_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    : new Date(guide.updated_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  const diffColor: Record<string, string> = {
    Beginner: "#00f5a0",
    Intermediate: "#ffd700",
    Advanced: "#ff3cac",
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://www.bloxquiz.gg" },
          { "@type": "ListItem", position: 2, name: "Guides", item: "https://www.bloxquiz.gg/guides" },
          { "@type": "ListItem", position: 3, name: guide.title, item: `https://www.bloxquiz.gg/guides/${slug}` },
        ],
      },
      {
        "@type": "Article",
        headline: guide.title,
        description: guide.excerpt,
        url: `https://www.bloxquiz.gg/guides/${slug}`,
        dateModified: guide.updated_at,
        publisher: { "@type": "Organization", name: "BloxQuiz", url: "https://www.bloxquiz.gg" },
        author: { "@type": "Organization", name: "BloxQuiz Editorial Team" },
      },
      ...(content.faqs?.length > 0 ? [{
        "@type": "FAQPage",
        mainEntity: content.faqs.map((faq: any) => ({
          "@type": "Question",
          name: faq.q,
          acceptedAnswer: { "@type": "Answer", text: faq.a },
        })),
      }] : []),
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "32px 24px 80px" }}>

        {/* Breadcrumb */}
        <nav style={{ fontSize: 13, color: "var(--text-dim)", fontWeight: 600, marginBottom: 24, display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
          <a href="/" style={{ color: "var(--text-dim)", textDecoration: "none" }}>Home</a>
          <span>›</span>
          <a href="/guides" style={{ color: "var(--text-dim)", textDecoration: "none" }}>Guides</a>
          <span>›</span>
          <span style={{ color: "var(--text-muted)" }}>{guide.game_name}</span>
        </nav>

        {/* Title */}
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(24px, 4vw, 36px)", marginBottom: 16, lineHeight: 1.2 }}>
          {guide.title}
        </h1>

        {/* Badges */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
          <span style={{ fontSize: 12, fontWeight: 800, padding: "4px 12px", borderRadius: 100, background: `${diffColor[guide.difficulty] || "#fff"}20`, color: diffColor[guide.difficulty] || "#fff", border: `1px solid ${diffColor[guide.difficulty] || "#fff"}40` }}>
            {guide.difficulty}
          </span>
          <span style={{ fontSize: 12, fontWeight: 700, padding: "4px 12px", borderRadius: 100, background: "rgba(255,255,255,0.06)", color: "var(--text-muted)" }}>
            🎮 {guide.game_name}
          </span>
          {guide.word_count && (
            <span style={{ fontSize: 12, fontWeight: 700, padding: "4px 12px", borderRadius: 100, background: "rgba(255,255,255,0.06)", color: "var(--text-muted)" }}>
              ~{Math.round(guide.word_count / 100) * 100} words
            </span>
          )}
        </div>

        {/* Trust signals */}
        <div style={{ background: "var(--bg-card, #111827)", border: "1px solid var(--border, rgba(255,255,255,0.07))", borderRadius: 10, padding: "12px 16px", marginBottom: 32, display: "flex", gap: 20, flexWrap: "wrap" }}>
          <span style={{ fontSize: 12, color: "var(--text-dim)", fontWeight: 600 }}>✍️ Reviewed by BloxQuiz Editorial Team</span>
          <span style={{ fontSize: 12, color: "var(--text-dim)", fontWeight: 600 }}>🕐 Last verified: {lastVerified}</span>
          <a href="/editorial" style={{ fontSize: 12, color: "var(--text-dim)", fontWeight: 600, textDecoration: "none" }}>📋 Editorial Standards</a>
        </div>

        {/* Who this is for */}
        {content.who_this_is_for && (
          <div style={{ background: "linear-gradient(135deg, rgba(0,180,216,0.06), rgba(184,76,255,0.04))", border: "1px solid rgba(0,180,216,0.15)", borderRadius: 12, padding: "16px 20px", marginBottom: 32 }}>
            <span style={{ fontSize: 12, fontWeight: 800, color: "#00b4d8", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 6 }}>Who This Guide Is For</span>
            <p style={{ margin: 0, fontSize: 14, color: "rgba(255,255,255,0.7)", fontWeight: 600, lineHeight: 1.6 }}>{content.who_this_is_for}</p>
          </div>
        )}

        {/* Intro */}
        {content.intro && (
          <div style={{ marginBottom: 40 }}>
            {content.intro.split("\n").filter(Boolean).map((para: string, i: number) => (
              <p key={i} style={{ fontSize: 15, color: "var(--text-muted)", fontWeight: 600, lineHeight: 1.8, marginBottom: 16 }}>{para}</p>
            ))}
          </div>
        )}

        {/* Table of contents */}
        {content.sections?.length > 0 && (
          <div style={{ background: "var(--bg-card, #111827)", border: "1px solid var(--border, rgba(255,255,255,0.07))", borderRadius: 12, padding: "20px 24px", marginBottom: 40 }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 16, marginBottom: 14, color: "var(--text)" }}>📋 In This Guide</h2>
            <ol style={{ margin: 0, paddingLeft: 20, display: "flex", flexDirection: "column", gap: 8 }}>
              {content.sections.map((section: any, i: number) => (
                <li key={i} style={{ fontSize: 14, color: "var(--text-muted)", fontWeight: 600 }}>
                  <a href={`#section-${i}`} style={{ color: "#00b4d8", textDecoration: "none" }}>{section.heading}</a>
                </li>
              ))}
              {content.tips?.length > 0 && (
                <li style={{ fontSize: 14, color: "var(--text-muted)", fontWeight: 600 }}>
                  <a href="#pro-tips" style={{ color: "#00b4d8", textDecoration: "none" }}>Pro Tips</a>
                </li>
              )}
              {content.faqs?.length > 0 && (
                <li style={{ fontSize: 14, color: "var(--text-muted)", fontWeight: 600 }}>
                  <a href="#faq" style={{ color: "#00b4d8", textDecoration: "none" }}>Frequently Asked Questions</a>
                </li>
              )}
            </ol>
          </div>
        )}

        {/* Main sections */}
        {content.sections?.map((section: any, i: number) => (
          <div key={i} id={`section-${i}`} style={{ marginBottom: 48 }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 24, marginBottom: 16, color: "var(--text)" }}>
              {section.heading}
            </h2>
            {section.body.split("\n").filter(Boolean).map((para: string, j: number) => (
              <p key={j} style={{ fontSize: 15, color: "var(--text-muted)", fontWeight: 600, lineHeight: 1.8, marginBottom: 16 }}>{para}</p>
            ))}
            {i === 2 && (
              <div style={{ marginTop: 32 }}>
                <RobuxCTA variant="card" game={guide.game_name} />
              </div>
            )}
          </div>
        ))}

        {/* Pro tips */}
        {content.tips?.length > 0 && (
          <div id="pro-tips" style={{ background: "linear-gradient(135deg, rgba(0,245,160,0.06), rgba(184,76,255,0.04))", border: "1px solid rgba(0,245,160,0.2)", borderRadius: 14, padding: "28px 28px", marginBottom: 48 }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, marginBottom: 20, color: "var(--text)" }}>
              💡 Pro Tips for {guide.game_name}
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {content.tips.map((tip: string, i: number) => (
                <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <span style={{ color: "#00f5a0", fontWeight: 900, fontSize: 14, flexShrink: 0, marginTop: 2 }}>✓</span>
                  <p style={{ margin: 0, fontSize: 14, color: "var(--text-muted)", fontWeight: 600, lineHeight: 1.7 }}>{tip}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FAQ */}
        {content.faqs?.length > 0 && (
          <div id="faq" style={{ marginBottom: 48 }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, marginBottom: 20, color: "var(--text)" }}>
              ❓ Frequently Asked Questions
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {content.faqs.map((faq: any, i: number) => (
                <div key={i} style={{ background: "var(--bg-card, #111827)", border: "1px solid var(--border, rgba(255,255,255,0.07))", borderRadius: 12, padding: "18px 20px" }}>
                  <p style={{ margin: "0 0 8px", fontWeight: 800, fontSize: 15, color: "var(--text)" }}>{faq.q}</p>
                  <p style={{ margin: 0, fontSize: 14, lineHeight: 1.7, color: "var(--text-muted)", fontWeight: 600 }}>{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Cross-links */}
        <div style={{ background: "var(--bg-card, #111827)", border: "1px solid var(--border, rgba(255,255,255,0.07))", borderRadius: 14, padding: "24px 28px", marginBottom: 40 }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 18, marginBottom: 16, color: "var(--text)" }}>
            More {guide.game_name} Content on BloxQuiz
          </h2>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <a href={`/games/${gameSlug}`} style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "linear-gradient(135deg, #00f5a0, #b84cff)", color: "#0a0a14", fontWeight: 900, fontSize: 13, padding: "10px 20px", borderRadius: 100, textDecoration: "none" }}>
              🎮 {guide.game_name} Quizzes
            </a>
            <a href={`/codes/${gameSlug}`} style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "var(--text)", fontWeight: 700, fontSize: 13, padding: "10px 20px", borderRadius: 100, textDecoration: "none" }}>
              🎁 {guide.game_name} Codes
            </a>
            <a href={`/stats/${gameSlug}`} style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "var(--text)", fontWeight: 700, fontSize: 13, padding: "10px 20px", borderRadius: 100, textDecoration: "none" }}>
              📊 Live Stats
            </a>
          </div>
        </div>

        {/* Related guides */}
        {relatedGuides.length > 0 && (
          <div style={{ marginBottom: 40 }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 20, marginBottom: 16, color: "var(--text)" }}>
              More Roblox Guides
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {relatedGuides.map((g: any) => (
                <a key={g.slug} href={`/guides/${g.slug}`} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, background: "var(--bg-card, #111827)", border: "1px solid var(--border, rgba(255,255,255,0.07))", borderRadius: 12, padding: "14px 18px", textDecoration: "none", flexWrap: "wrap" }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", marginBottom: 2 }}>{g.title}</div>
                    <div style={{ fontSize: 12, color: "var(--text-dim)", fontWeight: 600 }}>🎮 {g.game_name} · {g.difficulty}</div>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#00b4d8", whiteSpace: "nowrap" }}>Read Guide →</span>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Footer attribution */}
        <p style={{ fontSize: 12, color: "var(--text-dim)", textAlign: "center", fontWeight: 600 }}>
          Written by the BloxQuiz Editorial Team · Last verified {lastVerified} · <a href="/editorial" style={{ color: "var(--text-dim)" }}>Editorial Standards</a>
        </p>
      </div>
    </>
  );
}