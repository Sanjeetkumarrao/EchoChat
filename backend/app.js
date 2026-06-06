import express from 'express';
import cors from "cors"
import authRoutes from './src/routes/auth.routes.js'

const app = express();

app.use(cors({
    origin: "http://localhost:5173"
}))

app.use(express.json());

app.get('/', (req , res) => {
    res.send("Hello")
})

app.use('/api/auth', authRoutes);

export default app;