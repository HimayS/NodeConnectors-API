import * as ConfigService from '../Services/config.service.js';


const storeConnectorConfig = async (req, res) => {
    try {
        const userId = req.user.id;
        const configObject = req.body;

        const result = await ConfigService.storeConnectorConfig(userId, configObject);
        // failed to store configs
        if (!result.success) {
            return res.status(400).json({ success: false, message: result.message });
        }
        // succeefully stored configs
        return res.status(201).json({ success: true, message: result.message });
    } catch (error) {
        console.error('Error storing configuration:', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};


const fetchConnectorConfig = async (req, res) => {
    try {
        const userId = req.user.id;

        const result = await ConfigService.fetchConnectorConfig(userId);
        // failed to fetch configs
        if (!result.success) {
            return res.status(400).json({ success: false, message: result.message });
        }
        // succeefully fetched configs
        return res.status(201).json({ success: true, message: result.message, config: result.config });
    } catch (error) {
        console.error('Error fetching configuration:', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};


export { storeConnectorConfig, fetchConnectorConfig };