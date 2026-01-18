import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { apiService } from '../services/api';
import { Product, Category } from '../types';
import { SearchBar } from '../components/SearchBar';
import { PromotionalBanner } from '../components/PromotionalBanner';
import { CategoryCard } from '../components/CategoryCard';
import { ProductCard } from '../components/ProductCard';
import { FlashSaleTimer } from '../components/FlashSaleTimer';

const { width } = Dimensions.get('window');

const categories = [
  { id: '1', name: 'Áo', icon: '👕', color: '#FF6B9D' },
  { id: '2', name: 'Quần', icon: '👖', color: '#4ECDC4' },
  { id: '3', name: 'Váy', icon: '👗', color: '#FFE66D' },
  { id: '4', name: 'Giày', icon: '👟', color: '#A8E6CF' },
  { id: '5', name: 'Phụ kiện', icon: '👜', color: '#FFB6C1' },
];

export const HomeScreen: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [flashSaleProducts, setFlashSaleProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await apiService.getProducts();
      setProducts(data);
      setFlashSaleProducts(data.slice(0, 6));
      setLoading(false);
    } catch (error) {
      console.error('Error loading products:', error);
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header với gradient background */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.headerLeft}>
              <Text style={styles.greeting}>Xin chào 👋</Text>
              <Text style={styles.title}>Khám phá thời trang</Text>
            </View>
            <View style={styles.headerRight}>
              <TouchableOpacity style={styles.iconButton}>
                <View style={styles.iconBadge}>
                  <Text style={styles.iconBadgeText}>3</Text>
                </View>
                <Text style={styles.icon}>🔔</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <Text style={styles.icon}>❤️</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Search Bar với shadow */}
        <View style={styles.searchContainer}>
          <SearchBar />
        </View>

        {/* Promotional Banner */}
        <View style={styles.bannerContainer}>
          <PromotionalBanner
            title="Bộ Sưu Tập Mới"
            subtitle="Giảm giá lên đến 50%"
            buttonText="Mua Ngay"
          />
        </View>

        {/* Categories Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Danh Mục</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>Xem tất cả</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={categories}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <CategoryCard 
                name={item.name} 
                icon={item.icon}
                color={item.color}
              />
            )}
            contentContainerStyle={styles.categoriesList}
          />
        </View>

        {/* Flash Sale Section */}
        <View style={styles.section}>
          <View style={styles.flashSaleHeader}>
            <View style={styles.flashSaleTitleContainer}>
              <View style={styles.flashSaleIconContainer}>
                <Text style={styles.flashSaleIcon}>⚡</Text>
              </View>
              <Text style={styles.sectionTitle}>Flash Sale</Text>
            </View>
            <FlashSaleTimer />
          </View>
          <FlatList
            data={flashSaleProducts}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ProductCard product={item} discount={50} />
            )}
            contentContainerStyle={styles.productsList}
          />
        </View>

        {/* New Arrivals Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Hàng Mới Về</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>Xem tất cả</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={products.slice(0, 6)}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <ProductCard product={item} />}
            contentContainerStyle={styles.productsList}
          />
        </View>

        {/* Featured Products Section */}
        {products.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Sản Phẩm Nổi Bật</Text>
              <TouchableOpacity>
                <Text style={styles.seeAll}>Xem tất cả</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.productsGrid}>
              {products.slice(0, 4).map((item) => (
                <View key={item.id} style={styles.gridItem}>
                  <ProductCard product={item} />
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Bottom spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingBottom: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  headerLeft: {
    flex: 1,
  },
  greeting: {
    fontSize: 14,
    color: '#999',
    fontWeight: '400',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
    marginTop: 4,
    letterSpacing: -0.5,
  },
  headerRight: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  iconButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  iconBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FF4444',
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  iconBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  icon: {
    fontSize: 22,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  bannerContainer: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  section: {
    marginTop: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    letterSpacing: -0.3,
  },
  seeAll: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  flashSaleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  flashSaleTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flashSaleIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFF4E6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  flashSaleIcon: {
    fontSize: 18,
  },
  categoriesList: {
    paddingHorizontal: 20,
  },
  productsList: {
    paddingHorizontal: 20,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  gridItem: {
    width: (width - 60) / 2,
    marginBottom: 16,
  },
  bottomSpacing: {
    height: 20,
  },
});
