import { Habit } from '../types/habit';
import { Completion } from '../types/completion';
import { getTodayString, subtractDays, getDayOfWeek } from './date';

export interface StreakResult {
  currentStreak: number;
  bestStreak: number;
  lastCompletedDate: string | null;
  isCompletedToday: boolean;
}

function isHabitScheduledForDate(habit: Habit, dateString: string): boolean {
  if (habit.frequency === 'daily') return true;
  if (habit.frequency === 'weekly' && habit.targetDays) {
    const dayOfWeek = getDayOfWeek(dateString);
    return habit.targetDays.includes(dayOfWeek);
  }
  return true;
}

export function calculateStreak(
  habit: Habit,
  completions: Completion[],
  currentDate: string = getTodayString()
): StreakResult {
  // Create a Set for O(1) lookup
  const completedDates = new Set(completions.map((c) => c.date));

  let currentStreak = 0;
  let bestStreak = 0;
  let tempStreak = 0;
  let lastCompletedDate: string | null = null;
  let streakBroken = false;

  // Start from today and walk backwards
  let checkDate = currentDate;

  for (let i = 0; i < 365; i++) {
    // Max 1 year lookback
    if (isHabitScheduledForDate(habit, checkDate)) {
      if (completedDates.has(checkDate)) {
        if (!streakBroken) {
          currentStreak++;
        }
        tempStreak++;
        if (!lastCompletedDate) {
          lastCompletedDate = checkDate;
        }
      } else {
        // Give grace period for today
        if (checkDate === currentDate) {
          // Don't break streak yet
        } else {
          if (!streakBroken) {
            streakBroken = true;
          }
          bestStreak = Math.max(bestStreak, tempStreak);
          tempStreak = 0;
        }
      }
    }
    checkDate = subtractDays(checkDate, 1);
  }

  bestStreak = Math.max(bestStreak, tempStreak, currentStreak);

  return {
    currentStreak,
    bestStreak,
    lastCompletedDate,
    isCompletedToday: completedDates.has(currentDate),
  };
}

// Quick check if streak is still active (without full recalculation)
export function isStreakActive(
  habit: Habit,
  completions: Completion[]
): boolean {
  const today = getTodayString();
  const yesterday = subtractDays(today, 1);

  const completedDates = new Set(completions.map((c) => c.date));

  // Streak is active if completed today
  if (completedDates.has(today)) return true;

  // Or if completed yesterday and habit is scheduled for today
  if (
    completedDates.has(yesterday) &&
    isHabitScheduledForDate(habit, today)
  ) {
    return true;
  }

  return false;
}
