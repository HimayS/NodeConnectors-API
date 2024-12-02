import * as MysqlController from '../Controllers/mysql.controller.js';
import express from 'express';
import mysql from 'mysql2/promise';

// To store connection pool for each user
const poolCache = {};

// MySQL connection provider middleware functions
async function mysqlConProvider(req, res, next) {
    try {
        const userId = req.user.id;
        const mysqlConfig = req.body.mysql;

        // Check if the pool for the user exists, if not, create one
        if (!poolCache[userId]) {
            poolCache[userId] = mysql.createPool(mysqlConfig);
        }

        // Attach the pool to the request object for future queries
        req.MysqlPool = poolCache[userId];

        // Close the pool once the request-response cycle is complete
        res.on('finish', () => {
            if (poolCache[userId]) {
                poolCache[userId].end();
                delete poolCache[userId];
            }
        });

        next();
    } catch (error) {
        console.error('MySQL connection error:', error);
        return res.status(500).json({ message: 'Failed to create MySQL connection' });
    }
}


const router = express.Router();
router.get("/list", mysqlConProvider, MysqlController.listFiles);
router.get("/download", mysqlConProvider, MysqlController.downloadFiles);
router.delete("/delete", MysqlController.deleteFiles);

export default router;