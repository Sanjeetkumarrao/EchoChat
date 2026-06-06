import User from "../models/user.model.js";
import crypto from "crypto";
import { sendVerificationEmail } from "../services/email.service.js";

export const registerUser = async (req, res) => {
    const { name, username, email, password } = req.body;

    if (
        !name?.trim() ||
        !username?.trim() ||
        !email?.trim() ||
        !password?.trim()
    ) {
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        });
    }

    const existingUser = await User.findOne({
        $or: [{ email }, { username }]
    });

    if (existingUser) {
        return res.status(409).json({
            success: false,
            message: "User already exists"
        });
    }

    const verificationToken = crypto
        .randomBytes(32)
        .toString("hex");

    const hashedVerificationToken = crypto
        .createHash("sha256")
        .update(verificationToken)
        .digest("hex");

    const verificationTokenExpiry =
        new Date(Date.now() + 10 * 60 * 1000);

    const user = await User.create({
        name,
        username,
        email,
        password,
        verificationToken: hashedVerificationToken,
        verificationTokenExpiry
    });

    const verificationURL =
        `http://localhost:5173/verify-email?token=${verificationToken}`;

    await sendVerificationEmail(
        user.email,
        verificationURL
    );

    return res.status(201).json({
        success: true,
        message:
            "Registration successful. Please verify your email.",
        user: {
            _id: user._id,
            name: user.name,
            username: user.username,
            email: user.email,
            profilePhoto: user.profilePhoto,
            about: user.about,
        }
    });
};


export const verifyEmail = async(req, res) => {
    const {token} = req.query;
    
    if(!token){
        return res.status(400).json({
        success: false,
        message: "Verification token is required"
    });
    }

    const hashedToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");
    
    const user = await User.findOne({
        verificationToken: hashedToken,
        verificationTokenExpiry: {$gt: Date.now()}
    })

    if(!user){
        return res.status(400).json({
        success: false,
        message: "Invalid or expired token"
    }) 
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiry = undefined;
    await user.save();

    return res.status(200).send(`
        <html>
            <body style="font-family: sans-serif; text-align: center; padding: 50px;">
                <h1>✅ Email Verified!</h1>
                <a href="http://localhost:5173/login">
                    Login here !!
                </a>
            </body>
        </html>
    `)
}


export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email?.trim() || !password?.trim()) {
        return res.status(400).json({
            success: false,
            message: "Email and password are required"
        });
    }

    const user = await User.findOne({ email })
        .select("+password");

    if (!user) {
        return res.status(404).json({
            success: false,
            message: "Invalid email or password"
        });
    }

    if (!user.isVerified) {
        return res.status(403).json({
            success: false,
            message: "Please verify your email first"
        });
    }

    const isPasswordCorrect =
        await user.comparePassword(password);

    if (!isPasswordCorrect) {
        return res.status(401).json({
            success: false,
            message: "Invalid email or password"
        });
    }

    const accessToken =
        user.generateAccessToken();

    user.isOnline = true;
    user.lastSeen = new Date();

    await user.save();

    return res.status(200).json({
        success: true,
        message: "Login successful",
        accessToken,
        user: {
            _id: user._id,
            name: user.name,
            username: user.username,
            email: user.email,
            profilePhoto: user.profilePhoto,
            about: user.about,
            isVerified: user.isVerified
        }
    });
};