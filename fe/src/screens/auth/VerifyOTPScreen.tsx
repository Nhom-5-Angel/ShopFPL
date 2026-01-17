import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { NavigationAction, useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { AuthStackParamList } from '../../navigation/AuthStackParamList'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { RouteProp, useRoute } from '@react-navigation/native'
import { useAuth } from '../../hooks/auth/useAuth'
import { verifyOtp } from '../../services/auth/auth.service'

type VerifyOTPNavigatorProp = NativeStackNavigationProp<AuthStackParamList, 'VerifyOTP'>

type VerifyOTPRouteProp = RouteProp<AuthStackParamList, 'VerifyOTP'>

const VerifyOTPScreen = () => {

  const navigation = useNavigation<VerifyOTPNavigatorProp>()

  const route = useRoute<VerifyOTPRouteProp>()

  const { email } = route.params

  const [otpCode, setOtpCode] = useState('')
  const [focusInput, setFocusInput] = useState<String | null>(null)

  const { handleResendForgotPassword, handleVerifyOtp } = useAuth()

  const OTP_EXFIRE_TIME = 300
  const REFRESH_RESEND_OTP = 30

  const [otpExpire, setOtpExpire] = useState(OTP_EXFIRE_TIME)
  const [resendCountdown, setResendCountdown] = useState(REFRESH_RESEND_OTP)

  const [otpExpired, setOtpExpired] = useState(false)
  const [canResend, setCanResend] = useState(false)

  //Thời gian hết hạn OTP
  useEffect(() => {
    if (otpExpire === 0) {
      setOtpExpired(true)
      return
    }

    const timer = setTimeout(() => {
      setOtpExpire(prev => prev - 1)
    }, 1000)

    return () => clearTimeout(timer)
  }, [otpExpire])

  //Thười gian làm cho gửi lại OTP
  useEffect(() => {
    if (resendCountdown === 0) {
      setCanResend(true)
      return
    }

    const timer = setTimeout(() => {
      setResendCountdown(prev => prev - 1)
    }, 1000)

    return () => clearTimeout(timer)
  }, [resendCountdown])

  const formatTime = (time: number) => {
    const m = Math.floor(time / 60)
    const s = time % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Ionicons name='arrow-back' size={25} color={'black'} />
        </Pressable>
        <Text style={{ marginLeft: 10, fontSize: 20 }}>Quay lại</Text>
      </View>

      <View>
        <Text style={{ marginTop: 25, fontSize: 30, fontWeight: 'bold' }}>Xác thực OTP</Text>
        <Text style={{ marginTop: 10, fontSize: 15 }}>Chúng tôi đã gửi mã OTP gồm 6 số đến email {' '}</Text>
        <Text style={{ color: 'blue', fontSize: 18 }}>{email}</Text>
      </View>

      <View style={styles.circle}>
        <Ionicons name='mail-outline' size={50} color={'blue'} />
      </View>

      <View>
        <Text style={{ fontSize: 18, marginTop: 30 }}>Mã OTP</Text>
        <TextInput
          style={[styles.input, focusInput === 'otpCode' && styles.inputFocus]}
          placeholder='096543'
          keyboardType='number-pad'
          value={otpCode}
          onChangeText={setOtpCode}
          onFocus={() => setFocusInput('otpCode')}
          onBlur={() => setFocusInput(null)}
          underlineColorAndroid="transparent" />
      </View>

      <Text
        style={{
          marginTop: 15,
          fontSize: 14,
          color: otpExpired ? 'red' : 'gray',
          alignSelf: 'flex-end',
        }}
      >{otpExpired ? 'Mã OTP đã hết hạn sau' : `Mã OTP hết hạn sau ${formatTime(otpExpire)}`}</Text>

      <Pressable style={styles.btnVerifyOtp}
        disabled={otpExpired}
        onPress={() => handleVerifyOtp({email, otp: otpCode}, () => navigation.navigate('ChangePassword', {email}) )}>
        <Text style={{ fontSize: 20, color: 'white' }}>Xác nhận</Text>
      </Pressable>

      <View style={styles.footer}>
        <Text style={{ fontSize: 16 }}>Chưa nhận được mã?</Text>
        <Pressable
          onPress={async () => {
            if (!canResend) return
            await handleResendForgotPassword({ email }, () => { })
            setOtpExpire(OTP_EXFIRE_TIME)
            setResendCountdown(REFRESH_RESEND_OTP)
            setOtpExpired(false)
            setCanResend(false)
          }}>
          <Text style={{ fontSize: 16, textDecorationLine: 'underline', color: 'blue', marginLeft: 10 }}>Gửi lại mã</Text>
        </Pressable>
      </View>

    </SafeAreaView>
  )
}

export default VerifyOTPScreen

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
    fontSize: 20,
    borderWidth: 1,
    borderColor: '#f3f3f5',
    paddingHorizontal: 10,
    textAlign: 'center'
  },
  inputFocus: {
    borderWidth: 2,
    borderColor: '#4A90E2',
  },
  btnVerifyOtp: {
    marginTop: 20,
    backgroundColor: '#1e2939',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: 10,
  },
  footer: {
    flexDirection: 'row',
    marginTop: 20,
    alignSelf: 'center'
  }
})