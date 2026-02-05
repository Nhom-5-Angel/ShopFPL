/**
 * Order Detail Screen
 * Display detailed information about a specific order
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../navigation/types';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { apiService } from '../services/api';
import { Order, OrderItem, Product } from '../types';
import { colors, typography, spacing } from '../theme';
import { Button } from '../components/common/Button';

type OrderDetailNavigationProp = NativeStackNavigationProp<MainStackParamList, 'OrderDetail'>;

export const OrderDetailScreen: React.FC = () => {
  const navigation = useNavigation<OrderDetailNavigationProp>();
  const route = useRoute();
  const { orderId } = route.params as { orderId: string };

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  const loadOrder = async () => {
    try {
      setLoading(true);
      const orderData = await apiService.getOrderById(orderId);
      setOrder(orderData);
    } catch (error: any) {
      console.error('Error loading order:', error);
      Alert.alert('Lỗi', error.message || 'Không thể tải chi tiết đơn hàng');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsPaid = async () => {
    if (!order) return;

    Alert.alert(
      'Xác nhận',
      'Bạn có chắc chắn đã thanh toán đơn hàng này?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xác nhận',
          onPress: async () => {
            try {
              setUpdating(true);
              const updatedOrder = await apiService.updateOrderStatus(orderId, 'paid', 'paid');
              setOrder(updatedOrder);
              Alert.alert('Thành công', 'Đã đánh dấu đơn hàng là đã thanh toán');
            } catch (error: any) {
              console.error('Error updating order:', error);
              Alert.alert('Lỗi', error.message || 'Không thể cập nhật trạng thái đơn hàng');
            } finally {
              setUpdating(false);
            }
          },
        },
      ]
    );
  };

  const handleCancelOrder = async () => {
    if (!order) return;

    Alert.alert(
      'Xác nhận',
      'Bạn có chắc chắn muốn hủy đơn hàng này?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xác nhận',
          style: 'destructive',
          onPress: async () => {
            try {
              setUpdating(true);
              await apiService.cancelOrder(orderId);
              Alert.alert('Thành công', 'Đã hủy đơn hàng', [
                { text: 'OK', onPress: () => navigation.goBack() },
              ]);
            } catch (error: any) {
              console.error('Error cancelling order:', error);
              Alert.alert('Lỗi', error.message || 'Không thể hủy đơn hàng');
            } finally {
              setUpdating(false);
            }
          },
        },
      ]
    );
  };

  const getProductFromItem = (item: OrderItem): Product | null => {
    if (typeof item.productId === 'object' && item.productId !== null) {
      return item.productId as Product;
    }
    return null;
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'paid':
        return colors.success;
      case 'pending':
        return colors.warning || '#FFA500';
      case 'delivered':
        return colors.success;
      case 'cancelled':
        return colors.error;
      default:
        return colors.text.secondary;
    }
  };

  const getStatusText = (status: string): string => {
    switch (status) {
      case 'pending':
        return 'Chờ xử lý';
      case 'confirmed':
        return 'Đã xác nhận';
      case 'paid':
        return 'Đã thanh toán';
      case 'shipping':
        return 'Đang giao hàng';
      case 'delivered':
        return 'Đã giao hàng';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return status;
    }
  };

  const formatDate = (dateString?: string): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

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

  if (!order) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Không tìm thấy đơn hàng</Text>
        </View>
      </SafeAreaView>
    );
  }

  const canMarkAsPaid = order.paymentStatus !== 'paid' && order.status !== 'cancelled';
  const canCancel = order.status !== 'cancelled' && order.status !== 'delivered';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chi tiết đơn hàng</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Order Info */}
        <View style={styles.section}>
          <View style={styles.orderHeader}>
            <View>
              <Text style={styles.orderId}>Đơn hàng #{(order._id || order.id || '').slice(-8)}</Text>
              <Text style={styles.orderDate}>{formatDate(order.createdAt)}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) + '20' }]}>
              <Text style={[styles.statusText, { color: getStatusColor(order.status) }]}>
                {getStatusText(order.status)}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Trạng thái thanh toán:</Text>
            <Text style={styles.infoValue}>
              {order.paymentStatus === 'paid' ? 'Đã thanh toán' : 'Chờ thanh toán'}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Phương thức:</Text>
            <Text style={styles.infoValue}>
              {order.paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng' : 'Chuyển khoản'}
            </Text>
          </View>
        </View>

        {/* Shipping Address */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Địa chỉ giao hàng</Text>
          <Text style={styles.addressText}>{order.shippingAddress.fullName}</Text>
          <Text style={styles.addressText}>{order.shippingAddress.phone}</Text>
          <Text style={styles.addressText}>{order.shippingAddress.address}</Text>
          {order.shippingAddress.city && (
            <Text style={styles.addressText}>
              {[order.shippingAddress.ward, order.shippingAddress.district, order.shippingAddress.city]
                .filter(Boolean)
                .join(', ')}
            </Text>
          )}
        </View>

        {/* Order Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sản phẩm</Text>
          {order.items.map((item, index) => {
            const product = getProductFromItem(item);
            const imageUrl = product?.images && product.images.length > 0 ? product.images[0].url : null;
            const discount = item.discount || 0;
            const finalPrice = item.price * (1 - discount / 100);
            const itemTotal = finalPrice * item.quantity;

            return (
              <View key={index} style={styles.orderItem}>
                {imageUrl ? (
                  <Image source={{ uri: imageUrl }} style={styles.productImage} resizeMode="cover" />
                ) : (
                  <View style={styles.productImagePlaceholder}>
                    <Text style={styles.imagePlaceholderText}>👗</Text>
                  </View>
                )}
                <View style={styles.itemInfo}>
                  <Text style={styles.productName} numberOfLines={2}>
                    {product?.name || 'Sản phẩm không xác định'}
                  </Text>
                  <Text style={styles.itemQuantity}>Số lượng: {item.quantity}</Text>
                  <Text style={styles.itemPrice}>
                    {finalPrice.toLocaleString('vi-VN')}₫
                    {discount > 0 && (
                      <Text style={styles.discountText}> (-{discount}%)</Text>
                    )}
                  </Text>
                </View>
                <Text style={styles.itemTotal}>{itemTotal.toLocaleString('vi-VN')}₫</Text>
              </View>
            );
          })}
        </View>

        {/* Notes */}
        {order.notes && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ghi chú</Text>
            <Text style={styles.notesText}>{order.notes}</Text>
          </View>
        )}

        {/* Total */}
        <View style={styles.section}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Tổng cộng:</Text>
            <Text style={styles.totalAmount}>{order.total.toLocaleString('vi-VN')}₫</Text>
          </View>
        </View>
      </ScrollView>

      {/* Actions */}
      {canMarkAsPaid && (
        <View style={styles.footer}>
          <Button
            title="Đánh dấu đã thanh toán"
            onPress={handleMarkAsPaid}
            variant="primary"
            fullWidth
            loading={updating}
            style={styles.actionButton}
          />
        </View>
      )}

      {canCancel && (
        <View style={styles.footer}>
          <Button
            title="Hủy đơn hàng"
            onPress={handleCancelOrder}
            variant="outline"
            fullWidth
            loading={updating}
            style={[styles.actionButton, styles.cancelButton]}
          />
        </View>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
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
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
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
    fontSize: typography.fontSize.lg,
    color: colors.text.secondary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.md,
  },
  section: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  orderId: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
  },
  orderDate: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
  },
  statusText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  infoLabel: {
    fontSize: typography.fontSize.md,
    color: colors.text.secondary,
  },
  infoValue: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  addressText: {
    fontSize: typography.fontSize.md,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  orderItem: {
    flexDirection: 'row',
    marginBottom: spacing.md,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: colors.gray[100],
  },
  productImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    fontSize: 24,
  },
  itemInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  productName: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  itemQuantity: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  itemPrice: {
    fontSize: typography.fontSize.md,
    color: colors.text.primary,
  },
  discountText: {
    fontSize: typography.fontSize.sm,
    color: colors.text.tertiary,
  },
  itemTotal: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.error,
    alignSelf: 'flex-end',
  },
  notesText: {
    fontSize: typography.fontSize.md,
    color: colors.text.primary,
    lineHeight: 20,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  footer: {
    backgroundColor: colors.white,
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  actionButton: {
    marginBottom: spacing.sm,
  },
  cancelButton: {
    borderColor: colors.error,
  },
});
