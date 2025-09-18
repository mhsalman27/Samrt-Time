import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    department: { type: String, required: true }, // e.g. CSE, ECE, ME
    designation: {
      type: String,
      enum: ["Professor", "Associate Professor", "Assistant Professor", "Lecturer"],
      default: "Lecturer",
    },
    courses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subject" }],
    years: [{ type: Number }],
    maxLoadPerWeek: { type: Number, default: 20 },

    // Owner (admin) — set from token in isAuth middleware
    admin: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Teacher", teacherSchema);
