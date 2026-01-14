import { StyleSheet } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import LoginPage from './pages/auth/LoginPage'

const App = () => {
  return (
    <NavigationContainer>
      <LoginPage />
    </NavigationContainer>
  )
}

export default App

const styles = StyleSheet.create({})
