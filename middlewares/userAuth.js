import jwt from 'jsonwebtoken';
import ErrorResponse from '../utils/errorResponse.js';

const userAuth = (req, res, next) => {
    const token = req.header("X-ACCESS-TOKEN");
    if (!token) return next(new ErrorResponse("Access Denied, No Token Found", 403));
    try {
        const verifyToken = jwt.verify(token, process.env.JWT_AT_SEC);
        req.user = verifyToken;
        next()
    }catch (error) {
        next(new ErrorResponse(error,403));
    }
}

export default userAuth;