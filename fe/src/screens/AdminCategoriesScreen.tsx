/**
 * Admin Categories Screen
 * Admin screen for managing categories
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
  Image,
  ScrollView,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../navigation/types';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  getAllCategories,
  deleteCategory,
  createCategory,
  updateCategory,
  CreateCategoryPayload,
  UpdateCategoryPayload,
} from '../services/admin/category.service';
import { Category } from '../types';
import { colors, typography, spacing } from '../theme';
import { handleApiError } from '../services/api/errorHandler';
import { Button, Input } from '../components/common';

type AdminCategoriesNavigationProp = NativeStackNavigationProp<
  MainStackParamList,
  'AdminCategories'
>;

export const AdminCategoriesScreen: React.FC = () => {
  const navigation = useNavigation<AdminCategoriesNavigationProp>();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  // Form state
  const [formData, setFormData] = useState<CreateCategoryPayload>({
    name: '',
    description: '',
    isActive: true,
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const response = await getAllCategories();
      if (response.success && response.data) {
        const filtered = response.data.filter((cat) =>
          cat.name.toLowerCase().includes(searchText.toLowerCase())
        );
        setCategories(filtered);
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
    loadCategories();
  };

  const handleSearch = () => {
    loadCategories();
  };

  const handleAddCategory = () => {
    setIsEditing(false);
    setSelectedCategory(null);
    setFormData({
      name: '',
      description: '',
      isActive: true,
    });
    setShowModal(true);
  };

  const handleEditCategory = (category: Category) => {
    setIsEditing(true);
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      isActive: category.isActive !== undefined ? category.isActive : true,
      image: category.image,
    });
    setShowModal(true);
  };

  const handleDeleteCategory = (category: Category) => {
    Alert.alert(
      'Xác nhận xóa',
      `Bạn có chắc chắn muốn xóa danh mục "${category.name}"?`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            try {
              const categoryId = category.id;
              const response = await deleteCategory(categoryId);
              if (response.success) {
                Alert.alert('Thành công', 'Đã xóa danh mục');
                loadCategories();
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

  const handleSaveCategory = async () => {
    if (!formData.name) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên danh mục');
      return;
    }

    try {
      if (isEditing && selectedCategory) {
        const categoryId = selectedCategory.id;
        const updateData: UpdateCategoryPayload = {
          name: formData.name,
          description: formData.description,
          isActive: formData.isActive,
          image: formData.image,
        };
        const response = await updateCategory(categoryId, updateData);
        if (response.success) {
          Alert.alert('Thành công', 'Đã cập nhật danh mục');
          setShowModal(false);
          loadCategories();
        }
      } else {
        const response = await createCategory(formData);
        if (response.success) {
          Alert.alert('Thành công', 'Đã tạo danh mục');
          setShowModal(false);
          loadCategories();
        }
      }
    } catch (error) {
      const errorMessage = handleApiError(error);
      Alert.alert('Lỗi', errorMessage);
    }
  };

  const handleAddImage = () => {
    Alert.prompt(
      'Thêm hình ảnh',
      'Nhập URL hình ảnh',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Thêm',
          onPress: (url) => {
            if (url) {
              setFormData({
                ...formData,
                image: { url },
              });
            }
          },
        },
      ],
      'plain-text'
    );
  };

  const handleRemoveImage = () => {
    setFormData({ ...formData, image: undefined });
  };

  const renderCategoryItem = ({ item }: { item: Category }) => {
    const imageUrl = item.image?.url;

    return (
      <View style={styles.categoryCard}>
        {imageUrl && (
          <Image source={{ uri: imageUrl }} style={styles.categoryImage} resizeMode="cover" />
        )}
        {!imageUrl && (
          <View style={styles.categoryImagePlaceholder}>
            <Ionicons name="folder-outline" size={32} color={colors.text.tertiary} />
          </View>
        )}
        <View style={styles.categoryInfo}>
          <View style={styles.categoryHeader}>
            <Text style={styles.categoryName}>{item.name}</Text>
            {item.isActive === false && (
              <View style={styles.inactiveBadge}>
                <Text style={styles.inactiveBadgeText}>Ẩn</Text>
              </View>
            )}
          </View>
          {item.description && (
            <Text style={styles.categoryDescription} numberOfLines={2}>
              {item.description}
            </Text>
          )}
        </View>
        <View style={styles.categoryActions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.editButton]}
            onPress={() => handleEditCategory(item)}
          >
            <Ionicons name="create-outline" size={18} color={colors.primary} />
            <Text style={styles.actionButtonText}>Sửa</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => handleDeleteCategory(item)}
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
        <Text style={styles.headerTitle}>Quản lý danh mục</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddCategory}>
          <Ionicons name="add" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color={colors.text.tertiary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm danh mục..."
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

      {/* Categories List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Đang tải...</Text>
        </View>
      ) : categories.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="folder-outline" size={64} color={colors.text.tertiary} />
          <Text style={styles.emptyText}>Không có danh mục nào</Text>
        </View>
      ) : (
        <FlatList
          data={categories}
          renderItem={renderCategoryItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        />
      )}

      {/* Category Form Modal */}
      <Modal
        visible={showModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalTitle}>
                {isEditing ? 'Sửa danh mục' : 'Thêm danh mục'}
              </Text>

              <Input
                label="Tên danh mục *"
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
                placeholder="Nhập tên danh mục"
                style={styles.input}
              />

              <Input
                label="Mô tả"
                value={formData.description}
                onChangeText={(text) => setFormData({ ...formData, description: text })}
                placeholder="Nhập mô tả"
                multiline
                numberOfLines={3}
                style={styles.input}
              />

              <View style={styles.switchContainer}>
                <Text style={styles.label}>Hiển thị</Text>
                <Switch
                  value={formData.isActive}
                  onValueChange={(value) => setFormData({ ...formData, isActive: value })}
                  trackColor={{ false: colors.gray[300], true: colors.primary }}
                />
              </View>

              <View style={styles.imageSection}>
                <View style={styles.imageHeader}>
                  <Text style={styles.label}>Hình ảnh</Text>
                  {formData.image ? (
                    <TouchableOpacity onPress={handleRemoveImage}>
                      <Ionicons name="trash-outline" size={20} color={colors.error} />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity onPress={handleAddImage}>
                      <Ionicons name="add-circle" size={24} color={colors.primary} />
                    </TouchableOpacity>
                  )}
                </View>
                {formData.image?.url && (
                  <Image source={{ uri: formData.image.url }} style={styles.imagePreview} />
                )}
              </View>

              <View style={styles.modalActionButtons}>
                <Button
                  variant="secondary"
                  onPress={() => setShowModal(false)}
                  style={styles.modalCancelBtn}
                >
                  Hủy
                </Button>
                <Button
                  variant="primary"
                  onPress={handleSaveCategory}
                  style={styles.modalConfirmBtn}
                >
                  {isEditing ? 'Cập nhật' : 'Tạo mới'}
                </Button>
              </View>
            </ScrollView>
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
  addButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
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
  categoryCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.sm,
    flexDirection: 'row',
    shadowColor: colors.shadow.light,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: colors.gray[100],
  },
  categoryImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  categoryName: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    flex: 1,
  },
  inactiveBadge: {
    backgroundColor: colors.gray[400],
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: 4,
  },
  inactiveBadgeText: {
    fontSize: typography.fontSize.xs,
    color: colors.white,
    fontWeight: typography.fontWeight.bold,
  },
  categoryDescription: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
  categoryActions: {
    flexDirection: 'column',
    gap: spacing.xs,
    justifyContent: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: 8,
    backgroundColor: colors.background.secondary,
    gap: spacing.xs,
  },
  editButton: {
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: spacing.lg,
    maxHeight: '90%',
  },
  modalTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.lg,
  },
  input: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  imageSection: {
    marginBottom: spacing.md,
  },
  imageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    backgroundColor: colors.gray[100],
  },
  modalActionButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  modalCancelBtn: {
    flex: 1,
  },
  modalConfirmBtn: {
    flex: 1,
  },
});
