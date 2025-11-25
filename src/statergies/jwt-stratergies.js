import jwt from "jsonwebtoken";

const SECRET = "super-secret-change-me";

export function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      role: user.role, // "ADMIN" or "EMPLOYEE"
    },
    SECRET,
    { expiresIn: "1d" }
  );
}

export function getUserFromRequest(req) {
  const auth = req.headers.authorization || "";
  if (!auth.startsWith("Bearer ")) return { role: "EMPLOYEE" }; // default
  const token = auth.replace("Bearer ", "").trim();
  try {
    const decoded = jwt.verify(token, SECRET);
    return decoded;
  } catch (err) {
    return { role: "EMPLOYEE" };
  }
}

// Simple helpers
export function requireAdmin(user) {
  if (user.role !== "ADMIN") {
    throw new Error("Not authorized: admin role required.");
  }
}
