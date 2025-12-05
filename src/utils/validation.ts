/**
 * Validation utilities for habit data
 */

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Sanitizes input text by trimming and removing dangerous characters
 */
export function sanitizeText(text: string): string {
  return text
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .substring(0, 500); // Limit length
}

/**
 * Validates habit name
 */
export function validateHabitName(name: string): ValidationResult {
  const errors: string[] = [];
  const sanitized = sanitizeText(name);

  if (!sanitized) {
    errors.push('Habit name is required');
  } else if (sanitized.length < 2) {
    errors.push('Habit name must be at least 2 characters');
  } else if (sanitized.length > 50) {
    errors.push('Habit name must be less than 50 characters');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validates habit description
 */
export function validateHabitDescription(description: string | undefined): ValidationResult {
  const errors: string[] = [];

  if (description) {
    const sanitized = sanitizeText(description);
    if (sanitized.length > 200) {
      errors.push('Description must be less than 200 characters');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validates a complete habit form
 */
export function validateHabitForm(data: {
  name: string;
  description?: string;
  targetDays?: number[];
  frequency: string;
}): ValidationResult {
  const errors: string[] = [];

  // Validate name
  const nameValidation = validateHabitName(data.name);
  errors.push(...nameValidation.errors);

  // Validate description
  if (data.description) {
    const descValidation = validateHabitDescription(data.description);
    errors.push(...descValidation.errors);
  }

  // Validate target days for weekly frequency
  if (data.frequency === 'weekly' && (!data.targetDays || data.targetDays.length === 0)) {
    errors.push('Please select at least one day for weekly habits');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Checks if a string contains only safe characters
 */
export function isSafeString(text: string): boolean {
  // Allow alphanumeric, spaces, common punctuation, and emojis
  const safePattern = /^[\p{L}\p{N}\p{Emoji}\s.,!?'-]+$/u;
  return safePattern.test(text);
}
