import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Plus,
  Edit3,
  Trash2,
  Users,
  GraduationCap,
  Building,
  BookOpen,
  Search,
  X,
  Check,
  AlertCircle,
  ChevronRight,
  RefreshCw,
  Clock,
  User
} from "lucide-react";

const API_BASE = import.meta.env.VITE_URL;
const TEACHER_API = `${API_BASE}/teacher`;
const SUBJECT_API = `${API_BASE}/subject`;

const designations = [
  "Professor",
  "Associate Professor",
  "Assistant Professor",
  "Lecturer",
];

export default function TeacherPage() {
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [open, setOpen] = useState(false);
  const [editTeacher, setEditTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    department: "",
    designation: "Lecturer",
    years: "",
    maxLoadPerWeek: "",
    courses: [],
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    type: "success",
  });

  const token = localStorage.getItem("sihtoken");

  // Fetch subjects and teachers
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [teachersRes, subjectsRes] = await Promise.all([
        axios.get(TEACHER_API, { headers: { sihtoken: token } }),
        axios.get(SUBJECT_API, { headers: { sihtoken: token } })
      ]);
      
      setTeachers(teachersRes.data.teachers || []);
      setSubjects(subjectsRes.data.subjects || []);
    } catch (err) {
      console.error("Failed to load data:", err);
      showSnackbar(
        err.response?.data?.message || "Failed to load data",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, type = "success") => {
    setSnackbar({ open: true, message, type });
    setTimeout(() => {
      setSnackbar({ open: false, message: "", type: "success" });
    }, 4000);
  };

  const openDialog = (teacher = null) => {
    setEditTeacher(teacher);
    if (teacher) {
      const courseIds = (teacher.courses || []).map((c) =>
        typeof c === "string" ? c : c._id
      );
      setFormData({
        name: teacher.name || "",
        department: teacher.department || "",
        designation: teacher.designation || "Lecturer",
        years: (teacher.years || []).join(",") || "",
        maxLoadPerWeek: teacher.maxLoadPerWeek || "",
        courses: courseIds,
      });
    } else {
      setFormData({
        name: "",
        department: "",
        designation: "Lecturer",
        years: "",
        maxLoadPerWeek: "",
        courses: [],
      });
    }
    setOpen(true);
  };

  const closeDialog = () => setOpen(false);

  const handleSave = async () => {
    if (!formData.name || !formData.department || !formData.designation) {
      showSnackbar("Please fill all required fields", "error");
      return;
    }
    
    try {
      const payload = {
        name: formData.name,
        department: formData.department,
        designation: formData.designation,
        years: formData.years
          .split(",")
          .map((s) => Number(s.trim()))
          .filter((n) => !Number.isNaN(n)),
        maxLoadPerWeek: formData.maxLoadPerWeek
          ? Number(formData.maxLoadPerWeek)
          : undefined,
        courses: formData.courses,
      };

      if (editTeacher) {
        await axios.put(`${TEACHER_API}/${editTeacher._id}`, payload, {
          headers: { sihtoken: token },
        });
        showSnackbar("Teacher updated successfully", "success");
      } else {
        await axios.post(TEACHER_API, payload, {
          headers: { sihtoken: token },
        });
        showSnackbar("Teacher added successfully", "success");
      }

      fetchData();
      closeDialog();
    } catch (err) {
      console.error("Save teacher error:", err);
      showSnackbar(
        err.response?.data?.message || "Failed to save teacher",
        "error"
      );
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this teacher?")) return;
    try {
      await axios.delete(`${TEACHER_API}/${id}`, {
        headers: { sihtoken: token },
      });
      showSnackbar("Teacher deleted successfully", "success");
      fetchData();
    } catch (err) {
      console.error("Delete error:", err);
      showSnackbar(
        err.response?.data?.message || "Delete failed",
        "error"
      );
    }
  };

  // Filter teachers based on search term
  const filteredTeachers = teachers.filter(teacher => 
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.designation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getSubjectNames = (courseIds) => {
    return (courseIds || [])
      .map((c) =>
        typeof c === "string"
          ? subjects.find((s) => s._id === c)?.name || c
          : c.name || c._id
      )
      .join(", ");
  };

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
              👨‍🏫 Teacher Management
            </h1>
            <p className="text-lg text-slate-600 font-medium">
              Manage your faculty members and their course assignments
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => openDialog()}
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Plus className="w-4 h-4" />
              Add Teacher
            </button>
            <button
              onClick={fetchData}
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
              placeholder="Search teachers by name, department, or designation..."
              className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 placeholder-slate-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Stats Card */}
        <div className="bg-white rounded-2xl border border-purple-200 p-6 shadow-sm relative overflow-hidden group hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-purple-600"></div>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
                Total Teachers
              </p>
              <p className="text-3xl font-bold text-slate-900 mb-3">
                {teachers.length}
              </p>
              <div className="flex items-center gap-1.5 text-sm">
                <span className="font-semibold text-purple-600">Faculty</span>
                <span className="text-slate-500">members</span>
              </div>
            </div>
            <div className="w-14 h-14 bg-purple-50 rounded-xl flex items-center justify-center shadow-sm">
              <Users className="w-7 h-7 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Teachers Grid */}
      <div className="space-y-4">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((item) => (
              <SkeletonRow key={item} />
            ))}
          </div>
        ) : filteredTeachers.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
            <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              {searchTerm ? "No teachers found" : "No teachers yet"}
            </h3>
            <p className="text-slate-500 mb-6">
              {searchTerm 
                ? "Try adjusting your search terms" 
                : "Get started by adding your first teacher"}
            </p>
            {!searchTerm && (
              <button
                onClick={() => openDialog()}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl mx-auto"
              >
                <Plus className="w-4 h-4" />
                Add First Teacher
              </button>
            )}
          </div>
        ) : (
          filteredTeachers.map((teacher, index) => (
            <div
              key={teacher._id}
              className="bg-white rounded-2xl border border-purple-200 p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden cursor-pointer"
              onClick={() => openDialog(teacher)}
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-purple-600"></div>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-purple-50 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                      <User className="w-7 h-7 text-purple-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-slate-900 truncate">
                          {teacher.name}
                        </h3>
                        <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium">
                          {teacher.designation}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-3">
                        <div className="flex items-center gap-2">
                          <Building className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-600">{teacher.department}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <GraduationCap className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-600">Years: {(teacher.years || []).join(", ")}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-600">Max Load: {teacher.maxLoadPerWeek || "N/A"} hrs/week</span>
                        </div>
                      </div>
                      
                      {teacher.courses && teacher.courses.length > 0 && (
                        <div className="mt-2">
                          <div className="flex items-center gap-2 mb-1">
                            <BookOpen className="w-4 h-4 text-slate-400" />
                            <span className="text-sm font-medium text-slate-700">Assigned Courses:</span>
                          </div>
                          <p className="text-sm text-slate-600 pl-6">
                            {getSubjectNames(teacher.courses)}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openDialog(teacher);
                    }}
                    className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(teacher._id);
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
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl transform transition-all">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900">
                  {editTeacher ? "Edit Teacher" : "Add New Teacher"}
                </h2>
                <button
                  onClick={closeDialog}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Teacher Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dr. John Smith"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Designation
                </label>
                <select
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  value={formData.designation}
                  onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                >
                  {designations.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Years (comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 1,2,3,4"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.years}
                  onChange={(e) => setFormData({ ...formData, years: e.target.value })}
                />
                <p className="text-xs text-slate-500 mt-1">Enter the years this teacher can teach, separated by commas</p>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Max Load Per Week (hours)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 20"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.maxLoadPerWeek}
                  onChange={(e) => setFormData({ ...formData, maxLoadPerWeek: e.target.value })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Assigned Courses
                </label>
                <div className="border border-slate-200 rounded-xl p-3 bg-white">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {formData.courses.length === 0 ? (
                      <span className="text-slate-500 text-sm">No courses selected</span>
                    ) : (
                      formData.courses.map(courseId => {
                        const course = subjects.find(s => s._id === courseId);
                        return (
                          <div key={courseId} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                            <span>{course ? course.name : courseId}</span>
                            <button 
                              onClick={() => setFormData({
                                ...formData, 
                                courses: formData.courses.filter(id => id !== courseId)
                              })}
                              className="text-blue-500 hover:text-blue-700"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        );
                      })
                    )}
                  </div>
                  
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {subjects
                      .filter(subject => !formData.courses.includes(subject._id))
                      .map(subject => (
                        <div 
                          key={subject._id}
                          onClick={() => setFormData({
                            ...formData,
                            courses: [...formData.courses, subject._id]
                          })}
                          className="flex items-center p-2 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors"
                        >
                          <BookOpen className="w-4 h-4 text-slate-400 mr-2" />
                          <span>{subject.name}</span>
                          <span className="text-xs text-slate-500 ml-2">({subject.code})</span>
                        </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-slate-200 flex gap-3">
              <button
                onClick={closeDialog}
                className="flex-1 px-4 py-3 border border-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg"
              >
                {editTeacher ? "Update" : "Save"}
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