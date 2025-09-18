import express from "express";
import {
  createTeacher,
  getTeachers,
  getTeacherById,
  updateTeacher,
  deleteTeacher,
  checkTeacherOwnership,
} from "../controllers/teacher.js";
import { isAuth } from "../middlewares/isAuth.js";

const router = express.Router();

router.post("/", isAuth, createTeacher); // create (must be authenticated)
router.get("/", isAuth, getTeachers); // list only admin's teachers
router.get("/:id", isAuth, checkTeacherOwnership, getTeacherById);
router.put("/:id", isAuth, checkTeacherOwnership, updateTeacher);
router.delete("/:id", isAuth, checkTeacherOwnership, deleteTeacher);

export default router;
