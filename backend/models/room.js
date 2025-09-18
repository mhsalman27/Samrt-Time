import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    room: { type: String, required: true },      
    building: { type: String, required: true }, 
    floor: { type: Number, required: true },     
    type: { 
      type: String, 
      enum: ["Lab", "Classroom", "Seminar"], 
      required: true 
    },
    admin: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Room", roomSchema);
