import * as OpenSearchController from '../Controllers/opensearch.controller.js';
import express from 'express';
import { Client } from '@opensearch-project/opensearch';

// To store connection of each user
// once the connection is created for user, it will not modify in subsequent requests until recreated with different config
const openSearchClientCache = {};

// OpenSearch connection provider middleware functions
async function openSearchConnectionProvider(req, res, next) {
    try {
        const userId = req.user.id;
        const { uri } = req.body.opensearch;

        // Check if the OpenSearch client for the user exists, if not create one
        if (!openSearchClientCache[userId]) {
            const client = new Client({ node: uri });
            openSearchClientCache[userId] = client;
        }

        // Attach the OpenSearch client to the req object
        req.openSearchConnection = openSearchClientCache[userId];

        // Close the connection once the request-response cycle is complete
        res.on('finish', async () => {
            if (openSearchClientCache[userId]) {
                await openSearchClientCache[userId].close();
                delete openSearchClientCache[userId];
            }
        });

        next();
    } catch (error) {
        console.error("OpenSearch connection error: ", error);
        res.status(500).json({ message: "Failed connecting to OpenSearch" });
    }
}

const router = express.Router();
router.get("/list", openSearchConnectionProvider, OpenSearchController.listFiles);
router.get("/download", openSearchConnectionProvider, OpenSearchController.downloadFiles);
router.delete("/delete", OpenSearchController.deleteFiles);

export default router;
