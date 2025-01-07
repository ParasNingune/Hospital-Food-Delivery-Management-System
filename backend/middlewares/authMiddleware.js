const jwt = require("jsonwebtoken");

exports.authMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token has expired" });
    }
    return res.status(401).json({ message: "Token is not valid" });
  }
};

exports.roleMiddleware = (requiredRole) => (req, res, next) => {
  if (req.user.role !== requiredRole) {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
};
