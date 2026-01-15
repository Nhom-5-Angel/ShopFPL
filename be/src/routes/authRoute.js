import express from 'express'
import { forgotPassword, resetPassword, signIn, signUp } from '../controllers/auth.controller.js'

const router = express.Router()

router.post('/signup', signUp)
router.post('/signin', signIn)
router.post('/forgotpassword', forgotPassword)
router.post('/resetpassword', resetPassword)
export default router
