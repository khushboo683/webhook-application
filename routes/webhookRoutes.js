import express from 'express';
const router = express.Router();
import {subscribe,listSubscriptions, handleEvent, cancelSubscription} from '../controllers/webhookController.js';
import {authMiddleware} from '../middlewares/auth.js';

router.post('/subscribe', authMiddleware, subscribe);
router.get('/subscriptions', authMiddleware, listSubscriptions);
router.post('/events', handleEvent);
router.delete('/subscriptions/:id', authMiddleware, cancelSubscription);

export default router;
