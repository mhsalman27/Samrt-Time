import jwt from "jsonwebtoken";

export const isAuth = (req, res, next) => {
  try {
    const token = req.headers.sihtoken;

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.id = decoded.id; // ✅ store admin id in request

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
