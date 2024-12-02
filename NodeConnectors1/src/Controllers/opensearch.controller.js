import * as OpenSearchService from '../Services/opensearch.service.js';


const listFiles = async (req, res) => { 
    try {
        const userName = req.user.username;
        const openSearchConnection = req.openSearchConnection;
        const { uri } = req.body.opensearch;

        const result = await OpenSearchService.listFiles(userName, openSearchConnection, uri);
        // Service Failed
        if (!result.success) {
            return res.status(400).json({ success: false, message: result.message });
        }
        // Service Succeeded
        return res.status(200).json({ success: true, message: result.message });
    } catch (error) {
        console.error('Opensearch error:', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};


const downloadFiles = async (req, res) => {
    try {
        const userName = req.user.username;
        const openSearchConnection = req.openSearchConnection;
        const { uri } = req.body.opensearch;

        const result = await OpenSearchService.downloadFiles(userName, openSearchConnection, uri);
        // Service Failed
        if (!result.success) {
            return res.status(400).json({ success: false, message: result.message });
        }
        // Service Succeeded
        return res.status(200).json({ success: true, message: result.message });
    } catch (error) {
        console.error('Opensearch error:', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};


const deleteFiles = async (req, res) => {
    // Currently it will delete files from NFS
    try {
        const userName = req.user.username;
        const { uri } = req.body.opensearch;
    
        const result = await OpenSearchService.deleteFiles(userName, uri);
        // Service Failed
        if (!result.success) {
            return res.status(400).json({ success: false, message: result.message });
        }
        // Service Succeeded
        return res.status(200).json({ success: true, message: result.message });
    } catch (error) {
        console.error('Opensearch error:', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};


export { listFiles, downloadFiles, deleteFiles }