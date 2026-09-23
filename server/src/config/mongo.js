import mongoose from "mongoose";

const connectMongo = async () => {
  try {
    await mongoose.connect(process.env.CONNECTION_MONGO);
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  }
};

export default connectMongo;
