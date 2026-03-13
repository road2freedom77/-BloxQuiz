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

// Games we actively maintain codes for
const GAMES_TO_UPDATE = [
  { slug: 'blox-fruits', game: 'Blox Fruits' },
  { slug: 'brookhaven-rp', game: 'Brookhaven RP' },
  { slug: 'adopt-me', game: 'Adopt Me' },
  { slug: 'murder-mystery-2', game: 'Murder Mystery 2' },
  { slug: 'grow-a-garden', game: 'Grow a Garden' },
  { slug: 'royale-high', game: 'Royale High' },
  { slug: 'doors', game: 'Doors' },
  { slug: 'arsenal', game: 'Arsenal' },
  { slug: 'anime-fighting-simulator', game: 'Anime Fighting Simulator' },
  { slug: 'berry-avenue', game: 'Berry Avenue' },
  { slug: 'bee-swarm-simulator', game: 'Bee Swarm Simulator' },
  { slug: 'dress-to-impress', game: 'Dress to Impress' },
  { slug: 'anime-defenders', game: 'Anime Defenders' },
  { slug: 'funky-friday', game: 'Funky Friday' },
]

interface CodeEntry {
  code: string
  reward: string
  active: boolean
}

export async function GET(request: Request) {
  // Verify this is an authorized cron call
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const results: Record<string, { added: number; deactivated: number }> = {}
  const today = new Date().toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  })

  for (const { slug, game } of GAMES_TO_UPDATE) {
    try {
      // Get existing codes from DB
      const { data: existingCodes } = await supabaseAdmin
        .from('codes')
        .select('code, active')
        .eq('slug', slug)

      const existingMap = new Map(
        (existingCodes ?? []).map((c) => [c.code.toLowerCase(), c])
      )
      const existingActiveList = (existingCodes ?? [])
        .filter((c) => c.active)
        .map((c) => c.code)
        .join(', ')

      // Ask Claude to research current active codes
      const message = await anthropic.messages.create({
        model: 'claude-opus-4-6',
        max_tokens: 1024,
        tools: [{ type: 'web_search_20250305', name: 'web_search' } as any],
        messages: [
          {
            role: 'user',
            content: `Search for the current active codes for the Roblox game "${game}" as of today.
            
Current codes in our database (active): ${existingActiveList || 'none'}

Return ONLY a JSON array of currently active codes. Format:
[{"code": "CODENAME", "reward": "reward description"}]

Rules:
- Only include codes that are confirmed working/active right now
- Do not include expired codes
- Be conservative — only include codes you find confirmed on multiple sources or official channels
- If you find no active codes, return []
- Return ONLY the JSON array, no other text`,
          },
        ],
      })

      // Extract the text response
      const textBlock = message.content.find((b) => b.type === 'text')
      if (!textBlock || textBlock.type !== 'text') {
        console.error(`No text response for ${game}`)
        continue
      }

      let newCodes: { code: string; reward: string }[] = []
      try {
        const cleaned = textBlock.text.replace(/```json|```/g, '').trim()
        newCodes = JSON.parse(cleaned)
        if (!Array.isArray(newCodes)) newCodes = []
      } catch {
        console.error(`Failed to parse codes JSON for ${game}:`, textBlock.text)
        continue
      }

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
          // Brand new code
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
          // Was inactive, now active again
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

      // Small delay to avoid rate limits
      await new Promise((r) => setTimeout(r, 1000))
    } catch (err) {
      console.error(`Error updating codes for ${game}:`, err)
      results[slug] = { added: 0, deactivated: 0 }
    }
  }

  return NextResponse.json({
    success: true,
    date: today,
    results,
  })
}