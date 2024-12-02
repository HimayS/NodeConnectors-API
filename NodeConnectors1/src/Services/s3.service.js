// dotenv configuration
import path from 'path';
import dotenv from 'dotenv';
const env = process.env.NODE_ENV || 'development';
const envFile = `.env.${env}`;
dotenv.config({ path: path.resolve(process.cwd(), `${envFile}`) });

// imports
import { projectConnection } from '../Config/prospera.connection.js';
import fs from 'fs';   // synchronous read and write operation
import fsPromises from 'fs/promises';  // async promise based filesystem operations
import { pipeline } from 'stream/promises';  // streaming of data from source to destination as fs not support it
import { ListBucketsCommand, GetBucketLocationCommand, ListObjectsV2Command, GetObjectCommand } from "@aws-sdk/client-s3";
const nfsPath = process.env.NFS_PATH;


const listFiles = async (userName, s3Connection, awsRegion) => {
    try {
        const db = await projectConnection();
        const userCollection = db.collection(`${userName}'s_Meta`);

        

    } catch (error) {
        console.error('Error listing s3 files: ', error);
        return { success: false, message: 'Error listing s3 files' };
    }
};


const downloadFiles = async (userName, s3Connection, awsRegion) => {
    try {
        const db = await projectConnection();
        const userCollection = db.collection(`${userName}'s_Meta`);

        // Find relevant documents 
        const cursor = await userCollection.aggregate([
            // Step 1: First filter by 'mysql' connector and isFileDownloaded: false
            {
                $match: {
                    connectorType: 's3',
                    awsRegion: awsRegion,
                    isFileDownloaded: false
                }
            },
            // fetch only required fields
            {
                $project: {
                    _id: 1,
                    bucketName: 1,         // Default is also Included 
                    fileName: 1,           // Keep the field
                    nfsFilePath: 1,
                }
            }
        ]);

        // Iterate over the cursor with for-await loop
        for await (const doc of cursor) {
            const { bucketName, fileName, nfsFilePath } = doc;

            try {
                

            } catch (error) {
                console.error(`Error downloading file ${fileName}:`, error);
            }
        }

        return { success: true, message: 's3 files downloaded' };

    } catch (error) {
        console.error("Error downloading s3 files:", error);
        return { success: false, message: 'Error downloading s3 files' };
    }
};


const deleteFiles = async (userName, awsRegion) => {
    try {
        const db = await projectConnection();
        const userCollection = db.collection(`${userName}'s_Meta`);

        // Find relevant documents 
        const cursor = await userCollection.aggregate([
            // First filter by 'mysql' connector and isFileDownloaded: true
            {
                $match: {
                    connectorType: 's3',
                    awsRegion: awsRegion,
                    isFileDownloaded: true
                }
            },
            // fetch only required fields
            {
                $project: {
                    _id: 1,
                    fileName: 1,
                    nfsFilePath: 1,
                }
            }
        ]);

        // Iterate over the cursor with for-await loop
        for await (const doc of cursor) {
            const { fileName, nfsFilePath } = doc;

            try {
                // Delete the files from nfs
                await fsPromises.unlink(nfsFilePath);

                // Delete the document from the collection
                await userCollection.deleteOne({ _id: doc._id });

            } catch (error) {
                console.error(`Error deleting file ${fileName}:`, error);
            }
        }

        return { success: true, message: 's3 files deleted' };

    } catch (error) {
        console.error("Error deleting s3 files:", error);
        return { success: false, message: 'Error deleting s3 files' };
    }
};


export { listFiles, downloadFiles, deleteFiles }