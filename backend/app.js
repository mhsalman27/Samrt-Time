// // app.js
// import express from "express";
// import mongoose from "mongoose";
// import dotenv from "dotenv";
// import cors from "cors";
// import morgan from "morgan";

// // Routes (banane hain alag files me)
// // Example: routes/auth.js, routes/subject.js etc.
// import authRoutes from "./routes/auth.js";
// import subjectRoutes from "./routes/subject.js";
// import roomRoutes from "./routes/room.js";
// import teacherRoutes from "./routes/teacher.js";

// dotenv.config();

// const app = express();

// // Middlewares
// app.use(cors());
// app.use(express.json());
// app.use(morgan("dev"));

// // MongoDB connection
// const MONGO_URL = process.env.MONGO_URL


// // Routes
// app.get("/ping", (req, res) => {
//   res.json({ message: "pong 🏓" });
// });

// app.use("/auth", authRoutes);
// app.use("/subject", subjectRoutes);
// app.use("/room", roomRoutes);
// app.use("/teacher", teacherRoutes);

// // Start server
// const PORT = process.env.PORT ;
// app.listen(PORT, async () => {
//   console.log(`🚀 Server running on http://localhost:${PORT}`);
//  await mongoose
//   .connect(MONGO_URL)
//   .then(() => console.log("✅ MongoDB Connected"))
//   .catch((err) => console.error("❌ MongoDB Error:", err));
// });

// app.js
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";

import authRoutes from "./routes/auth.js";
import subjectRoutes from "./routes/subject.js";
import roomRoutes from "./routes/room.js";
import teacherRoutes from "./routes/teacher.js";

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.get("/ping", (req, res) => {
  res.json({ message: "pong 🏓" });
});

app.use("/auth", authRoutes);
app.use("/subject", subjectRoutes);
app.use("/room", roomRoutes);
app.use("/teacher", teacherRoutes);

const PORT = process.env.PORT || 5000;
const MONGO_URL = process.env.MONGO_URL;

// Connect DB first, then start server
mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("✅ MongoDB Connected");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB Error:", err.message);
    process.exit(1);
  });

