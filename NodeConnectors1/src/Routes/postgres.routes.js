import * as PostgresController from '../Controllers/postgres.controller.js';
import express from 'express';
import pg from 'pg'; // PostgreSQL client library
const { Pool } = pg;

// To store connection pool for each user
const poolCache = {};

// PostgreSQL connection provider middleware function
async function postgresConProvider(req, res, next) {
    try {
        const userId = req.user.id; // Assume `req.user.id` contains the authenticated user's ID
        const postgresConfig = req.body.postgres; // PostgreSQL connection config from the request body

        // Check if the pool for the user exists, if not, create one
        if (!poolCache[userId]) {
            poolCache[userId] = new Pool(postgresConfig);
        }

        // Attach the pool to the request object for future queries
        req.PostgresPool = poolCache[userId];
        
        // Close the pool once the request-response cycle is complete
        res.on('finish', () => {
            if (poolCache[userId]) {
                poolCache[userId].end();
                delete poolCache[userId];
            }
        });

        next();
    } catch (error) {
        console.error('PostgreSQL connection error:', error);
        return res.status(500).json({ message: 'Failed to create PostgreSQL connection' });
    }
}

const router = express.Router();

// Define routes and attach the connection provider
router.get("/list", postgresConProvider, PostgresController.listFiles);
router.get("/download", postgresConProvider, PostgresController.downloadFiles);
router.delete("/delete", PostgresController.deleteFiles);

export default router;
