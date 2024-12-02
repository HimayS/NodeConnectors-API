import * as S3Service from '../Services/s3.service.js';


const listFiles = async (req, res) => {
    try {
        const userName = req.user.username;
        const s3Connection = req.s3Connection;
        const { awsRegion } = req.body.s3;

        const result = await S3Service.listFiles(userName, s3Connection, awsRegion);
        // Service Failed
        if (!result.success) {
            return res.status(400).json({ success: false, message: result.message });
        }
        // Service Succeeded
        return res.status(200).json({ success: true, message: result.message });
    } catch (error) {
        console.error('s3 error:', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};


const downloadFiles = async (req, res) => {
    try {
        const userName = req.user.username;
        const s3Connection = req.s3Connection;
        const { awsRegion } = req.body.s3; // need to pass awsRegion separately because encoded in s3Connection

        const result = await S3Service.downloadFiles(userName, s3Connection, awsRegion);
        // Service Failed
        if (!result.success) {
            return res.status(400).json({ success: false, message: result.message });
        }
        // Service Succeeded
        return res.status(200).json({ success: true, message: result.message });
    } catch (error) {
        console.error('s3 error:', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};


const deleteFiles = async (req, res) => {
    try {
        const userName = req.user.username;
        const { awsRegion } = req.body.s3; // need to pass awsRegion separately because encoded in s3Connection

        const result = await S3Service.deleteFiles(userName, awsRegion);
        // Service Failed
        if (!result.success) {
            return res.status(400).json({ success: false, message: result.message });
        }
        // Service Succeeded
        return res.status(200).json({ success: true, message: result.message });
    } catch (error) {
        console.error('s3 error:', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};


export { listFiles, downloadFiles, deleteFiles }