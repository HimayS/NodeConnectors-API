import * as UserController from '../Controllers/user.controller.js';
import express from 'express';

const router = express.Router();
router.post("/register", UserController.register);
router.get("/login", UserController.login);

// TO DO: Below Routes to be completed 
// router.put("/update", UserController.update);
// router.delete("/delete", UserController.delete);

export default router;