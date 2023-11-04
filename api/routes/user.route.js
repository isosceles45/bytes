import express from 'express';
import { register } from '../controllers/user.controller.js';
import { confirm } from '../controllers/user.controller.js';
import { login } from '../controllers/user.controller.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/confirm', confirm);

export default router;