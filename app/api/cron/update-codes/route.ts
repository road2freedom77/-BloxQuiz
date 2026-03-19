// app/api/cron/update-codes/route.ts
// Vercel cron: runs daily at 6am UTC
// vercel.json: { "crons": [{ "path": "/api/cron/update-codes", "schedule": "0 6 * * *" }] }

import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

const GAMES_TO_UPDATE = [
  { slug: 'blox-fruits', game: 'Blox Fruits', rocodesSlug: 'blox-fruits' },
  { slug: 'brookhaven-rp', game: 'Brookhaven RP', rocodesSlug: 'brookhaven-rp' },
  { slug: 'adopt-me', game: 'Adopt Me!', rocodesSlug: 'adopt-me' },
  { slug: 'murder-mystery-2', game: 'Murder Mystery 2', rocodesSlug: 'murder-mystery-2' },
  { slug: 'grow-a-garden', game: 'Grow a Garden', rocodesSlug: 'grow-a-garden' },
  { slug: 'royale-high', game: 'Royale High', rocodesSlug: 'royale-high' },
  { slug: 'doors', game: 'Doors', rocodesSlug: 'doors' },
  { slug: 'arsenal', game: 'Arsenal', rocodesSlug: 'arsenal' },
  { slug: 'anime-fighting-simulator', game: 'Anime Fighting Simulator', rocodesSlug: 'anime-fighting-simulator' },
  { slug: 'berry-avenue', game: 'Berry Avenue', rocodesSlug: 'berry-avenue' },
  { slug: 'bee-swarm-simulator', game: 'Bee Swarm Simulator', rocodesSlug: 'bee-swarm-simulator' },
  { slug: 'dress-to-impress', game: 'Dress to Impress', rocodesSlug: 'dress-to-impress' },
  { slug: 'anime-defenders', game: 'Anime Defenders', rocodesSlug: 'anime-defenders' },
  { slug: 'funky-friday', game: 'Funky Friday', rocodesSlug: 'funky-friday' },
  { slug: 'fisch', game: 'Fisch', rocodesSlug: 'fisch' },
  { slug: 'kick-off', game: 'Kick Off', rocodesSlug: 'kick-off' },
  { slug: 'livetopia', game: 'Livetopia', rocodesSlug: 'livetopia' },
  { slug: 'natural-disaster-survival', game: 'Natural Disaster Survival', rocodesSlug: 'natural-disaster-survival' },
]

async function fetchRocodesPage(rocodesSlug: string): Promise<string | null> {
  try {
    const res = await fetch(`https://rocodes.gg/codes/${rocodesSlug}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html',
      },
      next: { revalidate: 0 },
    })
    if (!res.ok) return null
    const html = await res.text()
    // Return only the relevant section to minimize tokens sent to Haiku
    // Extract just the codes table area — between "All New" and "How Do I Redeem"
    const start = html.indexOf('All New')
    const end = html.indexOf('How Do I Redeem')
    if (start === -1 || end === -1) return html.slice(0, 8000)
    return html.slice(start, end)
  } catch {
    return null
  }
}

async function parseCodesWithHaiku(html: string, game: string): Promise<{ code: string; reward: string }[]> {
  const message = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 512,
    messages: [
      {
        role: 'user',
        content: `Extract active codes from this HTML snippet for the Roblox game "${game}".

Return ONLY a JSON array: [{"code": "CODE", "reward": "reward description"}]
- Active codes only (in the Active tab, not Expired)
- Codes appear in backticks like \`CodeName\`
- Rewards follow "Redeem this code to get"
- Return [] if no active codes found
- No markdown, no explanation, just the JSON array

HTML:
${html.slice(0, 6000)}`,
      },
    ],
  })

  const textBlock = message.content.find((b) => b.type === 'text')
  if (!textBlock || textBlock.type !== 'text') return []

  try {
    const cleaned = textBlock.text.replace(/```json|```/g, '').trim()
    const parsed = JSON.parse(cleaned)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const results: Record<string, { added: number; deactivated: number; fetchFailed?: boolean }> = {}
  const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })

  for (const { slug, game, rocodesSlug } of GAMES_TO_UPDATE) {
    try {
      // Step 1: Fetch the rocodes.gg page directly — no AI, no tokens
      const html = await fetchRocodesPage(rocodesSlug)
      if (!html) {
        console.error(`Failed to fetch rocodes.gg page for ${game}`)
        results[slug] = { added: 0, deactivated: 0, fetchFailed: true }
        continue
      }

      // Step 2: Use Haiku to parse the HTML into structured JSON — small focused prompt
      const newCodes = await parseCodesWithHaiku(html, game)

      // Step 3: Get existing codes from DB
      const { data: existingCodes } = await supabaseAdmin
        .from('codes')
        .select('code, active')
        .eq('slug', slug)

      const existingMap = new Map(
        (existingCodes ?? []).map((c) => [c.code.toLowerCase(), c])
      )

      const newCodeKeys = new Set(newCodes.map((c) => c.code.toLowerCase()))
      let added = 0
      let deactivated = 0

      // Deactivate codes no longer in the active list
      for (const [key, existing] of existingMap) {
        if (existing.active && !newCodeKeys.has(key)) {
          await supabaseAdmin
            .from('codes')
            .update({ active: false })
            .eq('slug', slug)
            .ilike('code', key)
          deactivated++
        }
      }

      // Add new codes or re-activate existing ones
      for (const { code, reward } of newCodes) {
        const key = code.toLowerCase()
        if (!existingMap.has(key)) {
          await supabaseAdmin.from('codes').insert({
            game,
            slug,
            code,
            reward,
            active: true,
            is_new: true,
          })
          added++
        } else if (!existingMap.get(key)!.active) {
          await supabaseAdmin
            .from('codes')
            .update({ active: true, is_new: true })
            .eq('slug', slug)
            .ilike('code', key)
          added++
        }
      }

      // Update the game's updated_at timestamp
      await supabaseAdmin
        .from('code_games')
        .update({ updated_at: new Date().toISOString() })
        .eq('slug', slug)

      results[slug] = { added, deactivated }

      // Small delay between games
      await new Promise((r) => setTimeout(r, 800))
    } catch (err) {
      console.error(`Error updating codes for ${game}:`, err)
      results[slug] = { added: 0, deactivated: 0 }
    }
  }

  return NextResponse.json({ success: true, date: today, results })
}