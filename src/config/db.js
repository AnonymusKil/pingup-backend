import mongoose from "mongoose";
async function connectDB() {
  try {
    await mongoose.connect(process.env.MongoDB_URI);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.log("Error connecting to MongoDB:", err);
  }
}
export default connectDB
