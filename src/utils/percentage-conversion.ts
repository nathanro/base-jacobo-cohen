/**
 * Percentage conversion utilities for large numeric data ranges
 * Converts between raw values and percentage scale (0-100%)
 */

// Constants for the data range
export const DATA_RANGE = {
  MIN_VALUE: -98908000.00,
  MAX_VALUE: 44019015000000.00
} as const;

/**
 * Converts a raw numeric value to percentage (0-100%)
 * Formula: percentage = ((value - min_value) / (max_value - min_value)) * 100
 */
export function valueToPercentage(value: number): number {
  if (typeof value !== 'number' || isNaN(value)) {
    return 0;
  }

  const { MIN_VALUE, MAX_VALUE } = DATA_RANGE;
  const range = MAX_VALUE - MIN_VALUE;
  const normalizedValue = value - MIN_VALUE;
  const percentage = normalizedValue / range * 100;

  // Ensure percentage is between 0 and 100
  return Math.max(0, Math.min(100, percentage));
}

/**
 * Converts a percentage (0-100%) back to raw numeric value
 * Formula: value = (percentage / 100) * (max_value - min_value) + min_value
 */
export function percentageToValue(percentage: number): number {
  if (typeof percentage !== 'number' || isNaN(percentage)) {
    return DATA_RANGE.MIN_VALUE;
  }

  // Ensure percentage is between 0 and 100
  const clampedPercentage = Math.max(0, Math.min(100, percentage));

  const { MIN_VALUE, MAX_VALUE } = DATA_RANGE;
  const range = MAX_VALUE - MIN_VALUE;
  const value = clampedPercentage / 100 * range + MIN_VALUE;

  return value;
}

/**
 * Formats a raw value as a percentage string
 */
export function formatAsPercentage(value: number, precision: number = 2): string {
  const percentage = valueToPercentage(value);
  return `${percentage.toFixed(precision)}%`;
}

/**
 * Checks if a value should be converted to percentage based on field characteristics
 * This determines which fields should use the percentage conversion
 */
export function shouldConvertToPercentage(fieldName: string, value: number): boolean {
  if (typeof value !== 'number' || isNaN(value)) {
    return false;
  }

  const fieldLower = fieldName.toLowerCase();

  // Convert fields that are likely to benefit from percentage representation
  // This includes large numeric values that would be difficult to interpret
  const isLargeNumericField = Math.abs(value) > 1000000; // Values > 1M

  // Also check if the field name suggests it's a financial metric that could benefit from normalization
  const isFinancialMetric =
  fieldLower.includes('revenue') ||
  fieldLower.includes('sales') ||
  fieldLower.includes('income') ||
  fieldLower.includes('expense') ||
  fieldLower.includes('cost') ||
  fieldLower.includes('asset') ||
  fieldLower.includes('liability') ||
  fieldLower.includes('debt') ||
  fieldLower.includes('profit') ||
  fieldLower.includes('cash') ||
  fieldLower.includes('investment') ||
  fieldLower.includes('equity') ||
  fieldLower.includes('capital') ||
  fieldLower.includes('value') ||
  fieldLower.includes('worth') ||
  fieldLower.includes('balance') ||
  fieldLower.includes('amount');

  // Convert if it's a large value or a financial metric within our data range
  return isLargeNumericField && isFinancialMetric &&
  value >= DATA_RANGE.MIN_VALUE && value <= DATA_RANGE.MAX_VALUE;
}

/**
 * Gets the appropriate step size for percentage sliders based on precision needs
 */
export function getPercentageStep(precision: number = 2): number {
  return 1 / Math.pow(10, precision);
}

/**
 * Converts percentage range filter values back to raw values for API queries
 */
export function convertPercentageRangeToValues(percentageRange: [number, number]): [number, number] {
  return [
  percentageToValue(percentageRange[0]),
  percentageToValue(percentageRange[1])];

}

/**
 * Converts raw value range to percentage range for display
 */
export function convertValueRangeToPercentages(valueRange: [number, number]): [number, number] {
  return [
  valueToPercentage(valueRange[0]),
  valueToPercentage(valueRange[1])];

}