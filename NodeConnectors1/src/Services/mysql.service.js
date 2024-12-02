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


const listFiles = async (userName, MysqlPool, databaseName) => {
    try {
        // projectConnection returns Prosperascan detabase object
        const db = await projectConnection();
        const userCollection = db.collection(`${userName}'s_Meta`);
        const connection = await MysqlPool.getConnection();

        const [rows] = await connection.query("SHOW TABLES");

        // Extract table names in array
        const tableNames = rows.map(row => Object.values(row)[0]);

        // Prepare documents to insert into MongoDB
        const documents = tableNames.map(tableName => ({
            connectorType: "mysql",
            databaseName: databaseName,
            tableName: tableName,
            nfsFilePath: `${nfsPath}/${userName}/mysql/${databaseName}/${tableName}.csv`,
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
            return { success: true, message: 'MySQL tables metadata stored in mongodb' };
        } else {
            return { success: false, message: 'Failed to store MySQL tables metadata in mongodb' };
        }

    } catch (error) {
        console.error("Error listing MySQL tables:", error);
        return { success: false, message: 'Error listing MySQL tables' };
    }
};


const downloadFiles = async (userName, MysqlPool, databaseName) => {
    try {
        const db = await projectConnection();
        const userCollection = db.collection(`${userName}'s_Meta`);
        const connection = await MysqlPool.getConnection();

        // Find relevant documents 
        const cursor = await userCollection.aggregate([
            // First Filter
            {
                $match: {
                    connectorType: 'mysql',
                    databaseName: databaseName,
                    isFileDownloaded: false
                }
            },
            // Optionally, fetch only required fields
            {
                $project: {
                    _id: 1,                 // Default is also Included 
                    tableName: 1,           // Keep the field
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

        return { success: true, message: 'MySQL tables downloaded' };

    } catch (error) {
        console.error("Error downloading MySQL tables:", error);
        return { success: false, message: 'Error downloading MySQL tables' };
    }
};


const deleteFiles = async (userName, databaseName) => {
    try {
        const db = await projectConnection();
        const userCollection = db.collection(`${userName}'s_Meta`);

        // Find relevant documents 
        const cursor = await userCollection.aggregate([
            // First Filter
            {
                $match: {
                    connectorType: 'mysql',
                    databaseName: databaseName,
                    isFileDownloaded: true
                }
            },
            // fetch only required fields
            {
                $project: {
                    _id: 1,                 // Default is also Included 
                    tableName: 1,           // Keep the field
                    nfsFilePath: 1,
                }
            }
        ]);

        // Iterate over the cursor with for-await loop
        for await (const doc of cursor) {
            const { tableName, nfsFilePath } = doc;

            try {
                // Delete the CSV file from nfs
                await fs.promises.unlink(nfsFilePath);

                // Delete the document from the collection
                await userCollection.deleteOne({ _id: doc._id });

            } catch (error) {
                console.error(`Error deleting table ${tableName}:`, error);
            }
        }

        return { success: true, message: 'MySQL tables deleted' };

    } catch (error) {
        console.error("Error deleting MySQL tables:", error);
        return { success: false, message: 'Error deleting MySQL tables' };
    }
};


export { listFiles, downloadFiles, deleteFiles }