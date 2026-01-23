/**
 * Register Screen
 * User registration screen
 */

import React, { useState } from 'react';
import { View, StyleSheet, Pressable, Text, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import { useAuth } from '../../hooks/auth/useAuth';
import { Button, Input } from '../../components/common';
import { colors, typography, spacing } from '../../theme';
import Ionicons from 'react-native-vector-icons/Ionicons';

type RegisterNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Register'>;

const RegisterScreen: React.FC = () => {
  const navigation = useNavigation<RegisterNavigationProp>();
  const { handleRegister, isLoading } = useAuth();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<{
    fullName?: string;
    email?: string;
    phone?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const updateField = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async () => {
    // Clear previous errors
    setErrors({});

    // Basic validation
    const newErrors: typeof errors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Họ và tên không được để trống';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email không được để trống';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Số điện thoại không được để trống';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Mật khẩu không được để trống';
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Xác nhận mật khẩu không được để trống';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    handleRegister(
      {
        username: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phone,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      },
      () => {
        navigation.navigate('Login');
      }
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <SafeAreaView style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.header}>
            <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
              <Text style={styles.backText}>Quay lại</Text>
            </Pressable>
          </View>

          <View style={styles.content}>
            <View style={styles.titleSection}>
              <Text style={styles.title}>Đăng Ký</Text>
              <Text style={styles.subtitle}>
                Tạo tài khoản mới để bắt đầu mua sắm
              </Text>
            </View>

            <View style={styles.form}>
              <Input
                label="Họ và tên"
                placeholder="Nguyễn Văn A"
                value={formData.fullName}
                onChangeText={(value) => updateField('fullName', value)}
                error={errors.fullName}
                leftIcon="person-outline"
              />

              <Input
                label="Email"
                placeholder="example@gmail.com"
                value={formData.email}
                onChangeText={(value) => updateField('email', value)}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                error={errors.email}
                leftIcon="mail-outline"
              />

              <Input
                label="Số điện thoại"
                placeholder="0123456789"
                value={formData.phone}
                onChangeText={(value) => updateField('phone', value)}
                keyboardType="phone-pad"
                error={errors.phone}
                leftIcon="call-outline"
              />

              <Input
                label="Mật khẩu"
                placeholder="Tối thiểu 8 ký tự"
                value={formData.password}
                onChangeText={(value) => updateField('password', value)}
                secureTextEntry
                autoCapitalize="none"
                error={errors.password}
                leftIcon="lock-closed-outline"
              />

              <Input
                label="Xác nhận mật khẩu"
                placeholder="Nhập lại mật khẩu"
                value={formData.confirmPassword}
                onChangeText={(value) => updateField('confirmPassword', value)}
                secureTextEntry
                autoCapitalize="none"
                error={errors.confirmPassword}
                leftIcon="lock-closed-outline"
              />

              <Button
                title="Đăng ký"
                onPress={handleSubmit}
                loading={isLoading}
                fullWidth
                style={styles.submitButton}
              />

              <View style={styles.footer}>
                <Text style={styles.footerText}>Đã có tài khoản?</Text>
                <Pressable onPress={() => navigation.navigate('Login')}>
                  <Text style={styles.footerLink}>Đăng nhập ngay</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    padding: spacing.base,
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
  content: {
    flex: 1,
    padding: spacing.base,
  },
  titleSection: {
    marginTop: spacing.base,
    marginBottom: spacing['2xl'],
  },
  title: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: typography.fontSize.lg,
    color: colors.text.secondary,
  },
  form: {
    flex: 1,
  },
  submitButton: {
    marginTop: spacing.lg,
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
});
