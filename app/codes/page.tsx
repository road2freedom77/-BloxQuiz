// app/codes/page.tsx
import { createClient } from '@/lib/supabase/server'
import CodesHubClient from './CodesHubClient'

export const revalidate = 3600 // revalidate every hour

export const metadata = {
  title: 'Roblox Codes 2026 — Active & Updated Daily | BloxQuiz',
  description: 'Free Roblox codes for Blox Fruits, Adopt Me, Brookhaven, Doors, Arsenal and more. Updated daily — redeem before they expire!',
}

export default async function CodesPage() {
  const supabase = createClient()

  const [{ data: games }, { data: codes }] = await Promise.all([
    supabase.from('code_games').select('*').order('game'),
    supabase.from('codes').select('*').order('is_new', { ascending: false }),
  ])

  // Shape into the same structure CodesHubClient already expects
  const allCodes = (games ?? []).map((g) => ({
    game: g.game,
    slug: g.slug,
    icon: g.icon,
    updatedAt: new Date(g.updated_at).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }),
    howToRedeem: g.how_to_redeem,
    noCodesMessage: g.no_codes_message ?? undefined,
    codes: (codes ?? [])
      .filter((c) => c.slug === g.slug)
      .map((c) => ({
        code: c.code,
        reward: c.reward,
        active: c.active,
        isNew: c.is_new,
      })),
  }))

  const lastUpdated = (games ?? []).reduce((latest, g) => {
    const t = new Date(g.updated_at).getTime()
    return t > latest ? t : latest
  }, 0)

  const lastUpdatedStr = lastUpdated
    ? new Date(lastUpdated).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Recently'

  return <CodesHubClient allCodes={allCodes} lastUpdated={lastUpdatedStr} />
}