/**
 * Admin Products Screen
 * Admin screen for managing products
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
  getAllProducts,
  deleteProduct,
  createProduct,
  updateProduct,
  GetAllProductsParams,
  CreateProductPayload,
  UpdateProductPayload,
} from '../services/admin/product.service';
import { getAllCategories } from '../services/admin/category.service';
import { Product, Category } from '../types';
import { colors, typography, spacing } from '../theme';
import { handleApiError } from '../services/api/errorHandler';
import { Button, Input } from '../components/common';

type AdminProductsNavigationProp = NativeStackNavigationProp<MainStackParamList, 'AdminProducts'>;

export const AdminProductsScreen: React.FC = () => {
  const navigation = useNavigation<AdminProductsNavigationProp>();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Form state
  const [formData, setFormData] = useState<CreateProductPayload>({
    name: '',
    description: '',
    price: 0,
    categoryId: '',
    stock: 0,
    discount: 0,
    isActive: true,
    images: [],
  });

  useEffect(() => {
    loadCategories();
    loadProducts();
  }, [page, categoryFilter]);

  const loadCategories = async () => {
    try {
      const response = await getAllCategories();
      if (response.success && response.data) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      const params: GetAllProductsParams = {
        page,
        limit: 10,
        search: searchText || undefined,
        categoryId: categoryFilter || undefined,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      };
      const response = await getAllProducts(params);
      if (response.success && response.data) {
        setProducts(response.data.data || []);
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
    loadProducts();
  };

  const handleSearch = () => {
    setPage(1);
    loadProducts();
  };

  const handleAddProduct = () => {
    setIsEditing(false);
    setSelectedProduct(null);
    setFormData({
      name: '',
      description: '',
      price: 0,
      categoryId: '',
      stock: 0,
      discount: 0,
      isActive: true,
      images: [],
    });
    setShowModal(true);
  };

  const handleEditProduct = (product: Product) => {
    setIsEditing(true);
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price,
      categoryId: typeof product.categoryId === 'string' ? product.categoryId : product.categoryId._id,
      stock: product.stock || 0,
      discount: product.discount || 0,
      isActive: product.isActive,
      images: product.images || [],
    });
    setShowModal(true);
  };

  const handleDeleteProduct = (product: Product) => {
    Alert.alert(
      'Xác nhận xóa',
      `Bạn có chắc chắn muốn xóa sản phẩm "${product.name}"?`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            try {
              const productId = product._id || product.id;
              const response = await deleteProduct(productId);
              if (response.success) {
                Alert.alert('Thành công', 'Đã xóa sản phẩm');
                loadProducts();
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

  const handleSaveProduct = async () => {
    if (!formData.name || !formData.price || !formData.categoryId) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    try {
      if (isEditing && selectedProduct) {
        const productId = selectedProduct._id || selectedProduct.id;
        const updateData: UpdateProductPayload = {
          name: formData.name,
          description: formData.description,
          price: formData.price,
          categoryId: formData.categoryId,
          stock: formData.stock,
          discount: formData.discount,
          isActive: formData.isActive,
          images: formData.images,
        };
        const response = await updateProduct(productId, updateData);
        if (response.success) {
          Alert.alert('Thành công', 'Đã cập nhật sản phẩm');
          setShowModal(false);
          loadProducts();
        }
      } else {
        const response = await createProduct(formData);
        if (response.success) {
          Alert.alert('Thành công', 'Đã tạo sản phẩm');
          setShowModal(false);
          loadProducts();
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
                images: [...(formData.images || []), { url }],
              });
            }
          },
        },
      ],
      'plain-text'
    );
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...(formData.images || [])];
    newImages.splice(index, 1);
    setFormData({ ...formData, images: newImages });
  };

  const renderProductItem = ({ item }: { item: Product }) => {
    const productId = item._id || item.id;
    const categoryName = typeof item.categoryId === 'object' ? item.categoryId.name : '';
    const imageUrl = item.images && item.images.length > 0 ? item.images[0].url : null;

    return (
      <View style={styles.productCard}>
        {imageUrl && (
          <Image source={{ uri: imageUrl }} style={styles.productImage} resizeMode="cover" />
        )}
        <View style={styles.productInfo}>
          <View style={styles.productHeader}>
            <Text style={styles.productName}>{item.name}</Text>
            {!item.isActive && (
              <View style={styles.inactiveBadge}>
                <Text style={styles.inactiveBadgeText}>Ẩn</Text>
              </View>
            )}
          </View>
          {categoryName && <Text style={styles.productCategory}>{categoryName}</Text>}
          <Text style={styles.productPrice}>
            {item.price.toLocaleString('vi-VN')}₫
            {item.discount && item.discount > 0 && (
              <Text style={styles.discountText}> (-{item.discount}%)</Text>
            )}
          </Text>
          <Text style={styles.productStock}>Tồn kho: {item.stock || 0}</Text>
        </View>
        <View style={styles.productActions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.editButton]}
            onPress={() => handleEditProduct(item)}
          >
            <Ionicons name="create-outline" size={18} color={colors.primary} />
            <Text style={styles.actionButtonText}>Sửa</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => handleDeleteProduct(item)}
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
        <Text style={styles.headerTitle}>Quản lý sản phẩm</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddProduct}>
          <Ionicons name="add" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Search and Filter */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color={colors.text.tertiary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm sản phẩm..."
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

      {/* Category Filter */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={[styles.filterButton, categoryFilter === '' && styles.filterButtonActive]}
            onPress={() => setCategoryFilter('')}
          >
            <Text style={[styles.filterText, categoryFilter === '' && styles.filterTextActive]}>
              Tất cả
            </Text>
          </TouchableOpacity>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.filterButton,
                categoryFilter === cat.id && styles.filterButtonActive,
              ]}
              onPress={() => setCategoryFilter(cat.id)}
            >
              <Text
                style={[
                  styles.filterText,
                  categoryFilter === cat.id && styles.filterTextActive,
                ]}
              >
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Products List */}
      {loading && page === 1 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Đang tải...</Text>
        </View>
      ) : products.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="cube-outline" size={64} color={colors.text.tertiary} />
          <Text style={styles.emptyText}>Không có sản phẩm nào</Text>
        </View>
      ) : (
        <FlatList
          data={products}
          renderItem={renderProductItem}
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

      {/* Product Form Modal */}
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
                {isEditing ? 'Sửa sản phẩm' : 'Thêm sản phẩm'}
              </Text>

              <Input
                label="Tên sản phẩm *"
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
                placeholder="Nhập tên sản phẩm"
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

              <View style={styles.row}>
                <View style={styles.halfInput}>
                  <Input
                    label="Giá *"
                    value={formData.price.toString()}
                    onChangeText={(text) =>
                      setFormData({ ...formData, price: parseFloat(text) || 0 })
                    }
                    placeholder="0"
                    keyboardType="numeric"
                    style={styles.input}
                  />
                </View>
                <View style={styles.halfInput}>
                  <Input
                    label="Giảm giá (%)"
                    value={formData.discount?.toString() || '0'}
                    onChangeText={(text) =>
                      setFormData({ ...formData, discount: parseInt(text) || 0 })
                    }
                    placeholder="0"
                    keyboardType="numeric"
                    style={styles.input}
                  />
                </View>
              </View>

              <View style={styles.row}>
                <View style={styles.halfInput}>
                  <Input
                    label="Tồn kho"
                    value={formData.stock?.toString() || '0'}
                    onChangeText={(text) =>
                      setFormData({ ...formData, stock: parseInt(text) || 0 })
                    }
                    placeholder="0"
                    keyboardType="numeric"
                    style={styles.input}
                  />
                </View>
                <View style={styles.halfInput}>
                  <Text style={styles.label}>Danh mục *</Text>
                  <View style={styles.selectContainer}>
                    {categories.length > 0 ? (
                      <ScrollView style={styles.selectScroll}>
                        {categories.map((cat) => (
                          <TouchableOpacity
                            key={cat.id}
                            style={[
                              styles.selectOption,
                              formData.categoryId === cat.id && styles.selectOptionActive,
                            ]}
                            onPress={() => setFormData({ ...formData, categoryId: cat.id })}
                          >
                            <Text
                              style={[
                                styles.selectOptionText,
                                formData.categoryId === cat.id && styles.selectOptionTextActive,
                              ]}
                            >
                              {cat.name}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    ) : (
                      <Text style={styles.noCategoriesText}>Chưa có danh mục</Text>
                    )}
                  </View>
                </View>
              </View>

              <View style={styles.switchContainer}>
                <Text style={styles.label}>Hiển thị</Text>
                <Switch
                  value={formData.isActive}
                  onValueChange={(value) => setFormData({ ...formData, isActive: value })}
                  trackColor={{ false: colors.gray[300], true: colors.primary }}
                />
              </View>

              <View style={styles.imagesSection}>
                <View style={styles.imagesHeader}>
                  <Text style={styles.label}>Hình ảnh</Text>
                  <TouchableOpacity onPress={handleAddImage}>
                    <Ionicons name="add-circle" size={24} color={colors.primary} />
                  </TouchableOpacity>
                </View>
                <View style={styles.imagesList}>
                  {formData.images?.map((img, index) => (
                    <View key={index} style={styles.imageItem}>
                      <Image source={{ uri: img.url }} style={styles.imagePreview} />
                      <TouchableOpacity
                        style={styles.removeImageButton}
                        onPress={() => handleRemoveImage(index)}
                      >
                        <Ionicons name="close-circle" size={20} color={colors.error} />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
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
                  onPress={handleSaveProduct}
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
  filterContainer: {
    paddingVertical: spacing.sm,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  filterButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 20,
    backgroundColor: colors.background.secondary,
    borderWidth: 1,
    borderColor: colors.border.light,
    marginHorizontal: spacing.xs,
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
  productCard: {
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
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: colors.gray[100],
  },
  productInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  productHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  productName: {
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
  productCategory: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  productPrice: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.error,
    marginBottom: spacing.xs,
  },
  discountText: {
    fontSize: typography.fontSize.sm,
    color: colors.text.tertiary,
  },
  productStock: {
    fontSize: typography.fontSize.sm,
    color: colors.text.tertiary,
  },
  productActions: {
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
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  halfInput: {
    flex: 1,
  },
  label: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  selectContainer: {
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: 8,
    maxHeight: 150,
  },
  selectScroll: {
    maxHeight: 150,
  },
  selectOption: {
    padding: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  selectOptionActive: {
    backgroundColor: colors.primary,
  },
  selectOptionText: {
    fontSize: typography.fontSize.md,
    color: colors.text.primary,
  },
  selectOptionTextActive: {
    color: colors.white,
  },
  noCategoriesText: {
    padding: spacing.sm,
    fontSize: typography.fontSize.sm,
    color: colors.text.tertiary,
    textAlign: 'center',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  imagesSection: {
    marginBottom: spacing.md,
  },
  imagesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  imagesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  imageItem: {
    position: 'relative',
  },
  imagePreview: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: colors.gray[100],
  },
  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: colors.white,
    borderRadius: 12,
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
