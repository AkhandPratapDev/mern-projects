import jwt from "jsonwebtoken";

const adminAuth = async (req, res, next) => {
  const token = req.headers.token || req.headers.authorization;

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Not Authorized. Token missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.adminId = decoded.id;
    req.isSuperAdmin = decoded.isSuperAdmin || false;

    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};

export default adminAuth;
