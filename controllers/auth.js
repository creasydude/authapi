import userSchema from "../models/userSchema.js";
import ErrorResponse from "../utils/errorResponse.js";
import sendTokens from "../utils/sendTokens.js";
import sendMail from "../utils/sendMail.js";

export const register = async (req, res, next) => {
    const { username, email, password } = req.body;
    try {
        const newUser = new userSchema({
            username,
            email,
            password
        })
        const verification = newUser.getVerificationToken();
        await newUser.save()
        await sendMail(process.env.FE_URL, "/active/", verification, next)

        res.status(201).json({
            success: true,
            newUser,
        })
    } catch (error) {
        next(error);
    }
};

export const sendVerification = async (req, res, next) => {
    const { email } = req.body;
    if (!email) return next(new ErrorResponse("Please enter email", 400));
    try {
        const user = await userSchema.findOne({ email });
        if (!user) return next(new ErrorResponse("Invalid Credentials", 401));

        const verification = user.getVerificationToken();
        await sendMail(process.env.FE_URL, "/active/", verification, next)

        res.status(201).json({
            success: true,
            data: "Verification Sent"
        })
    } catch (error) {
        next(error);
    }
};

export const verifyUser = async (req, res, next) => {
    const { verifyToken } = req.params;
    if (!verifyToken) return next(new ErrorResponse("No Verify Token Found", 404));
    try {
        const user = await userSchema.findOne({ verificationToken: verifyToken });
        if (!user) return next(new ErrorResponse("Token is invalid or expired", 401));
        const verifyUser = user.activeUser();
        await user.save();

        res.status(201).json({
            success: true,
            data: "Account verified"
        })
    } catch (error) {
        next(error)
    }
};

export const login = async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) return next(new ErrorResponse("Please enter email or password", 400));
    try {
        const user = await userSchema.findOne({ email }).select("+password");
        if (!user) return next(new ErrorResponse("Invalid Credentials", 401));
        if (!user.active) return next(new ErrorResponse("Account Not Activated", 401));

        const isMatch = await user.matchPasswords(password);
        if (!isMatch) return next(new ErrorResponse("Invalid Credentials", 401));

        await sendTokens(user, 200, res, next)
    } catch (error) {
        next(error);
    }
};

export const refreshToken = async (req, res, next) => {
    const { rt } = req.signedCookies;
    if (!rt) return next(new ErrorResponse("No Token Found , Access Denied", 403))
    try {
        const user = await userSchema.findOne({ refreshToken: rt });
        if (!user) return next(new ErrorResponse("No Token Found , Access Denied", 403))
        await sendTokens(user, 201, res, next)
    } catch (error) {
        next(error)
    }

};

export const logout = async (req, res, next) => {
    const { rt } = req.signedCookies;
    if (!rt) return next(new ErrorResponse("No Token Found , Access Denied", 403))
    try {
        const user = await userSchema.findOne({ refreshToken: rt });
        if (!user) return next(new ErrorResponse("No Token Found , Access Denied", 403))

        const deleteRt = user.deleteRefreshToken();
        res.clearCookie('rt')

        await user.save()
        res.status(200).json({
            success: true,
            data: "Logout Successful"
        });
    } catch (error) {
        next(error);
    }

};

export const forgetPassword = async (req, res, next) => {
    const { email } = req.body;
    try {
        const user = await userSchema.findOne({ email });
        if (!user) return next(new ErrorResponse("User Not Found", 401));
        if (!user.active) return next(new ErrorResponse("Account Not Activated", 401));

        const resetToken = user.getResetPasswordToken();
        await user.save()
        await sendMail(process.env.FE_URL, "/resetPassword/", resetToken, next)

        res.status(201).json({
            success: true,
            data: "Link Create Success"
        })
    } catch (error) {
        next(error)
    }
};

export const resetPassword = async (req, res, next) => {
    const { resetToken } = req.params;
    const { password } = req.body;
    if (!resetToken) return next(new ErrorResponse("No Reset Token Found", 404));
    try {
        const user = await userSchema.findOne({ resetPasswordToken: resetToken, resetPasswordExpire: { $gt: Date.now() } });
        if (!user) return next(new ErrorResponse("Invalid Reset Token", 400));
        if (user && !password) return res.status(200).json({ success: true, data: "Token Is Valid" });
        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save()
        res.status(200).json({
            success: true,
            data: "Password Reset Success"
        })
    } catch (error) {
        next(error)
    }
};