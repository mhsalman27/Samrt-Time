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
  MenuItem,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import axios from "axios";

const API_URL = "http://localhost:9090";

export default function RoomPage() {
  const [rooms, setRooms] = useState([]);
  const [open, setOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", type: "success" });
  const [newRoom, setNewRoom] = useState({
    room: "",
    building: "",
    floor: "",
    type: "",
  });

  const token = localStorage.getItem("sihtoken");

  // Fetch rooms
  const fetchRooms = async () => {
    try {
      const res = await axios.get(`${API_URL}/room`, {
        headers: { sihtoken: token },
      });
      setRooms(res.data.rooms || []);
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: err.response?.data?.message || "Failed to fetch rooms",
        type: "error",
      });
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  // Open dialog for add/edit
  const handleClickOpen = (room = null, index = null) => {
    if (room) {
      setNewRoom(room);
      setEditIndex(index);
    } else {
      setNewRoom({ room: "", building: "", floor: "", type: "" });
      setEditIndex(null);
    }
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  // Save room (add/update)
  const handleSave = async () => {
    try {
      const payload = {
        room: newRoom.room,
        building: newRoom.building,
        floor: Number(newRoom.floor),
        type: newRoom.type,
      };

      if (editIndex !== null) {
        const id = rooms[editIndex]._id;
        const res = await axios.put(`${API_URL}/room/${id}`, payload, {
          headers: { sihtoken: token },
        });
        const updated = [...rooms];
        updated[editIndex] = res.data.room;
        setRooms(updated);
        setSnackbar({ open: true, message: "Room updated", type: "success" });
      } else {
        const res = await axios.post(`${API_URL}/room`, payload, {
          headers: { sihtoken: token },
        });
        setRooms([...rooms, res.data.room]);
        setSnackbar({ open: true, message: "Room added", type: "success" });
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

  // Delete room
  const handleDelete = async (id, index) => {
    try {
      await axios.delete(`${API_URL}/room/${id}`, {
        headers: { sihtoken: token },
      });
      const updated = [...rooms];
      updated.splice(index, 1);
      setRooms(updated);
      setSnackbar({ open: true, message: "Room deleted", type: "success" });
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
        Add Room
      </Button>

      {/* Rooms Table */}
      <TableContainer component={Paper} style={{ marginTop: "20px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Room No</TableCell>
              <TableCell>Building</TableCell>
              <TableCell>Floor</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rooms.map((room, index) => (
              <TableRow key={room._id}>
                <TableCell>{room.room}</TableCell>
                <TableCell>{room.building}</TableCell>
                <TableCell>{room.floor}</TableCell>
                <TableCell>{room.type}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleClickOpen(room, index)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(room._id, index)}>
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
        <DialogTitle>{editIndex !== null ? "Edit Room" : "Add Room"}</DialogTitle>
        <DialogContent>
          <TextField
            label="Room No"
            fullWidth
            margin="dense"
            value={newRoom.room}
            onChange={(e) => setNewRoom({ ...newRoom, room: e.target.value })}
          />
          <TextField
            label="Building"
            fullWidth
            margin="dense"
            value={newRoom.building}
            onChange={(e) => setNewRoom({ ...newRoom, building: e.target.value })}
          />
          <TextField
            label="Floor"
            type="number"
            fullWidth
            margin="dense"
            value={newRoom.floor}
            onChange={(e) => setNewRoom({ ...newRoom, floor: e.target.value })}
          />
          <TextField
            label="Type"
            select
            fullWidth
            margin="dense"
            value={newRoom.type}
            onChange={(e) => setNewRoom({ ...newRoom, type: e.target.value })}
          >
            <MenuItem value="Lab">Lab</MenuItem>
            <MenuItem value="Classroom">Classroom</MenuItem>
            <MenuItem value="Seminar">Seminar</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            {editIndex !== null ? "Update" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
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
