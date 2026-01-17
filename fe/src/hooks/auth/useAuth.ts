import { Alert } from "react-native";
import { changePassword, forgotPasword, login, register, verifyOtp } from "../../services/auth/auth.service";

export const useAuth = () => {

  const handleRegister = async (
    data: {
      username: string;
      email: string;
      phoneNumber: string;
      password: string;
      confirmPassword: string;
    },
    onSuccess: () => void
  ) => {

    if (!data.username || !data.email || !data.phoneNumber || !data.password || !data.confirmPassword) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin');
      return;
    }

    if (data.password.length < 8) {
      Alert.alert('Lỗi', 'Mật khẩu phải trên 8 ký tự');
      return;
    }

    if (data.password !== data.confirmPassword) {
      Alert.alert('Lỗi', 'Mật khẩu không trùng khớp');
      return;
    }

    try {
      await register({
        username: data.username,
        email: data.email,
        phoneNumber: data.phoneNumber,
        password: data.password,
      });

      Alert.alert('Thành công', 'Đăng ký thành công');
      onSuccess();

    } catch (error: any) {
      console.log('REGISTER ERROR:', error);

      Alert.alert(
        'Thất bại',
        error?.response?.data?.message || error?.message || 'Lỗi hệ thống'
      );
    }
  };

  const handleLogin = async (
    data: {
      email: string;
      password: string;
    },
    onSuccess: () => void
  ) => {

    if (!data.email || !data.password) {
      Alert.alert('Lỗi', 'Không được để trống');
      return;
    }

    if (data.password.length < 8) {
      Alert.alert('Lỗi', 'Mật khẩu phải trên 8 ký tự');
      return;
    }

    try {
      await login(data);

      Alert.alert('Thành công', 'Đăng nhập thành công');
      onSuccess();

    } catch (error: any) {
      console.log('LOGIN ERROR:', error);

      Alert.alert(
        'Thất bại',
        error?.response?.data?.message || error?.message || 'Lỗi hệ thống'
      );
    }
  };

  const handleForgotPassword = async (
    data: {
      email: string
    }, onSuccess: () => void
  ) => {
    if (!data.email) {
      Alert.alert('Lỗi', 'Vui lòng nhập địa chỉ email của bạn')
      return
    }

    try {
      await forgotPasword(data)
      Alert.alert('Thành cồng', 'Mã xác nhận đã được gửi về email của bạn')
      onSuccess()
    } catch (error: any) {
      console.log('FORGOTPASSWORD ERROR:', error);

      Alert.alert(
        'Thất bại',
        error?.response?.data?.message || error?.message || 'Lỗi hệ thống'
      );
    }
  }

  const handleResendForgotPassword = async (
    data: {
      email: string
    }, onSuccess: () => void
  ) => {
    if (!data.email) {
      Alert.alert('Lỗi', 'Vui lòng nhập địa chỉ email của bạn')
      return
    }

    try {
      await forgotPasword(data)
      Alert.alert('Thành cồng', 'Mã xác nhận đã được gửi lại về email của bạn')
      onSuccess()
    } catch (error: any) {
      console.log('FORGOTPASSWORD ERROR:', error);

      Alert.alert(
        'Thất bại',
        error?.response?.data?.message || error?.message || 'Lỗi hệ thống'
      );
    }
  }

  const handleVerifyOtp = async(
    data: {
      email: string
      otp: string
    }, onSuccess: () => void
  ) => {
    if(!data.otp) {
      Alert.alert('Lỗi', 'Chưa nhập mã xác nhận')
      return
    }
    if (data.otp.length !== 6) {
      Alert.alert('Lỗi', 'Mã OTP phải đủ 6 số')
      return
    }

    try {
      await verifyOtp(data)
      Alert.alert('Thành công', 'Mã xác nhận chính xác')
      onSuccess()
    } catch (error: any) {
      console.log('VERIFYOTP ERROR', error);
      Alert.alert('Thất bại', error?.response?.data?.message || error?.message || 'Lỗi hệ thống' )
    }
  }

  const hanldeChangePassword = async(
    data: {
      email: string,
      newPassword: string,
      confirmPassword: string
    }, onSuccess: () => void 
  ) => {
    if (!data.newPassword || !data.confirmPassword) {
    Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ mật khẩu')
    return
  }

  if (data.newPassword.length < 8) {
    Alert.alert('Lỗi', 'Mật khẩu phải ít nhất 8 ký tự')
    return
  }

  if (data.newPassword !== data.confirmPassword) {
    Alert.alert('Lỗi', 'Mật khẩu xác nhận không khớp')
    return
  }
  try {
    await changePassword({
      email: data.email,
      newPassword: data.newPassword
    })

    Alert.alert('Thành công', 'Đổi mật khẩu thành công')
    onSuccess()
  } catch (error: any) {
    console.log('RESETPASSWORD ERROR:', error)

    Alert.alert(
      'Thất bại',
      error?.response?.data?.message || 'Lỗi hệ thống'
    )
  }
  }

  return {
    handleRegister,
    handleLogin,
    handleForgotPassword,
    handleResendForgotPassword,
    handleVerifyOtp,
    hanldeChangePassword
  };
};
