import { NextResponse } from "next/server";

const placeIds = [
  { game: "Dress to Impress", placeId: 15101393044 },
  { game: "Grow a Garden", placeId: 126884695634066 },
];

export async function GET() {
  const results: Record<string, number | string> = {};

  for (const { game, placeId } of placeIds) {
    try {
      const res = await fetch(
        `https://apis.roblox.com/universes/v1/places/${placeId}/universe`
      );
      const data = await res.json();
      results[game] = data.universeId;
    } catch (e) {
      results[game] = "error";
    }
  }

  return NextResponse.json(results);
}