/**
 * Admin Users Screen
 * Admin screen for managing users
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  RefreshControl,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../navigation/types';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  getAllUsers,
  deleteUser,
  updateUserRole,
  resetUserPassword,
  GetAllUsersParams,
} from '../services/admin/admin.service';
import { User } from '../types';
import { colors, typography, spacing } from '../theme';
import { handleApiError } from '../services/api/errorHandler';
import { Button, Input } from '../components/common';

type AdminUsersNavigationProp = NativeStackNavigationProp<MainStackParamList, 'AdminUsers'>;

export const AdminUsersScreen: React.FC = () => {
  const navigation = useNavigation<AdminUsersNavigationProp>();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [roleFilter, setRoleFilter] = useState<'user' | 'admin' | ''>('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    loadUsers();
  }, [page, roleFilter]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const params: GetAllUsersParams = {
        page,
        limit: 10,
        search: searchText || undefined,
        role: roleFilter || undefined,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      };
      const response = await getAllUsers(params);
      if (response.success && response.data) {
        setUsers(response.data.data || []);
        setTotalPages(response.data.totalPages || 1);
      }
    } catch (error) {
      const errorMessage = handleApiError(error);
      Alert.alert('Lỗi', errorMessage);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setPage(1);
    loadUsers();
  };

  const handleSearch = () => {
    setPage(1);
    loadUsers();
  };

  const handleDeleteUser = (user: User) => {
    Alert.alert(
      'Xác nhận xóa',
      `Bạn có chắc chắn muốn xóa người dùng "${user.username}"?`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            try {
              const userId = user._id || user.id;
              const response = await deleteUser(userId);
              if (response.success) {
                Alert.alert('Thành công', 'Đã xóa người dùng');
                loadUsers();
              }
            } catch (error) {
              const errorMessage = handleApiError(error);
              Alert.alert('Lỗi', errorMessage);
            }
          },
        },
      ]
    );
  };

  const handleChangeRole = (user: User) => {
    setSelectedUser(user);
    setShowRoleModal(true);
  };

  const confirmChangeRole = async (newRole: 'user' | 'admin') => {
    if (!selectedUser) return;

    try {
      const userId = selectedUser._id || selectedUser.id;
      const response = await updateUserRole(userId, { role: newRole });
      if (response.success) {
        Alert.alert('Thành công', `Đã đổi role thành ${newRole === 'admin' ? 'Admin' : 'User'}`);
        setShowRoleModal(false);
        setSelectedUser(null);
        loadUsers();
      }
    } catch (error) {
      const errorMessage = handleApiError(error);
      Alert.alert('Lỗi', errorMessage);
    }
  };

  const handleResetPassword = (user: User) => {
    setSelectedUser(user);
    setNewPassword('');
    setShowPasswordModal(true);
  };

  const confirmResetPassword = async () => {
    if (!selectedUser || !newPassword) {
      Alert.alert('Lỗi', 'Vui lòng nhập mật khẩu mới');
      return;
    }

    if (newPassword.length < 8) {
      Alert.alert('Lỗi', 'Mật khẩu phải có ít nhất 8 ký tự');
      return;
    }

    try {
      const userId = selectedUser._id || selectedUser.id;
      const response = await resetUserPassword(userId, { newPassword });
      if (response.success) {
        Alert.alert('Thành công', 'Đã reset mật khẩu');
        setShowPasswordModal(false);
        setSelectedUser(null);
        setNewPassword('');
      }
    } catch (error) {
      const errorMessage = handleApiError(error);
      Alert.alert('Lỗi', errorMessage);
    }
  };

  const renderUserItem = ({ item }: { item: User }) => {
    const userId = item._id || item.id;
    const isAdmin = item.role === 'admin';

    return (
      <View style={styles.userCard}>
        <View style={styles.userInfo}>
          <View style={styles.userHeader}>
            <Text style={styles.userName}>{item.username}</Text>
            {isAdmin && (
              <View style={styles.adminBadge}>
                <Text style={styles.adminBadgeText}>Admin</Text>
              </View>
            )}
          </View>
          <Text style={styles.userEmail}>{item.email}</Text>
          {item.phoneNumber && (
            <Text style={styles.userPhone}>{item.phoneNumber}</Text>
          )}
        </View>
        <View style={styles.userActions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.roleButton]}
            onPress={() => handleChangeRole(item)}
          >
            <Ionicons name="person-outline" size={18} color={colors.primary} />
            <Text style={styles.actionButtonText}>Role</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.passwordButton]}
            onPress={() => handleResetPassword(item)}
          >
            <Ionicons name="lock-closed-outline" size={18} color={colors.warning} />
            <Text style={styles.actionButtonText}>Reset</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => handleDeleteUser(item)}
          >
            <Ionicons name="trash-outline" size={18} color={colors.error} />
            <Text style={styles.actionButtonText}>Xóa</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Quản lý người dùng</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Search and Filter */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color={colors.text.tertiary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm theo tên, email..."
            value={searchText}
            onChangeText={setSearchText}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText('')}>
              <Ionicons name="close-circle" size={20} color={colors.text.tertiary} />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>Tìm</Text>
        </TouchableOpacity>
      </View>

      {/* Filter */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, roleFilter === '' && styles.filterButtonActive]}
          onPress={() => setRoleFilter('')}
        >
          <Text style={[styles.filterText, roleFilter === '' && styles.filterTextActive]}>
            Tất cả
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, roleFilter === 'user' && styles.filterButtonActive]}
          onPress={() => setRoleFilter('user')}
        >
          <Text style={[styles.filterText, roleFilter === 'user' && styles.filterTextActive]}>
            User
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, roleFilter === 'admin' && styles.filterButtonActive]}
          onPress={() => setRoleFilter('admin')}
        >
          <Text style={[styles.filterText, roleFilter === 'admin' && styles.filterTextActive]}>
            Admin
          </Text>
        </TouchableOpacity>
      </View>

      {/* Users List */}
      {loading && page === 1 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Đang tải...</Text>
        </View>
      ) : users.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="people-outline" size={64} color={colors.text.tertiary} />
          <Text style={styles.emptyText}>Không có người dùng nào</Text>
        </View>
      ) : (
        <FlatList
          data={users}
          renderItem={renderUserItem}
          keyExtractor={(item) => item._id || item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          onEndReached={() => {
            if (page < totalPages && !loading) {
              setPage(page + 1);
            }
          }}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loading && page > 1 ? (
              <View style={styles.footerLoading}>
                <ActivityIndicator size="small" color={colors.primary} />
              </View>
            ) : null
          }
        />
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <View style={styles.pagination}>
          <TouchableOpacity
            style={[styles.pageButton, page === 1 && styles.pageButtonDisabled]}
            onPress={() => page > 1 && setPage(page - 1)}
            disabled={page === 1}
          >
            <Text style={[styles.pageButtonText, page === 1 && styles.pageButtonTextDisabled]}>
              Trước
            </Text>
          </TouchableOpacity>
          <Text style={styles.pageInfo}>
            Trang {page} / {totalPages}
          </Text>
          <TouchableOpacity
            style={[styles.pageButton, page === totalPages && styles.pageButtonDisabled]}
            onPress={() => page < totalPages && setPage(page + 1)}
            disabled={page === totalPages}
          >
            <Text
              style={[
                styles.pageButtonText,
                page === totalPages && styles.pageButtonTextDisabled,
              ]}
            >
              Sau
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Change Role Modal */}
      <Modal
        visible={showRoleModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowRoleModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Đổi role</Text>
            <Text style={styles.modalSubtitle}>
              Người dùng: {selectedUser?.username}
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.userRoleButton]}
                onPress={() => confirmChangeRole('user')}
              >
                <Text style={styles.modalButtonText}>User</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.adminRoleButton]}
                onPress={() => confirmChangeRole('admin')}
              >
                <Text style={styles.modalButtonText}>Admin</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={() => setShowRoleModal(false)}
            >
              <Text style={styles.modalCancelText}>Hủy</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Reset Password Modal */}
      <Modal
        visible={showPasswordModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPasswordModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Reset mật khẩu</Text>
            <Text style={styles.modalSubtitle}>
              Người dùng: {selectedUser?.username}
            </Text>
            <Input
              placeholder="Mật khẩu mới"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
              style={styles.passwordInput}
            />
            <View style={styles.modalActionButtons}>
              <Button
                variant="secondary"
                onPress={() => {
                  setShowPasswordModal(false);
                  setNewPassword('');
                }}
                style={styles.modalCancelBtn}
              >
                Hủy
              </Button>
              <Button
                variant="primary"
                onPress={confirmResetPassword}
                style={styles.modalConfirmBtn}
              >
                Xác nhận
              </Button>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
  },
  placeholder: {
    width: 40,
  },
  searchContainer: {
    flexDirection: 'row',
    padding: spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
    gap: spacing.sm,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    paddingHorizontal: spacing.sm,
    gap: spacing.xs,
  },
  searchIcon: {
    marginRight: spacing.xs,
  },
  searchInput: {
    flex: 1,
    fontSize: typography.fontSize.md,
    color: colors.text.primary,
    paddingVertical: spacing.sm,
  },
  searchButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 12,
    justifyContent: 'center',
  },
  searchButtonText: {
    color: colors.white,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.white,
    gap: spacing.sm,
  },
  filterButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 20,
    backgroundColor: colors.background.secondary,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterText: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    fontWeight: typography.fontWeight.medium,
  },
  filterTextActive: {
    color: colors.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: typography.fontSize.md,
    color: colors.text.secondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyText: {
    marginTop: spacing.md,
    fontSize: typography.fontSize.md,
    color: colors.text.tertiary,
  },
  listContent: {
    padding: spacing.md,
  },
  userCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.sm,
    shadowColor: colors.shadow.light,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  userInfo: {
    marginBottom: spacing.sm,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  userName: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
  },
  adminBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: 4,
  },
  adminBadgeText: {
    fontSize: typography.fontSize.xs,
    color: colors.white,
    fontWeight: typography.fontWeight.bold,
  },
  userEmail: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  userPhone: {
    fontSize: typography.fontSize.sm,
    color: colors.text.tertiary,
  },
  userActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xs,
    borderRadius: 8,
    gap: spacing.xs,
    backgroundColor: colors.background.secondary,
  },
  roleButton: {
    backgroundColor: colors.background.secondary,
  },
  passwordButton: {
    backgroundColor: colors.background.secondary,
  },
  deleteButton: {
    backgroundColor: colors.background.secondary,
  },
  actionButtonText: {
    fontSize: typography.fontSize.xs,
    color: colors.text.secondary,
    fontWeight: typography.fontWeight.medium,
  },
  footerLoading: {
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  pageButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 8,
    backgroundColor: colors.primary,
  },
  pageButtonDisabled: {
    backgroundColor: colors.gray[300],
  },
  pageButtonText: {
    color: colors.white,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
  },
  pageButtonTextDisabled: {
    color: colors.text.tertiary,
  },
  pageInfo: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    fontWeight: typography.fontWeight.medium,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: spacing.lg,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  modalSubtitle: {
    fontSize: typography.fontSize.md,
    color: colors.text.secondary,
    marginBottom: spacing.lg,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  modalButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: 12,
    alignItems: 'center',
  },
  userRoleButton: {
    backgroundColor: colors.background.secondary,
  },
  adminRoleButton: {
    backgroundColor: colors.primary,
  },
  modalButtonText: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
  },
  modalCancelButton: {
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: typography.fontSize.md,
    color: colors.text.tertiary,
  },
  passwordInput: {
    marginBottom: spacing.lg,
  },
  modalActionButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  modalCancelBtn: {
    flex: 1,
  },
  modalConfirmBtn: {
    flex: 1,
  },
});
