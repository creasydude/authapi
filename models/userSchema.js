import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import CryptoJS from 'crypto-js';
const Schema = mongoose.Schema;

const User = new Schema({
    username: {
        type: String,
        required: [true, "Please enter username"]
    },
    email: {
        type: String,
        required: [true, "Please enter email"],
        unique: true,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            "Please enter valid email"
        ]
    },
    password: {
        type: String,
        required: [true, "Please enter password"],
        minLength: 8,
        match: [
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
            "Password must be at least 8 characters , 1 upper , 1 lower , 1 special character"
        ],
        select: false
    },
    status: {
        type: String,
        default: "pending"
    }
    refreshToken: String,
    verificationToken: String,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
});

User.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next()
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next()
})
User.methods.matchPasswords = async function (password) {
    return await bcrypt.compare(password, this.password);
};
User.methods.getTheTokens = function () {
    const accessToken = jwt.sign({ _id: this._id }, process.env.JWT_AT_SEC, { expiresIn: process.env.JWT_AT_EXPIRE });
    const refreshToken = jwt.sign({ _id: this._id }, process.env.JWT_RT_SEC, { expiresIn: process.env.JWT_RT_EXPIRE });
    this.refreshToken = refreshToken;
    return {
        accessToken,
        refreshToken
    };
}
User.methods.deleteRefreshToken = function () {
    this.refreshToken = undefined;
};
User.methods.getResetPasswordToken = function () {
    const resetPassowrd = CryptoJS.lib.WordArray.random(20).toString();
    this.resetPasswordToken = resetPassowrd;
    this.resetPasswordExpire = Date.now() + 10 * (60 * 1000);
    return resetPassowrd;
}
User.methods.getVerificationToken = function () {
    const verificationToken = CryptoJS.lib.WordArray.random(20).toString();


}

const userSchema = mongoose.model('users', User);
export default userSchema;