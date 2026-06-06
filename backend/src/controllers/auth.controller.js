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
            "Registration successful. Please verify your email."
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
                <a href="http://localhost:5173/users/login">
                    Login here !!
                </a>
            </body>
        </html>
    `)
}


export const loginUser = async (req , res ) => {
    try {
        const {email, password} = req.body;

        if(!email || !password){
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const existingUser = await User.findOne({email});

        if(!existingUser){
            return res.status(400).json({
                message: "Invalid credentials"
            });
        }

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);

        if(!isPasswordCorrect){
            return res.status(400).json({
                message: "Invalid credentials"
            });
        }

        const token = jwt.sign(
            {userId: existingUser._id},
            
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        return res.status(200).json({
            message: "User logged in successfully !",
            user: {
                id: existingUser._id,
                name: existingUser.name,
                email: existingUser.email
            },
            token: token
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

