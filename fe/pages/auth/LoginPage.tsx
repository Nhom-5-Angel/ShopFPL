import { Pressable, SafeAreaViewBase, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Ionicons from 'react-native-vector-icons/Ionicons'


const LoginPage = () => {
    const [isFocus, setIsFocus] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isFocusPassword, setIsFocusPassword] = useState(false);

    //button login press
    return (
        <SafeAreaView style={{ flex: 1, justifyContent: 'start', alignItems: 'start', padding: 20 }}>
            <Text style={styles.title}>Đăng Nhập</Text>
            <Text style={styles.subtitle}>Chào mừng bạn trở lại!</Text>

            <Text style={{ fontSize: 18, marginTop: 20 }}>Email</Text>
            <TextInput style={[styles.input, isFocus && styles.inputFocus]}
                placeholder='example@gmail.com'
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
            />
            <Text style={{ fontSize: 18, marginTop: 20 }}>Mật khẩu</Text>
            <View
                style={[
                    styles.passwordContainer,
                    isFocusPassword && styles.inputFocus
                ]}
            >
                <TextInput
                    style={styles.passwordInput}
                    placeholder="Nhập mật khẩu"
                    secureTextEntry={!showPassword}
                    onFocus={() => setIsFocusPassword(true)}
                    onBlur={() => setIsFocusPassword(false)}
                />

                <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={22}
                    color="gray"
                    onPress={() => setShowPassword(!showPassword)}
                />
            </View>
            <Text style={{alignSelf: 'flex-end', marginTop: 20, textDecorationLine: 'underline', color: 'blue'}}>Quên mật khẩu?</Text>
            <Pressable>
                <View style={{ backgroundColor: '#000000', padding: 15, borderRadius: 10, marginTop: 30, alignItems: 'center' }}>
                    <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>Đăng Nhập</Text>
                </View>
            </Pressable>
        </SafeAreaView>
    )
}

export default LoginPage

const styles = StyleSheet.create({
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 18,
        color: 'gray',
        marginBottom: 20,
    },
    input: {
        height: 40,
        borderColor: 'black',
        borderWidth: 0,
        borderRadius: 10,
        width: '100%',
        paddingHorizontal: 10,
        marginTop: 10,
        backgroundColor: '#f3f3f5',
        fontSize: 16,
        color: 'black',
    },
    inputFocus: {
        borderWidth: 2,
        borderColor: 'gray',
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f3f3f5',
        borderRadius: 10,
        paddingHorizontal: 10,
        marginTop: 10,
    },
    passwordInput: {
        flex: 1,
        height: 40,
        fontSize: 16,
        color: 'black',
    },
    passwordInputFocus: {
        borderWidth: 2,
        borderColor: '#4A90E2',
    },


})