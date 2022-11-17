import express from 'express';
import {login, register, verificate} from '../controllers/authController.js'
import createUserValidator from '../middlewares/createUserValidator.js';
import loginUserValidator from '../middlewares/loginUserValidator.js';

const router = express.Router();

router.post('/register',createUserValidator, register,)
router.post('/login',loginUserValidator,login)
router.get('/verificate/:token',verificate)

export default router;