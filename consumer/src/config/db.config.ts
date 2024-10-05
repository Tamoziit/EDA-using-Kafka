import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect("mongodb://localhost:27017/eda").then(() => {
        console.log("Connected to MongoDB");
    }).catch((error) => {
        console.error("Error in connecting to MongoDb", error);
    });
}