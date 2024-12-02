import * as S3Controller from '../Controllers/s3.controller.js';
import express from 'express';
import { S3Client } from '@aws-sdk/client-s3';

// To store connection of each user
// once the connection is created for user, it will not modify in subsequent requests untill recreated with different config
const s3ClientCache = {};

// s3 connection provider middleware functions
async function S3ConnectionProvider(req, res, next) {
    try {
        const userId = req.user.id;
        const { awsAccessKey, awsSecretKey, awsRegion } = req.body.s3;

        // Check if the S3 client for the user exists, if not create one
        if (!s3ClientCache[userId]) {
            s3ClientCache[userId] = new S3Client({
                region: awsRegion,
                credentials: {
                    accessKeyId: awsAccessKey,
                    secretAccessKey: awsSecretKey,
                },
            });
        }

        // Attach the S3 client to the req object
        req.s3Connection = s3ClientCache[userId];

        // just Delete object bcz s3 connection is non-persistent
        res.on('finish', () => {
            if (s3ClientCache[userId]) {
                delete s3ClientCache[userId];
            }
        });

        next();
    } catch (error) {
        console.error("s3 connection error: ", error);
        res.status(500).json({ message: "Failed connecting to the AWS S3"});
    }
}


const router = express.Router();
router.get("/list", S3ConnectionProvider, S3Controller.listFiles);
router.get("/download", S3ConnectionProvider, S3Controller.downloadFiles);
router.delete("/delete", S3Controller.deleteFiles);

export default router;