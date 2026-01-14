import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { apiService } from '../services/api';
import { Product, Category } from '../types';
import { SearchBar } from '../components/SearchBar';
import { PromotionalBanner } from '../components/PromotionalBanner';
import { CategoryCard } from '../components/CategoryCard';
import { ProductCard } from '../components/ProductCard';
import { FlashSaleTimer } from '../components/FlashSaleTimer';

const categories = [
  { id: '1', name: 'Áo', icon: '👕' },
  { id: '2', name: 'Quần', icon: '👖' },
  { id: '3', name: 'Váy', icon: '👗' },
  { id: '4', name: 'Giày', icon: '👟' },
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
      // Mock flash sale products với discount
      setFlashSaleProducts(data.slice(0, 5));
      setLoading(false);
    } catch (error) {
      console.error('Error loading products:', error);
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.greeting}>Xin chào 👋</Text>
            <Text style={styles.title}>Khám phá thời trang</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.iconButton}>
              <Text style={styles.icon}>🔔</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Text style={styles.icon}>❤️</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar */}
        <SearchBar />

        {/* Promotional Banner */}
        <PromotionalBanner
          title="Bộ Sưu Tập Mới"
          subtitle="Giảm giá lên đến 50%"
          buttonText="Mua Ngay"
        />

        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Danh Mục</Text>
          <FlatList
            data={categories}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <CategoryCard name={item.name} icon={item.icon} />
            )}
            contentContainerStyle={styles.categoriesList}
          />
        </View>

        {/* Flash Sale */}
        <View style={styles.section}>
          <View style={styles.flashSaleHeader}>
            <View style={styles.flashSaleTitleContainer}>
              <Text style={styles.flashSaleIcon}>⚡</Text>
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

        {/* All Products */}
        {products.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sản Phẩm Nổi Bật</Text>
            <FlatList
              data={products}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <ProductCard product={item} />}
              contentContainerStyle={styles.productsList}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
  headerLeft: {
    flex: 1,
  },
  greeting: {
    fontSize: 14,
    color: '#666',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 2,
  },
  headerRight: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 20,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  flashSaleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  flashSaleTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flashSaleIcon: {
    fontSize: 18,
    marginRight: 4,
  },
  categoriesList: {
    paddingHorizontal: 16,
  },
  productsList: {
    paddingHorizontal: 16,
  },
});
