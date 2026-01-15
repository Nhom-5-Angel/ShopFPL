import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'
import { NativeSafeAreaProviderProps, SafeAreaView } from 'react-native-safe-area-context'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { AuthStackParamList } from '../../navigation/AuthStackParamList'
import { useAuth } from '../../hooks/auth/useAuth'

type LoginNaviagtionProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>

const LoginPage = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const [focusInput, setFocusInput] = useState<String | null>(null)

    const [showPassword, setShowPassword] = useState(false)


    const navigation = useNavigation<LoginNaviagtionProp>()

    const { handleLogin } = useAuth()
    return (
        <SafeAreaView style={styles.container}>
            <View>
                <Text style={{ fontWeight: 'bold', fontSize: 30, marginTop: 25 }}>Đăng Nhập</Text>
                <Text style={{ marginTop: 10, fontSize: 18 }}>Chào mừng bạn trở lại</Text>

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

                <Pressable
                    onPress={() => navigation.navigate('ForgotPassword')}
                >
                    <Text
                        style={{ alignSelf: 'flex-end', marginTop: 10, textDecorationLine: 'underline', color: 'blue' }}
                    >
                        Quên mật khẩu?
                    </Text>
                </Pressable>

                <Pressable
                    style={[styles.btnLogin]}
                    onPress={() => handleLogin({
                        email,
                        password
                    },
                        () => navigation.navigate('Home')
                    )}>
                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>Đăng ký</Text>
                </Pressable>

                <View style={styles.footer}>
                    <Text style={{ fontSize: 15 }}>Chưa có tài khoản?</Text>
                    <Pressable
                        onPress={() => navigation.navigate('Register')}
                    >
                        <Text
                            style={{ fontSize: 15, marginLeft: 10, textDecorationLine: 'underline', color: 'blue' }}
                        >
                            Đăng ký Ngay
                        </Text>
                    </Pressable>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default LoginPage

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
    btnLogin: {
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