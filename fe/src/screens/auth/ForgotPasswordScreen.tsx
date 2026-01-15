import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { AuthStackParamList } from '../../navigation/AuthStackParamList'

type RegisterNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'ForgotPassword'>

const ForgotPasswordPage = () => {


  const navigation = useNavigation<RegisterNavigationProp>()
  const [focusInput, setFocusInput] = useState<String | null>(null)
  const [email, setEmail] = useState('')
  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Ionicons name='arrow-back' size={25} color={'black'} />
        </Pressable>
        <Text style={{ marginLeft: 10, fontSize: 20 }}>Quay lại</Text>
      </View>

      <View>
        <Text style={{ fontWeight: 'bold', fontSize: 30, marginTop: 25 }}>Quên mật khẩu</Text>
        <Text style={{ fontSize: 15, fontWeight: 'regular', marginTop: 10 }}>Đừng lo lắng! Chỉ cần nhập email đã đăng ký và chúng tôi sẽ gửi mã OTP về email của bạn</Text>
      </View>

      <View style={styles.circle}>
        <Ionicons name='mail-outline' size={50} color={'blue'} />
      </View>

      <View>
        <Text>Email</Text>
        <TextInput
          style={[styles.input, focusInput === 'email' && styles.inputFocus]}
          placeholder='example@gmail.com'
          value={email}
          onChangeText={setEmail}
          onFocus={() => setFocusInput('email')}
          onBlur={() => setFocusInput(null)}
          underlineColorAndroid="transparent" />
      </View>

      <Pressable
      style={styles.btnSendOTP}>
        <Text style={{fontSize: 15, color: 'white'}}>Gửi Mã OTP</Text>
      </Pressable>
    </SafeAreaView>
  )
}

export default ForgotPasswordPage

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
    borderRadius: 500,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 50
  },
  input: {
    marginTop: 10,
    backgroundColor: '#f3f3f5',
    borderRadius: 10,
    height: 48,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#f3f3f5',
    paddingHorizontal: 10
  },
  inputFocus: {
    borderWidth: 2,
    borderColor: '#4A90E2',
  },
  btnSendOTP: {
    marginTop: 30,
    backgroundColor: '#1e2939',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: 10,
  }
})