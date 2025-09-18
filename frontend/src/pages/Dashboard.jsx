import React, { useEffect, useState } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  Chip,
  IconButton,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Refresh, People, School, MeetingRoom, Schedule } from "@mui/icons-material";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    teachers: 25,
    subjects: 12,
    classrooms: 18,
    schedules: 45,
  });

  const navigate = useNavigate();

  // Fake loading simulation
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setStats({
        teachers: 25,
        subjects: 12,
        classrooms: 18,
        schedules: 45,
      });
      setLoading(false);
    }, 1000);
  };

  const statCards = [
    {
      title: "Teachers",
      value: stats.teachers,
      icon: <People />,
      color: "#1976d2",
      link: "/teachers",
    },
    {
      title: "Subjects",
      value: stats.subjects,
      icon: <School />,
      color: "#2e7d32",
      link: "/subjects",
    },
    {
      title: "Rooms",
      value: stats.classrooms,
      icon: <MeetingRoom />,
      color: "#ed6c02",
      link: "/rooms",
    },
    {
      title: "Schedules",
      value: stats.schedules,
      icon: <Schedule />,
      color: "#9c27b0",
      link: "/schedules",
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h5" fontWeight="bold">
          📊 Dashboard
        </Typography>
        <IconButton onClick={handleRefresh} color="primary">
          <Refresh />
        </IconButton>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3}>
        {statCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                borderLeft: `6px solid ${card.color}`,
                borderRadius: 2,
                boxShadow: 3,
                cursor: "pointer",
                transition: "0.3s",
                "&:hover": { transform: "scale(1.03)", boxShadow: 6 },
              }}
              onClick={() => navigate(card.link)}
            >
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <Box sx={{ color: card.color, fontSize: 30 }}>{card.icon}</Box>
                  <Box>
                    <Typography variant="body2" color="textSecondary">
                      {card.title}
                    </Typography>
                    <Typography variant="h6" fontWeight="bold">
                      {loading ? <LinearProgress /> : card.value}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Recent Activity */}
      <Card sx={{ mt: 4, borderRadius: 2, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            🔔 Recent Activity
          </Typography>
          <Divider sx={{ mb: 2 }} />

          {loading ? (
            <LinearProgress />
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Chip
                label="New teacher added: Mr. Sharma"
                color="primary"
                variant="outlined"
              />
              <Chip
                label="3 new subjects created"
                color="success"
                variant="outlined"
              />
              <Chip
                label="Classroom A-203 scheduled"
                color="warning"
                variant="outlined"
              />
              <Chip
                label="Exam timetable generated"
                color="secondary"
                variant="outlined"
              />
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default Dashboard;
