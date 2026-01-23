/**
 * Validation Utilities
 * Reusable validation functions
 */

import { VALIDATION, ERROR_MESSAGES } from '../constants';

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validate email format
 */
export const validateEmail = (email: string): ValidationResult => {
  if (!email || email.trim() === '') {
    return { isValid: false, error: ERROR_MESSAGES.REQUIRED };
  }

  if (!VALIDATION.EMAIL.REGEX.test(email)) {
    return { isValid: false, error: ERROR_MESSAGES.INVALID_EMAIL };
  }

  return { isValid: true };
};

/**
 * Validate password
 */
export const validatePassword = (password: string): ValidationResult => {
  if (!password || password.trim() === '') {
    return { isValid: false, error: ERROR_MESSAGES.REQUIRED };
  }

  if (password.length < VALIDATION.PASSWORD.MIN_LENGTH) {
    return {
      isValid: false,
      error: ERROR_MESSAGES.PASSWORD_TOO_SHORT,
    };
  }

  if (password.length > VALIDATION.PASSWORD.MAX_LENGTH) {
    return {
      isValid: false,
      error: `Mật khẩu không được vượt quá ${VALIDATION.PASSWORD.MAX_LENGTH} ký tự`,
    };
  }

  return { isValid: true };
};

/**
 * Validate password confirmation
 */
export const validatePasswordConfirmation = (
  password: string,
  confirmPassword: string
): ValidationResult => {
  if (!confirmPassword || confirmPassword.trim() === '') {
    return { isValid: false, error: ERROR_MESSAGES.REQUIRED };
  }

  if (password !== confirmPassword) {
    return { isValid: false, error: ERROR_MESSAGES.PASSWORD_MISMATCH };
  }

  return { isValid: true };
};

/**
 * Validate phone number
 */
export const validatePhone = (phone: string): ValidationResult => {
  if (!phone || phone.trim() === '') {
    return { isValid: false, error: ERROR_MESSAGES.REQUIRED };
  }

  if (!VALIDATION.PHONE.REGEX.test(phone)) {
    return { isValid: false, error: ERROR_MESSAGES.INVALID_PHONE };
  }

  return { isValid: true };
};

/**
 * Validate OTP
 */
export const validateOTP = (otp: string): ValidationResult => {
  if (!otp || otp.trim() === '') {
    return { isValid: false, error: ERROR_MESSAGES.REQUIRED };
  }

  if (otp.length !== VALIDATION.OTP.LENGTH) {
    return { isValid: false, error: ERROR_MESSAGES.OTP_LENGTH };
  }

  if (!/^\d+$/.test(otp)) {
    return { isValid: false, error: ERROR_MESSAGES.OTP_INVALID };
  }

  return { isValid: true };
};

/**
 * Validate required field
 */
export const validateRequired = (value: string, fieldName?: string): ValidationResult => {
  if (!value || value.trim() === '') {
    return {
      isValid: false,
      error: fieldName ? `${fieldName} không được để trống` : ERROR_MESSAGES.REQUIRED,
    };
  }

  return { isValid: true };
};

/**
 * Validate full name
 */
export const validateFullName = (name: string): ValidationResult => {
  if (!name || name.trim() === '') {
    return { isValid: false, error: 'Họ và tên không được để trống' };
  }

  if (name.trim().length < 2) {
    return { isValid: false, error: 'Họ và tên phải có ít nhất 2 ký tự' };
  }

  return { isValid: true };
};
