import express from 'express';
import { register, login } from '../controllers/authController.js';
import {userRegistrationValidationRules, validateUserRegistration} from "../validators/registerValidator.js";

const router = express.Router();

router.post('/register', userRegistrationValidationRules, validateUserRegistration, register);
router.post('/login', login);

export default router;

