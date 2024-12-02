// dotenv configuration
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const env = process.env.NODE_ENV || 'development';
const envFile = `.env.${env}`;
dotenv.config({ path: `${__dirname}/../${envFile}` });

// imports
import express from 'express';
import routes from './Routes/index.js';


// Express Server Configuration
const app = express();
app.use(express.json());
const port = process.env.PORT || 10000;


// Routes
app.use("/api", routes);


// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
