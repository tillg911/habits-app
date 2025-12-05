export interface Completion {
  id: string;
  habitId: string;
  date: string; // "YYYY-MM-DD" format
  completedAt: string; // Full ISO timestamp
  count: number; // For multi-completion habits
  note?: string;
}

// Indexed by date for efficient lookup
export interface CompletionsByDate {
  [date: string]: {
    [habitId: string]: Completion;
  };
}
