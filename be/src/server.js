const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const connectDB = require('./configs/db.js');

const app = express()
const PORT = process.env.PORT || 3000

dotenv.config()



app.use(cors())
app.use(express.json())

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server đang lắng nghe cổng ${PORT}`);
    });
});