/**
 * Verify OTP Screen
 * Screen for verifying OTP code sent to email
 */

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Pressable, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import { useAuth } from '../../hooks/auth/useAuth';
import { Button, Input } from '../../components/common';
import { colors, typography, spacing } from '../../theme';
import Ionicons from 'react-native-vector-icons/Ionicons';

type VerifyOTPNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'VerifyOTP'>;
type VerifyOTPRouteProp = RouteProp<AuthStackParamList, 'VerifyOTP'>;

const OTP_EXPIRE_TIME = 300; // 5 minutes
const RESEND_COOLDOWN = 30; // 30 seconds

const VerifyOTPScreen: React.FC = () => {
  const navigation = useNavigation<VerifyOTPNavigationProp>();
  const route = useRoute<VerifyOTPRouteProp>();
  const { handleVerifyOtp, handleResendForgotPassword, isLoading } = useAuth();

  const { email } = route.params;

  const [otpCode, setOtpCode] = useState('');
  const [otpExpire, setOtpExpire] = useState(OTP_EXPIRE_TIME);
  const [resendCountdown, setResendCountdown] = useState(RESEND_COOLDOWN);
  const [otpExpired, setOtpExpired] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const [error, setError] = useState<string | undefined>();

  // OTP expiration timer
  useEffect(() => {
    if (otpExpire === 0) {
      setOtpExpired(true);
      return;
    }

    const timer = setTimeout(() => {
      setOtpExpire((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [otpExpire]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCountdown === 0) {
      setCanResend(true);
      return;
    }

    const timer = setTimeout(() => {
      setResendCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [resendCountdown]);

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async () => {
    setError(undefined);

    if (!otpCode.trim()) {
      setError('Mã OTP không được để trống');
      return;
    }

    if (otpCode.length !== 6) {
      setError('Mã OTP phải có 6 số');
      return;
    }

    handleVerifyOtp({ email, otp: otpCode }, () => {
      navigation.navigate('ChangePassword', { email });
    });
  };

  const handleResend = async () => {
    if (!canResend) return;

    handleResendForgotPassword({ email }, () => {
      setOtpExpire(OTP_EXPIRE_TIME);
      setResendCountdown(RESEND_COOLDOWN);
      setOtpExpired(false);
      setCanResend(false);
      setOtpCode('');
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
            <Text style={styles.backText}>Quay lại</Text>
          </Pressable>
        </View>

        <View style={styles.titleSection}>
          <Text style={styles.title}>Xác thực OTP</Text>
          <Text style={styles.subtitle}>
            Chúng tôi đã gửi mã OTP gồm 6 số đến email
          </Text>
          <Text style={styles.email}>{email}</Text>
        </View>

        <View style={styles.iconContainer}>
          <View style={styles.iconCircle}>
            <Ionicons name="mail-outline" size={50} color={colors.primary} />
          </View>
        </View>

        <View style={styles.form}>
          <Input
            label="Mã OTP"
            placeholder="096543"
            value={otpCode}
            onChangeText={setOtpCode}
            keyboardType="number-pad"
            maxLength={6}
            error={error}
            style={styles.otpInput}
          />

          <Text
            style={[
              styles.timerText,
              otpExpired && styles.timerTextExpired,
            ]}
          >
            {otpExpired
              ? 'Mã OTP đã hết hạn'
              : `Mã OTP hết hạn sau ${formatTime(otpExpire)}`}
          </Text>

          <Button
            title="Xác nhận"
            onPress={handleSubmit}
            loading={isLoading}
            disabled={otpExpired}
            fullWidth
            style={styles.submitButton}
          />

          <View style={styles.footer}>
            <Text style={styles.footerText}>Chưa nhận được mã?</Text>
            <Pressable onPress={handleResend} disabled={!canResend}>
              <Text
                style={[
                  styles.footerLink,
                  !canResend && styles.footerLinkDisabled,
                ]}
              >
                {canResend ? 'Gửi lại mã' : `Gửi lại (${resendCountdown}s)`}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default VerifyOTPScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  content: {
    flex: 1,
    padding: spacing.base,
  },
  header: {
    marginBottom: spacing.base,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    fontSize: typography.fontSize.base,
    color: colors.text.primary,
    marginLeft: spacing.sm,
  },
  titleSection: {
    marginTop: spacing.base,
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  email: {
    fontSize: typography.fontSize.lg,
    color: colors.primary,
    fontWeight: typography.fontWeight.medium,
  },
  iconContainer: {
    alignItems: 'center',
    marginVertical: spacing['2xl'],
  },
  iconCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  form: {
    flex: 1,
  },
  otpInput: {
    textAlign: 'center',
    fontSize: typography.fontSize.xl,
    letterSpacing: spacing.sm,
  },
  timerText: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    textAlign: 'right',
    marginTop: spacing.xs,
    marginBottom: spacing.base,
  },
  timerTextExpired: {
    color: colors.error,
  },
  submitButton: {
    marginTop: spacing.base,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing['2xl'],
  },
  footerText: {
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
  },
  footerLink: {
    fontSize: typography.fontSize.base,
    color: colors.primary,
    marginLeft: spacing.sm,
    textDecorationLine: 'underline',
    fontWeight: typography.fontWeight.medium,
  },
  footerLinkDisabled: {
    color: colors.text.tertiary,
    opacity: 0.6,
  },
});
