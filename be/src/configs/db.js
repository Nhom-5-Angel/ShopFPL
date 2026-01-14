import mongoose from 'mongoose'

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.STRING_CONNECT_DB)
    console.log('Kết nối DB thành công')
  } catch (error) {
    console.error(error)
    console.log('Kết nối DB thất bại')
    process.exit(1)
  }
}

export default connectDB
