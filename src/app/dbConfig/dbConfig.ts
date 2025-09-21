import mongoose from "mongoose";

// Make Mongoose fail fast and avoid buffering timeouts in dev
mongoose.set("strictQuery", true);

export const dbConnect = async () => {
  const uri = process.env.mongo_url;
  if (!uri) {
    throw new Error("Missing required env var: mongo_url");
  }

  // If already connected (readyState 1), skip reconnecting
  if (mongoose.connection.readyState === 1) {
    return;
  }

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      // heartbeatFrequencyMS: 2000, // optional tweak
    } as any);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
};
