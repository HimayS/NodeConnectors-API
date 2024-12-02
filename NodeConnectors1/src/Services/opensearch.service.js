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


const listFiles = async (userName, openSearchConnection, uri) => {
    try {
        const db = await projectConnection();
        const userCollection = db.collection(`${userName}'s_Meta`);

        // Fetch indices from OpenSearch
        const indices = await openSearchConnection.cat.indices({ format: 'json' });
        const indexNames = indices.body.map(index => index.index);

        // Filter out system indices (those starting with a dot)
        const userIndexNames = indexNames.filter(indexName => !indexName.startsWith('.'));

        // Extract hostname from the URI
        const url = new URL(uri);
        const hostName = url.hostname;

        // Prepare documents to insert into MongoDB
        const documents = userIndexNames.map(indexName => ({
            connectorType: "opensearch",
            hostName: hostName,
            indexName: indexName,
            nfsFilePath: `${nfsPath}/${userName}/opensearch/${hostName}/${indexName}.json`,
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
            return { success: true, message: 'Opensearch indices metadata stored in mongodb' };
        } else {
            return { success: false, message: 'Failed to store Opensearch indices metadata in mongodb' };
        }

    } catch (error) {
        console.error("Error listing Opensearch indices:", error);
        return { success: false, message: 'Error listing Opensearch indices' };
    }
};


const downloadFiles = async (userName, openSearchConnection, uri) => {
    try {
        const db = await projectConnection();
        const userCollection = db.collection(`${userName}'s_Meta`);

        // Extract hostname from the URI
        const url = new URL(uri);
        const hostName = url.hostname;

        // Find relevant documents 
        const cursor = userCollection.aggregate([
            { $match: { connectorType: 'opensearch', hostName: hostName, isFileDownloaded: false } },
            { $project: { _id: 1, indexName: 1, nfsFilePath: 1 } }
        ]);

        // Download each collection from database as json file
        for await (const doc of cursor) {
            const { indexName, nfsFilePath } = doc;

            try {
                

            } catch (error) {
                console.error(`Error downloading file for index ${indexName}:`, error);
            }
        }

        return { success: true, message: 'Opensearch indices downloaded' };

    } catch (error) {
        console.error("Error downloading Opensearch indices:", error);
        return { success: false, message: 'Error downloading Opensearch indices' };
    }
};


const deleteFiles = async (userName, uri) => {
    try {
        const db = await projectConnection();
        const userCollection = db.collection(`${userName}'s_Meta`);

        // Extract hostname from the URI
        const url = new URL(uri);
        const hostName = url.hostname;

        // Find relevant documents 
        const cursor = await userCollection.aggregate([
            // filter by 'opensearch' connector and isFileDownloaded: true
            {
                $match: {
                    connectorType: 'opensearch',
                    hostName: hostName,
                    isFileDownloaded: true
                }
            },
            // fetch only required fields
            {
                $project: {
                    _id: 1,
                    indexName: 1,
                    nfsFilePath: 1,
                }
            }
        ]);

        // Iterate over the cursor with for-await loop
        for await (const doc of cursor) {
            const { indexName, nfsFilePath } = doc;

            try {
                // Delete the CSV file from nfs
                await fs.promises.unlink(nfsFilePath);

                // Delete the document from the collection
                await userCollection.deleteOne({ _id: doc._id });

            } catch (error) {
                console.error(`Error deleting file ${indexName}:`, error);
            }
        }

        return { success: true, message: 'Opensearch indices deleted' };

    } catch (error) {
        console.error("Error deleting Opensearch indices:", error);
        return { success: false, message: 'Error deleting Opensearch indices' };
    }
};


export { listFiles, downloadFiles, deleteFiles }