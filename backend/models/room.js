import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    roomNumber: { type: String, required: true, unique: true },
    capacity: { type: Number, required: true },
    
    type: { type: String, enum: ["classroom", "lab", "seminar", "auditorium"], default: "classroom" },
    department: { type: String }, // optional (for department-specific labs)

    resources: [{ type: String }], // e.g. ["Projector", "Smart Board", "AC"]
  },
  { timestamps: true }
);

export default mongoose.model("Room", roomSchema);
