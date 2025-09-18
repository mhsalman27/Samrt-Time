import Room from "../models/room.js";

// 🔒 Middleware to check ownership
export const checkRoomOwnership = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({ success: false, message: "⚠️ Room not found" });
    }

    if (room.admin.toString() !== req.id) {
      return res.status(403).json({ success: false, message: "🚫 Not authorized to access this room" });
    }

    req.room = room; // attach to req
    next();
  } catch (error) {
    return res.status(500).json({ success: false, message: "❌ Server error", error: error.message });
  }
};

// ✅ Create room
export const createRoom = async (req, res) => {
  try {
    const { room, building, floor, type } = req.body;

    if (!room || !building || !floor || !type) {
      return res.status(400).json({ success: false, message: "⚠️ All fields are required" });
    }

    const newRoom = await Room.create({
      room,
      building,
      floor,
      type,
      admin: req.id,
    });

    res.status(201).json({ success: true, message: "✅ Room created successfully", room: newRoom });
  } catch (error) {
    res.status(500).json({ success: false, message: "❌ Error creating room", error: error.message });
  }
};


// ✅ Get all rooms (for logged-in admin)
export const getRooms = async (req, res) => {
  try {
    const rooms = await Room.find({ admin: req.id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, rooms });
  } catch (error) {
    res.status(500).json({ success: false, message: "❌ Error fetching rooms", error: error.message });
  }
};

// ✅ Get single room (ownership checked)
export const getRoomById = async (req, res) => {
  res.status(200).json({ success: true, room: req.room });
};

// ✅ Update room (ownership checked)
export const updateRoom = async (req, res) => {
  try {
    const { room, building, floor, type } = req.body;

    if (!room || !building || !floor || !type) {
      return res.status(400).json({ success: false, message: "⚠️ All fields are required" });
    }

    Object.assign(req.room, { room, building, floor, type });
    const updatedRoom = await req.room.save();

    res.status(200).json({ success: true, message: "✅ Room updated successfully", room: updatedRoom });
  } catch (error) {
    res.status(500).json({ success: false, message: "❌ Error updating room", error: error.message });
  }
};

// ✅ Delete room (ownership checked)
export const deleteRoom = async (req, res) => {
  try {
    await req.room.deleteOne();
    res.status(200).json({ success: true, message: "🗑️ Room deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "❌ Error deleting room", error: error.message });
  }
};

// ✅ Count rooms for logged-in user
export const getCountRoom = async (req, res) => {
  try {
    const count = await Room.countDocuments({ admin: req.id });
    res.status(200).json({ success: true, count });
  } catch (error) {
    res.status(500).json({ success: false, message: "❌ Error counting rooms", error: error.message });
  }
};
