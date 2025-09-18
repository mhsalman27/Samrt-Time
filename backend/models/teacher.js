import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },

    department: { type: String, required: true }, // e.g. CSE, ECE, ME
    designation: { type: String, enum: ["Professor", "Associate Professor", "Assistant Professor", "Lecturer"], default: "Lecturer" },
    
    courses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subject" }], // subjects teacher can teach
    years: [{ type: Number }], // e.g. [1,2,3] means can teach 1st, 2nd, 3rd year

    maxLoadPerWeek: { type: Number, default: 20 }, // teaching load (hours/week)
  },
  { timestamps: true }
);

export default mongoose.model("Teacher", teacherSchema);
