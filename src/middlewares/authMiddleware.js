import jwt from "jsonwebtoken";
import {
  AuthExceptionExpiredError,
  AuthExceptionInvalidCredentials,
  AuthExceptionInvalidToken,
  AuthExceptionMissingToken,
} from "../exceptions/authExceptions.js";

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
    if (error.name === "TokenExpiredError") {
      return next(new AuthExceptionExpiredError());
    }

    console.error("Error verifying token:", error);
    return next(new AuthExceptionInvalidToken());
  }
};

export const authorizeRole = (...roles) => {
 return (req, res, next) => {

    console.log("User role:", req.user ? req.user.role : "No user");

    if (!req.user) {
      return res.status(401).json({ message: "No autenticado" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "No tienes permisos" });
    }

    next();
  };
};
