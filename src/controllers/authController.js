import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { findUserByUsername, createUser } from "../services/userService.js";



export const register = async (req, res) => {

    console.log("Register request body:", req.body);
    try {
        const { email, password } = req.body;

        //Valida usuario y contraseña
        if (!email || !password) {
            //TODO Agregar validaciones personalizadas
            return res.status(400).json({ message: "Email and password are required" });
        }

        const existingUser = await findUserByUsername(email);
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await createUser({
            email,
            password: hashedPassword,
        });

        res.status(201).json({ message: "Usuario creado", user: newUser });

    } catch (error) {
        console.error("Error during registration:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate user and password
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        // Check if user exists
        const user = await findUserByUsername(email);
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Generate JWT
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });

        res.status(200).json({ token });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export default { register, login };