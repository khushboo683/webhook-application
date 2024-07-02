import express from 'express';
const router = express.Router();
import {subscribe,listSubscriptions, handleEvent, cancelSubscription, getEvents} from '../controllers/webhookController.js';
import {authMiddleware} from '../middlewares/auth.js';

router.post('/subscribe', authMiddleware, subscribe);
router.get('/subscriptions', authMiddleware, listSubscriptions);
router.post('/events', handleEvent);
router.get('/events',authMiddleware, getEvents);
router.delete('/subscriptions/:subsId', authMiddleware, cancelSubscription);

export default router;
