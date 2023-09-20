const jwt = require('jsonwebtoken');
require("dotenv").config({ path: "./.env" })


const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ message: 'Access denied. Token missing.' });
  
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if (err) return res.status(403).json({ message: 'Invalid token.' });
      req.user = decoded; // Store user information in the request for future use
      next();
    });
};






module.exports = authenticateToken
