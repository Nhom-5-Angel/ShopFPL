import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { AuthStackParamList } from '../../navigation/AuthStackParamList'



const RegisterPage = () => {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [focusInput, setFocusInput] = useState<String | null>(null)

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  type RegisterNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Register'>
  const navigation = useNavigation<RegisterNavigationProp>()
  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Ionicons name='arrow-back' size={25} color={'black'} />
        </Pressable>
        <Text style={{ marginLeft: 10, fontSize: 20 }}>Quay lại</Text>
      </View>

      <View>
        <Text style={{ fontWeight: 'bold', fontSize: 30, marginTop: 25 }}>Đăng Ký</Text>
        <Text style={{ marginTop: 10, fontSize: 18 }}>Tạo tài khoản mới để bắt đầu mua sắm</Text>

        <Text style={{ marginTop: 30, fontSize: 20 }}>Họ và tên</Text>
        <TextInput
          style={[styles.input, focusInput === 'fullname' && styles.inputFocus]}
          placeholder='Nguyễn Văn A'
          value={fullName}
          onChangeText={setFullName}
          onFocus={() => setFocusInput('fullname')}
          onBlur={() => setFocusInput(null)}
          underlineColorAndroid="transparent"
        />

        <Text style={{ marginTop: 20, fontSize: 20 }}>Email</Text>
        <TextInput
          style={[styles.input, focusInput === 'email' && styles.inputFocus]}
          placeholder='example@gmail.com'
          value={email}
          onChangeText={setEmail}
          onFocus={() => setFocusInput('email')}
          onBlur={() => setFocusInput(null)}
          underlineColorAndroid="transparent"
        />

        <Text style={{ marginTop: 20, fontSize: 20 }}>Số điện thoại</Text>
        <TextInput
          style={[styles.input, focusInput === 'phone' && styles.inputFocus]}
          placeholder='012345678'
          value={phone}
          onChangeText={setPhone}
          onFocus={() => setFocusInput('phone')}
          onBlur={() => setFocusInput(null)}
          underlineColorAndroid="transparent"
        />

        <Text style={{ marginTop: 20, fontSize: 20 }}>Mật khẩu</Text>
        <View style={[styles.passwordContainer, focusInput === 'password' && styles.inputFocus]}>
          <TextInput
            style={[styles.passwordInput]}
            placeholder='Tối thiểu 8 ký tự'
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            onFocus={() => setFocusInput('password')}
            onBlur={() => setFocusInput(null)}
            underlineColorAndroid="transparent"
          />

          <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'}
            size={22}
            color={'#888'}
            onPress={() => setShowPassword(!showPassword)} />
        </View>

        <Text style={{ marginTop: 20, fontSize: 20 }}>Xác nhận mật khẩu</Text>
        <View style={[styles.passwordContainer, focusInput === 'confirmPassword' && styles.inputFocus]}>
          <TextInput
            style={[styles.passwordInput]}
            placeholder='Tối thiểu 8 ký tự'
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirmPassword}
            onFocus={() => setFocusInput('confirmPassword')}
            onBlur={() => setFocusInput(null)}
            underlineColorAndroid="transparent"
          />

          <Ionicons name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
            size={22}
            color={'#888'}
            onPress={() => setShowConfirmPassword(!showConfirmPassword)} />
        </View>

        <Pressable
          style={[styles.btnRegister]}
          onPress={() => { }}>
          <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>Đăng ký</Text>
        </Pressable>

        <View style={styles.footer}>
                            <Text style={{fontSize: 15}}>Có tài khoản</Text>
                            <Pressable
                            onPress={() => navigation.navigate('Login')}
                        >
                            <Text
                                style={{fontSize: 15, marginLeft: 10, textDecorationLine: 'underline', color: 'blue' }}
                            >
                                Đăng nhập ngay
                            </Text>
                        </Pressable>
                        </View>

      </View>
    </SafeAreaView>
  )
}

export default RegisterPage

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
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f3f5',
    borderRadius: 10,
    height: 48,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#f3f3f5',
    paddingHorizontal: 10
  },
  passwordInput: {
    flex: 1,
    fontSize: 16
  },
  btnRegister: {
    marginTop: 30,
    backgroundColor: '#1e2939',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: 10,
  },
  footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 30,
    }
})