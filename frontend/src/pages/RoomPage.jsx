import React, { useState, useEffect } from "react";
import {
  Box, Typography, Button, Table, TableHead, TableBody, TableRow, TableCell,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton, MenuItem
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";

const RoomPage = () => {
  const initialRooms = [
    { room: "A-101", building: "Block A", floor: 1, capacity: 40, type: "Classroom", facilities: "Projector, AC" },
    { room: "B-203", building: "Block B", floor: 2, capacity: 50, type: "Lab", facilities: "Computers, AC" },
    { room: "C-305", building: "Block C", floor: 3, capacity: 60, type: "Seminar Hall", facilities: "Mic, Projector" }
  ];

  const [rooms, setRooms] = useState([]);
  const [open, setOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [formData, setFormData] = useState({
    room: "", building: "", floor: "", capacity: "", type: "", facilities: ""
  });

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("rooms");
    if (saved) {
      setRooms(JSON.parse(saved));
    } else {
      setRooms(initialRooms);
      localStorage.setItem("rooms", JSON.stringify(initialRooms));
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("rooms", JSON.stringify(rooms));
  }, [rooms]);

  const handleOpen = (index = null) => {
    setEditIndex(index);
    setFormData(index !== null ? rooms[index] :
      { room: "", building: "", floor: "", capacity: "", type: "", facilities: "" });
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleSave = () => {
    if (editIndex !== null) {
      const updated = [...rooms];
      updated[editIndex] = formData;
      setRooms(updated);
    } else {
      setRooms([...rooms, formData]);
    }
    handleClose();
  };

  const handleDelete = (index) => {
    setRooms(rooms.filter((_, i) => i !== index));
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>🏫 Rooms</Typography>
      <Button variant="contained" startIcon={<Add />} onClick={() => handleOpen()} sx={{ mb: 2 }}>
        Add Room
      </Button>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Room</TableCell>
            <TableCell>Building</TableCell>
            <TableCell>Floor</TableCell>
            <TableCell>Capacity</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Facilities</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rooms.map((r, i) => (
            <TableRow key={i}>
              <TableCell>{r.room}</TableCell>
              <TableCell>{r.building}</TableCell>
              <TableCell>{r.floor}</TableCell>
              <TableCell>{r.capacity}</TableCell>
              <TableCell>{r.type}</TableCell>
              <TableCell>{r.facilities}</TableCell>
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
        <DialogTitle>{editIndex !== null ? "Edit Room" : "Add Room"}</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Room No" margin="dense"
            value={formData.room}
            onChange={(e) => setFormData({ ...formData, room: e.target.value })} />
          <TextField fullWidth label="Building" margin="dense"
            value={formData.building}
            onChange={(e) => setFormData({ ...formData, building: e.target.value })} />
          <TextField fullWidth type="number" label="Floor" margin="dense"
            value={formData.floor}
            onChange={(e) => setFormData({ ...formData, floor: e.target.value })} />
          <TextField fullWidth type="number" label="Capacity" margin="dense"
            value={formData.capacity}
            onChange={(e) => setFormData({ ...formData, capacity: e.target.value })} />
          <TextField fullWidth select label="Type" margin="dense"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
            <MenuItem value="Classroom">Classroom</MenuItem>
            <MenuItem value="Lab">Lab</MenuItem>
            <MenuItem value="Seminar Hall">Seminar Hall</MenuItem>
          </TextField>
          <TextField fullWidth label="Facilities" margin="dense"
            value={formData.facilities}
            onChange={(e) => setFormData({ ...formData, facilities: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RoomPage;
