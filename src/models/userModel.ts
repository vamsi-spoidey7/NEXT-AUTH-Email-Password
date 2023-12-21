import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username : {
        type: String,
        required: [true,"Please provide a username"],
        trim: true,
        unique: true
    },
    email : {
        type: String,
        required: [true,"Please provide a email"],
        trim: true,
        unique: true
    },
    password : {
        type: String,
        required: [true,"Please provide a password"],
        trim: true
    },
    isAdmin : {
        type: Boolean,
        default: false
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    forgotPasswordToken: String,
    forgotPasswordTokenExpiry: Date,
    verifyToken: String,
    verifyTokenExpiry: Date
})

const User =  mongoose.models.User || mongoose.model("User",userSchema);

export default User;