import { notFound } from "next/navigation";
import { codesData } from "../../data/codes";
import CodesClient from "./CodesClient";

export async function generateMetadata({ params }: { params: Promise<{ game: string }> }) {
  const { game } = await params;
  const data = codesData[game];
  if (!data) return { title: "Not Found" };
  return {
    title: `${data.game} Codes 2026 — All Active Codes | BloxQuiz`,
    description: `All active ${data.game} codes for 2026. Updated ${data.updatedAt}.`,
    alternates: { canonical: `https://www.bloxquiz.gg/codes/${game}` }
  };
}

export default async function CodesPage({ params }: { params: Promise<{ game: string }> }) {
  const { game } = await params;
  const data = codesData[game];
  if (!data) notFound();
  return <CodesClient data={data} game={game} />;
}