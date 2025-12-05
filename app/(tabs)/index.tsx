import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { format } from 'date-fns';
import { HabitList, AddHabitButton } from '../../src/components/habits';
import { ProgressRing, Loading, EmptyState } from '../../src/components/ui';
import { useHabitStore, selectActiveHabits, selectTodayProgress } from '../../src/store';
import { colors } from '../../src/constants/colors';

export default function HomeScreen() {
  const router = useRouter();
  const habits = useHabitStore(selectActiveHabits);
  const progress = useHabitStore(selectTodayProgress);
  const isHydrated = useHabitStore((state) => state.isHydrated);

  const today = new Date();
  const dateString = format(today, 'EEEE, MMMM d');

  if (!isHydrated) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Loading message="Loading your habits..." />
      </SafeAreaView>
    );
  }

  if (habits.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={['left', 'right']}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.date}>{dateString}</Text>
            <Text style={styles.greeting}>{getGreeting()}</Text>
          </View>
        </View>
        <EmptyState
          icon="🌱"
          title="Start Your Journey"
          description="Create your first habit and begin building positive routines that stick."
          actionLabel="Create First Habit"
          onAction={() => router.push('/habit/new')}
        />
        <AddHabitButton onPress={() => router.push('/habit/new')} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.date}>{dateString}</Text>
          <Text style={styles.greeting}>{getGreeting()}</Text>
        </View>

        {/* Progress Section */}
        {habits.length > 0 && (
          <View style={styles.progressCard}>
            <View style={styles.progressContent}>
              <ProgressRing
                progress={progress.percentage}
                size={80}
                strokeWidth={8}
                color={colors.success[500]}
              >
                <Text style={styles.progressText}>
                  {progress.completed}/{progress.total}
                </Text>
              </ProgressRing>
              <View style={styles.progressInfo}>
                <Text style={styles.progressTitle}>
                  {progress.percentage === 100
                    ? 'All done! 🎉'
                    : progress.percentage >= 50
                    ? 'Great progress!'
                    : 'Keep going!'}
                </Text>
                <Text style={styles.progressSubtitle}>
                  {progress.total - progress.completed} habits remaining today
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Habits Section */}
        <Text style={styles.sectionTitle}>Your Habits</Text>
      </View>

      <View style={styles.listContainer}>
        <HabitList
          habits={habits}
          onHabitPress={(habit) => router.push(`/habit/${habit.id}`)}
        />
      </View>

      <AddHabitButton onPress={() => router.push('/habit/new')} />
    </SafeAreaView>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning!';
  if (hour < 18) return 'Good afternoon!';
  return 'Good evening!';
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.gray[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: colors.gray[500],
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  header: {
    marginBottom: 24,
  },
  date: {
    fontSize: 14,
    color: colors.gray[500],
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.gray[900],
    marginTop: 4,
  },
  progressCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.gray[100],
  },
  progressContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.gray[900],
  },
  progressInfo: {
    marginLeft: 20,
    flex: 1,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.gray[900],
  },
  progressSubtitle: {
    fontSize: 14,
    color: colors.gray[500],
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.gray[900],
    marginBottom: 12,
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
});
