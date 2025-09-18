import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    college: {
      type: String,
      required: true, // ✅ Admin will belong to a college/university
    },
  },
  { timestamps: true }
);

export default mongoose.model("Admin", adminSchema);
