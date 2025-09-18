import Subject from "../models/subject.js";

// ✅ Create a new subject (linked to logged-in user)
export const createSubject = async (req, res) => {
  try {
    const { name, code, department, year, semester, credits } = req.body;

    const subject = new Subject({
      name,
      code,
      department,
      year,
      semester,
      credits,
      admin: req.id   // 👈 logged in user id
    });

    await subject.save();
    res.status(201).json({ message: "✅ Subject created successfully", subject });
  } catch (error) {
    res.status(500).json({ message: "❌ Error creating subject", error: error.message });
  }
};

// ✅ Get all subjects of logged-in user
export const getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find({ admin: req.id });
    res.status(200).json(subjects);
  } catch (error) {
    res.status(500).json({ message: "❌ Error fetching subjects", error: error.message });
  }
};

// ✅ Get single subject by ID (only if belongs to logged-in user)
export const getSubjectById = async (req, res) => {
  try {
    const subject = await Subject.findOne({ _id: req.params.id, admin: req.id });

    if (!subject) return res.status(404).json({ message: "⚠️ Subject not found or unauthorized" });

    res.status(200).json(subject);
  } catch (error) {
    res.status(500).json({ message: "❌ Error fetching subject", error: error.message });
  }
};

// ✅ Update subject (only if belongs to logged-in user)
export const updateSubject = async (req, res) => {
  try {
    const updatedSubject = await Subject.findOneAndUpdate(
      { _id: req.params.id, admin: req.id },
      req.body,
      { new: true }
    );

    if (!updatedSubject) return res.status(404).json({ message: "⚠️ Subject not found or unauthorized" });

    res.status(200).json({ message: "✅ Subject updated successfully", subject: updatedSubject });
  } catch (error) {
    res.status(500).json({ message: "❌ Error updating subject", error: error.message });
  }
};

// ✅ Delete subject (only if belongs to logged-in user)
export const deleteSubject = async (req, res) => {
  try {
    const deletedSubject = await Subject.findOneAndDelete({ _id: req.params.id, admin: req.id });

    if (!deletedSubject) return res.status(404).json({ message: "⚠️ Subject not found or unauthorized" });

    res.status(200).json({ message: "🗑️ Subject deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "❌ Error deleting subject", error: error.message });
  }
};

export const getcountsubject=async(req,res)=>{
  try{
      const count= await Subject.find({admin:req.id})
       res.status(200).json({ message: "here are count of subject", count : count });
  }
  catch(err){
      res.status(500).json({ message: "❌ Error conunting subject", error: error.message });
  }
}