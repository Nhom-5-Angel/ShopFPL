import React from 'react'
import { StatusBar, useColorScheme } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { AuthStackParamList } from './src/navigation/AuthStackParamList'
import LoginScreen from './src/screens/auth/LoginScreen'
import RegisterScreen from './src/screens/auth/RegisterScreen'
import ForgotPasswordScreen from './src/screens/auth/ForgotPasswordScreen'

// import { BottomTabNavigator } from './src/navigation/BottomTabNavigator'

const Stack = createNativeStackNavigator<AuthStackParamList>()

const App = () => {
  const isDarkMode = useColorScheme() === 'dark'

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        </Stack.Navigator>

        {/*
        👉 Sau này login xong thì đổi sang:
        <BottomTabNavigator />
        */}
      </NavigationContainer>
    </SafeAreaProvider>
  )
}

export default App
