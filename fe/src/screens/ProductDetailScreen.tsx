/**
 * Product Detail Screen
 * Displays detailed information about a product
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../navigation/types';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { apiService } from '../services/api';
import { Product } from '../types';
import { colors, typography, spacing } from '../theme';

const { width } = Dimensions.get('window');
const IMAGE_HEIGHT = width * 0.9;

type ProductDetailNavigationProp = NativeStackNavigationProp<MainStackParamList, 'ProductDetail'>;

export const ProductDetailScreen: React.FC = () => {
  const navigation = useNavigation<ProductDetailNavigationProp>();
  const route = useRoute();
  const { productId } = route.params as { productId: string };

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    loadProduct();
  }, [productId]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const data = await apiService.getProduct(productId);
      setProduct(data);
    } catch (error) {
      console.error('Error loading product:', error);
      Alert.alert('Lỗi', 'Không thể tải thông tin sản phẩm');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;

    try {
      const productId = product._id || product.id;
      await apiService.addToCart(productId, quantity);
      Alert.alert('Thành công', 'Đã thêm vào giỏ hàng');
    } catch (error: any) {
      console.error('Error adding to cart:', error);
      Alert.alert('Lỗi', error.message || 'Không thể thêm vào giỏ hàng');
    }
  };

  const handleBuyNow = () => {
    // TODO: Implement buy now functionality
    Alert.alert('Thông báo', 'Tính năng đang phát triển');
  };

  const finalPrice = product?.discount && product.discount > 0
    ? product.price * (1 - product.discount / 100)
    : product?.price || 0;

  const categoryName = typeof product?.categoryId === 'object' 
    ? product.categoryId.name 
    : '';

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Đang tải...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!product) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Không tìm thấy sản phẩm</Text>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Quay lại</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const images = product.images && product.images.length > 0 
    ? product.images.map(img => img.url)
    : [];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header với nút back */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="heart-outline" size={24} color={colors.text.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Image Gallery */}
        <View style={styles.imageContainer}>
          {images.length > 0 ? (
            <>
              <Image 
                source={{ uri: images[selectedImageIndex] }} 
                style={styles.mainImage}
                resizeMode="cover"
              />
              {images.length > 1 && (
                <View style={styles.imageIndicators}>
                  {images.map((_, index) => (
                    <View
                      key={index}
                      style={[
                        styles.indicator,
                        selectedImageIndex === index && styles.indicatorActive,
                      ]}
                    />
                  ))}
                </View>
              )}
              {images.length > 1 && (
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  style={styles.thumbnailContainer}
                  contentContainerStyle={styles.thumbnailContent}
                >
                  {images.map((imageUrl, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => setSelectedImageIndex(index)}
                      style={[
                        styles.thumbnail,
                        selectedImageIndex === index && styles.thumbnailActive,
                      ]}
                    >
                      <Image 
                        source={{ uri: imageUrl }} 
                        style={styles.thumbnailImage}
                        resizeMode="cover"
                      />
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
            </>
          ) : (
            <View style={styles.imagePlaceholder}>
              <Text style={styles.imagePlaceholderText}>👗</Text>
            </View>
          )}
        </View>

        {/* Product Info */}
        <View style={styles.infoContainer}>
          {/* Category */}
          {categoryName && (
            <Text style={styles.category}>{categoryName}</Text>
          )}

          {/* Product Name */}
          <Text style={styles.productName}>{product.name}</Text>

          {/* Rating & Reviews */}
          {product.rating && product.rating > 0 && (
            <View style={styles.ratingContainer}>
              <View style={styles.ratingStars}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Ionicons
                    key={star}
                    name={star <= Math.round(product.rating || 0) ? 'star' : 'star-outline'}
                    size={16}
                    color={colors.warning}
                  />
                ))}
              </View>
              <Text style={styles.ratingText}>
                {product.rating.toFixed(1)} ({product.reviewsCount || 0} đánh giá)
              </Text>
            </View>
          )}

          {/* Price */}
          <View style={styles.priceContainer}>
            {product.discount && product.discount > 0 && (
              <>
                <Text style={styles.oldPrice}>
                  {product.price.toLocaleString('vi-VN')}₫
                </Text>
                <View style={styles.discountBadge}>
                  <Text style={styles.discountText}>-{product.discount}%</Text>
                </View>
              </>
            )}
            <Text style={styles.price}>
              {finalPrice.toLocaleString('vi-VN')}₫
            </Text>
          </View>

          {/* Stock & Sold */}
          <View style={styles.metaContainer}>
            {product.stock !== undefined && (
              <View style={styles.metaItem}>
                <Ionicons name="cube-outline" size={16} color={colors.text.secondary} />
                <Text style={styles.metaText}>Còn {product.stock} sản phẩm</Text>
              </View>
            )}
            {product.sold !== undefined && product.sold > 0 && (
              <View style={styles.metaItem}>
                <Ionicons name="checkmark-circle-outline" size={16} color={colors.text.secondary} />
                <Text style={styles.metaText}>Đã bán {product.sold}</Text>
              </View>
            )}
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Description */}
          {product.description && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Mô tả sản phẩm</Text>
              <Text style={styles.description}>{product.description}</Text>
            </View>
          )}

          {/* Quantity Selector */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Số lượng</Text>
            <View style={styles.quantityContainer}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Ionicons name="remove" size={20} color={colors.text.primary} />
              </TouchableOpacity>
              <Text style={styles.quantityText}>{quantity}</Text>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => setQuantity(quantity + 1)}
              >
                <Ionicons name="add" size={20} color={colors.text.primary} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action Buttons */}
      <View style={styles.bottomActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.cartButton]}
          onPress={handleAddToCart}
        >
          <Ionicons name="cart-outline" size={24} color={colors.white} />
          <Text style={styles.cartButtonText}>Thêm vào giỏ</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.buyButton]}
          onPress={handleBuyNow}
        >
          <Text style={styles.buyButtonText}>Mua ngay</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.secondary,
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  errorText: {
    fontSize: typography.fontSize.lg,
    color: colors.text.secondary,
    marginBottom: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  imageContainer: {
    backgroundColor: colors.white,
    marginBottom: spacing.md,
  },
  mainImage: {
    width: width,
    height: IMAGE_HEIGHT,
    backgroundColor: colors.gray[100],
  },
  imagePlaceholder: {
    width: width,
    height: IMAGE_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.gray[100],
  },
  imagePlaceholderText: {
    fontSize: 80,
  },
  imageIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    gap: 6,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.gray[300],
  },
  indicatorActive: {
    backgroundColor: colors.primary,
    width: 24,
  },
  thumbnailContainer: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
  },
  thumbnailContent: {
    gap: spacing.sm,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'transparent',
    overflow: 'hidden',
    marginRight: spacing.sm,
  },
  thumbnailActive: {
    borderColor: colors.primary,
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  infoContainer: {
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: 16,
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  category: {
    fontSize: typography.fontSize.sm,
    color: colors.text.tertiary,
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  productName: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.sm,
    lineHeight: 32,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    gap: spacing.xs,
  },
  ratingStars: {
    flexDirection: 'row',
    gap: 2,
  },
  ratingText: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    marginLeft: spacing.xs,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  oldPrice: {
    fontSize: typography.fontSize.md,
    color: colors.text.tertiary,
    textDecorationLine: 'line-through',
  },
  discountBadge: {
    backgroundColor: colors.error,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 6,
  },
  discountText: {
    color: colors.white,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
  },
  price: {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.error,
  },
  metaContainer: {
    flexDirection: 'row',
    gap: spacing.lg,
    marginBottom: spacing.md,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  metaText: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border.light,
    marginVertical: spacing.md,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  description: {
    fontSize: typography.fontSize.md,
    color: colors.text.secondary,
    lineHeight: 24,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border.light,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
  },
  quantityText: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    minWidth: 40,
    textAlign: 'center',
  },
  bottomActions: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
    gap: spacing.sm,
  },
  actionButton: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.xs,
  },
  cartButton: {
    backgroundColor: colors.primary,
  },
  cartButtonText: {
    color: colors.white,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
  },
  buyButton: {
    backgroundColor: colors.error,
  },
  buyButtonText: {
    color: colors.white,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
  },
});
