import React, { useState, useEffect } from "react";
import {
  Box, Typography, Button, Table, TableHead, TableBody, TableRow, TableCell,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";

const TeacherPage = () => {
  const initialTeachers = [
    { empId: "T001", name: "Mr. Sharma", email: "sharma@college.com", dept: "Mathematics", maxHrs: 4 },
    { empId: "T002", name: "Ms. Gupta", email: "gupta@college.com", dept: "Physics", maxHrs: 5 },
    { empId: "T003", name: "Dr. Khan", email: "khan@college.com", dept: "Computer Science", maxHrs: 6 }
  ];

  const [teachers, setTeachers] = useState([]);
  const [open, setOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [formData, setFormData] = useState({ empId: "", name: "", email: "", dept: "", maxHrs: "" });

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("teachers");
    if (saved) {
      setTeachers(JSON.parse(saved));
    } else {
      setTeachers(initialTeachers);
      localStorage.setItem("teachers", JSON.stringify(initialTeachers));
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("teachers", JSON.stringify(teachers));
  }, [teachers]);

  const handleOpen = (index = null) => {
    setEditIndex(index);
    setFormData(index !== null ? teachers[index] : { empId: "", name: "", email: "", dept: "", maxHrs: "" });
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleSave = () => {
    if (editIndex !== null) {
      const updated = [...teachers];
      updated[editIndex] = formData;
      setTeachers(updated);
    } else {
      setTeachers([...teachers, formData]);
    }
    handleClose();
  };

  const handleDelete = (index) => {
    setTeachers(teachers.filter((_, i) => i !== index));
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>👨‍🏫 Teachers</Typography>
      <Button variant="contained" startIcon={<Add />} onClick={() => handleOpen()} sx={{ mb: 2 }}>
        Add Teacher
      </Button>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Employee ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Department</TableCell>
            <TableCell>Max Hrs/Day</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {teachers.map((t, i) => (
            <TableRow key={i}>
              <TableCell>{t.empId}</TableCell>
              <TableCell>{t.name}</TableCell>
              <TableCell>{t.email}</TableCell>
              <TableCell>{t.dept}</TableCell>
              <TableCell>{t.maxHrs}</TableCell>
              <TableCell>
                <IconButton color="primary" onClick={() => handleOpen(i)}><Edit /></IconButton>
                <IconButton color="error" onClick={() => handleDelete(i)}><Delete /></IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Add/Edit Dialog */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editIndex !== null ? "Edit Teacher" : "Add Teacher"}</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Employee ID" margin="dense"
            value={formData.empId}
            onChange={(e) => setFormData({ ...formData, empId: e.target.value })} />
          <TextField fullWidth label="Name" margin="dense"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
          <TextField fullWidth label="Email" margin="dense"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
          <TextField fullWidth label="Department" margin="dense"
            value={formData.dept}
            onChange={(e) => setFormData({ ...formData, dept: e.target.value })} />
          <TextField fullWidth type="number" label="Max Hrs/Day" margin="dense"
            value={formData.maxHrs}
            onChange={(e) => setFormData({ ...formData, maxHrs: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TeacherPage;
