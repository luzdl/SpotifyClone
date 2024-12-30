import express from 'express';
import dotenv from 'dotenv';

import {connectDB} from './lib/db.js';
import { clerkMiddleware } from '@clerk/express'

import usersRoutes from './routes/user.route.js';
import adminRoutes from './routes/admin.route.js';
import authRoutes from './routes/auth.route.js';
import songRoutes from './routes/song.route.js';
import albumRoutes from './routes/album.route.js';
import statRoutes from './routes/stat.route.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT 

app.use(express.json()); //to parse req.body

app.use(clerkMiddleware()); //this will add auth to req obj =>

app.use("/api/users", usersRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/songs", songRoutes);
app.use("/api/albums", albumRoutes);
app.use("/api/stats", statRoutes);

app.listen(PORT, () => {
    console.log('Server is running on port 123 '+ PORT);
    connectDB();
});