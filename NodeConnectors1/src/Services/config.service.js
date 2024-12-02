// dotenv configuration
import path from 'path';
import dotenv from 'dotenv';
const env = process.env.NODE_ENV || 'development';
const envFile = `.env.${env}`;
dotenv.config({ path: path.resolve(process.cwd(), `${envFile}`) });

// imports
import { projectConnection } from '../Config/prospera.connection.js';
const configCollectionName = process.env.USER_CONFIG_COLLECTION_NAME || 'User_Configuration';


const storeConnectorConfig = async (userId, configObject) => {
    try {
        const db = await projectConnection();
        const configCollection = db.collection(configCollectionName);

        // Check if the email already exists
        const existingUser = await configCollection.findOne({ userId });
        if (existingUser) {
            return { success: false, message: 'configs already exists, update it instead of inserting' };
        }

        // Create the document to be inserted
        const document = {
            userId: userId,
            config: configObject,
        };

        // Insert the document into the collection
        const result = await configCollection.insertOne(document);

        // Check if the insertion was successful
        if (result.acknowledged === true) {
            return { success: true, message: 'Configs stored successfully' };
        } else {
            return { success: false, message: 'Failed to store configuration' };
        }

    } catch (error) {
        console.error('Error in storeConnectorConfig function:', error);
        return { success: false, message: 'Error storing configuration' };
    }
};


const fetchConnectorConfig = async (userId) => {
    try {
        const db = await projectConnection();
        const configCollection = db.collection(configCollectionName);

        // Insert the document into the collection
        const result = await configCollection.findOne({ userId });
        
        // Check if the insertion was successful
        if (result) {
            return { success: true, message: 'Configs fetched successfully', config: result.config };
        } else {
            return { success: false, message: 'No Configs Found' };
        }

    } catch (error) {
        console.error('Error in fetchConnectorConfig function:', error);
        return { success: false, message: 'Error fetching configuration' };
    }
};


export { storeConnectorConfig, fetchConnectorConfig };