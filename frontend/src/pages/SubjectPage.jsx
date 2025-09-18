import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Snackbar,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import axios from "axios";

const API_URL = "http://localhost:9090"; // adjust if different

export default function SubjectPage() {
  const [subjects, setSubjects] = useState([]);
  const [open, setOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
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
    try {
      const res = await axios.get(`${API_URL}/subject`, {
        headers: { sihtoken: token },
      });
      setSubjects(res.data.subjects || []);
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: err.response?.data?.message || "Failed to fetch subjects",
        type: "error",
      });
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

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
        setSnackbar({ open: true, message: "Subject updated", type: "success" });
      } else {
        const res = await axios.post(`${API_URL}/subject`, payload, {
          headers: { sihtoken: token },
        });
        setSubjects([...subjects, res.data.subject]);
        setSnackbar({ open: true, message: "Subject added", type: "success" });
      }
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: err.response?.data?.message || "Action failed",
        type: "error",
      });
    } finally {
      handleClose();
    }
  };

  // Delete subject
  const handleDelete = async (id, index) => {
    try {
      await axios.delete(`${API_URL}/subject/${id}`, {
        headers: { sihtoken: token },
      });
      const updated = [...subjects];
      updated.splice(index, 1);
      setSubjects(updated);
      setSnackbar({ open: true, message: "Subject deleted", type: "success" });
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: err.response?.data?.message || "Delete failed",
        type: "error",
      });
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <Button variant="contained" color="primary" onClick={() => handleClickOpen()}>
        Add Subject
      </Button>

      {/* Subjects Table */}
      <TableContainer component={Paper} style={{ marginTop: "20px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Code</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Year</TableCell>
              <TableCell>Semester</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {subjects.map((subject, index) => (
              <TableRow key={subject._id}>
                <TableCell>{subject.code}</TableCell>
                <TableCell>{subject.name}</TableCell>
                <TableCell>{subject.department}</TableCell>
                <TableCell>{subject.year}</TableCell>
                <TableCell>{subject.semester}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleClickOpen(subject, index)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(subject._id, index)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Dialog */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editIndex !== null ? "Edit Subject" : "Add Subject"}</DialogTitle>
        <DialogContent>
          <TextField
            label="Code"
            fullWidth
            margin="dense"
            value={newSubject.code}
            onChange={(e) => setNewSubject({ ...newSubject, code: e.target.value })}
          />
          <TextField
            label="Name"
            fullWidth
            margin="dense"
            value={newSubject.name}
            onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
          />
          <TextField
            label="Department"
            fullWidth
            margin="dense"
            value={newSubject.department}
            onChange={(e) => setNewSubject({ ...newSubject, department: e.target.value })}
          />
          <TextField
            label="Year"
            type="number"
            fullWidth
            margin="dense"
            value={newSubject.year}
            onChange={(e) => setNewSubject({ ...newSubject, year: e.target.value })}
          />
          <TextField
            label="Semester"
            type="number"
            fullWidth
            margin="dense"
            value={newSubject.semester}
            onChange={(e) => setNewSubject({ ...newSubject, semester: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            {editIndex !== null ? "Update" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for messages */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.type}>{snackbar.message}</Alert>
      </Snackbar>
    </div>
  );
}
