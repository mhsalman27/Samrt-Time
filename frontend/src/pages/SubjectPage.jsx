import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";

const SubjectPage = () => {
  const [subjects, setSubjects] = useState([
    {
      code: "MTH101",
      name: "Mathematics",
      dept: "Science",
      sem: 1,
      type: "Core",
      hrsPerWeek: 4,
      lab: "No"
    },
    {
      code: "PHY102",
      name: "Physics",
      dept: "Science",
      sem: 2,
      type: "Core",
      hrsPerWeek: 3,
      lab: "Yes"
    },
    {
      code: "CSE103",
      name: "Computer Science",
      dept: "Engineering",
      sem: 3,
      type: "Elective",
      hrsPerWeek: 5,
      lab: "Yes"
    }
  ]);

  const [open, setOpen] = useState(false);
  const [newSubject, setNewSubject] = useState({
    code: "",
    name: "",
    dept: "",
    sem: "",
    type: "",
    hrsPerWeek: "",
    lab: ""
  });
  const [editIndex, setEditIndex] = useState(null);

  const handleAdd = () => {
    if (editIndex !== null) {
      const updated = [...subjects];
      updated[editIndex] = newSubject;
      setSubjects(updated);
      setEditIndex(null);
    } else {
      setSubjects([...subjects, newSubject]);
    }
    setNewSubject({
      code: "",
      name: "",
      dept: "",
      sem: "",
      type: "",
      hrsPerWeek: "",
      lab: ""
    });
    setOpen(false);
  };

  const handleEdit = (index) => {
    setNewSubject(subjects[index]);
    setEditIndex(index);
    setOpen(true);
  };

  const handleDelete = (index) => {
    const updated = [...subjects];
    updated.splice(index, 1);
    setSubjects(updated);
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Manage Subjects
      </Typography>
      <Button
        variant="contained"
        startIcon={<Add />}
        onClick={() => setOpen(true)}
      >
        Add Subject
      </Button>

      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Code</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Dept</TableCell>
              <TableCell>Sem</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Hrs/Wk</TableCell>
              <TableCell>Lab?</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {subjects.map((subj, index) => (
              <TableRow key={index}>
                <TableCell>{subj.code}</TableCell>
                <TableCell>{subj.name}</TableCell>
                <TableCell>{subj.dept}</TableCell>
                <TableCell>{subj.sem}</TableCell>
                <TableCell>{subj.type}</TableCell>
                <TableCell>{subj.hrsPerWeek}</TableCell>
                <TableCell>{subj.lab}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleEdit(index)}>
                    <Edit />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(index)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editIndex !== null ? "Edit Subject" : "Add Subject"}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Code"
            fullWidth
            margin="dense"
            value={newSubject.code}
            onChange={(e) =>
              setNewSubject({ ...newSubject, code: e.target.value })
            }
          />
          <TextField
            label="Name"
            fullWidth
            margin="dense"
            value={newSubject.name}
            onChange={(e) =>
              setNewSubject({ ...newSubject, name: e.target.value })
            }
          />
          <TextField
            label="Dept"
            fullWidth
            margin="dense"
            value={newSubject.dept}
            onChange={(e) =>
              setNewSubject({ ...newSubject, dept: e.target.value })
            }
          />
          <TextField
            label="Sem"
            type="number"
            fullWidth
            margin="dense"
            value={newSubject.sem}
            onChange={(e) =>
              setNewSubject({ ...newSubject, sem: e.target.value })
            }
          />
          <TextField
            select
            label="Type"
            fullWidth
            margin="dense"
            value={newSubject.type}
            onChange={(e) =>
              setNewSubject({ ...newSubject, type: e.target.value })
            }
          >
            <MenuItem value="Core">Core</MenuItem>
            <MenuItem value="Elective">Elective</MenuItem>
          </TextField>
          <TextField
            label="Hrs/Wk"
            type="number"
            fullWidth
            margin="dense"
            value={newSubject.hrsPerWeek}
            onChange={(e) =>
              setNewSubject({ ...newSubject, hrsPerWeek: e.target.value })
            }
          />
          <TextField
            select
            label="Lab?"
            fullWidth
            margin="dense"
            value={newSubject.lab}
            onChange={(e) =>
              setNewSubject({ ...newSubject, lab: e.target.value })
            }
          >
            <MenuItem value="Yes">Yes</MenuItem>
            <MenuItem value="No">No</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleAdd} variant="contained">
            {editIndex !== null ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SubjectPage;
