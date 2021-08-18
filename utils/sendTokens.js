import setRtCookie from "../utils/setRtCookie.js";

const sendTokens = async (user, statusCode, res, next) => {
    try {
        const { accessToken, refreshToken } = user.getTheTokens();
        await user.save();
        setRtCookie(res, refreshToken)
        res.status(statusCode).json({
            success: true,
            accessToken,
            refreshToken
        })
    } catch (error) {
        next(error)
    }
};

export default sendTokens;