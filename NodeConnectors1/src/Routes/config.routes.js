import * as ConfigController from '../Controllers/config.controller.js';
import express from 'express';

const router = express.Router();
router.get("/fetch", ConfigController.fetchConnectorConfig);
router.post("/store", ConfigController.storeConnectorConfig);

// TO DO: Below Routes to be completed 
// router.put("/fetch", ConfigController.updateConnectorConfig);
// router.delete("/fetch", ConfigController.deleteConnectorConfig);

export default router;