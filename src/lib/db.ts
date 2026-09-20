import mongoose from "mongoose";

// Cached on globalThis so the connection survives hot reloads in dev
// and is reused across invocations in a warm serverless instance.
// A plain module-level boolean is reset on every cold start.
declare global {
  var _mongooseConn: typeof mongoose | undefined;
}

export const connectToDB = async () => {
  if (global._mongooseConn) return;

  const dbUri = process.env.MONGODB_URI;
  if (!dbUri) throw new Error("MONGODB_URI is not defined.");

  try {
    global._mongooseConn = await mongoose.connect(dbUri, {
      maxPoolSize: 10,       // cap concurrent connections per instance
      socketTimeoutMS: 45_000,
      serverSelectionTimeoutMS: 5_000,
      bufferCommands: false, // fail fast instead of queuing while disconnected
    });
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    throw new Error("Database connection failed.");
  }
};