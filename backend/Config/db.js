import mongoose from "mongoose";
import dns from 'dns';

// Set DNS to use system DNS instead of localhost
dns.setServers(['8.8.8.8', '8.8.4.4']);

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      family: 4, // Use IPv4
    });
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
};

