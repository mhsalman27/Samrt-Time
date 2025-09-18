import mongoose from "mongoose";

const timetableSchema = new mongoose.Schema(
  {
    subject: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: true },
    room: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },

    course: { type: String, required: true }, // e.g. B.Tech
    department: { type: String, required: true }, // e.g. CSE
    year: { type: Number, required: true }, // e.g. 2nd year

    section: { type: String, default: "A" }, // A, B, C sections
    day: {
      type: String,
      enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      required: true,
    },

    startTime: { type: String, required: true }, // e.g. "10:00"
    endTime: { type: String, required: true },   // e.g. "11:00"
  },
  { timestamps: true }
);

export default mongoose.model("Timetable", timetableSchema);
