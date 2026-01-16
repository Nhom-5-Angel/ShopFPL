import express from 'express'
import { forgotPassword, refreshToken, resetPassword, signIn, signUp } from '../controllers/auth.controller.js'
import { authenticateToken } from '../middlewares/auth.middleware.js'

const router = express.Router()

// Public routes - Không cần authentication
router.post('/signup', signUp)
router.post('/signin', signIn)
router.post('/forgotpassword', forgotPassword)
router.post('/resetpassword', resetPassword)
router.post('/refreshtoken', refreshToken)

// Protected routes - Cần authentication
// Ví dụ: router.get('/profile', authenticateToken, getUserProfile)

export default router
