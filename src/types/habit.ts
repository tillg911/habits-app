export interface Reminder {
  id: string;
  time: string; // "HH:mm" format
  enabled: boolean;
  days?: number[]; // 0-6, where 0 = Sunday
}

export type HabitFrequency = 'daily' | 'weekly' | 'custom';

export interface Habit {
  id: string;
  name: string;
  description?: string;
  icon: string; // emoji
  color: string; // hex color
  frequency: HabitFrequency;
  targetDays?: number[]; // 0-6 for weekly frequency
  targetCount: number; // times per day (default: 1)
  reminders: Reminder[];
  createdAt: string; // ISO date string
  updatedAt: string;
  archivedAt?: string; // soft delete
  // Cached values
  currentStreak: number;
  bestStreak: number;
  totalCompletions: number;
}

export type CreateHabitInput = Omit<
  Habit,
  'id' | 'createdAt' | 'updatedAt' | 'currentStreak' | 'bestStreak' | 'totalCompletions'
>;

export type UpdateHabitInput = Partial<Omit<Habit, 'id' | 'createdAt'>>;
