import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Snackbar,
  Alert,
  MenuItem,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import { Add, Edit, Delete } from "@mui/icons-material";

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
    severity: "success",
  });

  const token = localStorage.getItem("sihtoken");

  // Fetch subjects and teachers
  useEffect(() => {
    fetchSubjects();
    fetchTeachers();
  }, []);

  const fetchSubjects = async () => {
    try {
      const res = await axios.get(SUBJECT_API, {
        headers: { sihtoken: token },
      });
      setSubjects(res.data.subjects || []);
    } catch (err) {
      console.error("Failed to load subjects:", err);
      setSnackbar({
        open: true,
        message:
          err.response?.data?.message || "Failed to load subjects",
        severity: "error",
      });
    }
  };

  const fetchTeachers = async () => {
    try {
      const res = await axios.get(TEACHER_API, {
        headers: { sihtoken: token },
      });
      setTeachers(res.data.teachers || []);
    } catch (err) {
      console.error("Failed to load teachers:", err);
      setSnackbar({
        open: true,
        message:
          err.response?.data?.message || "Failed to load teachers",
        severity: "error",
      });
    }
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
        setSnackbar({
          open: true,
          message: "Teacher updated",
          severity: "success",
        });
      } else {
        await axios.post(TEACHER_API, payload, {
          headers: { sihtoken: token },
        });
        setSnackbar({
          open: true,
          message: "Teacher added",
          severity: "success",
        });
      }

      fetchTeachers();
      closeDialog();
    } catch (err) {
      console.error("Save teacher error:", err);
      setSnackbar({
        open: true,
        message: err.response?.data?.message || "Failed to save teacher",
        severity: "error",
      });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete teacher?")) return;
    try {
      await axios.delete(`${TEACHER_API}/${id}`, {
        headers: { sihtoken: token },
      });
      setSnackbar({
        open: true,
        message: "Teacher deleted",
        severity: "success",
      });
      fetchTeachers();
    } catch (err) {
      console.error("Delete error:", err);
      setSnackbar({
        open: true,
        message: err.response?.data?.message || "Delete failed",
        severity: "error",
      });
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        👨‍🏫 Teachers
      </Typography>

      <Button
        variant="contained"
        startIcon={<Add />}
        onClick={() => openDialog()}
        sx={{ mb: 2 }}
      >
        Add Teacher
      </Button>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Department</TableCell>
            <TableCell>Designation</TableCell>
            <TableCell>Courses</TableCell>
            <TableCell>Years</TableCell>
            <TableCell>Max Load/Week</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {teachers.map((t) => (
            <TableRow key={t._id}>
              <TableCell>{t.name}</TableCell>
              <TableCell>{t.department}</TableCell>
              <TableCell>{t.designation}</TableCell>
              <TableCell>
                {(t.courses || [])
                  .map((c) =>
                    typeof c === "string"
                      ? subjects.find((s) => s._id === c)?.name || c
                      : c.name || c._id
                  )
                  .join(", ")}
              </TableCell>
              <TableCell>{(t.years || []).join(", ")}</TableCell>
              <TableCell>{t.maxLoadPerWeek}</TableCell>
              <TableCell>
                <IconButton color="primary" onClick={() => openDialog(t)}>
                  <Edit />
                </IconButton>
                <IconButton
                  color="error"
                  onClick={() => handleDelete(t._id)}
                >
                  <Delete />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Add/Edit Dialog */}
      <Dialog open={open} onClose={closeDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editTeacher ? "Edit Teacher" : "Add Teacher"}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Name"
            margin="dense"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
          />

          <TextField
            fullWidth
            label="Department"
            margin="dense"
            value={formData.department}
            onChange={(e) =>
              setFormData({ ...formData, department: e.target.value })
            }
          />

          <TextField
            select
            fullWidth
            label="Designation"
            margin="dense"
            value={formData.designation}
            onChange={(e) =>
              setFormData({ ...formData, designation: e.target.value })
            }
          >
            {designations.map((d) => (
              <MenuItem key={d} value={d}>
                {d}
              </MenuItem>
            ))}
          </TextField>

          <Autocomplete
            multiple
            options={subjects}
            getOptionLabel={(option) => option.name}
            value={subjects.filter((s) =>
              formData.courses.includes(s._id)
            )}
            onChange={(e, newValue) => {
              setFormData({
                ...formData,
                courses: newValue.map((v) => v._id),
              });
            }}
            renderInput={(params) => (
              <TextField {...params} label="Courses" margin="dense" />
            )}
          />

          <TextField
            fullWidth
            label="Years (comma-separated)"
            margin="dense"
            value={formData.years}
            onChange={(e) =>
              setFormData({ ...formData, years: e.target.value })
            }
            helperText="e.g., 1,2,3"
          />

          <TextField
            fullWidth
            type="number"
            label="Max Load / Week (hours)"
            margin="dense"
            value={formData.maxLoadPerWeek}
            onChange={(e) =>
              setFormData({
                ...formData,
                maxLoadPerWeek: e.target.value,
              })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}
