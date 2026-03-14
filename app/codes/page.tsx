// app/codes/page.tsx
import { supabase } from '@/app/lib/supabase'
import CodesHubClient from './CodesHubClient'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Roblox Codes (2026) — All Active Codes Updated Daily | BloxQuiz',
  description: 'Find active Roblox codes for 2026. Blox Fruits, Adopt Me, Anime Defenders, Doors, Bee Swarm & 12 more games. Free rewards updated daily — redeem before they expire!',
  alternates: { canonical: 'https://www.bloxquiz.gg/codes' },
  openGraph: {
    title: 'Roblox Codes (2026) — All Active Codes Updated Daily | BloxQuiz',
    description: 'Active Roblox codes for Blox Fruits, Adopt Me, Anime Defenders, Doors & more. Updated daily — redeem free rewards before they expire!',
    url: 'https://www.bloxquiz.gg/codes',
    siteName: 'BloxQuiz',
    type: 'website',
  },
}

const faqs = [
  { q: 'Do Roblox codes expire?', a: 'Yes — most Roblox codes are time-limited and expire after a few days or weeks. Some codes expire after a certain number of uses. Always redeem codes as soon as possible to avoid missing out.' },
  { q: 'Are these codes free?', a: 'Yes — all codes listed on BloxQuiz are completely free. You never need to pay to use a Roblox code. If a site asks you to pay for codes, it\'s a scam.' },
  { q: "Why isn't my code working?", a: 'Codes are case sensitive — make sure you type them exactly as shown. The code may also have expired or already been redeemed on your account. Check the active/expired status on each game\'s page.' },
  { q: 'How often are new codes released?', a: 'New codes are typically released during game updates, milestones, collaborations, or special events. Follow game developers on Twitter/X and Discord for the fastest code announcements.' },
  { q: 'Can I use the same code twice?', a: 'No — each code can only be redeemed once per account. Attempting to use a code you\'ve already redeemed will show an error.' },
]

export default async function CodesPage() {
  const [{ data: games }, { data: codes }] = await Promise.all([
    supabase.from('code_games').select('*').order('game'),
    supabase.from('codes').select('*').order('is_new', { ascending: false }),
  ])

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

  const totalActive = allCodes.reduce((sum, g) => sum + g.codes.filter((c) => c.active).length, 0)
  const lastUpdated = (games ?? []).reduce((latest, g) => {
    const t = new Date(g.updated_at).getTime()
    return t > latest ? t : latest
  }, 0)
  const lastUpdatedStr = lastUpdated
    ? new Date(lastUpdated).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : 'Recently'

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px' }}>

      {/* Breadcrumb */}
      <div style={{ fontSize: 13, color: 'var(--text-dim)', fontWeight: 600, marginBottom: 20 }}>
        <a href="/" style={{ color: 'var(--text-dim)', textDecoration: 'none' }}>Home</a>
        <span style={{ margin: '0 8px' }}>›</span>
        <span style={{ color: 'var(--text-muted)' }}>Roblox Codes</span>
      </div>

      {/* Hero */}
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, marginBottom: 12 }}>
        🎁 Roblox Game Codes — Active & Updated Daily
      </h1>
      <p style={{ fontSize: 15, color: 'var(--text-muted)', fontWeight: 600, lineHeight: 1.7, maxWidth: 760, marginBottom: 20 }}>
        Roblox codes give players free rewards such as coins, boosts, skins, and special items inside their favorite games. Many popular Roblox games release new codes during updates, events, or milestones. On this page you can find active Roblox codes for games like Blox Fruits, Adopt Me, Brookhaven RP, Doors, and many more. Codes often expire quickly — redeem them as soon as possible!
      </p>

      {/* Stats bar */}
      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginBottom: 8 }}>
        <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--neon-green)' }}>✅ {totalActive} Active Codes</span>
        <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--neon-blue)' }}>🎮 {allCodes.length} Games Covered</span>
        <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-muted)' }}>🔄 Updated Daily</span>
      </div>
      <div style={{ fontSize: 13, color: 'var(--text-dim)', fontWeight: 600, marginBottom: 32 }}>
        🕐 Last updated: {lastUpdatedStr} — codes verified and refreshed
      </div>

      {/* How to redeem */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '22px 24px', marginBottom: 32 }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, marginBottom: 12 }}>How To Redeem Roblox Codes</h2>
        <p style={{ fontSize: 14, color: 'var(--text-muted)', fontWeight: 600, lineHeight: 1.7, marginBottom: 14 }}>
          Each Roblox game has its own code system, but the general process is the same. Follow these steps to redeem codes in most Roblox games:
        </p>
        <ol style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
          {[
            'Launch the Roblox game on your device',
            'Look for a Twitter bird icon, Codes button, or Settings menu inside the game',
            'Click it to open the code redemption menu',
            'Type the code exactly as shown — codes are case sensitive',
            'Press Redeem or Enter to claim your free reward',
          ].map((step, i) => (
            <li key={i} style={{ fontSize: 14, color: 'var(--text-muted)', fontWeight: 600, lineHeight: 1.6 }}>{step}</li>
          ))}
        </ol>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#ffe347' }}>
          ⚠️ Codes expire fast — redeem them as soon as you find them. Each game page below has specific redemption steps.
        </div>
      </div>

      {/* Games grid via client component */}
      <CodesHubClient games={allCodes} />

      {/* FAQ */}
      <div style={{ marginBottom: 48 }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, marginBottom: 16 }}>Frequently Asked Questions</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {faqs.map((faq, i) => (
            <div key={i} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '18px 22px' }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--text)', marginBottom: 8 }}>{faq.q}</div>
              <div style={{ fontSize: 14, color: 'var(--text-muted)', fontWeight: 600, lineHeight: 1.7 }}>{faq.a}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '28px 32px', textAlign: 'center', marginBottom: 48 }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, marginBottom: 8 }}>🎮 Test Your Roblox Knowledge</h2>
        <p style={{ fontSize: 14, color: 'var(--text-muted)', fontWeight: 600, lineHeight: 1.7, maxWidth: 500, margin: '0 auto 20px' }}>
          Now that you've redeemed your codes, put your Roblox knowledge to the test! BloxQuiz has free trivia quizzes for all your favorite Roblox games.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="/browse" style={{ background: 'var(--gradient-main)', color: 'var(--bg)', fontWeight: 900, fontSize: 14, padding: '12px 28px', borderRadius: 100, textDecoration: 'none', WebkitTextFillColor: 'var(--bg)' }}>🎮 Browse All Quizzes</a>
          <a href="/games/blox-fruits" style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)', fontWeight: 800, fontSize: 14, padding: '12px 28px', borderRadius: 100, textDecoration: 'none' }}>⚔️ Blox Fruits Quizzes</a>
          <a href="/games/adopt-me" style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)', fontWeight: 800, fontSize: 14, padding: '12px 28px', borderRadius: 100, textDecoration: 'none' }}>🐾 Adopt Me Quizzes</a>
        </div>
      </div>

    </div>
  )
}