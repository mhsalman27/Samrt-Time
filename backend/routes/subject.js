import express from "express";
import {
  createSubject,
  getSubjects,
  getSubjectById,
  updateSubject,
  deleteSubject,
  getCountSubject,
} from "../controllers/subject.js";
import { checkSubjectOwnership } from "../controllers/subject.js";
import { isAuth } from "../middlewares/isAuth.js";

const router = express.Router();


router.post("/", isAuth, createSubject);
router.get("/", isAuth, getSubjects);
router.get("/count", isAuth, getCountSubject);
router.get("/:id", isAuth, checkSubjectOwnership, getSubjectById);
router.put("/:id", isAuth, checkSubjectOwnership, updateSubject);
router.delete("/:id", isAuth, checkSubjectOwnership, deleteSubject);

export default router;
