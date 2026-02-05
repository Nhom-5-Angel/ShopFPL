/**
 * Cart Screen
 * Shopping cart screen with cart items management
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../navigation/types';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { apiService } from '../services/api';
import { CartItem, Product } from '../types';
import { colors, typography, spacing } from '../theme';
import { Button } from '../components/common/Button';

type CartNavigationProp = NativeStackNavigationProp<MainStackParamList, 'Cart'>;

export const CartScreen: React.FC = () => {
  const navigation = useNavigation<CartNavigationProp>();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      setLoading(true);
      const items = await apiService.getCart();
      setCartItems(items);
    } catch (error: any) {
      console.error('Error loading cart:', error);
      Alert.alert('Lỗi', error.message || 'Không thể tải giỏ hàng');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadCart();
  };

  const handleUpdateQuantity = async (productId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      handleRemoveItem(productId);
      return;
    }

    try {
      setUpdatingItems(prev => new Set(prev).add(productId));
      const updatedItems = await apiService.updateCartItem(productId, newQuantity);
      setCartItems(updatedItems);
    } catch (error: any) {
      console.error('Error updating quantity:', error);
      Alert.alert('Lỗi', error.message || 'Không thể cập nhật số lượng');
      loadCart(); // Reload để sync lại
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  const handleRemoveItem = (productId: string) => {
    Alert.alert(
      'Xác nhận',
      'Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            try {
              const updatedItems = await apiService.removeFromCart(productId);
              setCartItems(updatedItems);
            } catch (error: any) {
              console.error('Error removing item:', error);
              Alert.alert('Lỗi', error.message || 'Không thể xóa sản phẩm');
            }
          },
        },
      ]
    );
  };

  const getProductFromItem = (item: CartItem): Product | null => {
    if (typeof item.productId === 'object' && item.productId !== null) {
      return item.productId as Product;
    }
    return null;
  };

  const calculateTotal = (): number => {
    return cartItems.reduce((total, item) => {
      const product = getProductFromItem(item);
      if (!product) return total;

      const price = product.discount && product.discount > 0
        ? product.price * (1 - product.discount / 100)
        : product.price;

      return total + price * item.quantity;
    }, 0);
  };

  const renderCartItem = ({ item }: { item: CartItem }) => {
    const product = getProductFromItem(item);
    const productId = typeof item.productId === 'string' ? item.productId : (product?._id || product?.id || '');
    const isUpdating = updatingItems.has(productId);

    if (!product) {
      return null; // Skip invalid items
    }

    const finalPrice = product.discount && product.discount > 0
      ? product.price * (1 - product.discount / 100)
      : product.price;

    const itemTotal = finalPrice * item.quantity;
    const imageUrl = product.images && product.images.length > 0 ? product.images[0].url : null;

    return (
      <View style={styles.cartItem}>
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.productImage} resizeMode="cover" />
        ) : (
          <View style={styles.productImagePlaceholder}>
            <Text style={styles.imagePlaceholderText}>👗</Text>
          </View>
        )}

        <View style={styles.itemInfo}>
          <Text style={styles.productName} numberOfLines={2}>
            {product.name}
          </Text>
          <Text style={styles.productPrice}>
            {finalPrice.toLocaleString('vi-VN')}₫
            {product.discount && product.discount > 0 && (
              <Text style={styles.oldPrice}>
                {' '}(-{product.discount}%)
              </Text>
            )}
          </Text>
          <Text style={styles.itemTotal}>
            Tổng: {itemTotal.toLocaleString('vi-VN')}₫
          </Text>
        </View>

        <View style={styles.itemActions}>
          <View style={styles.quantityContainer}>
            <TouchableOpacity
              style={[styles.quantityButton, item.quantity <= 1 && styles.quantityButtonDisabled]}
              onPress={() => handleUpdateQuantity(productId, item.quantity - 1)}
              disabled={isUpdating || item.quantity <= 1}
            >
              <Ionicons name="remove" size={18} color={colors.text.primary} />
            </TouchableOpacity>
            <Text style={styles.quantityText}>{item.quantity}</Text>
            <TouchableOpacity
              style={[styles.quantityButton, product.stock && item.quantity >= product.stock && styles.quantityButtonDisabled]}
              onPress={() => handleUpdateQuantity(productId, item.quantity + 1)}
              disabled={isUpdating || (product.stock !== undefined && item.quantity >= product.stock)}
            >
              <Ionicons name="add" size={18} color={colors.text.primary} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleRemoveItem(productId)}
            disabled={isUpdating}
          >
            <Ionicons name="trash-outline" size={20} color={colors.error} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Đang tải giỏ hàng...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const total = calculateTotal();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Giỏ hàng</Text>
        {cartItems.length > 0 && (
          <Text style={styles.itemCount}>{cartItems.length} sản phẩm</Text>
        )}
      </View>

      {/* Cart Items */}
      {cartItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="cart-outline" size={64} color={colors.text.tertiary} />
          <Text style={styles.emptyText}>Giỏ hàng trống</Text>
          <Text style={styles.emptySubtext}>Hãy thêm sản phẩm vào giỏ hàng</Text>
          <Button
            title="Mua sắm ngay"
            onPress={() => navigation.navigate('Home')}
            variant="primary"
            style={styles.shopButton}
          />
        </View>
      ) : (
        <>
          <FlatList
            data={cartItems}
            renderItem={renderCartItem}
            keyExtractor={(item, index) => {
              const productId = typeof item.productId === 'string' ? item.productId : (getProductFromItem(item)?._id || getProductFromItem(item)?.id || index.toString());
              return productId || index.toString();
            }}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
            }
          />

          {/* Total and Checkout */}
          <View style={styles.footer}>
            <View style={styles.totalContainer}>
              <Text style={styles.totalLabel}>Tổng cộng:</Text>
              <Text style={styles.totalAmount}>
                {total.toLocaleString('vi-VN')}₫
              </Text>
            </View>
            <Button
              title="Thanh toán"
              onPress={() => {
                if (cartItems.length === 0) {
                  Alert.alert('Thông báo', 'Giỏ hàng trống');
                  return;
                }
                navigation.navigate('Checkout');
              }}
              variant="primary"
              fullWidth
              style={styles.checkoutButton}
            />
          </View>
        </>
      )}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  headerTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
  },
  itemCount: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
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
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginTop: spacing.lg,
  },
  emptySubtext: {
    fontSize: typography.fontSize.md,
    color: colors.text.secondary,
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
  },
  shopButton: {
    marginTop: spacing.md,
  },
  listContent: {
    padding: spacing.md,
  },
  cartItem: {
    flexDirection: 'row',
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
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: colors.gray[100],
  },
  productImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    fontSize: 32,
  },
  itemInfo: {
    flex: 1,
    marginLeft: spacing.md,
    justifyContent: 'space-between',
  },
  productName: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  productPrice: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.error,
    marginBottom: spacing.xs,
  },
  oldPrice: {
    fontSize: typography.fontSize.sm,
    color: colors.text.tertiary,
    fontWeight: typography.fontWeight.normal,
  },
  itemTotal: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
  itemActions: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border.light,
    marginBottom: spacing.sm,
  },
  quantityButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonDisabled: {
    opacity: 0.3,
  },
  quantityText: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    minWidth: 30,
    textAlign: 'center',
  },
  deleteButton: {
    padding: spacing.xs,
  },
  footer: {
    backgroundColor: colors.white,
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  totalLabel: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
  },
  totalAmount: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.error,
  },
  checkoutButton: {
    marginTop: spacing.sm,
  },
});
