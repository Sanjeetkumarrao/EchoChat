import dotenv from 'dotenv';
dotenv.config();

if (!process.env.JWT_SECRET) {
    console.error("FATAL ERROR: JWT_SECRET is not defined");
    process.exit(1);
}

import app from "./app.js";
import connectDB from './src/db/db.js';


const PORT = process.env.PORT || 3000;

const serverStart = async() => {
    try {
        await connectDB();

        app.listen(PORT , () => {
            console.log(`Server is running on : http://localhost:${PORT}`);
        });
    } catch (error) {
        console.log("Server failed to start:", error.message);
    }
}

serverStart();

