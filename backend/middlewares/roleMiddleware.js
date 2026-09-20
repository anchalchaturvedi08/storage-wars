const authorizeRoles = (...allowedRoles) => {
    return(req,res,next) => {
        if(!allowedRoles.includes(req.user.role)){
            return res.status(403).json({
                success: false,
                message: "Access denied"
            });
        }
        next();
    };
};

module.exports = authorizeRoles;


// Customer Login
//       ↓
// JWT Token generated ✅
//       ↓
// Protected Route
//       ↓
// Auth Middleware
//       ↓
// Token valid? ✅
//       ↓
// Role Middleware
//       ↓
// Customer ≠ Admin ❌
//       ↓
// 403 Forbidden ✅