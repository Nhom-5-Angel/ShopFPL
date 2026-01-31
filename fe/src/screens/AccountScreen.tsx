/**
 * Account Screen
 * User profile management screen
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../navigation/types';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useAuthContext } from '../contexts/AuthContext';
import { getProfile, updateProfile, changePassword, UpdateProfilePayload } from '../services/user/user.service';
import { Button, Input } from '../components/common';
import { colors, typography, spacing, layout } from '../theme';
import { handleApiError } from '../services/api/errorHandler';
import { formatDate } from '../utils/formatters';
import { User } from '../types';

type AccountNavigationProp = NativeStackNavigationProp<MainStackParamList, 'Account'>;

export const AccountScreen: React.FC = () => {
  const navigation = useNavigation<AccountNavigationProp>();
  const { user: authUser, logout, updateUser } = useAuthContext();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  // Form state
  const [formData, setFormData] = useState<UpdateProfilePayload>({
    username: '',
    phoneNumber: '',
    birthDate: '',
    address: '',
    gender: 'other',
  });

  // Password change state
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const response = await getProfile();
      if (response.success && response.data) {
        const userData = response.data;
        setUser(userData);
        setFormData({
          username: userData.username || '',
          phoneNumber: userData.phoneNumber || '',
          birthDate: userData.birthDate ? userData.birthDate.split('T')[0] : '',
          address: userData.address || '',
          gender: userData.gender || 'other',
        });
      }
    } catch (error) {
      const errorMessage = handleApiError(error);
      Alert.alert('Lỗi', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      setLoading(true);
      const response = await updateProfile(formData);
      if (response.success && response.data) {
        updateUser(response.data);
        setUser(response.data);
        setIsEditing(false);
        Alert.alert('Thành công', 'Cập nhật profile thành công');
      }
    } catch (error) {
      const errorMessage = handleApiError(error);
      Alert.alert('Lỗi', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      Alert.alert('Lỗi', 'Mật khẩu xác nhận không khớp');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      Alert.alert('Lỗi', 'Mật khẩu phải có ít nhất 8 ký tự');
      return;
    }

    try {
      setLoading(true);
      const response = await changePassword({
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      });

      if (response.success) {
        Alert.alert('Thành công', 'Đổi mật khẩu thành công');
        setShowPasswordModal(false);
        setPasswordData({
          oldPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      }
    } catch (error) {
      const errorMessage = handleApiError(error);
      Alert.alert('Lỗi', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Đăng xuất',
      'Bạn có chắc chắn muốn đăng xuất?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Đăng xuất',
          style: 'destructive',
          onPress: async () => {
            await logout();
          },
        },
      ]
    );
  };

  if (loading && !user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text>Đang tải...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Tài khoản</Text>
          {!isEditing && (
            <TouchableOpacity onPress={() => setIsEditing(true)}>
              <Ionicons name="create-outline" size={24} color={colors.primary} />
            </TouchableOpacity>
          )}
        </View>

        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarContainer}>
            {user?.avatarUrl ? (
              <View style={styles.avatarPlaceholder}>
                <Ionicons name="person" size={50} color={colors.text.secondary} />
              </View>
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Ionicons name="person" size={50} color={colors.text.secondary} />
              </View>
            )}
          </View>
          <Text style={styles.username}>{user?.username || 'Chưa có tên'}</Text>
          <Text style={styles.email}>{user?.email}</Text>
          {user?.role === 'admin' && (
            <View style={styles.adminBadge}>
              <Text style={styles.adminBadgeText}>Admin</Text>
            </View>
          )}
        </View>

        {/* Profile Form */}
        <View style={styles.formSection}>
          <Input
            label="Tên người dùng"
            placeholder="Nhập tên người dùng"
            value={formData.username || ''}
            onChangeText={(value) => setFormData({ ...formData, username: value })}
            editable={isEditing}
            leftIcon="person-outline"
            containerStyle={!isEditing ? styles.disabledInput : undefined}
          />

          <Input
            label="Số điện thoại"
            placeholder="Nhập số điện thoại"
            value={formData.phoneNumber || ''}
            onChangeText={(value) => setFormData({ ...formData, phoneNumber: value })}
            keyboardType="phone-pad"
            editable={isEditing}
            leftIcon="call-outline"
            containerStyle={!isEditing ? styles.disabledInput : undefined}
          />

          <Input
            label="Ngày sinh"
            placeholder="YYYY-MM-DD"
            value={formData.birthDate || ''}
            onChangeText={(value) => setFormData({ ...formData, birthDate: value })}
            editable={isEditing}
            leftIcon="calendar-outline"
            containerStyle={!isEditing ? styles.disabledInput : undefined}
          />

          <Input
            label="Địa chỉ"
            placeholder="Nhập địa chỉ"
            value={formData.address || ''}
            onChangeText={(value) => setFormData({ ...formData, address: value })}
            editable={isEditing}
            multiline
            numberOfLines={3}
            leftIcon="location-outline"
            containerStyle={!isEditing ? styles.disabledInput : undefined}
          />

          {isEditing && (
            <View style={styles.buttonGroup}>
              <Button
                title="Hủy"
                onPress={() => {
                  setIsEditing(false);
                  loadProfile();
                }}
                variant="outline"
                style={styles.cancelButton}
              />
              <Button
                title="Lưu"
                onPress={handleUpdateProfile}
                loading={loading}
                style={styles.saveButton}
              />
            </View>
          )}
        </View>

        {/* Actions */}
        {!isEditing && (
          <View style={styles.actionsSection}>
            <TouchableOpacity
              style={styles.actionItem}
              onPress={() => setShowPasswordModal(true)}
            >
              <Ionicons name="lock-closed-outline" size={24} color={colors.primary} />
              <Text style={styles.actionText}>Đổi mật khẩu</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.text.tertiary} />
            </TouchableOpacity>

            {user?.role === 'admin' && (
              <>
                <TouchableOpacity
                  style={styles.actionItem}
                  onPress={() => navigation.navigate('AdminUsers')}
                >
                  <Ionicons name="people-outline" size={24} color={colors.primary} />
                  <Text style={styles.actionText}>Quản lý người dùng</Text>
                  <Ionicons name="chevron-forward" size={20} color={colors.text.tertiary} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionItem}
                  onPress={() => navigation.navigate('AdminProducts')}
                >
                  <Ionicons name="cube-outline" size={24} color={colors.primary} />
                  <Text style={styles.actionText}>Quản lý sản phẩm</Text>
                  <Ionicons name="chevron-forward" size={20} color={colors.text.tertiary} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionItem}
                  onPress={() => navigation.navigate('AdminCategories')}
                >
                  <Ionicons name="folder-outline" size={24} color={colors.primary} />
                  <Text style={styles.actionText}>Quản lý danh mục</Text>
                  <Ionicons name="chevron-forward" size={20} color={colors.text.tertiary} />
                </TouchableOpacity>
              </>
            )}

            <TouchableOpacity style={styles.actionItem} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={24} color={colors.error} />
              <Text style={[styles.actionText, styles.logoutText]}>Đăng xuất</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Change Password Modal */}
      <Modal
        visible={showPasswordModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPasswordModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Đổi mật khẩu</Text>
              <TouchableOpacity onPress={() => setShowPasswordModal(false)}>
                <Ionicons name="close" size={24} color={colors.text.primary} />
              </TouchableOpacity>
            </View>

            <Input
              label="Mật khẩu cũ"
              placeholder="Nhập mật khẩu cũ"
              value={passwordData.oldPassword}
              onChangeText={(value) =>
                setPasswordData({ ...passwordData, oldPassword: value })
              }
              secureTextEntry
              leftIcon="lock-closed-outline"
            />

            <Input
              label="Mật khẩu mới"
              placeholder="Nhập mật khẩu mới"
              value={passwordData.newPassword}
              onChangeText={(value) =>
                setPasswordData({ ...passwordData, newPassword: value })
              }
              secureTextEntry
              leftIcon="lock-closed-outline"
            />

            <Input
              label="Xác nhận mật khẩu"
              placeholder="Nhập lại mật khẩu mới"
              value={passwordData.confirmPassword}
              onChangeText={(value) =>
                setPasswordData({ ...passwordData, confirmPassword: value })
              }
              secureTextEntry
              leftIcon="lock-closed-outline"
            />

            <View style={styles.modalButtons}>
              <Button
                title="Hủy"
                onPress={() => setShowPasswordModal(false)}
                variant="outline"
                style={styles.modalCancelButton}
              />
              <Button
                title="Đổi mật khẩu"
                onPress={handleChangePassword}
                loading={loading}
                style={styles.modalSaveButton}
              />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.secondary,
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.base,
    backgroundColor: colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  headerTitle: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
  },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: spacing['2xl'],
    backgroundColor: colors.background.primary,
    marginBottom: spacing.base,
  },
  avatarContainer: {
    marginBottom: spacing.base,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.background.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  username: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  email: {
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },
  adminBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: layout.borderRadius.sm,
  },
  adminBadgeText: {
    color: colors.white,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
  formSection: {
    backgroundColor: colors.background.primary,
    padding: spacing.base,
    marginBottom: spacing.base,
  },
  disabledInput: {
    opacity: 0.6,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: spacing.base,
    marginTop: spacing.base,
  },
  cancelButton: {
    flex: 1,
  },
  saveButton: {
    flex: 1,
  },
  actionsSection: {
    backgroundColor: colors.background.primary,
    marginBottom: spacing.base,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  actionText: {
    flex: 1,
    fontSize: typography.fontSize.base,
    color: colors.text.primary,
    marginLeft: spacing.base,
  },
  logoutText: {
    color: colors.error,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.background.primary,
    borderTopLeftRadius: layout.borderRadius.xl,
    borderTopRightRadius: layout.borderRadius.xl,
    padding: spacing.base,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.base,
  },
  modalTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: spacing.base,
    marginTop: spacing.base,
  },
  modalCancelButton: {
    flex: 1,
  },
  modalSaveButton: {
    flex: 1,
    },
});
