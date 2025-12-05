import { View, Text, StyleSheet } from 'react-native';
import { Card } from '../ui/Card';
import { Checkbox } from '../ui/Checkbox';
import { Habit } from '../../types';
import { colors } from '../../constants/colors';

interface HabitCardProps {
  habit: Habit;
  isCompleted: boolean;
  onToggle: () => void;
  onPress: () => void;
}

export function HabitCard({
  habit,
  isCompleted,
  onToggle,
  onPress,
}: HabitCardProps) {
  return (
    <Card onPress={onPress} style={styles.card}>
      <View style={styles.container}>
        <Checkbox
          checked={isCompleted}
          onToggle={onToggle}
          color={habit.color}
          size="lg"
        />
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.icon}>{habit.icon}</Text>
            <Text
              style={[
                styles.name,
                isCompleted && styles.nameCompleted,
              ]}
            >
              {habit.name}
            </Text>
          </View>
          {habit.description && (
            <Text style={styles.description} numberOfLines={1}>
              {habit.description}
            </Text>
          )}
        </View>
        {habit.currentStreak > 0 && (
          <View style={styles.streakBadge}>
            <Text style={styles.streakIcon}>🔥</Text>
            <Text style={styles.streakText}>{habit.currentStreak}</Text>
          </View>
        )}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    marginLeft: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  icon: {
    fontSize: 24,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.gray[900],
  },
  nameCompleted: {
    color: colors.gray[400],
    textDecorationLine: 'line-through',
  },
  description: {
    fontSize: 14,
    color: colors.gray[500],
    marginTop: 2,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.orange[100],
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  streakIcon: {
    fontSize: 14,
  },
  streakText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.orange[600],
    marginLeft: 4,
  },
});
