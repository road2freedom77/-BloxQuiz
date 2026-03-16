import { NextResponse } from "next/server";

const placeIds = [
  { game: "Brookhaven RP", placeId: 4924922222 },
  { game: "Adopt Me!", placeId: 920587237 },
  { game: "Murder Mystery 2", placeId: 142823291 },
  { game: "Tower of Hell", placeId: 1962086868 },
  { game: "Arsenal", placeId: 286090429 },
  { game: "Doors", placeId: 6516141723 },
  { game: "Royale High", placeId: 735030788 },
  { game: "Bee Swarm Simulator", placeId: 1537690496 },
  { game: "Dress to Impress", placeId: 3959474908 },
  { game: "Anime Defenders", placeId: 8351304158 },
  { game: "Funky Friday", placeId: 6372028262 },
  { game: "Livetopia", placeId: 4249459727 },
  { game: "Berry Avenue", placeId: 6872265039 },
  { game: "Natural Disaster Survival", placeId: 189707 },
  { game: "Kick Off", placeId: 5672779463 },
  { game: "Fisch", placeId: 13822889320 },
  { game: "Grow a Garden", placeId: 126244816498 },
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