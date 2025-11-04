import rateLimit, { ipKeyGenerator } from "express-rate-limit";

export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  keyGenerator: (req) => {
    if (req.user && req.user.id) {
      console.log(`Rate limit key with token: ${req.user.id}`);
      return `user-${req.user.id}`;
    }
    return req.ip;
  },
  message: {
    success: false,
    message: "You have reached the request limit, please try again later.",
  },
    standardHeaders: true,
    legacyHeaders: false,
});

//Rate limit para rutas públicas (login y register)
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10, // máximo de 10 intentos por IP cada 15 min
  message: {
    success: false,
    message: "You have reached the request limit, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    const key = req.ip; // 👈 toma la IP directamente
    console.log("Rate limit key:", key);
    return key;
  },
});
