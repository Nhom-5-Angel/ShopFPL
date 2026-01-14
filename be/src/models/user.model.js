import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: true,
        match: /^\+?[0-9]\d{1,14}$/
    },
    avatarUrl: {
        type: String,
    },
    avatarId: {
        type: String,
    },
    birthDate: {
        type: Date,
    },
    address: {
        type: String,
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other'],
        default: 'other',
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    refreshToken: {
        type: String
    }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;