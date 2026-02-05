/**
 * Checkout Screen
 * Screen for creating orders from cart
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../navigation/types';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { apiService } from '../services/api';
import { CartItem, ShippingAddress } from '../types';
import { colors, typography, spacing } from '../theme';
import { Button } from '../components/common/Button';

type CheckoutNavigationProp = NativeStackNavigationProp<MainStackParamList, 'Checkout'>;

export const CheckoutScreen: React.FC = () => {
  const navigation = useNavigation<CheckoutNavigationProp>();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // Form fields
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');
  const [ward, setWard] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bank_transfer' | 'credit_card' | 'e_wallet'>('cod');

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
    }
  };

  const getProductFromItem = (item: CartItem) => {
    if (typeof item.productId === 'object' && item.productId !== null) {
      return item.productId;
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

  const validateForm = (): boolean => {
    if (!fullName.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập họ tên');
      return false;
    }
    if (!phone.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập số điện thoại');
      return false;
    }
    if (!address.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập địa chỉ');
      return false;
    }
    return true;
  };

  const handleCreateOrder = async () => {
    if (!validateForm()) return;

    if (cartItems.length === 0) {
      Alert.alert('Lỗi', 'Giỏ hàng trống');
      return;
    }

    try {
      setSubmitting(true);

      const shippingAddress: ShippingAddress = {
        fullName: fullName.trim(),
        phone: phone.trim(),
        address: address.trim(),
        city: city.trim() || undefined,
        district: district.trim() || undefined,
        ward: ward.trim() || undefined,
      };

      const order = await apiService.createOrder(shippingAddress, paymentMethod, notes.trim() || undefined);

      Alert.alert(
        'Thành công',
        'Đã tạo đơn hàng thành công',
        [
          {
            text: 'OK',
            onPress: () => {
              navigation.navigate('Orders');
            },
          },
        ]
      );
    } catch (error: any) {
      console.error('Error creating order:', error);
      Alert.alert('Lỗi', error.message || 'Không thể tạo đơn hàng');
    } finally {
      setSubmitting(false);
    }
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

  const total = calculateTotal();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thanh toán</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Shipping Address Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin giao hàng</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Họ và tên *"
            value={fullName}
            onChangeText={setFullName}
            placeholderTextColor={colors.text.tertiary}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Số điện thoại *"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            placeholderTextColor={colors.text.tertiary}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Địa chỉ *"
            value={address}
            onChangeText={setAddress}
            placeholderTextColor={colors.text.tertiary}
          />
          
          <View style={styles.row}>
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="Tỉnh/Thành phố"
              value={city}
              onChangeText={setCity}
              placeholderTextColor={colors.text.tertiary}
            />
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="Quận/Huyện"
              value={district}
              onChangeText={setDistrict}
              placeholderTextColor={colors.text.tertiary}
            />
          </View>
          
          <TextInput
            style={styles.input}
            placeholder="Phường/Xã"
            value={ward}
            onChangeText={setWard}
            placeholderTextColor={colors.text.tertiary}
          />
        </View>

        {/* Payment Method Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Phương thức thanh toán</Text>
          
          <TouchableOpacity
            style={[styles.paymentOption, paymentMethod === 'cod' && styles.paymentOptionSelected]}
            onPress={() => setPaymentMethod('cod')}
          >
            <Ionicons
              name={paymentMethod === 'cod' ? 'radio-button-on' : 'radio-button-off'}
              size={24}
              color={paymentMethod === 'cod' ? colors.primary : colors.text.tertiary}
            />
            <Text style={styles.paymentOptionText}>Thanh toán khi nhận hàng (COD)</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.paymentOption, paymentMethod === 'bank_transfer' && styles.paymentOptionSelected]}
            onPress={() => setPaymentMethod('bank_transfer')}
          >
            <Ionicons
              name={paymentMethod === 'bank_transfer' ? 'radio-button-on' : 'radio-button-off'}
              size={24}
              color={paymentMethod === 'bank_transfer' ? colors.primary : colors.text.tertiary}
            />
            <Text style={styles.paymentOptionText}>Chuyển khoản ngân hàng</Text>
          </TouchableOpacity>
        </View>

        {/* Notes Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ghi chú</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Ghi chú cho người bán (tùy chọn)"
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={4}
            placeholderTextColor={colors.text.tertiary}
          />
        </View>

        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tóm tắt đơn hàng</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tổng tiền:</Text>
            <Text style={styles.summaryValue}>{total.toLocaleString('vi-VN')}₫</Text>
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Tổng cộng:</Text>
          <Text style={styles.totalAmount}>{total.toLocaleString('vi-VN')}₫</Text>
        </View>
        <Button
          title={submitting ? 'Đang xử lý...' : 'Đặt hàng'}
          onPress={handleCreateOrder}
          variant="primary"
          fullWidth
          disabled={submitting || cartItems.length === 0}
          style={styles.submitButton}
        />
      </View>
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
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  input: {
    backgroundColor: colors.background.secondary,
    borderRadius: 8,
    padding: spacing.md,
    fontSize: typography.fontSize.md,
    color: colors.text.primary,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: 8,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  paymentOptionSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.background.secondary,
  },
  paymentOptionText: {
    marginLeft: spacing.sm,
    fontSize: typography.fontSize.md,
    color: colors.text.primary,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: typography.fontSize.md,
    color: colors.text.secondary,
  },
  summaryValue: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
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
  submitButton: {
    marginTop: spacing.sm,
  },
});
