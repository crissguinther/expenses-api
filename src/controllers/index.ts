import { Router } from 'express';
import { router as LoginRouter } from './LoginController';

const router = Router();

router.get('/login', LoginRouter);

export default router;
