import { View, Text, FlatList, StyleSheet } from 'react-native';
import { HabitCard } from './HabitCard';
import { Habit } from '../../types';
import { useHabitStore } from '../../store';
import { getTodayString } from '../../utils/date';
import { colors } from '../../constants/colors';

interface HabitListProps {
  habits: Habit[];
  onHabitPress: (habit: Habit) => void;
}

export function HabitList({ habits, onHabitPress }: HabitListProps) {
  const { toggleCompletion, isHabitCompletedOnDate } = useHabitStore();
  const today = getTodayString();

  if (habits.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyIcon}>🎯</Text>
        <Text style={styles.emptyTitle}>No habits yet</Text>
        <Text style={styles.emptyText}>
          Start building better habits by adding your first one!
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={habits}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <HabitCard
          habit={item}
          isCompleted={isHabitCompletedOnDate(item.id, today)}
          onToggle={() => toggleCompletion(item.id, today)}
          onPress={() => onHabitPress(item)}
        />
      )}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.list}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    paddingBottom: 100,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.gray[900],
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: colors.gray[500],
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});
