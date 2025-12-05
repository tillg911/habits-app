import { View, TextInput, Text, StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';

interface InputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  multiline?: boolean;
  numberOfLines?: number;
  maxLength?: number;
}

export function Input({
  value,
  onChangeText,
  placeholder,
  label,
  error,
  multiline = false,
  numberOfLines = 1,
  maxLength,
}: InputProps) {
  return (
    <View>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.gray[400]}
        multiline={multiline}
        numberOfLines={numberOfLines}
        maxLength={maxLength}
        style={[
          styles.input,
          error && styles.inputError,
          multiline && styles.multiline,
        ]}
        textAlignVertical={multiline ? 'top' : 'center'}
      />
      {error && <Text style={styles.error}>{error}</Text>}
      {maxLength && (
        <Text style={styles.counter}>
          {value.length}/{maxLength}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.gray[700],
    marginBottom: 6,
  },
  input: {
    backgroundColor: colors.gray[50],
    borderWidth: 1,
    borderColor: colors.gray[200],
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.gray[900],
  },
  inputError: {
    borderColor: colors.red[500],
  },
  multiline: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  error: {
    fontSize: 14,
    color: colors.red[500],
    marginTop: 4,
  },
  counter: {
    fontSize: 12,
    color: colors.gray[400],
    marginTop: 4,
    textAlign: 'right',
  },
});
