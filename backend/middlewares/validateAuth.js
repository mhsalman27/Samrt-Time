import { z } from "zod";

// ✅ Signup Schema
const signupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  college: z.string().min(1, "College/University name is required"),
});

// ✅ Login Schema
const loginSchema = z.object({
  email: z.string().email("Valid email is required"),
  password: z.string().min(1, "Password is required"),
});

// ✅ Middleware for validation
export const validateSignup = (req, res, next) => {
  try {
    signupSchema.parse(req.body);
    next();
  } catch (err) {
    return res.status(400).json({
      errors: err.errors.map((e) => ({
        field: e.path[0],
        msg: e.message,
      })),
    });
  }
};

export const validateLogin = (req, res, next) => {
  try {
    loginSchema.parse(req.body);
    next();
  } catch (err) {
    return res.status(400).json({
      errors: err.errors.map((e) => ({
        field: e.path[0],
        msg: e.message,
      })),
    });
  }
};
