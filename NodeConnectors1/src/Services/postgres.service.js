// dotenv configuration
import path from 'path';
import dotenv from 'dotenv';
const env = process.env.NODE_ENV || 'development';
const envFile = `.env.${env}`;
dotenv.config({ path: path.resolve(process.cwd(), `${envFile}`) });

// imports
import { projectConnection } from '../Config/prospera.connection.js';
import fs from 'fs';
import { stringify } from 'csv-stringify';
const nfsPath = process.env.NFS_PATH;

const listFiles = async (userName, PostgresPool, databaseName) => {
    try {
        // projectConnection returns Prosperascan database object
        const db = await projectConnection();
        const userCollection = db.collection(`${userName}'s_Meta`);
        const client = await PostgresPool.connect();

        const query = "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE';"
        const res = await client.query(query);

        // Extract table names in array
        const tableNames = res.rows.map(row => row.table_name);

        // Prepare documents to insert into MongoDB
        const documents = tableNames.map(tableName => ({
            connectorType: "postgresql",
            databaseName: databaseName,
            tableName: tableName,
            nfsFilePath: `${nfsPath}/${userName}/postgresql/${databaseName}/${tableName}.csv`,
            isFileDownloaded: false,
            isFileParsed: false,
            isFileDeleted: false
        }));

        // Check if documents is empty before insertion
        if (documents.length === 0) {
            return { success: true, message: 'No tables found to insert.' };
        }

        // Insert documents into MongoDB
        const result = await userCollection.insertMany(documents);

        // Check if the insertion was successful
        if (result.acknowledged === true) {
            return { success: true, message: 'PostgreSQL tables metadata stored in MongoDB' };
        } else {
            return { success: false, message: 'Failed to store PostgreSQL tables metadata in MongoDB' };
        }

    } catch (error) {
        console.error("Error listing PostgreSQL tables:", error);
        return { success: false, message: 'Error listing PostgreSQL tables' };
    }
};

const downloadFiles = async (userName, PostgresPool, databaseName) => {
    try {
        const db = await projectConnection();
        const userCollection = db.collection(`${userName}'s_Meta`);
        const client = await PostgresPool.connect();

        // Find relevant documents
        const cursor = await userCollection.aggregate([
            {
                $match: {
                    connectorType: 'postgresql',
                    databaseName: databaseName,
                    isFileDownloaded: false
                }
            },
            {
                $project: {
                    _id: 1,
                    tableName: 1,
                    nfsFilePath: 1,
                }
            }
        ]);

        // Iterate over the cursor with for-await loop
        for await (const doc of cursor) {
            const { tableName, nfsFilePath } = doc;

            try {
                

            } catch (error) {
                console.error(`Error downloading table ${tableName}:`, error);
            }
        }

        return { success: true, message: 'PostgreSQL tables downloaded' };

    } catch (error) {
        console.error("Error downloading PostgreSQL tables:", error);
        return { success: false, message: 'Error downloading PostgreSQL tables' };
    }
};

const deleteFiles = async (userName, databaseName) => {
    try {
        const db = await projectConnection();
        const userCollection = db.collection(`${userName}'s_Meta`);

        // Find relevant documents
        const cursor = await userCollection.aggregate([
            {
                $match: {
                    connectorType: 'postgresql',
                    databaseName: databaseName,
                    isFileDownloaded: true
                }
            },
            {
                $project: {
                    _id: 1,
                    tableName: 1,
                    nfsFilePath: 1,
                }
            }
        ]);

        // Iterate over the cursor with for-await loop
        for await (const doc of cursor) {
            const { tableName, nfsFilePath } = doc;

            try {
                // Delete the CSV file from NFS
                await fs.promises.unlink(nfsFilePath);

                // Delete the document from the collection
                await userCollection.deleteOne({ _id: doc._id });

            } catch (error) {
                console.error(`Error deleting table ${tableName}:`, error);
            }
        }

        return { success: true, message: 'PostgreSQL tables deleted' };

    } catch (error) {
        console.error("Error deleting PostgreSQL tables:", error);
        return { success: false, message: 'Error deleting PostgreSQL tables' };
    }
};

export { listFiles, downloadFiles, deleteFiles };
