import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login"
import "./App.css"
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import TeacherPage from "./pages/TeacherPage";
import RoomPage from "./pages/RoomPage";
import SubjectPage from "./pages/SubjectPage";
function App() {
  return (
    <Router>
      <Routes>
        {/* Auth */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Entity Management */}
        <Route path="/teachers" element={<TeacherPage />} />
        <Route path="/rooms" element={<RoomPage />} />
        <Route path="/subjects" element={<SubjectPage />} />

        {/* Timetable */}
        <Route path="/timetable" element={<LandingPage />} />
        <Route path="/timetable/weekly" element={<LandingPage />} />
        <Route path="/timetable/day" element={<LandingPage />} />

        {/* Fallback */}
        <Route path="*" element={<LandingPage />} />
      </Routes>
    </Router>
  );
}

export default App;
