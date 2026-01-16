import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { NavigationAction, useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { AuthStackParamList } from '../../navigation/AuthStackParamList'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { RouteProp, useRoute } from '@react-navigation/native'

type VerifyOTPNavigatorProp = NativeStackNavigationProp<AuthStackParamList, 'VerifyOTP'>
type VerifyOTPRouteProp = RouteProp<AuthStackParamList, 'VerifyOTP'>
const VerifyOTPScreen = () => {

  const navigation = useNavigation<VerifyOTPNavigatorProp>()

  const route = useRoute<VerifyOTPRouteProp>()

  const {email} = route.params
  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Ionicons name='arrow-back' size={25} color={'black'} />
        </Pressable>
        <Text style={{ marginLeft: 10, fontSize: 20 }}>Quay lại</Text>
      </View>

      <View>
        <Text style={{marginTop: 25, fontSize: 30, fontWeight: 'bold'}}>Xác thực OTP</Text>
        <Text style={{marginTop: 10, fontSize: 15}}>Chúng tôi đã gửi mã OTP gồm 6 số đến email {' '}</Text>
        <Text style={{color: 'blue', fontSize: 18}}>{email}</Text>
      </View>

      <View style={styles.circle}>
              <Ionicons name='mail-outline' size={50} color={'blue'} />
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
})