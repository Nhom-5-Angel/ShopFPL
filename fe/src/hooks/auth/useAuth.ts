/**
 * useAuth Hook
 * Custom hook for authentication operations with validation and error handling
 */

import { useState } from 'react';
import { Alert } from 'react-native';
import {
  register,
  login,
  forgotPassword,
  verifyOtp,
  resetPassword,
  RegisterPayload,
  LoginPayload,
  ForgotPasswordPayload,
  VerifyOtpPayload,
  ResetPasswordPayload,
} from '../../services/auth/auth.service';
import { useAuthContext } from '../../contexts/AuthContext';
import {
  validateEmail,
  validatePassword,
  validatePasswordConfirmation,
  validatePhone,
  validateOTP,
  validateFullName,
} from '../../utils/validation';
import { handleApiError } from '../../services/api/errorHandler';
import { SUCCESS_MESSAGES } from '../../constants';
import { User } from '../../types';
import { tokenStorage } from '../../utils';

export const useAuth = () => {
  const { login: loginContext } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Register a new user
   */
  const handleRegister = async (
    data: {
      username: string;
      email: string;
      phoneNumber: string;
      password: string;
      confirmPassword: string;
    },
    onSuccess?: () => void
  ) => {
    // Validation
    const nameValidation = validateFullName(data.username);
    if (!nameValidation.isValid) {
      Alert.alert('Lỗi', nameValidation.error);
      return;
    }

    const emailValidation = validateEmail(data.email);
    if (!emailValidation.isValid) {
      Alert.alert('Lỗi', emailValidation.error);
      return;
    }

    const phoneValidation = validatePhone(data.phoneNumber);
    if (!phoneValidation.isValid) {
      Alert.alert('Lỗi', phoneValidation.error);
      return;
    }

    const passwordValidation = validatePassword(data.password);
    if (!passwordValidation.isValid) {
      Alert.alert('Lỗi', passwordValidation.error);
      return;
    }

    const confirmPasswordValidation = validatePasswordConfirmation(
      data.password,
      data.confirmPassword
    );
    if (!confirmPasswordValidation.isValid) {
      Alert.alert('Lỗi', confirmPasswordValidation.error);
      return;
    }

    setIsLoading(true);
    try {
      const payload: RegisterPayload = {
        username: data.username,
        email: data.email,
        phoneNumber: data.phoneNumber,
        password: data.password,
      };

      console.log('[Auth] Register payload', payload);
      const response = await register(payload);
      console.log('[Auth] Register response', response);

      if (response.success && response.data) {
        // Đăng ký thành công: chỉ thông báo và điều hướng về màn Đăng nhập,
        // KHÔNG tự đăng nhập để tránh nhảy thẳng vào màn Home gây khó hiểu.
        Alert.alert('Thành công', SUCCESS_MESSAGES.REGISTER_SUCCESS);
        onSuccess?.();
      }
    } catch (error) {
      console.error('[Auth] Register error', error);
      const errorMessage = handleApiError(error);
      Alert.alert('Thất bại', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Login user
   */
  const handleLogin = async (
    data: LoginPayload,
    onSuccess?: () => void
  ) => {
    // Validation
    const emailValidation = validateEmail(data.email);
    if (!emailValidation.isValid) {
      Alert.alert('Lỗi', emailValidation.error);
      return;
    }

    const passwordValidation = validatePassword(data.password);
    if (!passwordValidation.isValid) {
      Alert.alert('Lỗi', passwordValidation.error);
      return;
    }

    setIsLoading(true);
    try {
      const response = await login(data);

      if (response.success && response.data) {
        // Save user data and access token
        const userData: User = {
          _id: response.data.user.id,
          id: response.data.user.id,
          username: response.data.user.username,
          email: response.data.user.email,
          phoneNumber: response.data.user.phoneNumber,
          role: 'user',
        };
        await loginContext(userData, response.data.accessToken);

        // Lưu refresh token để phục vụ tự động refresh khi accessToken hết hạn
        if (response.data.refreshToken) {
          await tokenStorage.setRefreshToken(response.data.refreshToken);
        }

        Alert.alert('Thành công', SUCCESS_MESSAGES.LOGIN_SUCCESS);
        onSuccess?.();
      }
    } catch (error) {
      const errorMessage = handleApiError(error);
      Alert.alert('Thất bại', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Request password reset (send OTP)
   */
  const handleForgotPassword = async (
    data: ForgotPasswordPayload,
    onSuccess?: () => void
  ) => {
    const emailValidation = validateEmail(data.email);
    if (!emailValidation.isValid) {
      Alert.alert('Lỗi', emailValidation.error);
      return;
    }

    setIsLoading(true);
    try {
      const response = await forgotPassword(data);

      if (response.success) {
        Alert.alert('Thành công', SUCCESS_MESSAGES.FORGOT_PASSWORD_SUCCESS);
        onSuccess?.();
      }
    } catch (error) {
      const errorMessage = handleApiError(error);
      Alert.alert('Thất bại', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Resend OTP for password reset
   */
  const handleResendForgotPassword = async (
    data: ForgotPasswordPayload,
    onSuccess?: () => void
  ) => {
    const emailValidation = validateEmail(data.email);
    if (!emailValidation.isValid) {
      Alert.alert('Lỗi', emailValidation.error);
      return;
    }

    setIsLoading(true);
    try {
      const response = await forgotPassword(data);

      if (response.success) {
        Alert.alert('Thành công', 'Mã xác nhận đã được gửi lại về email của bạn');
        onSuccess?.();
      }
    } catch (error) {
      const errorMessage = handleApiError(error);
      Alert.alert('Thất bại', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Verify OTP
   */
  const handleVerifyOtp = async (
    data: VerifyOtpPayload,
    onSuccess?: () => void
  ) => {
    const otpValidation = validateOTP(data.otp);
    if (!otpValidation.isValid) {
      Alert.alert('Lỗi', otpValidation.error);
      return;
    }

    setIsLoading(true);
    try {
      const response = await verifyOtp(data);

      if (response.success) {
        Alert.alert('Thành công', SUCCESS_MESSAGES.VERIFY_OTP_SUCCESS);
        onSuccess?.();
      }
    } catch (error) {
      const errorMessage = handleApiError(error);
      Alert.alert('Thất bại', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Change password after OTP verification
   */
  const handleChangePassword = async (
    data: {
      email: string;
      newPassword: string;
      confirmPassword: string;
    },
    onSuccess?: () => void
  ) => {
    const passwordValidation = validatePassword(data.newPassword);
    if (!passwordValidation.isValid) {
      Alert.alert('Lỗi', passwordValidation.error);
      return;
    }

    const confirmPasswordValidation = validatePasswordConfirmation(
      data.newPassword,
      data.confirmPassword
    );
    if (!confirmPasswordValidation.isValid) {
      Alert.alert('Lỗi', confirmPasswordValidation.error);
      return;
    }

    setIsLoading(true);
    try {
      const payload: ResetPasswordPayload = {
        email: data.email,
        newPassword: data.newPassword,
      };

      const response = await resetPassword(payload);

      if (response.success) {
        Alert.alert('Thành công', SUCCESS_MESSAGES.CHANGE_PASSWORD_SUCCESS);
        onSuccess?.();
      }
    } catch (error) {
      const errorMessage = handleApiError(error);
      Alert.alert('Thất bại', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleRegister,
    handleLogin,
    handleForgotPassword,
    handleResendForgotPassword,
    handleVerifyOtp,
    handleChangePassword,
  };
};
