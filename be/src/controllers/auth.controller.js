import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../models/user.model.js';
import dotenv from 'dotenv'

dotenv.config()

export const signUp = async (req, res) => {
    try {
        // Lấy dữ liệu từ request body
        const { username, password, email, phoneNumber } = req.body;

        // Kiểm tra nếu có trường trống
        if (!username || !password || !email || !phoneNumber) {
            return res.status(400).json({ message: "Không được để trống" })
        }

        // Kiểm tra xem username đã tồn tại hay chưa
        const existsUser = await User.findOne({ username })

        if (existsUser) {
            return res.status(409).json({ message: "Username đã tồn tại" })
        }

        // Kiểm tra xem email đã được đăng ký hay chưa
        const existsEmail = await User.findOne({ email })

        if (existsEmail) {
            return res.status(409).json({ message: "Email đã được đăng ký" })
        }

        // Mã hóa mật khẩu với bcrypt
        const hashPassword = await bcrypt.hash(password, 10)

        // Tạo người dùng mới trong cơ sở dữ liệu
        await User.create({
            username,
            password: hashPassword,
            email,
            phoneNumber
        })

        // Trả về thông báo thành công
        return res.status(201).json({ message: "Đăng ký thành công" });

    } catch (error) {
        // Xử lý lỗi
        console.error("SignUp error:", error.message);
        return res.status(500).json({ message: "Lỗi hệ thống" })
    }
}


export const signIn = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ message: "Vui lòng điền đầu đủ thông tin" })
        }

        const user = await User.findOne({ email })

        if (!user) {
            return res.status(401).json({ message: "email hoặc password không chính xác" })
        }

        const checkPassword = await bcrypt.compare(password, user.password)
        if (!checkPassword) {
            return res.status(401).json({ message: "Password không chính xác" })
        }

        const accessToken = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' })

        const refreshToken = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '7d' })

        user.refreshToken = refreshToken

        await user.save()

        return res.status(200).json({
            message: "Đăng nhập thành công",
            accessToken,
            refreshToken
        })
    } catch (error) {
        console.error("SignIn error:", error.message);
        return res.status(500).json({ message: "Lỗi hệ thống" })
    }
}

export const refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body

        if (!refreshToken) {
            return res.status(401).json({ message: 'Thiếu refresh token' })
        }

        const user = await User.findOne({ refreshToken })
        if (!user) {
            return res.status(403).json({ message: 'Refresh token không hợp lệ' })
        }

        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            (err, decoded) => {
                if (err) {
                    return res.status(403).json({ message: 'Refresh token hết hạn' })
                }

                const newAccessToken = jwt.sign(
                    { userId: decoded.userId },
                    process.env.ACCESS_TOKEN_SECRET,
                    { expiresIn: '15m' }
                )

                return res.status(200).json({
                    accessToken: newAccessToken
                })
            }
        )
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: 'Lỗi hệ thống' })
    }
}
