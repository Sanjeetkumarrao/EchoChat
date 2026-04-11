import dotenv from 'dotenv';
dotenv.config();

import app from "./app.js";
import connectDB from './src/config/db.js';


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

