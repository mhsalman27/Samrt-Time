import express from "express";
import {
  createRoom,
  getRooms,
  getRoomById,
  updateRoom,
  deleteRoom,
  getCountRoom,
  checkRoomOwnership,
} from "../controllers/room.js";
import { isAuth } from "../middlewares/isAuth.js";

const router = express.Router();

router.post("/", isAuth, createRoom);
router.get("/", isAuth, getRooms);
router.get("/count", isAuth, getCountRoom);
router.get("/:id", isAuth, checkRoomOwnership, getRoomById);
router.put("/:id", isAuth, checkRoomOwnership, updateRoom);
router.delete("/:id", isAuth, checkRoomOwnership, deleteRoom);

export default router;
