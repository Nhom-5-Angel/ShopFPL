const mongoose = require('mongoose');

const connectDB = async() => {
    try {
        await mongoose.connect(process.env.STRING_CONNECT_DB);
        console.log("Kết nối đến DB thành công");
    } catch (error) {
        console.log(error);
        console.log("Kết nối DB thất bại");
        process.exit(1);
    }
}

module.exports = connectDB;