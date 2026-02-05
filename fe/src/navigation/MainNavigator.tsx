/**
 * Main Navigator
 * Navigation stack for authenticated users
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainStackParamList } from './types';
import { BottomTabNavigator } from './BottomTabNavigator';
import { ProductDetailScreen } from '../screens/ProductDetailScreen';
import { CheckoutScreen } from '../screens/CheckoutScreen';
import { OrdersScreen } from '../screens/OrdersScreen';
import { OrderDetailScreen } from '../screens/OrderDetailScreen';
import { AdminUsersScreen } from '../screens/AdminUsersScreen';
import { AdminProductsScreen } from '../screens/AdminProductsScreen';
import { AdminCategoriesScreen } from '../screens/AdminCategoriesScreen';


const Stack = createNativeStackNavigator<MainStackParamList>();

export const MainNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Home" component={BottomTabNavigator} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
      <Stack.Screen name="Orders" component={OrdersScreen} />
      <Stack.Screen name="OrderDetail" component={OrderDetailScreen} />
      <Stack.Screen name="AdminUsers" component={AdminUsersScreen} />
      <Stack.Screen name="AdminProducts" component={AdminProductsScreen} />
      <Stack.Screen name="AdminCategories" component={AdminCategoriesScreen} />
    </Stack.Navigator>
  );
};
