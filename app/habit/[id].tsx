import { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { format, subDays } from 'date-fns';
import { Card, Button, ProgressRing, ConfirmDialog } from '../../src/components/ui';
import { useHabitStore } from '../../src/store';
import { getTodayString, formatDateString } from '../../src/utils/date';
import { colors } from '../../src/constants/colors';

export default function HabitDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const habit = useHabitStore((state) => state.habits.find((h) => h.id === id));
  const completions = useHabitStore((state) =>
    state.completions.filter((c) => c.habitId === id)
  );
  const deleteHabit = useHabitStore((state) => state.deleteHabit);
  const toggleCompletion = useHabitStore((state) => state.toggleCompletion);
  const isHabitCompletedOnDate = useHabitStore((state) => state.isHabitCompletedOnDate);

  if (!habit) {
    return (
      <SafeAreaView style={styles.notFound}>
        <Text style={styles.notFoundText}>Habit not found</Text>
      </SafeAreaView>
    );
  }

  const today = getTodayString();
  const isCompletedToday = isHabitCompletedOnDate(id!, today);

  // Calculate completion rate (last 30 days)
  const last30Days = Array.from({ length: 30 }, (_, i) =>
    formatDateString(subDays(new Date(), i))
  );
  const completedLast30 = last30Days.filter(date =>
    completions.some(c => c.date === date)
  ).length;
  const completionRate = Math.round((completedLast30 / 30) * 100);

  // Last 7 days for calendar preview
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i);
    return {
      date: formatDateString(date),
      dayName: format(date, 'EEE'),
      dayNum: format(date, 'd'),
      isCompleted: completions.some(c => c.date === formatDateString(date)),
    };
  });

  const handleDelete = () => {
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    deleteHabit(id!);
    setShowDeleteDialog(false);
    router.back();
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Header Card */}
          <Card style={{ ...styles.headerCard, borderLeftColor: habit.color }}>
            <View style={styles.headerContent}>
              <View style={[styles.iconContainer, { backgroundColor: habit.color + '20' }]}>
                <Text style={styles.icon}>{habit.icon}</Text>
              </View>
              <View style={styles.headerInfo}>
                <Text style={styles.habitName}>{habit.name}</Text>
                {habit.description && (
                  <Text style={styles.habitDescription}>{habit.description}</Text>
                )}
                <Text style={styles.frequency}>
                  {habit.frequency === 'daily' ? 'Every day' : `${habit.targetDays?.length || 0} days/week`}
                </Text>
              </View>
            </View>
          </Card>

          {/* Today's Status */}
          <Card>
            <View style={styles.todayRow}>
              <View>
                <Text style={styles.todayTitle}>Today</Text>
                <Text style={styles.todaySubtitle}>
                  {isCompletedToday ? 'Completed! 🎉' : 'Not yet completed'}
                </Text>
              </View>
              <Button
                title={isCompletedToday ? 'Undo' : 'Complete'}
                variant={isCompletedToday ? 'secondary' : 'primary'}
                size="sm"
                onPress={() => toggleCompletion(id!, today)}
              />
            </View>
          </Card>

          {/* Streak Stats */}
          <View style={styles.statsRow}>
            <Card style={styles.statCard}>
              <View style={styles.statContent}>
                <Text style={styles.statIcon}>🔥</Text>
                <Text style={styles.statValue}>{habit.currentStreak}</Text>
                <Text style={styles.statLabel}>Current Streak</Text>
              </View>
            </Card>
            <Card style={styles.statCard}>
              <View style={styles.statContent}>
                <Text style={styles.statIcon}>⭐</Text>
                <Text style={styles.statValue}>{habit.bestStreak}</Text>
                <Text style={styles.statLabel}>Best Streak</Text>
              </View>
            </Card>
            <Card style={styles.statCard}>
              <View style={styles.statContent}>
                <Text style={styles.statIcon}>✅</Text>
                <Text style={styles.statValue}>{habit.totalCompletions}</Text>
                <Text style={styles.statLabel}>Total</Text>
              </View>
            </Card>
          </View>

          {/* Completion Rate */}
          <Card>
            <View style={styles.rateRow}>
              <ProgressRing
                progress={completionRate}
                size={70}
                strokeWidth={7}
                color={habit.color}
              />
              <View style={styles.rateInfo}>
                <Text style={styles.rateTitle}>{completionRate}% completion rate</Text>
                <Text style={styles.rateSubtitle}>Last 30 days</Text>
              </View>
            </View>
          </Card>

          {/* Week Calendar */}
          <Text style={styles.sectionTitle}>This Week</Text>
          <Card>
            <View style={styles.weekRow}>
              {last7Days.map((day) => (
                <View key={day.date} style={styles.dayColumn}>
                  <Text style={styles.dayName}>{day.dayName}</Text>
                  <View
                    style={[
                      styles.dayCircle,
                      day.isCompleted && { backgroundColor: habit.color },
                      !day.isCompleted && styles.dayCircleEmpty,
                    ]}
                  >
                    <Text style={[styles.dayNum, day.isCompleted && styles.dayNumCompleted]}>
                      {day.dayNum}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </Card>

          {/* Actions */}
          <View style={styles.actions}>
            <Button
              title="Edit Habit"
              variant="secondary"
              onPress={() => router.push(`/habit/edit/${id}`)}
            />
            <View style={styles.actionSpacer} />
            <Button title="Delete Habit" variant="danger" onPress={handleDelete} />
          </View>
        </View>
      </ScrollView>

      <ConfirmDialog
        visible={showDeleteDialog}
        title="Delete Habit"
        message={`Are you sure you want to delete "${habit.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={confirmDelete}
        onCancel={() => setShowDeleteDialog(false)}
        destructive
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  notFound: {
    flex: 1,
    backgroundColor: colors.gray[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  notFoundText: {
    color: colors.gray[500],
  },
  content: {
    padding: 20,
    gap: 16,
  },
  headerCard: {
    borderLeftWidth: 4,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  icon: {
    fontSize: 32,
  },
  headerInfo: {
    flex: 1,
  },
  habitName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.gray[900],
  },
  habitDescription: {
    fontSize: 14,
    color: colors.gray[500],
    marginTop: 2,
  },
  frequency: {
    fontSize: 14,
    color: colors.gray[400],
    marginTop: 4,
  },
  todayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  todayTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.gray[900],
  },
  todaySubtitle: {
    fontSize: 14,
    color: colors.gray[500],
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
  },
  statContent: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  statIcon: {
    fontSize: 28,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.gray[900],
  },
  statLabel: {
    fontSize: 12,
    color: colors.gray[500],
  },
  rateRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rateInfo: {
    marginLeft: 16,
  },
  rateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.gray[900],
  },
  rateSubtitle: {
    fontSize: 14,
    color: colors.gray[500],
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.gray[900],
    marginTop: 8,
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayColumn: {
    alignItems: 'center',
  },
  dayName: {
    fontSize: 12,
    color: colors.gray[500],
    marginBottom: 4,
  },
  dayCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCircleEmpty: {
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  dayNum: {
    fontWeight: '500',
    color: colors.gray[700],
  },
  dayNumCompleted: {
    color: colors.white,
  },
  actions: {
    marginTop: 16,
  },
  actionSpacer: {
    height: 12,
  },
});
