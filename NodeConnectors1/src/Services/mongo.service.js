// dotenv configuration
import path from 'path';
import dotenv from 'dotenv';
const env = process.env.NODE_ENV || 'development';
const envFile = `.env.${env}`;
dotenv.config({ path: path.resolve(process.cwd(), `${envFile}`) });

// imports
import { projectConnection } from '../Config/prospera.connection.js';
import fs from 'fs';
const nfsPath = process.env.NFS_PATH;


const listFiles = async (userName, mongoConnection, databaseName) => {
    try {
        const db = await projectConnection();
        const userCollection = db.collection(`${userName}'s_Meta`);

        // scan client's database
        const clientDb = mongoConnection.db(databaseName);
        const collections = await clientDb.listCollections().toArray();
        const collectionNames = collections.map(collection => collection.name);

        // Prepare documents to insert into MongoDB
        const documents = collectionNames.map(collectionName => ({
            connectorType: "mongo",
            databaseName: databaseName,
            collectionName: collectionName,
            nfsFilePath: `${nfsPath}/${userName}/mongo/${databaseName}/${collectionName}.json`,
            isFileDownloaded: false,
            isFileParsed: false,
            isFileDeleted: false
        }));

        // Check if documents is empty before insertion
        if (documents.length === 0) {
            return { success: true, message: 'No collections found to insert.' };
        }

        // Insert documents into Prospera MongoDB
        const result = await userCollection.insertMany(documents);

        // Check if the insertion was successful
        if (result.acknowledged === true) {
            return { success: true, message: 'Mongo Files metadata stored in mongodb' };
        } else {
            return { success: false, message: 'Failed to store Mongo Files metadata in mongodb' };
        }

    } catch (error) {
        console.error("Error listing Mongo files:", error);
        return { success: false, message: 'Error listing Mongo files' };
    }
};


const downloadFiles = async (userName, mongoConnection, databaseName) => {
    try {
        const db = await projectConnection();
        const userCollection = db.collection(`${userName}'s_Meta`);
        const clientDb = mongoConnection.db(databaseName);

        // Find relevant documents 
        const cursor = await userCollection.aggregate([
            // First filter of docs
            {
                $match: {
                    connectorType: 'mongo',
                    databaseName: databaseName,
                    isFileDownloaded: false
                }
            },
            // fetch only required fields
            {
                $project: {
                    _id: 1,
                    collectionName: 1,
                    nfsFilePath: 1,
                }
            }
        ]);

        // Download each collection from database as json file
        for await (const doc of cursor) {
            const { collectionName, nfsFilePath } = doc;

            try {
                const clientCollection = clientDb.collection(collectionName);

                // Update the document to mark it as downloaded
                await userCollection.updateOne(
                    { _id: doc._id },
                    { $set: { isFileDownloaded: true } }
                );
            } catch (error) {
                console.error(`Error downloading file ${collectionName}:`, error);
            }
        }

        return { success: true, message: 'Mongo files downloaded' };

    } catch (error) {
        console.error("Error downloading Mongo files:", error);
        return { success: false, message: 'Error downloading Mongo files' };
    }
};


const deleteFiles = async (userName, databaseName) => {
    try {
        const db = await projectConnection();
        const userCollection = db.collection(`${userName}'s_Meta`);

        // Find relevant documents 
        const cursor = await userCollection.aggregate([
            // Step 1: First filter by 'mysql' connector and isFileDownloaded: true
            {
                $match: {
                    connectorType: 'mongo',
                    databaseName: databaseName,
                    isFileDownloaded: true
                }
            },
            // fetch only required fields
            {
                $project: {
                    _id: 1,
                    collectionName: 1,
                    nfsFilePath: 1,
                }
            }
        ]);

        // Iterate over the cursor with for-await loop
        for await (const doc of cursor) {
            const { collectionName, nfsFilePath } = doc;

            try {
                // Delete the CSV file from nfs
                await fs.promises.unlink(nfsFilePath);

                // Delete the document from the collection
                await userCollection.deleteOne({ _id: doc._id });

            } catch (error) {
                console.error(`Error deleting file ${collectionName}:`, error);
            }
        }

        return { success: true, message: 'Mongo files deleted' };

    } catch (error) {
        console.error("Error deleting Mongo files:", error);
        return { success: false, message: 'Error deleting Mongo files' };
    }
};


export { listFiles, downloadFiles, deleteFiles }