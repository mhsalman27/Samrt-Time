import Subject from "../models/subject.js";

// 🔒 Middleware (inside controller file)
export const checkSubjectOwnership = async (req, res, next) => {
  try {
    const subject = await Subject.findById(req.params.id);

    if (!subject) {
      return res.status(404).json({ success: false, message: "⚠️ Subject not found" });
    }

    if (subject.admin.toString() !== req.id) {
      return res.status(403).json({ success: false, message: "🚫 Not authorized to access this subject" });
    }

    req.subject = subject; // ✅ attach subject for next handler
    next();
  } catch (error) {
    return res.status(500).json({ success: false, message: "❌ Server error", error: error.message });
  }
};

// ✅ Create subject
export const createSubject = async (req, res) => {
  console.log(req.body)

  try {
    const { name, code, department, year, semester } = req.body;

    if (!name || !code || !department || !year || !semester ) {
      return res.status(400).json({ success: false, message: "⚠️ All fields are required" });
    }

    const subject = await Subject.create({
      name,
      code,
      department,
      year,
      semester,
      
      admin: req.id,
    });

     console.log(subject)
    res.status(201).json({ success: true, message: "✅ Subject created successfully", subject });
  } catch (error) {
    res.status(500).json({ success: false, message: "❌ Error creating subject", error: error.message });
  }
};

// ✅ Get all subjects for logged-in user
export const getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find({ admin: req.id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, subjects });
  } catch (error) {
    res.status(500).json({ success: false, message: "❌ Error fetching subjects", error: error.message });
  }
};

// ✅ Get single subject (ownership checked)
export const getSubjectById = async (req, res) => {
  res.status(200).json({ success: true, subject: req.subject });
};

// ✅ Update subject (ownership checked)
export const updateSubject = async (req, res) => {
  try {
    Object.assign(req.subject, req.body);
    const updatedSubject = await req.subject.save();

    res.status(200).json({ success: true, message: "✅ Subject updated successfully", subject: updatedSubject });
  } catch (error) {
    res.status(500).json({ success: false, message: "❌ Error updating subject", error: error.message });
  }
};

// ✅ Delete subject (ownership checked)
export const deleteSubject = async (req, res) => {
  try {
    await req.subject.deleteOne();
    res.status(200).json({ success: true, message: "🗑️ Subject deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "❌ Error deleting subject", error: error.message });
  }
};

// ✅ Count subjects of logged-in user
export const getCountSubject = async (req, res) => {
  try {
    const count = await Subject.countDocuments({ admin: req.id });
    res.status(200).json({ success: true, count });
  } catch (error) {
    res.status(500).json({ success: false, message: "❌ Error counting subjects", error: error.message });
  }
};
