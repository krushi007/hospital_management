const jwt = require('jsonwebtoken');

exports.protect = (req, res, next) => {
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    
    if (!token) {
        return res.status(401).json({ detail: "Authentication credentials were not provided." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("AUTH MIDDLEWARE - DECODED:", JSON.stringify(decoded));
        req.user = decoded; // set user obj matching DRF decoded token
        next();
    } catch (error) {
        return res.status(401).json({ detail: "Given token not valid for any token type", code: "token_not_valid", messages: [{ token_class: "AccessToken", token_type: "access", message: "Token is invalid or expired" }] });
    }
};

exports.isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ detail: "You do not have permission to perform this action." });
    }
};

exports.isAdminOrDoctor = (req, res, next) => {
    if (req.user && (req.user.role === 'admin' || req.user.role === 'doctor')) {
        next();
    } else {
        res.status(403).json({ detail: "You do not have permission to perform this action." });
    }
};
