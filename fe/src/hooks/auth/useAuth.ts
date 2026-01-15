import { Alert } from "react-native";
import { login, register } from "../../services/auth/auth.service";

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

  return {
    handleRegister,
    handleLogin,
  };
};
