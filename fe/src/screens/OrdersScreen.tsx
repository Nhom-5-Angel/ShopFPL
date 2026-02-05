/**
 * Orders Screen
 * Display list of orders, especially paid orders
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
import { Order, OrderItem, Product } from '../types';
import { colors, typography, spacing } from '../theme';

type OrdersNavigationProp = NativeStackNavigationProp<MainStackParamList, 'Orders'>;

export const OrdersScreen: React.FC = () => {
  const navigation = useNavigation<OrdersNavigationProp>();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'paid' | 'pending' | 'delivered'>('all');

  useEffect(() => {
    loadOrders();
  }, [filter]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      let fetchedOrders: Order[] = [];
      
      if (filter === 'paid') {
        fetchedOrders = await apiService.getOrders(undefined, 'paid');
      } else if (filter === 'pending') {
        fetchedOrders = await apiService.getOrders('pending');
      } else if (filter === 'delivered') {
        fetchedOrders = await apiService.getOrders('delivered');
      } else {
        fetchedOrders = await apiService.getOrders();
      }
      
      setOrders(fetchedOrders);
    } catch (error: any) {
      console.error('Error loading orders:', error);
      Alert.alert('Lỗi', error.message || 'Không thể tải danh sách đơn hàng');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadOrders();
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

  const getPaymentStatusText = (paymentStatus: string): string => {
    switch (paymentStatus) {
      case 'pending':
        return 'Chờ thanh toán';
      case 'paid':
        return 'Đã thanh toán';
      case 'failed':
        return 'Thanh toán thất bại';
      case 'refunded':
        return 'Đã hoàn tiền';
      default:
        return paymentStatus;
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

  const renderOrderItem = ({ item }: { item: Order }) => {
    const orderId = item._id || item.id || '';
    const firstItem = item.items[0];
    const product = firstItem ? getProductFromItem(firstItem) : null;
    const imageUrl = product?.images && product.images.length > 0 ? product.images[0].url : null;
    const itemCount = item.items.length;

    return (
      <TouchableOpacity
        style={styles.orderCard}
        onPress={() => navigation.navigate('OrderDetail', { orderId })}
      >
        <View style={styles.orderHeader}>
          <View>
            <Text style={styles.orderId}>Đơn hàng #{orderId.slice(-8)}</Text>
            <Text style={styles.orderDate}>{formatDate(item.createdAt)}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
            <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
              {getStatusText(item.status)}
            </Text>
          </View>
        </View>

        <View style={styles.orderContent}>
          {imageUrl ? (
            <Image source={{ uri: imageUrl }} style={styles.productImage} resizeMode="cover" />
          ) : (
            <View style={styles.productImagePlaceholder}>
              <Text style={styles.imagePlaceholderText}>👗</Text>
            </View>
          )}

          <View style={styles.orderInfo}>
            {product ? (
              <Text style={styles.productName} numberOfLines={2}>
                {product.name}
              </Text>
            ) : (
              <Text style={styles.productName} numberOfLines={2}>
                Sản phẩm không xác định
              </Text>
            )}
            
            {itemCount > 1 && (
              <Text style={styles.itemCount}>và {itemCount - 1} sản phẩm khác</Text>
            )}

            <View style={styles.paymentInfo}>
              <Text style={styles.paymentStatus}>
                {getPaymentStatusText(item.paymentStatus)}
              </Text>
            </View>
          </View>

          <View style={styles.orderTotal}>
            <Text style={styles.totalAmount}>{item.total.toLocaleString('vi-VN')}₫</Text>
          </View>
        </View>

        <View style={styles.orderFooter}>
          <Ionicons name="chevron-forward" size={20} color={colors.text.tertiary} />
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Đang tải đơn hàng...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Đơn hàng của tôi</Text>
        <View style={styles.backButton} />
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterTab, filter === 'all' && styles.filterTabActive]}
          onPress={() => setFilter('all')}
        >
          <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>
            Tất cả
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterTab, filter === 'paid' && styles.filterTabActive]}
          onPress={() => setFilter('paid')}
        >
          <Text style={[styles.filterText, filter === 'paid' && styles.filterTextActive]}>
            Đã thanh toán
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterTab, filter === 'pending' && styles.filterTabActive]}
          onPress={() => setFilter('pending')}
        >
          <Text style={[styles.filterText, filter === 'pending' && styles.filterTextActive]}>
            Chờ xử lý
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterTab, filter === 'delivered' && styles.filterTabActive]}
          onPress={() => setFilter('delivered')}
        >
          <Text style={[styles.filterText, filter === 'delivered' && styles.filterTextActive]}>
            Đã giao
          </Text>
        </TouchableOpacity>
      </View>

      {/* Orders List */}
      {orders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="receipt-outline" size={64} color={colors.text.tertiary} />
          <Text style={styles.emptyText}>Chưa có đơn hàng</Text>
          <Text style={styles.emptySubtext}>
            {filter === 'paid' 
              ? 'Bạn chưa có đơn hàng nào đã thanh toán'
              : 'Hãy mua sắm và tạo đơn hàng đầu tiên'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          renderItem={renderOrderItem}
          keyExtractor={(item) => item._id || item.id || Math.random().toString()}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        />
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
  filterContainer: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  filterTab: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: spacing.xs,
  },
  filterTabActive: {
    backgroundColor: colors.primary + '20',
  },
  filterText: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
  filterTextActive: {
    color: colors.primary,
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
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginTop: spacing.lg,
  },
  emptySubtext: {
    fontSize: typography.fontSize.md,
    color: colors.text.secondary,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  listContent: {
    padding: spacing.md,
  },
  orderCard: {
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
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  orderId: {
    fontSize: typography.fontSize.md,
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
  orderContent: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
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
  orderInfo: {
    flex: 1,
    marginLeft: spacing.md,
    justifyContent: 'space-between',
  },
  productName: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
  },
  itemCount: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  paymentInfo: {
    marginTop: spacing.xs,
  },
  paymentStatus: {
    fontSize: typography.fontSize.xs,
    color: colors.text.tertiary,
  },
  orderTotal: {
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  totalAmount: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.error,
  },
  orderFooter: {
    alignItems: 'flex-end',
  },
});
