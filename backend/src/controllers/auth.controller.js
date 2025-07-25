import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { generateToken } from "../library/utils.js";

export const signup = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required." });
        }

        if (password.length < 6) {
            return res
                .status(400)
                .json({ message: "Password must be atleast 6 characters." });
        }

        const user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({ message: "Email already exists." });
        }
        // Store hash in your password DB
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const newUser = new User({ username, email, password: hash });

        if (newUser) {
            const token = generateToken(newUser._id, res);
            await newUser.save();
            res.status(201).json({
                success: true,
                message: "User registered successfully",
                user: {
                    _id: newUser._id,
                    username: newUser.username,
                    email: newUser.email,
                    avatar: newUser.avatar,
                },
                token,
            });
        } else {
            return res.status(400).json({ message: "Invalid user data." });
        }
    } catch (error) {
        console.log(`Error in Signup Controller: ${error}`);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        console.log(user.password);

        const isValid = await bcrypt.compare(password, user.password); // true

        if (isValid) {
            const token = generateToken(user._id, res);
            res.status(201).json({
                success: true,
                message: "User registered successfully",
                user: {
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                    avatar: user.avatar,
                },
                token,
            });
        } else {
            res.status(400).json({ message: "Invalid credentials" });
        }
    } catch (error) {
        console.log(`Error in login controller ${error}`);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged out successfully." });
    } catch (error) {
        console.log("Error in logout controller ${error}");
        res.status(500).json({ message: "Internal server error" });
    }
};
