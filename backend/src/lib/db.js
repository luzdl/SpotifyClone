import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`connected to MongoDb ${conn.connection.host}`);
    } catch (error) {
        console.error("MongoDB connection failed", error);
        process.exit(1); //1 is failiure, 0 is succes
    }
}