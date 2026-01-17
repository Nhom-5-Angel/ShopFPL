export type AuthStackParamList = {
  Login: undefined
  Register: undefined
  ForgotPassword: undefined
  VerifyOTP: {
    email: string
  }
  ChangePassword: {
    email: string
  }
  Home: undefined
}
