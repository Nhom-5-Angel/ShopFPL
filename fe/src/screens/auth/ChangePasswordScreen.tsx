import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

import { AuthStackParamList } from '../../navigation/AuthStackParamList'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { useAuth } from '../../hooks/auth/useAuth'


type ChangePasswordNavigatorProp = NativeStackNavigationProp<AuthStackParamList, 'ChangePassword'>

type ChangePasswordRouteProp = RouteProp<AuthStackParamList, 'ChangePassword'>

const ChangePasswordScreen = () => {

  const navigation = useNavigation<ChangePasswordNavigatorProp>()
  const route = useRoute<ChangePasswordRouteProp>()
  const {email} = route.params

  const [inputNewPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')

  const [isFocus, setIsFocus] = useState<String | null>(null)

  const isPasswordValid = inputNewPassword.length >= 8
  const isPasswordMatch = inputNewPassword.length > 0 && confirmNewPassword.length > 0 && inputNewPassword === confirmNewPassword

  const {hanldeChangePassword} = useAuth()
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Ionicons name='arrow-back' size={25} color={'black'} />
        </Pressable>
        <Text style={{ marginLeft: 10, fontSize: 20 }}>Quay lại</Text>
      </View>
      
      <View>
        <Text style={{fontSize: 30, fontWeight: 'bold', marginTop: 25}}>Đặt mật khẩu mới</Text>
        <Text style={{fontSize: 15, marginTop: 10}}>Tạo mật khẩu mới cho tài khoản của bạn</Text>
      </View>

      <View style={styles.circle}>
        <Ionicons name='lock-closed-outline' size={50} color={'blue'} />
      </View>

      <View>
        <Text style={{fontSize: 20, marginTop: 20}}>Mật khẩu mới</Text>
        <TextInput
        style={[styles.passwordInput, isFocus === 'newPassword' && styles.passwordFocus]}
        placeholder='Nhập mật khẩu mới'
        value={inputNewPassword}
        onChangeText={setNewPassword}
        secureTextEntry={true}
        onFocus={() => setIsFocus('newPassword')}
        onBlur={() => setIsFocus(null)}
        />

        <Text style={{marginTop: 10, fontSize: 20}}>Xác nhận mật khẩu</Text>
        <TextInput
        style={[styles.passwordInput, isFocus === 'confirmNewPassword' && styles.passwordFocus]}
        placeholder='Nhập mật khẩu mới'
        value={confirmNewPassword}
        onChangeText={setConfirmNewPassword}
        secureTextEntry={true}
        onFocus={() => setIsFocus('confirmNewPassword')}
        onBlur={() => setIsFocus(null)}
        />
      </View>

      <View style={styles.checkValPass}>
        <Text style={{fontSize: 15}}>Yêu cầu mật khẩu</Text>

        <View style={styles.requireItem}>
          <Ionicons name={isPasswordValid ? 'checkmark-circle-outline' : 'ellipse-outline'} size={20} color={'green'}/>
          <Text style={{marginLeft: 10}}>Ít nhất 8 ký tự</Text>
        </View>

        <View style={styles.requireItem}>
          <Ionicons name={isPasswordMatch ? 'checkmark-circle-outline' : 'ellipse-outline'} size={20} color={'green'}/>
          <Text style={{marginLeft: 10}}>Mật khẩu xác nhận khớp</Text>
        </View>
      </View>

      <Pressable style={styles.btnConfirm}
            onPress={() => hanldeChangePassword({email, newPassword: inputNewPassword, confirmPassword: confirmNewPassword }, () => navigation.navigate('Login'))}>
              <Text style={{fontSize: 20, color: 'white'}}>Xác nhận</Text>
            </Pressable>
    </SafeAreaView>
  )
}

export default ChangePasswordScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center'
  }, 
  circle: {
    backgroundColor: '#eff6ff',
    width: 150,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    alignSelf: 'center',
    marginTop: 50
  },
  passwordInput: {
    marginTop: 10,
    paddingHorizontal: 10,
    height: 48,
    fontSize: 20,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#f3f3f5',
    backgroundColor: '#f3f3f5'

  },
  passwordFocus: {
    borderWidth: 2,
    borderColor: '#4A90E2'
  },
  btnConfirm: {
    marginTop: 30,
    backgroundColor: '#1e2939',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: 10,
  },
  checkValPass: {
    backgroundColor: '#f3f3f5',
    marginTop: 15,
    padding: 15,
    borderRadius: 10
  },
  requireItem: {
    flexDirection: 'row',
    marginTop: 10
  }
})