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
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  InputAdornment,
  Fab,
  Grid,
  Avatar,
  Divider,
  Tooltip,
  LinearProgress,
} from "@mui/material";
import {
  Edit,
  Delete,
  Add,
  Search,
  MeetingRoom,
  Business,
  Layers,
  Category,
  FilterList,
  Refresh,
  ViewModule,
  ViewList,
} from "@mui/icons-material";
import axios from "axios";

const API_URL = import.meta.env.VITE_URL;

export default function RoomPage() {
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [open, setOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("table"); // 'table' or 'cards'
  const [filterType, setFilterType] = useState("All");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", type: "success" });
  const [newRoom, setNewRoom] = useState({
    room: "",
    building: "",
    floor: "",
    type: "",
  });

  const token = localStorage.getItem("sihtoken");

  const roomTypes = ["All", "Lab", "Classroom", "Seminar"];
  
  const getTypeColor = (type) => {
    switch (type) {
      case "Lab": return { bg: "#e3f2fd", color: "#1565c0" };
      case "Classroom": return { bg: "#e8f5e8", color: "#2e7d32" };
      case "Seminar": return { bg: "#fff3e0", color: "#f57c00" };
      default: return { bg: "#f5f5f5", color: "#666" };
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "Lab": return "🧪";
      case "Classroom": return "📚";
      case "Seminar": return "💼";
      default: return "🏢";
    }
  };

  // Fetch rooms
  const fetchRooms = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/room`, {
        headers: { sihtoken: token },
      });
      setRooms(res.data.rooms || []);
      setFilteredRooms(res.data.rooms || []);
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: err.response?.data?.message || "Failed to fetch rooms",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  // Filter and search functionality
  useEffect(() => {
    let filtered = rooms;
    
    // Filter by type
    if (filterType !== "All") {
      filtered = filtered.filter(room => room.type === filterType);
    }
    
    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(room =>
        room.room.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.building.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredRooms(filtered);
  }, [rooms, searchTerm, filterType]);

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
        setSnackbar({ open: true, message: "Room updated successfully! 🎉", type: "success" });
      } else {
        const res = await axios.post(`${API_URL}/room`, payload, {
          headers: { sihtoken: token },
        });
        setRooms([...rooms, res.data.room]);
        setSnackbar({ open: true, message: "Room added successfully! 🎉", type: "success" });
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
      setSnackbar({ open: true, message: "Room deleted successfully! ✅", type: "success" });
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: err.response?.data?.message || "Delete failed",
        type: "error",
      });
    }
  };

  // Stats calculation
  const stats = {
    total: rooms.length,
    labs: rooms.filter(r => r.type === "Lab").length,
    classrooms: rooms.filter(r => r.type === "Classroom").length,
    seminars: rooms.filter(r => r.type === "Seminar").length,
  };

  return (
    <Box sx={{ p: 3, backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      {/* Header */}
      <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Box>
            <Typography variant="h4" fontWeight="bold" sx={{ color: '#1e293b', display: 'flex', alignItems: 'center', gap: 1 }}>
              🏢 Room Management
            </Typography>
            <Typography variant="body1" sx={{ color: '#64748b', mt: 1 }}>
              Manage your classroom and laboratory spaces efficiently
            </Typography>
          </Box>
          
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <Tooltip title="Refresh Data">
              <IconButton 
                onClick={fetchRooms}
                sx={{ backgroundColor: '#f1f5f9', '&:hover': { backgroundColor: '#e2e8f0' } }}
              >
                <Refresh />
              </IconButton>
            </Tooltip>
            
            <Tooltip title={viewMode === 'table' ? 'Card View' : 'Table View'}>
              <IconButton 
                onClick={() => setViewMode(viewMode === 'table' ? 'cards' : 'table')}
                sx={{ backgroundColor: '#f1f5f9', '&:hover': { backgroundColor: '#e2e8f0' } }}
              >
                {viewMode === 'table' ? <ViewModule /> : <ViewList />}
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Search and Filters */}
        <Box sx={{ display: "flex", gap: 2, alignItems: "center", flexWrap: 'wrap' }}>
          <TextField
            placeholder="Search rooms, buildings..."
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ minWidth: 300, backgroundColor: 'white' }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
          
          <TextField
            select
            size="small"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            sx={{ minWidth: 120, backgroundColor: 'white' }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FilterList />
                </InputAdornment>
              ),
            }}
          >
            {roomTypes.map((type) => (
              <MenuItem key={type} value={type}>{type}</MenuItem>
            ))}
          </TextField>
        </Box>
      </Paper>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="body2" color="textSecondary">Total Rooms</Typography>
                  <Typography variant="h4" fontWeight="bold" color="#1976d2">{stats.total}</Typography>
                </Box>
                <Avatar sx={{ backgroundColor: '#e3f2fd', color: '#1976d2', width: 56, height: 56 }}>
                  <MeetingRoom sx={{ fontSize: 30 }} />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="body2" color="textSecondary">Labs</Typography>
                  <Typography variant="h4" fontWeight="bold" color="#1565c0">{stats.labs}</Typography>
                </Box>
                <Avatar sx={{ backgroundColor: '#e3f2fd', color: '#1565c0', width: 56, height: 56 }}>
                  🧪
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="body2" color="textSecondary">Classrooms</Typography>
                  <Typography variant="h4" fontWeight="bold" color="#2e7d32">{stats.classrooms}</Typography>
                </Box>
                <Avatar sx={{ backgroundColor: '#e8f5e8', color: '#2e7d32', width: 56, height: 56 }}>
                  📚
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="body2" color="textSecondary">Seminar Halls</Typography>
                  <Typography variant="h4" fontWeight="bold" color="#f57c00">{stats.seminars}</Typography>
                </Box>
                <Avatar sx={{ backgroundColor: '#fff3e0', color: '#f57c00', width: 56, height: 56 }}>
                  💼
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Loading */}
      {loading && <LinearProgress sx={{ mb: 2, borderRadius: 1 }} />}

      {/* Table View */}
      {viewMode === 'table' && (
        <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
          <CardContent sx={{ p: 0 }}>
            <Box sx={{ p: 3, pb: 0 }}>
              <Typography variant="h6" fontWeight="bold">
                📋 Rooms Directory ({filteredRooms.length})
              </Typography>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '0.95rem' }}>Room Details</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '0.95rem' }}>Building</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '0.95rem' }}>Floor</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '0.95rem' }}>Type</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '0.95rem' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredRooms.map((room, index) => {
                    const typeStyle = getTypeColor(room.type);
                    return (
                      <TableRow key={room._id} sx={{ '&:hover': { backgroundColor: '#f8fafc' } }}>
                        <TableCell>
                          <Box display="flex" alignItems="center" gap={2}>
                            <Avatar sx={{ backgroundColor: typeStyle.bg, color: typeStyle.color, width: 40, height: 40 }}>
                              {getTypeIcon(room.type)}
                            </Avatar>
                            <Box>
                              <Typography variant="body1" fontWeight="bold">{room.room}</Typography>
                              <Typography variant="caption" color="textSecondary">Room Number</Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center" gap={1}>
                            <Business sx={{ fontSize: 16, color: '#666' }} />
                            <Typography variant="body2">{room.building}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center" gap={1}>
                            <Layers sx={{ fontSize: 16, color: '#666' }} />
                            <Typography variant="body2">{room.floor}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={room.type}
                            sx={{
                              backgroundColor: typeStyle.bg,
                              color: typeStyle.color,
                              fontWeight: 'bold',
                              fontSize: '0.8rem'
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Box display="flex" gap={1}>
                            <Tooltip title="Edit Room">
                              <IconButton 
                                onClick={() => handleClickOpen(room, index)}
                                size="small"
                                sx={{ 
                                  backgroundColor: '#e3f2fd', 
                                  color: '#1976d2',
                                  '&:hover': { backgroundColor: '#bbdefb' }
                                }}
                              >
                                <Edit fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete Room">
                              <IconButton 
                                onClick={() => handleDelete(room._id, index)}
                                size="small"
                                sx={{ 
                                  backgroundColor: '#ffebee', 
                                  color: '#d32f2f',
                                  '&:hover': { backgroundColor: '#ffcdd2' }
                                }}
                              >
                                <Delete fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
            
            {filteredRooms.length === 0 && !loading && (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h6" color="textSecondary">No rooms found</Typography>
                <Typography variant="body2" color="textSecondary">Try adjusting your search or filter criteria</Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      )}

      {/* Card View */}
      {viewMode === 'cards' && (
        <Grid container spacing={3}>
          {filteredRooms.map((room, index) => {
            const typeStyle = getTypeColor(room.type);
            return (
              <Grid item xs={12} sm={6} md={4} lg={3} key={room._id}>
                <Card sx={{ 
                  borderRadius: 3, 
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease',
                  '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 40px rgba(0,0,0,0.15)' }
                }}>
                  <CardContent>
                    <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                      <Avatar sx={{ 
                        backgroundColor: typeStyle.bg, 
                        color: typeStyle.color, 
                        width: 50, 
                        height: 50 
                      }}>
                        {getTypeIcon(room.type)}
                      </Avatar>
                      <Chip
                        label={room.type}
                        size="small"
                        sx={{
                          backgroundColor: typeStyle.bg,
                          color: typeStyle.color,
                          fontWeight: 'bold'
                        }}
                      />
                    </Box>
                    
                    <Typography variant="h6" fontWeight="bold" mb={1}>{room.room}</Typography>
                    
                    <Box display="flex" flexDirection="column" gap={1} mb={2}>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Business sx={{ fontSize: 16, color: '#666' }} />
                        <Typography variant="body2" color="textSecondary">{room.building}</Typography>
                      </Box>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Layers sx={{ fontSize: 16, color: '#666' }} />
                        <Typography variant="body2" color="textSecondary">Floor {room.floor}</Typography>
                      </Box>
                    </Box>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <Box display="flex" gap={1} justifyContent="flex-end">
                      <IconButton 
                        onClick={() => handleClickOpen(room, index)}
                        size="small"
                        sx={{ 
                          backgroundColor: '#e3f2fd', 
                          color: '#1976d2',
                          '&:hover': { backgroundColor: '#bbdefb' }
                        }}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton 
                        onClick={() => handleDelete(room._id, index)}
                        size="small"
                        sx={{ 
                          backgroundColor: '#ffebee', 
                          color: '#d32f2f',
                          '&:hover': { backgroundColor: '#ffcdd2' }
                        }}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
          
          {filteredRooms.length === 0 && !loading && (
            <Grid item xs={12}>
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="h6" color="textSecondary">No rooms found</Typography>
                <Typography variant="body2" color="textSecondary">Try adjusting your search or filter criteria</Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      )}

      {/* Floating Add Button */}
      <Fab
        color="primary"
        aria-label="add"
        onClick={() => handleClickOpen()}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          background: 'linear-gradient(45deg, #3b82f6, #1d4ed8)',
          '&:hover': {
            background: 'linear-gradient(45deg, #1d4ed8, #1e40af)'
          }
        }}
      >
        <Add />
      </Fab>

      {/* Add/Edit Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ 
          backgroundColor: '#f8fafc', 
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <MeetingRoom />
          {editIndex !== null ? "Edit Room" : "Add New Room"}
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Room Number"
              fullWidth
              value={newRoom.room}
              onChange={(e) => setNewRoom({ ...newRoom, room: e.target.value })}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MeetingRoom />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Building"
              fullWidth
              value={newRoom.building}
              onChange={(e) => setNewRoom({ ...newRoom, building: e.target.value })}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Business />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Floor"
              type="number"
              fullWidth
              value={newRoom.floor}
              onChange={(e) => setNewRoom({ ...newRoom, floor: e.target.value })}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Layers />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Room Type"
              select
              fullWidth
              value={newRoom.type}
              onChange={(e) => setNewRoom({ ...newRoom, type: e.target.value })}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Category />
                  </InputAdornment>
                ),
              }}
            >
              <MenuItem value="Lab">🧪 Laboratory</MenuItem>
              <MenuItem value="Classroom">📚 Classroom</MenuItem>
              <MenuItem value="Seminar">💼 Seminar Hall</MenuItem>
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button onClick={handleClose} variant="outlined">Cancel</Button>
          <Button 
            onClick={handleSave} 
            variant="contained" 
            sx={{ 
              background: 'linear-gradient(45deg, #3b82f6, #1d4ed8)',
              '&:hover': {
                background: 'linear-gradient(45deg, #1d4ed8, #1e40af)'
              }
            }}
          >
            {editIndex !== null ? "Update Room" : "Add Room"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert 
          severity={snackbar.type} 
          sx={{ borderRadius: 2, fontWeight: 'bold' }}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}