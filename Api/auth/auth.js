const jwt = require("jsonwebtoken");

const AuthMiddleware = (roles = []) => {
    return (req, res, next) => {
        try {
            const token = req.header("Authorization")?.replace("Bearer ", ""); // Fixed spelling
            if (!token) {
                return res.status(401).json({ success: false, message: "No token provided. Authorization denied." });
            }
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            if (roles.length > 0 && !roles.includes(req.user.role)) {
                return res.status(403).json({ success: false, message: "Access denied" });
            }
            next();
        } catch (error) {
            res.status(401).json({ success: false, message: "Invalid or expired token" });
        }
    };
};

module.exports = AuthMiddleware;
