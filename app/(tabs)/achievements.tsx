import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '../../src/components/ui';
import { useHabitStore } from '../../src/store';
import { colors } from '../../src/constants/colors';

const ACHIEVEMENTS = [
  { id: '1', name: 'First Step', description: 'Create your first habit', icon: '🌱', points: 50, threshold: 1, requirement: 'habits_created' },
  { id: '2', name: 'Streak Starter', description: 'Reach a 3-day streak', icon: '🔥', points: 25, threshold: 3, requirement: 'streak_days' },
  { id: '3', name: 'Week Warrior', description: 'Reach a 7-day streak', icon: '💪', points: 75, threshold: 7, requirement: 'streak_days' },
  { id: '4', name: 'Habit Builder', description: 'Create 5 habits', icon: '🏗️', points: 100, threshold: 5, requirement: 'habits_created' },
  { id: '5', name: 'Two Week Champion', description: 'Reach a 14-day streak', icon: '⭐', points: 150, threshold: 14, requirement: 'streak_days' },
  { id: '6', name: 'Monthly Master', description: 'Reach a 30-day streak', icon: '🏆', points: 300, threshold: 30, requirement: 'streak_days' },
  { id: '7', name: 'Century Club', description: 'Complete 100 habits', icon: '💯', points: 200, threshold: 100, requirement: 'total_completions' },
  { id: '8', name: 'Unstoppable', description: 'Reach a 100-day streak', icon: '👑', points: 1000, threshold: 100, requirement: 'streak_days' },
];

export default function AchievementsScreen() {
  const habits = useHabitStore((state) => state.habits);
  const completions = useHabitStore((state) => state.completions);

  const getProgress = (achievement: typeof ACHIEVEMENTS[0]) => {
    switch (achievement.requirement) {
      case 'habits_created':
        return Math.min(habits.length, achievement.threshold);
      case 'streak_days':
        const maxStreak = habits.reduce((max, h) => Math.max(max, h.currentStreak), 0);
        return Math.min(maxStreak, achievement.threshold);
      case 'total_completions':
        return Math.min(completions.length, achievement.threshold);
      default:
        return 0;
    }
  };

  const totalPoints = ACHIEVEMENTS.reduce((sum, a) => {
    const progress = getProgress(a);
    return sum + (progress >= a.threshold ? a.points : 0);
  }, 0);

  const unlockedCount = ACHIEVEMENTS.filter(a => getProgress(a) >= a.threshold).length;

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Points Overview */}
        <View style={styles.section}>
          <Card style={styles.pointsCard}>
            <View style={styles.pointsContent}>
              <Text style={styles.trophy}>🏆</Text>
              <Text style={styles.points}>{totalPoints}</Text>
              <Text style={styles.pointsLabel}>Total Points</Text>
              <Text style={styles.unlocked}>
                {unlockedCount}/{ACHIEVEMENTS.length} achievements unlocked
              </Text>
            </View>
          </Card>
        </View>

        {/* Achievements Grid */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>All Achievements</Text>
          <View style={styles.grid}>
            {ACHIEVEMENTS.map((achievement) => {
              const progress = getProgress(achievement);
              const isUnlocked = progress >= achievement.threshold;
              const progressPercentage = (progress / achievement.threshold) * 100;

              return (
                <Card
                  key={achievement.id}
                  style={isUnlocked ? styles.achievementCard : [styles.achievementCard, styles.achievementLocked]}
                >
                  <View style={styles.achievementContent}>
                    <Text style={[styles.achievementIcon, !isUnlocked && styles.iconLocked]}>
                      {achievement.icon}
                    </Text>
                    <Text style={[styles.achievementName, !isUnlocked && styles.textLocked]}>
                      {achievement.name}
                    </Text>
                    <Text style={[styles.achievementDesc, !isUnlocked && styles.textLocked]} numberOfLines={2}>
                      {achievement.description}
                    </Text>
                    {isUnlocked ? (
                      <View style={styles.pointsBadge}>
                        <Text style={styles.pointsBadgeText}>+{achievement.points} pts</Text>
                      </View>
                    ) : (
                      <View style={styles.progressContainer}>
                        <View style={styles.progressBar}>
                          <View style={[styles.progressFill, { width: `${progressPercentage}%` }]} />
                        </View>
                        <Text style={styles.progressText}>{progress}/{achievement.threshold}</Text>
                      </View>
                    )}
                  </View>
                </Card>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  pointsCard: {
    backgroundColor: colors.primary[500],
    borderColor: colors.primary[500],
  },
  pointsContent: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  trophy: {
    fontSize: 48,
    marginBottom: 8,
  },
  points: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.white,
  },
  pointsLabel: {
    fontSize: 14,
    color: colors.primary[100],
  },
  unlocked: {
    fontSize: 14,
    color: colors.white,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.gray[900],
    marginBottom: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  achievementCard: {
    width: '48%',
    marginBottom: 12,
  },
  achievementLocked: {
    backgroundColor: colors.gray[100],
  },
  achievementContent: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  achievementIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  iconLocked: {
    opacity: 0.3,
  },
  achievementName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.gray[900],
    textAlign: 'center',
  },
  achievementDesc: {
    fontSize: 12,
    color: colors.gray[500],
    textAlign: 'center',
    marginTop: 4,
  },
  textLocked: {
    color: colors.gray[400],
  },
  pointsBadge: {
    backgroundColor: colors.success[100],
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    marginTop: 8,
  },
  pointsBadgeText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.success[600],
  },
  progressContainer: {
    width: '100%',
    marginTop: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: colors.gray[200],
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary[500],
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: colors.gray[400],
    textAlign: 'center',
    marginTop: 4,
  },
});
