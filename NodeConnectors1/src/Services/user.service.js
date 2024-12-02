// dotenv configuration
import path from 'path';
import dotenv from 'dotenv';
const env = process.env.NODE_ENV || 'development';
const envFile = `.env.${env}`;
dotenv.config({ path: path.resolve(process.cwd(), `${envFile}`) });

// imports
import { projectConnection } from '../Config/prospera.connection.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
const jwtSecret = process.env.JWT_SECRET;
const userCollectionName = process.env.USER_INFO_COLLECTION_NAME || 'User_Information';
const saltRounds = 10; // The cost factor for hashing the password


const registerUser = async (username, email, password) => {
    try {
        const db = await projectConnection();
        const userCollection = db.collection(userCollectionName);

        // Check if the username or email already exists in one query
        const existingUser = await userCollection.findOne({
            $or: [{ username }, { email }]
        });

        if (existingUser) {
            if (existingUser.username === username) {
                return { success: false, message: 'Username taken, please try with a different username' };
            }
            if (existingUser.email === email) {
                return { success: false, message: 'Email already used, register with a different email' };
            }
        }

        // Register the new user
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const result = await userCollection.insertOne({
            username,
            email,
            password: hashedPassword
        });
        // Check if the insertion was successful
        if (result.acknowledged === true) {
            return { success: true, message: 'User registered successfully' };
        } else {
            return { success: false, message: 'Failed to register User' };
        }

    } catch (error) {
        console.error('Error in registerUser function:', error);
        return { success: false, message: 'Error registering user' };
    }
};


const loginUser = async (username, email, password) => {
    try {
        const db = await projectConnection();
        const userCollection = db.collection(userCollectionName);

        // Check if the username or email already exists in one query
        const existingUser = await userCollection.findOne({
            $or: [{ username }, { email }]
        });

        if (!existingUser) {
            return { success: false, message: 'User not found' };
        }

        // Compare provided password with the stored hashed password
        const isPasswordValid = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordValid) {
            return { success: false, message: 'Incorrect password' };
        }

        // Generate JWT token if the password is valid
        const token = jwt.sign({ id: existingUser._id, username: existingUser.username }, jwtSecret, { expiresIn: '365d' });
        return { success: true, message: 'Login successful', token };

    } catch (error) {
        console.error('Error in loginUser function:', error);
        return { success: false, message: 'Error logging user' };
    }
};


export { registerUser, loginUser }