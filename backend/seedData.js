import mongoose from "mongoose";
import Teacher from "./models/teacher.js";
import Subject from "./models/subject.js";
import Room from "./models/room.js";
import Admin from "./models/admin.js";
import dotenv from "dotenv";

dotenv.config();
const MONGO_URL = process.env.MONGO_URL;

const seedData = async () => {
    try {
        await mongoose.connect(MONGO_URL);
        console.log("✅ MongoDB Connected");

        // Clear collections
        await Admin.deleteMany({});
        await Teacher.deleteMany({});
        await Subject.deleteMany({});
        await Room.deleteMany({});

        // Admin
        const admin = await Admin.create({
            name: "Super Admin",
            email: "admin@example.com",
            password: "admin123",
            roles: ["admin"],
            college: "Smart University",
        });

        // Subjects
        const math = await Subject.create({
            name: "Mathematics",
            periodsPerWeek: 5,
            admin: admin._id,
            semester: 1,
            year: 1,
            department: "CSE",
            code: "MATH101",
        });

        const physics = await Subject.create({
            name: "Physics",
            periodsPerWeek: 4,
            admin: admin._id,
            semester: 1,
            year: 1,
            department: "CSE",
            code: "PHY101",
        });

        // Rooms
        const room1 = await Room.create({
            admin: admin._id,
            type: "Classroom",  // ✅ must exactly match enum
            floor: 1,
            building: "Main Block",
            room: "C101",
            capacity: 40
        });

        const room2 = await Room.create({
            admin: admin._id,
            type: "Classroom",  // ✅ must exactly match enum
            floor: 1,
            building: "Main Block",
            room: "C102",
            capacity: 35
        });
        // Teacher
        const teacher = await Teacher.create({
            name: "Dr. Rakesh Sharma",
            department: "CSE",
            designation: "Professor",
            courses: [math._id, physics._id],
            years: [1, 2],
            maxLoadPerWeek: 16,
            admin: admin._id,
        });

        console.log("✅ Seed data inserted successfully");
        process.exit(0);

    } catch (error) {
        console.error("❌ Seed Data Error:", error.message);
        process.exit(1);
    }
};

seedData();
