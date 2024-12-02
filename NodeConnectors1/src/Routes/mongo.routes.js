import * as MongoController from '../Controllers/mongo.controller.js';
import express from 'express';
import { MongoClient } from 'mongodb';


// To store connection of each user
// once the connection is created for user, it will not modify in subsequent requests untill recreated with different config
const mongoClientCache = {};

// mongo connection provider middleware functions
async function mongoConnectionProvider(req, res, next) {
    try {
        const userId = req.user.id;
        const { uri } = req.body.mongo;

        // Check if the S3 client for the user exists, if not create one
        if (!mongoClientCache[userId]) {
            const client = new MongoClient(uri);
            await client.connect();  // Connect to MongoDB
            mongoClientCache[userId] = client;  // Cache the connected client
        }

        // Attach the S3 client to the req object
        req.mongoConnection = mongoClientCache[userId];

        // Close the connection once the request-response cycle is complete
        res.on('finish', async () => {
            if (mongoClientCache[userId]) {
                await mongoClientCache[userId].close();
                delete mongoClientCache[userId];
            }
        });

        next();
    } catch (error) {
        console.error("Mongo connection error: ", error);
        res.status(500).json({ message: "Failed connecting to the Mongo"});
    }
}


const router = express.Router();
router.get("/list", mongoConnectionProvider, MongoController.listFiles);
router.get("/download", mongoConnectionProvider, MongoController.downloadFiles);
router.delete("/delete", MongoController.deleteFiles);

export default router;