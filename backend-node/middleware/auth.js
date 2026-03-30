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
        req.user = decoded;
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

exports.isAdminOrReceptionist = (req, res, next) => {
    if (req.user && (req.user.role === 'admin' || req.user.role === 'receptionist')) {
        next();
    } else {
        res.status(403).json({ detail: "You do not have permission to perform this action." });
    }
};

exports.isAdminReceptionistOrDoctor = (req, res, next) => {
    if (req.user && (req.user.role === 'admin' || req.user.role === 'receptionist' || req.user.role === 'doctor')) {
        next();
    } else {
        res.status(403).json({ detail: "You do not have permission to perform this action." });
    }
};

exports.isDoctor = (req, res, next) => {
    if (req.user && req.user.role === 'doctor') {
        next();
    } else {
        res.status(403).json({ detail: "Only doctors can perform this action." });
    }
};

exports.isAdminOrPharmacist = (req, res, next) => {
    if (req.user && (req.user.role === 'admin' || req.user.role === 'pharmacist')) {
        next();
    } else {
        res.status(403).json({ detail: "You do not have permission to perform this action." });
    }
};

exports.isPatient = (req, res, next) => {
    if (req.user && req.user.role === 'patient') {
        next();
    } else {
        res.status(403).json({ detail: "Only patients can perform this action." });
    }
};

exports.isAdminReceptionistDoctorOrPatient = (req, res, next) => {
    if (req.user && (req.user.role === 'admin' || req.user.role === 'receptionist' || req.user.role === 'doctor' || req.user.role === 'patient')) {
        next();
    } else {
        res.status(403).json({ detail: "You do not have permission to perform this action." });
    }
};

