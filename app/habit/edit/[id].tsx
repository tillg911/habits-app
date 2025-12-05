import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Input, Button } from '../../../src/components/ui';
import { useHabitStore } from '../../../src/store';
import { HabitFrequency } from '../../../src/types';
import { colors } from '../../../src/constants/colors';
import { validateHabitName, validateHabitDescription, sanitizeText } from '../../../src/utils/validation';

const ICONS = ['💪', '🏃', '📚', '💧', '🧘', '😴', '🍎', '💊', '✍️', '🎵', '🧹', '💰'];
const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#14b8a6', '#0ea5e9', '#8b5cf6', '#ec4899'];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

interface FormErrors {
  name?: string;
  description?: string;
  targetDays?: string;
}

export default function EditHabitScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const habit = useHabitStore((state) => state.habits.find((h) => h.id === id));
  const updateHabit = useHabitStore((state) => state.updateHabit);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('💪');
  const [color, setColor] = useState('#0ea5e9');
  const [frequency, setFrequency] = useState<HabitFrequency>('daily');
  const [targetDays, setTargetDays] = useState<number[]>([0, 1, 2, 3, 4, 5, 6]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (habit) {
      setName(habit.name);
      setDescription(habit.description || '');
      setIcon(habit.icon);
      setColor(habit.color);
      setFrequency(habit.frequency);
      setTargetDays(habit.targetDays || [0, 1, 2, 3, 4, 5, 6]);
    }
  }, [habit]);

  if (!habit) {
    return (
      <SafeAreaView style={styles.notFound}>
        <Text style={styles.notFoundText}>Habit not found</Text>
      </SafeAreaView>
    );
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    const nameValidation = validateHabitName(name);
    if (!nameValidation.isValid) {
      newErrors.name = nameValidation.errors[0];
    }

    const descValidation = validateHabitDescription(description);
    if (!descValidation.isValid) {
      newErrors.description = descValidation.errors[0];
    }

    if (frequency === 'weekly' && targetDays.length === 0) {
      newErrors.targetDays = 'Please select at least one day';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNameChange = (text: string) => {
    setName(text);
    if (errors.name) {
      setErrors((prev) => ({ ...prev, name: undefined }));
    }
  };

  const handleDescriptionChange = (text: string) => {
    setDescription(text);
    if (errors.description) {
      setErrors((prev) => ({ ...prev, description: undefined }));
    }
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      updateHabit(id!, {
        name: sanitizeText(name),
        description: description ? sanitizeText(description) : undefined,
        icon,
        color,
        frequency,
        targetDays: frequency === 'weekly' ? targetDays : undefined,
      });

      router.back();
    } catch (error) {
      setIsSubmitting(false);
      setErrors({ name: 'Failed to update habit. Please try again.' });
    }
  };

  const toggleDay = (day: number) => {
    if (targetDays.includes(day)) {
      if (targetDays.length > 1) {
        setTargetDays(targetDays.filter((d) => d !== day));
      }
    } else {
      setTargetDays([...targetDays, day].sort());
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.inputGroup}>
            <Input
              value={name}
              onChangeText={handleNameChange}
              label="Habit Name"
              placeholder="e.g., Drink 8 glasses of water"
              maxLength={50}
              error={errors.name}
            />
          </View>

          <View style={styles.inputGroup}>
            <Input
              value={description}
              onChangeText={handleDescriptionChange}
              label="Description (optional)"
              placeholder="Add more details about your habit"
              multiline
              numberOfLines={3}
              maxLength={200}
              error={errors.description}
            />
          </View>

          {/* Icon Picker */}
          <Text style={styles.label}>Icon</Text>
          <View style={styles.iconGrid}>
            {ICONS.map((emoji) => (
              <TouchableOpacity
                key={emoji}
                onPress={() => setIcon(emoji)}
                style={[styles.iconButton, icon === emoji && styles.iconSelected]}
              >
                <Text style={styles.iconText}>{emoji}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Color Picker */}
          <Text style={styles.label}>Color</Text>
          <View style={styles.colorGrid}>
            {COLORS.map((c) => (
              <TouchableOpacity
                key={c}
                onPress={() => setColor(c)}
                style={[
                  styles.colorButton,
                  { backgroundColor: c },
                  color === c && styles.colorSelected,
                ]}
              />
            ))}
          </View>

          {/* Frequency Selector */}
          <Text style={styles.label}>Frequency</Text>
          <View style={styles.frequencyRow}>
            <TouchableOpacity
              onPress={() => setFrequency('daily')}
              style={[styles.frequencyButton, frequency === 'daily' && styles.frequencySelected]}
            >
              <Text style={[styles.frequencyText, frequency === 'daily' && styles.frequencyTextSelected]}>
                Daily
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setFrequency('weekly')}
              style={[styles.frequencyButton, frequency === 'weekly' && styles.frequencySelected]}
            >
              <Text style={[styles.frequencyText, frequency === 'weekly' && styles.frequencyTextSelected]}>
                Weekly
              </Text>
            </TouchableOpacity>
          </View>

          {/* Day Selector */}
          {frequency === 'weekly' && (
            <View style={styles.daysSection}>
              <Text style={styles.label}>Select Days</Text>
              <View style={styles.daysRow}>
                {DAYS.map((day, index) => (
                  <TouchableOpacity
                    key={day}
                    onPress={() => toggleDay(index)}
                    style={[styles.dayButton, targetDays.includes(index) && styles.daySelected]}
                  >
                    <Text style={[styles.dayText, targetDays.includes(index) && styles.dayTextSelected]}>
                      {day}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              {errors.targetDays && (
                <Text style={styles.errorText}>{errors.targetDays}</Text>
              )}
            </View>
          )}

          {/* Preview */}
          <Text style={styles.label}>Preview</Text>
          <View style={[styles.preview, { borderLeftColor: color }]}>
            <Text style={styles.previewIcon}>{icon}</Text>
            <View style={styles.previewContent}>
              <Text style={styles.previewName}>{name || 'Your Habit'}</Text>
              {description && (
                <Text style={styles.previewDescription} numberOfLines={1}>
                  {description}
                </Text>
              )}
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Save Changes"
          onPress={handleSubmit}
          loading={isSubmitting}
          disabled={!name.trim()}
        />
      </View>
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
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.gray[700],
    marginBottom: 8,
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  iconButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.gray[200],
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconSelected: {
    backgroundColor: colors.primary[100],
    borderWidth: 2,
    borderColor: colors.primary[500],
  },
  iconText: {
    fontSize: 24,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  colorButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  colorSelected: {
    borderWidth: 4,
    borderColor: colors.gray[900],
  },
  frequencyRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  frequencyButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.gray[200],
    alignItems: 'center',
  },
  frequencySelected: {
    backgroundColor: colors.primary[500],
    borderColor: colors.primary[500],
  },
  frequencyText: {
    fontWeight: '500',
    color: colors.gray[700],
  },
  frequencyTextSelected: {
    color: colors.white,
  },
  daysSection: {
    marginBottom: 24,
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.gray[200],
    alignItems: 'center',
    justifyContent: 'center',
  },
  daySelected: {
    backgroundColor: colors.primary[500],
    borderColor: colors.primary[500],
  },
  dayText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.gray[700],
  },
  dayTextSelected: {
    color: colors.white,
  },
  errorText: {
    fontSize: 14,
    color: colors.red[500],
    marginTop: 8,
  },
  preview: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.gray[100],
    borderLeftWidth: 4,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  previewIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  previewContent: {
    flex: 1,
  },
  previewName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.gray[900],
  },
  previewDescription: {
    fontSize: 14,
    color: colors.gray[500],
  },
  footer: {
    padding: 20,
    paddingTop: 8,
    backgroundColor: colors.gray[50],
    borderTopWidth: 1,
    borderTopColor: colors.gray[100],
  },
});
