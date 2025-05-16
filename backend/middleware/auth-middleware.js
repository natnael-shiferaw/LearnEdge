
const jwt = require('jsonwebtoken')

// verify the token
const verifyToken = (token, secretKey) => {
    return jwt.verify(token, secretKey)
}
// middleware to authenticate user
const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    // check if authorization Header exists
    if(!authHeader) {
        return res.status(401).json({
            success: false,
            message: "User is not authenticated"
        });
    }
    
    const token = authHeader.split(' ')[1];
    const payload = verifyToken(token, 'JWT_SECRET')
    req.user = payload;
    next();
}

module.exports = authenticate;
