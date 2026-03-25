import { notFound } from "next/navigation";
import { supabaseAdmin as supabase } from "../../lib/supabase";
import StatsClient from "./StatsClient";
import GameCrossLinks from "../../components/GameCrossLinks";

export const revalidate = 3600;
export const dynamicParams = true;

export interface GameRow {
  universe_id: number;
  place_id: number | null;
  slug: string;
  name: string;
  emoji: string | null;
  genre: string | null;
  thumbnail_url: string | null;
  current_players: number | null;
  total_visits: number | null;
  favorites: number | null;
  likes: number | null;
  dislikes: number | null;
  last_updated: string | null;
  intro: string | null;
  faqs: { q: string; a: string }[] | null;
  meta_title: string | null;
  meta_description: string | null;
}

export interface SnapshotRow {
  captured_at: string;
  concurrent_players: number;
  total_visits: number;
}

export interface DailyStatRow {
  date: string;
  avg_players: number;
  peak_players: number;
  min_players: number;
  total_visits_delta: number;
}

async function getGame(slug: string): Promise<GameRow | null> {
  const { data, error } = await supabase
    .from("roblox_games")
    .select("universe_id, place_id, slug, name, emoji, genre, thumbnail_url, current_players, total_visits, favorites, likes, dislikes, last_updated, intro, faqs, meta_title, meta_description")
    .eq("slug", slug)
    .eq("is_tracked", true)
    .single();
  if (error || !data) return null;
  return data as GameRow;
}

async function getRecentSnapshots(universeId: number): Promise<SnapshotRow[]> {
  const { data } = await supabase
    .from("game_snapshots")
    .select("captured_at, concurrent_players, total_visits")
    .eq("universe_id", universeId)
    .order("captured_at", { ascending: false })
    .limit(48);
  return (data as SnapshotRow[]) ?? [];
}

async function getDailyStats(universeId: number): Promise<DailyStatRow[]> {
  const { data } = await supabase
    .from("game_daily_stats")
    .select("date, avg_players, peak_players, min_players, total_visits_delta")
    .eq("universe_id", universeId)
    .order("date", { ascending: false })
    .limit(30);
  return (data as DailyStatRow[]) ?? [];
}

async function getAllSlugs(): Promise<string[]> {
  const { data } = await supabase.from("roblox_games").select("slug").eq("is_tracked", true);
  return (data ?? []).map((g: { slug: string }) => g.slug);
}

async function getPlayerRank(universeId: number, currentPlayers: number | null): Promise<number | null> {
  if (!currentPlayers) return null;
  const { count } = await supabase
    .from("roblox_games")
    .select("universe_id", { count: "exact", head: true })
    .gt("current_players", currentPlayers)
    .eq("is_tracked", true);
  return count != null ? count + 1 : null;
}

async function getQuizCount(gameName: string): Promise<number> {
  const { count } = await supabase
    .from("quizzes")
    .select("id", { count: "exact", head: true })
    .eq("game", gameName)
    .eq("status", "published");
  return count ?? 0;
}

async function getCompareGames(currentSlug: string): Promise<{ slug: string; name: string; emoji: string | null; current_players: number | null }[]> {
  const { data } = await supabase
    .from("roblox_games")
    .select("slug, name, emoji, current_players")
    .eq("is_tracked", true)
    .neq("slug", currentSlug)
    .order("current_players", { ascending: false, nullsFirst: false })
    .limit(6);
  return (data ?? []) as { slug: string; name: string; emoji: string | null; current_players: number | null }[];
}

async function hasCodes(slug: string): Promise<boolean> {
  const { count } = await supabase
    .from("code_games")
    .select("slug", { count: "exact", head: true })
    .eq("slug", slug);
  return (count ?? 0) > 0;
}

export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

function formatNumber(n: number | null): string {
  if (!n) return "N/A";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return n.toLocaleString();
}

function formatVisits(n: number | null): string {
  if (!n) return "N/A";
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  return n.toLocaleString();
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const game = await getGame(slug);
  if (!game) return {};

  const month = new Date().toLocaleString("en-US", { month: "long", year: "numeric" });
  const title = game.meta_title || `${game.name} Player Count — ${formatNumber(game.current_players)} Playing Now (${month}) | BloxQuiz`;
  const description = game.meta_description || `${game.name} has ${formatNumber(game.current_players)} active players right now and ${formatVisits(game.total_visits)} total visits. Live player count, historical charts, and ranking vs other Roblox games. Updated hourly.`;

  return {
    title,
    description,
    alternates: { canonical: `https://www.bloxquiz.gg/stats/${slug}` },
    openGraph: {
      title,
      description,
      url: `https://www.bloxquiz.gg/stats/${slug}`,
      siteName: "BloxQuiz",
      type: "website",
      ...(game.thumbnail_url ? { images: [{ url: game.thumbnail_url }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(game.thumbnail_url ? { images: [game.thumbnail_url] } : {}),
    },
  };
}

export default async function StatsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const game = await getGame(slug);
  if (!game) notFound();

  const [snapshots, dailyStats, rank, quizCount, compareGames, codesExist] = await Promise.all([
    getRecentSnapshots(game.universe_id),
    getDailyStats(game.universe_id),
    getPlayerRank(game.universe_id, game.current_players),
    getQuizCount(game.name),
    getCompareGames(slug),
    hasCodes(slug),
  ]);

  const month = new Date().toLocaleString("en-US", { month: "long", year: "numeric" });
  const approvalRate = game.likes && game.dislikes && game.likes + game.dislikes > 0
    ? ((game.likes / (game.likes + game.dislikes)) * 100).toFixed(1)
    : null;
  const peak24h = snapshots.length ? Math.max(...snapshots.map((s) => s.concurrent_players)) : null;

  const statsStaticFaqs = [
    {
      q: `How many people play ${game.name} right now?`,
      a: `${game.name} currently has ${formatNumber(game.current_players)} concurrent players. This count is updated hourly via the Roblox API.`,
    },
    {
      q: `How many total visits does ${game.name} have?`,
      a: `${game.name} has ${formatVisits(game.total_visits)} total all-time visits, reflecting its popularity since launch.`,
    },
    {
      q: `How often is the ${game.name} player count updated on BloxQuiz?`,
      a: `Player counts are fetched every hour via the Roblox API, so the data on this page is never more than 60 minutes old.`,
    },
  ];

  const staticQuestions = new Set(statsStaticFaqs.map((f) => f.q.toLowerCase().trim()));
  const dbFaqs = (game.faqs ?? [])
    .map((f) => ({ q: f.q, a: f.a }))
    .filter((f) => !staticQuestions.has(f.q.toLowerCase().trim()));

  const allFaqs = [...statsStaticFaqs, ...dbFaqs];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://www.bloxquiz.gg" },
          { "@type": "ListItem", position: 2, name: "Stats", item: "https://www.bloxquiz.gg/stats" },
          { "@type": "ListItem", position: 3, name: `${game.name} Stats`, item: `https://www.bloxquiz.gg/stats/${slug}` },
        ],
      },
      {
        "@type": "Article",
        headline: `${game.name} Player Count & Live Stats — ${month}`,
        dateModified: game.last_updated ?? new Date().toISOString(),
        author: { "@type": "Organization", name: "BloxQuiz" },
        publisher: { "@type": "Organization", name: "BloxQuiz" },
        description: `Live ${game.name} player count, historical trends, and ranking vs other Roblox games.`,
        mainEntityOfPage: `https://www.bloxquiz.gg/stats/${slug}`,
      },
      {
        "@type": "FAQPage",
        mainEntity: allFaqs.map((faq) => ({
          "@type": "Question",
          name: faq.q,
          acceptedAnswer: { "@type": "Answer", text: faq.a },
        })),
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px 0" }}>
        <GameCrossLinks
          slug={slug}
          gameName={game.name}
          hasQuizzes={quizCount > 0}
          hasCodes={codesExist}
          hasStats={true}
          activeTab="stats"
        />
      </div>
      <StatsClient
        game={game}
        snapshots={snapshots}
        dailyStats={dailyStats}
        rank={rank}
        approvalRate={approvalRate}
        peak24h={peak24h}
        slug={slug}
        quizCount={quizCount}
        compareGames={compareGames}
      />
    </>
  );
}