import { TouchableOpacity, Text, ActivityIndicator, View, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors } from '../../constants/colors';

interface ButtonProps {
  onPress: () => void;
  title: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
}

export function Button({
  onPress,
  title,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
}: ButtonProps) {
  const handlePress = () => {
    if (!disabled && !loading) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPress();
    }
  };

  const getButtonStyle = (): ViewStyle[] => {
    const base: ViewStyle[] = [styles.base];

    if (size === 'sm') base.push(styles.size_sm);
    if (size === 'md') base.push(styles.size_md);
    if (size === 'lg') base.push(styles.size_lg);

    if (variant === 'primary') base.push(styles.primary);
    if (variant === 'secondary') base.push(styles.secondary);
    if (variant === 'ghost') base.push(styles.ghost);
    if (variant === 'danger') base.push(styles.danger);

    if (disabled) base.push(styles.disabled);

    return base;
  };

  const getTextStyle = (): TextStyle[] => {
    const base: TextStyle[] = [styles.text];

    if (size === 'sm') base.push(styles.text_sm);
    if (size === 'md') base.push(styles.text_md);
    if (size === 'lg') base.push(styles.text_lg);

    if (variant === 'primary' || variant === 'danger') base.push(styles.textLight);
    if (variant === 'secondary') base.push(styles.textDark);
    if (variant === 'ghost') base.push(styles.textPrimary);

    return base;
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled || loading}
      style={getButtonStyle()}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' || variant === 'danger' ? '#fff' : colors.primary[500]}
          size="small"
        />
      ) : (
        <View style={styles.content}>
          {icon}
          <Text style={getTextStyle()}>{title}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  primary: {
    backgroundColor: colors.primary[500],
  },
  secondary: {
    backgroundColor: colors.gray[100],
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  danger: {
    backgroundColor: colors.red[500],
  },
  disabled: {
    opacity: 0.5,
  },
  size_sm: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  size_md: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  size_lg: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  text: {
    fontWeight: '600',
  },
  text_sm: {
    fontSize: 14,
  },
  text_md: {
    fontSize: 16,
  },
  text_lg: {
    fontSize: 18,
  },
  textLight: {
    color: colors.white,
  },
  textDark: {
    color: colors.gray[900],
  },
  textPrimary: {
    color: colors.primary[500],
  },
});
