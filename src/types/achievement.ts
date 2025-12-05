export type AchievementCategory =
  | 'streak'
  | 'completion'
  | 'consistency'
  | 'milestone'
  | 'special';

export type AchievementRequirement =
  | 'streak_days'
  | 'total_completions'
  | 'perfect_days'
  | 'habits_created'
  | 'active_days'
  | 'weekly_perfect';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: AchievementCategory;
  requirement: AchievementRequirement;
  threshold: number;
  points: number;
  unlockedAt?: string;
  progress?: number; // 0-100 percentage
}

export interface UserProgress {
  id: string;
  totalPoints: number;
  level: number;
  totalHabitsCreated: number;
  totalCompletions: number;
  longestStreak: number;
  perfectDays: number;
  joinedAt: string;
  lastActiveAt: string;
}
