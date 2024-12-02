import * as PostgresService from '../Services/postgres.service.js';

const listFiles = async (req, res) => {
    try {
        const userName = req.user.username;
        const PostgresPool = req.PostgresPool;
        const databaseName = req.body.postgres.database;

        const result = await PostgresService.listFiles(userName, PostgresPool, databaseName);
        // Service Failed
        if (!result.success) {
            return res.status(400).json({ success: false, message: result.message });
        }
        // Service Succeeded
        return res.status(200).json({ success: true, message: result.message });
    } catch (error) {
        console.error('PostgreSQL error:', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

const downloadFiles = async (req, res) => {
    try {
        const userName = req.user.username;
        const PostgresPool = req.PostgresPool;
        const databaseName = req.body.postgres.database;

        const result = await PostgresService.downloadFiles(userName, PostgresPool, databaseName);
        // Service Failed
        if (!result.success) {
            return res.status(400).json({ success: false, message: result.message });
        }
        // Service Succeeded
        return res.status(200).json({ success: true, message: result.message });
    } catch (error) {
        console.error('PostgreSQL error:', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

const deleteFiles = async (req, res) => {
    try {
        const userName = req.user.username;
        const databaseName = req.body.postgres.database;

        const result = await PostgresService.deleteFiles(userName, databaseName);
        // Service Failed
        if (!result.success) {
            return res.status(400).json({ success: false, message: result.message });
        }
        // Service Succeeded
        return res.status(200).json({ success: true, message: result.message });
    } catch (error) {
        console.error('PostgreSQL error:', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

export { listFiles, downloadFiles, deleteFiles };
