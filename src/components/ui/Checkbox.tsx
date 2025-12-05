import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors } from '../../constants/colors';

interface CheckboxProps {
  checked: boolean;
  onToggle: () => void;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  disabled?: boolean;
}

export function Checkbox({
  checked,
  onToggle,
  size = 'md',
  color = colors.success[500],
  disabled = false,
}: CheckboxProps) {
  const handlePress = () => {
    if (!disabled) {
      Haptics.impactAsync(
        checked
          ? Haptics.ImpactFeedbackStyle.Light
          : Haptics.ImpactFeedbackStyle.Medium
      );
      onToggle();
    }
  };

  const sizeValue = size === 'sm' ? 24 : size === 'md' ? 32 : 40;
  const checkSize = size === 'sm' ? 14 : size === 'md' ? 18 : 22;

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.7}
      style={[
        styles.checkbox,
        {
          width: sizeValue,
          height: sizeValue,
          backgroundColor: checked ? color : 'transparent',
          borderColor: checked ? color : colors.gray[300],
        },
        disabled && styles.disabled,
      ]}
    >
      {checked && (
        <Text style={[styles.check, { fontSize: checkSize }]}>✓</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  checkbox: {
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  check: {
    color: colors.white,
    fontWeight: 'bold',
  },
  disabled: {
    opacity: 0.5,
  },
});
