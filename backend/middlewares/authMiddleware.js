const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = decoded;

        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
};

module.exports = protect;


// is code ka simple meaning
// Postman Request
//       ↓
// Authorization Header
//       ↓
// Bearer Token
//       ↓
// JWT Verify
//       ↓
// Valid?
//    ↙      ↘
//  Yes       No
//   ↓         ↓
// next()     401
//   ↓
// Controller