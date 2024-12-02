import * as MysqlService from '../Services/mysql.service.js';


const listFiles = async (req, res) => { 
    try {
        const userName = req.user.username;
        const MysqlPool = req.MysqlPool;
        const databaseName = req.body.mysql.database;

        const result = await MysqlService.listFiles(userName, MysqlPool, databaseName);
        // Service Failed
        if (!result.success) {
            return res.status(400).json({ success: false, message: result.message });
        }
        // Service Succeeded
        return res.status(200).json({ success: true, message: result.message });
    } catch (error) {
        console.error('MySQL error:', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};


const downloadFiles = async (req, res) => {
    try {
        const userName = req.user.username;
        const MysqlPool = req.MysqlPool;
        const databaseName = req.body.mysql.database;

        const result = await MysqlService.downloadFiles(userName, MysqlPool, databaseName);
        // Service Failed
        if (!result.success) {
            return res.status(400).json({ success: false, message: result.message });
        }
        // Service Succeeded
        return res.status(200).json({ success: true, message: result.message });
    } catch (error) {
        console.error('MySQL error:', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};


const deleteFiles = async (req, res) => {
    // Currently it will delete downloaded tables from nfsDir
    try {
        const userName = req.user.username;
        const databaseName = req.body.mysql.database;

        const result = await MysqlService.deleteFiles(userName, databaseName);
        // Service Failed
        if (!result.success) {
            return res.status(400).json({ success: false, message: result.message });
        }
        // Service Succeeded
        return res.status(200).json({ success: true, message: result.message });
    } catch (error) {
        console.error('MySQL error:', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};


export { listFiles, downloadFiles, deleteFiles }