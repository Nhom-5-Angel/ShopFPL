/**
 * Forgot Password Screen
 * Screen for requesting password reset OTP
 */

import React, { useState } from 'react';
import { View, StyleSheet, Pressable, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import { useAuth } from '../../hooks/auth/useAuth';
import { Button, Input } from '../../components/common';
import { colors, typography, spacing } from '../../theme';
import Ionicons from 'react-native-vector-icons/Ionicons';

type ForgotPasswordNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  'ForgotPassword'
>;

const ForgotPasswordScreen: React.FC = () => {
  const navigation = useNavigation<ForgotPasswordNavigationProp>();
  const { handleForgotPassword, isLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | undefined>();

  const handleSubmit = async () => {
    setError(undefined);

    if (!email.trim()) {
      setError('Email không được để trống');
      return;
    }

    handleForgotPassword({ email }, () => {
      navigation.navigate('VerifyOTP', { email });
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
          <Text style={styles.title}>Quên mật khẩu</Text>
          <Text style={styles.subtitle}>
            Đừng lo lắng! Chỉ cần nhập email đã đăng ký và chúng tôi sẽ gửi mã
            OTP về email của bạn
          </Text>
        </View>

        <View style={styles.iconContainer}>
          <View style={styles.iconCircle}>
            <Ionicons name="mail-outline" size={50} color={colors.primary} />
          </View>
        </View>

        <View style={styles.form}>
          <Input
            label="Email"
            placeholder="example@gmail.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            error={error}
            leftIcon="mail-outline"
          />

          <Button
            title="Gửi Mã OTP"
            onPress={handleSubmit}
            loading={isLoading}
            fullWidth
            style={styles.submitButton}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ForgotPasswordScreen;

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
    lineHeight: typography.lineHeight.relaxed * typography.fontSize.base,
  },
  iconContainer: {
    alignItems: 'center',
    marginVertical: spacing['3xl'],
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
  submitButton: {
    marginTop: spacing.lg,
  },
});
