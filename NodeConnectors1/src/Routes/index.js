import express from 'express';
import { jwtValidation } from '../Middleware/jwt.validation.js';
import userRoutes from './user.routes.js';
import configRoutes from './config.routes.js';
import mysqlRoutes from './mysql.routes.js';
import s3Routes from './s3.routes.js';
import mongoRoutes from './mongo.routes.js';
import postgresRoutes from './postgres.routes.js';
import opensearchRoutes from './opensearch.routes.js';

const router = express.Router();
router.use("/user", userRoutes);
router.use("/config", jwtValidation, configRoutes);
router.use("/mysql", jwtValidation, mysqlRoutes);
router.use("/s3", jwtValidation, s3Routes);
router.use("/mongo", jwtValidation, mongoRoutes);
router.use("/postgres", jwtValidation, postgresRoutes);
router.use("/opensearch", jwtValidation, opensearchRoutes);

export default router;