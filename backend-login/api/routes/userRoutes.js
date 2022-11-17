import express from "express";
import * as userController from '../controllers/userController.js';

const router = express.Router();

router.get('/getUser/:token',userController.getUser)

export default router;