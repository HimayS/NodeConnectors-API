// dotenv configuration
import path from 'path';
import dotenv from 'dotenv';
const env = process.env.NODE_ENV || 'development';
const envFile = `.env.${env}`;
dotenv.config({ path: path.resolve(process.cwd(), `${envFile}`) });
const jwtSecret = process.env.JWT_SECRET;

// imports
import jwt from 'jsonwebtoken';

const jwtValidation = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Get the token from the header

    if (!token) return res.status(401).json({message: 'No token provided, unauthorized'}); // No token, unauthorized

    jwt.verify(token, jwtSecret, (err, user) => {
        if (err) return res.status(403).json({message: 'Invalid Token'}); // Invalid Token
        req.user = user; // Save user info in request object, i.e. mongo ObjectId and username, which was used when creating token
        next(); 
    });
};

export { jwtValidation };