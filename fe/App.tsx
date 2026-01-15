import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import RegisterPage from './src/pages/auth/RegisterPage'
import LoginPage from './src/pages/auth/LoginPage'
import ForgotPasswordPage from './src/pages/auth/ForgotPasswordPage'
import { AuthStackParamList } from './src/navigation/AuthStackParamList'

const Stack = createNativeStackNavigator<AuthStackParamList>()

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginPage} />

        <Stack.Screen name="Register" component={RegisterPage} />

        <Stack.Screen name="ForgotPassword" component={ForgotPasswordPage} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App
