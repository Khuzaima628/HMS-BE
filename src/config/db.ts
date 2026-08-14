import "dotenv/config";
import "colors";
import mongoose from "mongoose";

const mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
  console.error("MONGO_URI is not set".bgRed.white);
  process.exit(1);
}

mongoose
  .connect(mongoUri)
  .then(() => console.error("MongoDB connected".bgGreen.black))
  .catch((error: unknown) => {
    console.error("MongoDB connection failed".bgRed.white, error);
    process.exit(1);
  });
