import * as MongoService from '../Services/mongo.service.js';


const listFiles = async (req, res) => { 
    try {
        const userName = req.user.username;
        const mongoConnection = req.mongoConnection;
        const { databaseName } = req.body.mongo;

        const result = await MongoService.listFiles(userName, mongoConnection, databaseName);
        // Service Failed
        if (!result.success) {
            return res.status(400).json({ success: false, message: result.message });
        }
        // Service Succeeded
        return res.status(200).json({ success: true, message: result.message });
    } catch (error) {
        console.error('Mongo error:', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};


const downloadFiles = async (req, res) => {
    try {
        const userName = req.user.username;
        const mongoConnection = req.mongoConnection;
        const { databaseName } = req.body.mongo;

        const result = await MongoService.downloadFiles(userName, mongoConnection, databaseName);
        // Service Failed
        if (!result.success) {
            return res.status(400).json({ success: false, message: result.message });
        }
        // Service Succeeded
        return res.status(200).json({ success: true, message: result.message });
    } catch (error) {
        console.error('Mongo error:', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};


const deleteFiles = async (req, res) => {
    // Currently it will delete files from NFS
    try {
        const userName = req.user.username;
        const { databaseName } = req.body.mongo;

        const result = await MongoService.deleteFiles(userName, databaseName);
        // Service Failed
        if (!result.success) {
            return res.status(400).json({ success: false, message: result.message });
        }
        // Service Succeeded
        return res.status(200).json({ success: true, message: result.message });
    } catch (error) {
        console.error('Mongo error:', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};


export { listFiles, downloadFiles, deleteFiles }