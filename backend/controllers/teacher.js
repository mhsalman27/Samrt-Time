import Teacher from "../models/teacher.js";

/**
 * Middleware: checkTeacherOwnership
 * - finds teacher by :id
 * - ensures teacher exists and teacher.admin === req.id
 * - attaches teacher to req.teacher
 */
export const checkTeacherOwnership = async (req, res, next) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) {
      return res.status(404).json({ success: false, message: "Teacher not found" });
    }
    if (teacher.admin.toString() !== req.id) {
      return res.status(403).json({ success: false, message: "Not authorized to access this teacher" });
    }
    req.teacher = teacher;
    next();
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Create Teacher (admin from token)
export const createTeacher = async (req, res) => {
  try {
    const { name, department, designation, courses = [], years = [], maxLoadPerWeek } = req.body;

    if (!name || !department) {
      return res.status(400).json({ success: false, message: "Name and department are required" });
    }

    const teacher = await Teacher.create({
      name,
      department,
      designation,
      courses,
      years,
      maxLoadPerWeek,
      admin: req.id, // <-- owner set from token
    });

    return res.status(201).json({ success: true, teacher });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error creating teacher", error: error.message });
  }
};

// Get all teachers for logged-in admin
export const getTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find({ admin: req.id }).populate("courses");
    return res.status(200).json({ success: true, teachers });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error fetching teachers", error: error.message });
  }
};

// Get single teacher (ownership enforced by middleware)
export const getTeacherById = async (req, res) => {
  return res.status(200).json({ success: true, teacher: req.teacher });
};

// Update teacher (ownership enforced)
export const updateTeacher = async (req, res) => {
  try {
    // Prevent changing admin via body
    const body = { ...req.body };
    delete body.admin;

    // If years is passed as string, try to convert to array (frontend sends array usually)
    if (typeof body.years === "string") {
      body.years = body.years
        .split(",")
        .map((y) => Number(y.trim()))
        .filter((n) => !Number.isNaN(n));
    }

    Object.assign(req.teacher, body);
    const updated = await req.teacher.save();
    return res.status(200).json({ success: true, teacher: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error updating teacher", error: error.message });
  }
};

// Delete teacher (ownership enforced)
export const deleteTeacher = async (req, res) => {
  try {
    await req.teacher.deleteOne();
    return res.status(200).json({ success: true, message: "Teacher deleted" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error deleting teacher", error: error.message });
  }
};
