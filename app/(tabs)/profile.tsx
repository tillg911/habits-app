import { View, Text, ScrollView, Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, Button } from '../../src/components/ui';
import { useHabitStore } from '../../src/store';
import { colors } from '../../src/constants/colors';

export default function ProfileScreen() {
  const habits = useHabitStore((state) => state.habits);
  const completions = useHabitStore((state) => state.completions);

  const stats = {
    totalHabits: habits.length,
    activeHabits: habits.filter((h) => !h.archivedAt).length,
    totalCompletions: completions.length,
    longestStreak: habits.reduce((max, h) => Math.max(max, h.bestStreak), 0),
    currentStreaks: habits.reduce((sum, h) => sum + h.currentStreak, 0),
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'This will delete all your habits and progress. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            habits.forEach((habit) => {
              useHabitStore.getState().deleteHabit(habit.id);
            });
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* User Card */}
        <View style={styles.section}>
          <Card>
            <View style={styles.userContent}>
              <View style={styles.avatar}>
                <Text style={styles.avatarIcon}>🧘</Text>
              </View>
              <Text style={styles.userName}>Habit Builder</Text>
              <Text style={styles.userSubtitle}>Building better habits daily</Text>
            </View>
          </Card>
        </View>

        {/* Stats Grid */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Stats</Text>
          <View style={styles.statsGrid}>
            <StatCard value={stats.activeHabits.toString()} label="Active Habits" icon="📋" />
            <StatCard value={stats.totalCompletions.toString()} label="Completions" icon="✅" />
            <StatCard value={stats.longestStreak.toString()} label="Best Streak" icon="🔥" />
            <StatCard value={stats.currentStreaks.toString()} label="Active Streaks" icon="⚡" />
          </View>
        </View>

        {/* Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <Card>
            <SettingsItem icon="🔔" title="Notifications" subtitle="Manage reminders" />
            <View style={styles.divider} />
            <SettingsItem icon="🎨" title="Appearance" subtitle="Theme & colors" />
            <View style={styles.divider} />
            <SettingsItem icon="☁️" title="Cloud Sync" subtitle="Coming soon" disabled />
          </Card>
        </View>

        {/* Danger Zone */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data</Text>
          <Card>
            <Button title="Clear All Data" variant="danger" onPress={handleClearData} />
          </Card>
        </View>

        {/* App Info */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Minimal Habits v1.0.0</Text>
          <Text style={styles.footerSubtext}>Built with love for better habits</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatCard({ value, label, icon }: { value: string; label: string; icon: string }) {
  return (
    <Card style={styles.statCard}>
      <View style={styles.statContent}>
        <Text style={styles.statIcon}>{icon}</Text>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
      </View>
    </Card>
  );
}

function SettingsItem({ icon, title, subtitle, disabled }: { icon: string; title: string; subtitle: string; disabled?: boolean }) {
  return (
    <View style={[styles.settingsItem, disabled && styles.settingsDisabled]}>
      <Text style={styles.settingsIcon}>{icon}</Text>
      <View style={styles.settingsInfo}>
        <Text style={styles.settingsTitle}>{title}</Text>
        <Text style={styles.settingsSubtitle}>{subtitle}</Text>
      </View>
      <Text style={styles.settingsArrow}>›</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.gray[900],
    marginBottom: 12,
  },
  userContent: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    backgroundColor: colors.primary[100],
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarIcon: {
    fontSize: 40,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.gray[900],
  },
  userSubtitle: {
    fontSize: 14,
    color: colors.gray[500],
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    marginBottom: 12,
  },
  statContent: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  statIcon: {
    fontSize: 24,
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
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  settingsDisabled: {
    opacity: 0.5,
  },
  settingsIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  settingsInfo: {
    flex: 1,
  },
  settingsTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.gray[900],
  },
  settingsSubtitle: {
    fontSize: 14,
    color: colors.gray[500],
  },
  settingsArrow: {
    fontSize: 20,
    color: colors.gray[400],
  },
  divider: {
    height: 1,
    backgroundColor: colors.gray[100],
    marginVertical: 8,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  footerText: {
    fontSize: 14,
    color: colors.gray[400],
  },
  footerSubtext: {
    fontSize: 12,
    color: colors.gray[400],
    marginTop: 4,
  },
});
