import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit3,
  Trash2,
  BookOpen,
  GraduationCap,
  Building,
  Calendar,
  Search,
  X,
  Check,
  AlertCircle,
  ChevronRight,
  RefreshCw
} from "lucide-react";
import axios from "axios";

const API_URL = import.meta.env.VITE_URL;

export default function SubjectPage() {
  const [subjects, setSubjects] = useState([]);
  const [open, setOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", type: "success" });
  const [newSubject, setNewSubject] = useState({
    code: "",
    name: "",
    department: "",
    year: "",
    semester: "",
  });

  const token = localStorage.getItem("sihtoken");

  // Fetch subjects
  const fetchSubjects = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/subject`, {
        headers: { sihtoken: token },
      });
      setSubjects(res.data.subjects || []);
    } catch (err) {
      console.error(err);
      showSnackbar(err.response?.data?.message || "Failed to fetch subjects", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  // Show snackbar
  const showSnackbar = (message, type = "success") => {
    setSnackbar({ open: true, message, type });
    setTimeout(() => {
      setSnackbar({ open: false, message: "", type: "success" });
    }, 4000);
  };

  // Open dialog for add/edit
  const handleClickOpen = (subject = null, index = null) => {
    if (subject) {
      setNewSubject(subject);
      setEditIndex(index);
    } else {
      setNewSubject({ code: "", name: "", department: "", year: "", semester: "" });
      setEditIndex(null);
    }
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  // Save subject (add/update)
  const handleSave = async () => {
    if (!newSubject.code || !newSubject.name || !newSubject.department || !newSubject.year || !newSubject.semester) {
      showSnackbar("Please fill all fields", "error");
      return;
    }

    try {
      const payload = {
        code: newSubject.code,
        name: newSubject.name,
        department: newSubject.department,
        year: Number(newSubject.year),
        semester: Number(newSubject.semester),
      };

      if (editIndex !== null) {
        const id = subjects[editIndex]._id;
        const res = await axios.put(`${API_URL}/subject/${id}`, payload, {
          headers: { sihtoken: token },
        });
        const updated = [...subjects];
        updated[editIndex] = res.data.subject;
        setSubjects(updated);
        showSnackbar("Subject updated successfully", "success");
      } else {
        const res = await axios.post(`${API_URL}/subject`, payload, {
          headers: { sihtoken: token },
        });
        setSubjects([...subjects, res.data.subject]);
        showSnackbar("Subject added successfully", "success");
      }
    } catch (err) {
      console.error(err);
      showSnackbar(err.response?.data?.message || "Action failed", "error");
    } finally {
      handleClose();
    }
  };

  // Delete subject
  const handleDelete = async (id, index) => {
    if (window.confirm("Are you sure you want to delete this subject?")) {
      try {
        await axios.delete(`${API_URL}/subject/${id}`, {
          headers: { sihtoken: token },
        });
        const updated = [...subjects];
        updated.splice(index, 1);
        setSubjects(updated);
        showSnackbar("Subject deleted successfully", "success");
      } catch (err) {
        console.error(err);
        showSnackbar(err.response?.data?.message || "Delete failed", "error");
      }
    }
  };

  // Filter subjects based on search
  const filteredSubjects = subjects.filter(subject => 
    subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subject.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subject.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const SkeletonRow = () => (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="flex-1 space-y-3">
          <div className="h-4 bg-slate-200 rounded w-1/4"></div>
          <div className="h-3 bg-slate-200 rounded w-1/2"></div>
          <div className="h-3 bg-slate-200 rounded w-1/3"></div>
        </div>
        <div className="flex gap-2">
          <div className="w-8 h-8 bg-slate-200 rounded-lg"></div>
          <div className="w-8 h-8 bg-slate-200 rounded-lg"></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 p-4 md:p-8">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl p-6 md:p-8 mb-8 shadow-xl shadow-black/5">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
              📚 Subject Management
            </h1>
            <p className="text-lg text-slate-600 font-medium">
              Manage your academic subjects and courses
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleClickOpen()}
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Plus className="w-4 h-4" />
              Add Subject
            </button>
            <button
              onClick={fetchSubjects}
              className="p-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Search and Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        {/* Search */}
        <div className="lg:col-span-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search subjects by name, code, or department..."
              className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 placeholder-slate-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Stats Card */}
        <div className="bg-white rounded-2xl border border-blue-200 p-6 shadow-sm relative overflow-hidden group hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600"></div>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
                Total Subjects
              </p>
              <p className="text-3xl font-bold text-slate-900 mb-3">
                {subjects.length}
              </p>
              <div className="flex items-center gap-1.5 text-sm">
                <span className="font-semibold text-blue-600">Academic</span>
                <span className="text-slate-500">resources</span>
              </div>
            </div>
            <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center shadow-sm">
              <BookOpen className="w-7 h-7 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Subjects Grid */}
      <div className="space-y-4">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((item) => (
              <SkeletonRow key={item} />
            ))}
          </div>
        ) : filteredSubjects.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
            <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              {searchTerm ? "No subjects found" : "No subjects yet"}
            </h3>
            <p className="text-slate-500 mb-6">
              {searchTerm 
                ? "Try adjusting your search terms" 
                : "Get started by adding your first subject"}
            </p>
            {!searchTerm && (
              <button
                onClick={() => handleClickOpen()}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl mx-auto"
              >
                <Plus className="w-4 h-4" />
                Add First Subject
              </button>
            )}
          </div>
        ) : (
          filteredSubjects.map((subject, index) => (
            <div
              key={subject._id}
              className="bg-white rounded-2xl border border-blue-200 p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden cursor-pointer"
              onClick={() => handleClickOpen(subject, index)}
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600"></div>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                      <BookOpen className="w-7 h-7 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-slate-900 truncate">
                          {subject.name}
                        </h3>
                        <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium">
                          {subject.code}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Building className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-600">{subject.department}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <GraduationCap className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-600">Year {subject.year}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-600">Semester {subject.semester}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClickOpen(subject, index);
                    }}
                    className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(subject._id, index);
                    }}
                    className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <ChevronRight className="w-5 h-5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add/Edit Modal */}
      {open && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900">
                  {editIndex !== null ? "Edit Subject" : "Add New Subject"}
                </h2>
                <button
                  onClick={handleClose}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Subject Code
                </label>
                <input
                  type="text"
                  placeholder="e.g. CS101"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={newSubject.code}
                  onChange={(e) => setNewSubject({ ...newSubject, code: e.target.value })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Subject Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Introduction to Computer Science"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={newSubject.name}
                  onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Department
                </label>
                <input
                  type="text"
                  placeholder="e.g. Computer Science"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={newSubject.department}
                  onChange={(e) => setNewSubject({ ...newSubject, department: e.target.value })}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Year
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="4"
                    placeholder="1"
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={newSubject.year}
                    onChange={(e) => setNewSubject({ ...newSubject, year: e.target.value })}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Semester
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="8"
                    placeholder="1"
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={newSubject.semester}
                    onChange={(e) => setNewSubject({ ...newSubject, semester: e.target.value })}
                  />
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-slate-200 flex gap-3">
              <button
                onClick={handleClose}
                className="flex-1 px-4 py-3 border border-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg"
              >
                {editIndex !== null ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Snackbar */}
      {snackbar.open && (
        <div className="fixed bottom-6 right-6 z-50">
          <div className={`flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border backdrop-blur-sm transform transition-all ${
            snackbar.type === "success" 
              ? "bg-green-50 border-green-200 text-green-800" 
              : "bg-red-50 border-red-200 text-red-800"
          }`}>
            {snackbar.type === "success" ? (
              <Check className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <span className="font-medium">{snackbar.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}