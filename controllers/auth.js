import userSchema from "../models/userSchema.js";
import ErrorResponse from "../utils/errorResponse.js";
import sendTokens from "../utils/sendTokens.js";

export const register = async (req, res, next) => {
    const { username, email, password } = req.body;
    try {
        const newUser = await userSchema.create({
            username,
            email,
            password
        })
        res.status(201).json({
            success: true,
            newUser,
        })
    } catch (error) {
        next(error);
    }
};

export const login = async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) return next(new ErrorResponse("Please enter email or password", 400));
    try {
        const user = await userSchema.findOne({ email }).select("+password");
        if (!user) return next(new ErrorResponse("Invalid Credentials", 401));

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

}

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

}

export const forgetPassword = async (req, res, next) => {
    const { email } = req.body;
    try {
        const user = await userSchema.findOne({ email });
        if (!user) return next(new ErrorResponse("User Not Found", 401));

        const resetToken = user.getResetPasswordToken();
        await user.save()
        const resetPasswordUrl = process.env.FE_URL + resetToken;
        //For Development
        console.log(resetPasswordUrl)
        //Email Send LOGIC
        // try {
        //     sendMail(...)
        // } catch (error) {
        //     user.resetPasswordToken = undefined;
        //     user.resetPasswordExpire = undefined;
        //     await user.save()
        //     next(new ErrorResponse("Email Could Not Send", 500))
        // }

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