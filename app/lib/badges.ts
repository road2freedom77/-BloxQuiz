export interface Badge {
    id: string;
    emoji: string;
    label: string;
    description: string;
    color: string;
    bg: string;
  }
  
  export function getBadges({
    rank,
    streak,
    xp,
    totalQuizzes,
    perfectScores,
  }: {
    rank: number | null;
    streak: number;
    xp: number;
    totalQuizzes: number;
    perfectScores: number;
  }): Badge[] {
    const badges: Badge[] = [];
  
    // Rank badges
    if (rank === 1) badges.push({ id: "rank1", emoji: "👑", label: "#1 Champion", description: "Ranked #1 on the leaderboard", color: "#FFE347", bg: "rgba(255,227,71,0.15)" });
    else if (rank === 2) badges.push({ id: "rank2", emoji: "🥈", label: "#2 Elite", description: "Ranked #2 on the leaderboard", color: "#C0C0C0", bg: "rgba(192,192,192,0.15)" });
    else if (rank === 3) badges.push({ id: "rank3", emoji: "🥉", label: "#3 Legend", description: "Ranked #3 on the leaderboard", color: "#CD7F32", bg: "rgba(205,127,50,0.15)" });
    else if (rank && rank <= 10) badges.push({ id: "top10", emoji: "⭐", label: "Top 10", description: "Ranked in the top 10", color: "#B84CFF", bg: "rgba(184,76,255,0.15)" });
  
    // Streak badges
    if (streak >= 30) badges.push({ id: "streak30", emoji: "🔥", label: "On Fire", description: "30 day streak!", color: "#FF3CAC", bg: "rgba(255,60,172,0.15)" });
    else if (streak >= 7) badges.push({ id: "streak7", emoji: "🔥", label: "Streak Master", description: "7 day streak!", color: "#FF6B35", bg: "rgba(255,107,53,0.15)" });
    else if (streak >= 3) badges.push({ id: "streak3", emoji: "🔥", label: "On a Roll", description: "3 day streak!", color: "#FFE347", bg: "rgba(255,227,71,0.15)" });
  
    // XP badges
    if (xp >= 10000) badges.push({ id: "xp10000", emoji: "💎", label: "Diamond", description: "Earned 10,000+ XP", color: "#00D9FF", bg: "rgba(0,217,255,0.15)" });
    else if (xp >= 5000) badges.push({ id: "xp5000", emoji: "💜", label: "Legend", description: "Earned 5,000+ XP", color: "#B84CFF", bg: "rgba(184,76,255,0.15)" });
    else if (xp >= 1000) badges.push({ id: "xp1000", emoji: "⚡", label: "Rising Star", description: "Earned 1,000+ XP", color: "#00F5A0", bg: "rgba(0,245,160,0.15)" });
  
    // Quiz count badges
    if (totalQuizzes >= 100) badges.push({ id: "quiz100", emoji: "🎮", label: "Quiz Machine", description: "Played 100+ quizzes", color: "#00F5A0", bg: "rgba(0,245,160,0.15)" });
    else if (totalQuizzes >= 50) badges.push({ id: "quiz50", emoji: "🎮", label: "Quiz Addict", description: "Played 50+ quizzes", color: "#FFE347", bg: "rgba(255,227,71,0.15)" });
    else if (totalQuizzes >= 10) badges.push({ id: "quiz10", emoji: "🎮", label: "Quiz Fan", description: "Played 10+ quizzes", color: "#00D9FF", bg: "rgba(0,217,255,0.15)" });
  
    // Perfect score badges
    if (perfectScores >= 10) badges.push({ id: "perfect10", emoji: "🏆", label: "Perfectionist", description: "10+ perfect scores", color: "#FFE347", bg: "rgba(255,227,71,0.15)" });
    else if (perfectScores >= 1) badges.push({ id: "perfect1", emoji: "✨", label: "Perfect Score", description: "Got a perfect 10/10", color: "#00F5A0", bg: "rgba(0,245,160,0.15)" });
  
    return badges;
  }