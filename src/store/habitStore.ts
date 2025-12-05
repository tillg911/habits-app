import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { Habit, CreateHabitInput, UpdateHabitInput } from '../types/habit';
import { Completion } from '../types/completion';
import { createZustandStorage } from '../services/storage';
import { createISOTimestamp, getTodayString } from '../utils/date';
import { calculateStreak } from '../utils/streak';

interface HabitState {
  habits: Habit[];
  completions: Completion[];
  isLoading: boolean;
  isHydrated: boolean;
}

interface HabitActions {
  // Habit CRUD
  addHabit: (input: CreateHabitInput) => void;
  updateHabit: (id: string, updates: UpdateHabitInput) => void;
  deleteHabit: (id: string) => void;
  archiveHabit: (id: string) => void;

  // Completions
  toggleCompletion: (habitId: string, date?: string) => void;
  getCompletionsForHabit: (habitId: string) => Completion[];
  getCompletionsForDate: (date: string) => Completion[];
  isHabitCompletedOnDate: (habitId: string, date: string) => boolean;

  // Streak updates
  updateHabitStreaks: (habitId: string) => void;
  updateAllStreaks: () => void;

  // Hydration
  setHydrated: (state: boolean) => void;
}

type HabitStore = HabitState & HabitActions;

const DEFAULT_HABITS: Habit[] = [];
const DEFAULT_COMPLETIONS: Completion[] = [];

export const useHabitStore = create<HabitStore>()(
  persist(
    (set, get) => ({
      // State
      habits: DEFAULT_HABITS,
      completions: DEFAULT_COMPLETIONS,
      isLoading: false,
      isHydrated: false,

      // Habit CRUD
      addHabit: (input: CreateHabitInput) => {
        const now = createISOTimestamp();
        const newHabit: Habit = {
          ...input,
          id: uuidv4(),
          createdAt: now,
          updatedAt: now,
          currentStreak: 0,
          bestStreak: 0,
          totalCompletions: 0,
        };

        set((state) => ({
          habits: [...state.habits, newHabit],
        }));
      },

      updateHabit: (id: string, updates: UpdateHabitInput) => {
        set((state) => ({
          habits: state.habits.map((habit) =>
            habit.id === id
              ? { ...habit, ...updates, updatedAt: createISOTimestamp() }
              : habit
          ),
        }));
      },

      deleteHabit: (id: string) => {
        set((state) => ({
          habits: state.habits.filter((habit) => habit.id !== id),
          completions: state.completions.filter((c) => c.habitId !== id),
        }));
      },

      archiveHabit: (id: string) => {
        set((state) => ({
          habits: state.habits.map((habit) =>
            habit.id === id
              ? { ...habit, archivedAt: createISOTimestamp() }
              : habit
          ),
        }));
      },

      // Completions
      toggleCompletion: (habitId: string, date: string = getTodayString()) => {
        const { completions, habits } = get();
        const existingCompletion = completions.find(
          (c) => c.habitId === habitId && c.date === date
        );

        if (existingCompletion) {
          // Remove completion
          set((state) => ({
            completions: state.completions.filter(
              (c) => !(c.habitId === habitId && c.date === date)
            ),
          }));
        } else {
          // Add completion
          const newCompletion: Completion = {
            id: uuidv4(),
            habitId,
            date,
            completedAt: createISOTimestamp(),
            count: 1,
          };
          set((state) => ({
            completions: [...state.completions, newCompletion],
          }));
        }

        // Update streak for this habit
        get().updateHabitStreaks(habitId);
      },

      getCompletionsForHabit: (habitId: string) => {
        return get().completions.filter((c) => c.habitId === habitId);
      },

      getCompletionsForDate: (date: string) => {
        return get().completions.filter((c) => c.date === date);
      },

      isHabitCompletedOnDate: (habitId: string, date: string) => {
        return get().completions.some(
          (c) => c.habitId === habitId && c.date === date
        );
      },

      // Streak updates
      updateHabitStreaks: (habitId: string) => {
        const { habits, completions } = get();
        const habit = habits.find((h) => h.id === habitId);
        if (!habit) return;

        const habitCompletions = completions.filter(
          (c) => c.habitId === habitId
        );
        const streakResult = calculateStreak(habit, habitCompletions);

        set((state) => ({
          habits: state.habits.map((h) =>
            h.id === habitId
              ? {
                  ...h,
                  currentStreak: streakResult.currentStreak,
                  bestStreak: Math.max(h.bestStreak, streakResult.bestStreak),
                  totalCompletions: habitCompletions.length,
                }
              : h
          ),
        }));
      },

      updateAllStreaks: () => {
        const { habits } = get();
        habits.forEach((habit) => {
          get().updateHabitStreaks(habit.id);
        });
      },

      // Hydration
      setHydrated: (state: boolean) => {
        set({ isHydrated: state });
      },
    }),
    {
      name: 'habits-storage',
      storage: createJSONStorage(() => createZustandStorage()),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
        // Update all streaks on app start
        state?.updateAllStreaks();
      },
    }
  )
);

// Selectors
export const selectActiveHabits = (state: HabitStore) =>
  state.habits.filter((h) => !h.archivedAt);

export const selectTodayProgress = (state: HabitStore) => {
  const today = getTodayString();
  const activeHabits = selectActiveHabits(state);
  const todayCompletions = state.completions.filter((c) => c.date === today);

  const completedCount = activeHabits.filter((habit) =>
    todayCompletions.some((c) => c.habitId === habit.id)
  ).length;

  return {
    total: activeHabits.length,
    completed: completedCount,
    percentage: activeHabits.length > 0
      ? Math.round((completedCount / activeHabits.length) * 100)
      : 0,
  };
};
