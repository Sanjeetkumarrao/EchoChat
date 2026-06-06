import dotenv from "dotenv";
dotenv.config();

import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});


export const sendVerificationEmail = async (
    email,
    verificationURL
) => {
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Verify your EchoChat Account",
        html: `
            <h2>Welcome to EchoChat</h2>

            <p>
                Click the link below to verify your email:
            </p>

            <a href="${verificationURL}">
                Verify Email
            </a>
        `
    });
};

