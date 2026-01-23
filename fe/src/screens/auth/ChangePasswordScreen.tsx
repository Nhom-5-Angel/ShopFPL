/**
 * Change Password Screen
 * Screen for setting new password after OTP verification
 */

import React, { useState } from 'react';
import { View, StyleSheet, Pressable, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import { useAuth } from '../../hooks/auth/useAuth';
import { Button, Input } from '../../components/common';
import { colors, typography, spacing } from '../../theme';
import Ionicons from 'react-native-vector-icons/Ionicons';

type ChangePasswordNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  'ChangePassword'
>;
type ChangePasswordRouteProp = RouteProp<AuthStackParamList, 'ChangePassword'>;

const ChangePasswordScreen: React.FC = () => {
  const navigation = useNavigation<ChangePasswordNavigationProp>();
  const route = useRoute<ChangePasswordRouteProp>();
  const { handleChangePassword, isLoading } = useAuth();

  const { email } = route.params;

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{
    newPassword?: string;
    confirmPassword?: string;
  }>({});

  const isPasswordValid = newPassword.length >= 8;
  const isPasswordMatch =
    newPassword.length > 0 &&
    confirmPassword.length > 0 &&
    newPassword === confirmPassword;

  const handleSubmit = async () => {
    setErrors({});

    const newErrors: typeof errors = {};

    if (!newPassword.trim()) {
      newErrors.newPassword = 'Mật khẩu mới không được để trống';
    } else if (newPassword.length < 8) {
      newErrors.newPassword = 'Mật khẩu phải có ít nhất 8 ký tự';
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = 'Xác nhận mật khẩu không được để trống';
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    handleChangePassword(
      {
        email,
        newPassword,
        confirmPassword,
      },
      () => {
        navigation.navigate('Login');
      }
    );
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
          <Text style={styles.title}>Đặt mật khẩu mới</Text>
          <Text style={styles.subtitle}>
            Tạo mật khẩu mới cho tài khoản của bạn
          </Text>
        </View>

        <View style={styles.iconContainer}>
          <View style={styles.iconCircle}>
            <Ionicons name="lock-closed-outline" size={50} color={colors.primary} />
          </View>
        </View>

        <View style={styles.form}>
          <Input
            label="Mật khẩu mới"
            placeholder="Nhập mật khẩu mới"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
            autoCapitalize="none"
            error={errors.newPassword}
            leftIcon="lock-closed-outline"
          />

          <Input
            label="Xác nhận mật khẩu"
            placeholder="Nhập lại mật khẩu mới"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            autoCapitalize="none"
            error={errors.confirmPassword}
            leftIcon="lock-closed-outline"
          />

          <View style={styles.requirementsContainer}>
            <Text style={styles.requirementsTitle}>Yêu cầu mật khẩu</Text>

            <View style={styles.requirementItem}>
              <Ionicons
                name={isPasswordValid ? 'checkmark-circle' : 'ellipse-outline'}
                size={20}
                color={isPasswordValid ? colors.success : colors.text.tertiary}
              />
              <Text
                style={[
                  styles.requirementText,
                  isPasswordValid && styles.requirementTextValid,
                ]}
              >
                Ít nhất 8 ký tự
              </Text>
            </View>

            <View style={styles.requirementItem}>
              <Ionicons
                name={isPasswordMatch ? 'checkmark-circle' : 'ellipse-outline'}
                size={20}
                color={isPasswordMatch ? colors.success : colors.text.tertiary}
              />
              <Text
                style={[
                  styles.requirementText,
                  isPasswordMatch && styles.requirementTextValid,
                ]}
              >
                Mật khẩu xác nhận khớp
              </Text>
            </View>
          </View>

          <Button
            title="Xác nhận"
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

export default ChangePasswordScreen;

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
  requirementsContainer: {
    backgroundColor: colors.background.tertiary,
    padding: spacing.base,
    borderRadius: spacing.sm,
    marginTop: spacing.base,
    marginBottom: spacing.lg,
  },
  requirementsTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  requirementText: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    marginLeft: spacing.sm,
  },
  requirementTextValid: {
    color: colors.success,
  },
  submitButton: {
    marginTop: spacing.base,
  },
});
