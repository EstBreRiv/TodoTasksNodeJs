import jwt from "jsonwebtoken";
import {
    AuthExceptionExpiredError,
    AuthExceptionInvalidCredentials,
    AuthExceptionInvalidToken,
    AuthExceptionMissingToken
} from '../exceptions/authExceptions.js';

export const verifyToken = async (req, res, next) => {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return next(new AuthExceptionMissingToken());
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
        return next(new AuthExceptionMissingToken());
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {

        if(error.name === 'TokenExpiredError'){
            return next(new AuthExceptionExpiredError());
        }

        console.error("Error verifying token:", error);
        return next(new AuthExceptionInvalidToken());
    }
};