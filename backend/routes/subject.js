import express from "express";
import {
  createSubject,
  getSubjects,
  getSubjectById,
  updateSubject,
  deleteSubject
} from "../controllers/subject.js";

import { isAuth } from "../middlewares/isAuth.js";


const router = express.Router();

// /subject
router.post("/", isAuth, createSubject);
router.get("/", isAuth, getSubjects);
router.get("/:id", isAuth, getSubjectById);
router.put("/:id", isAuth, updateSubject);
router.delete("/:id", isAuth, deleteSubject);

export default router;
