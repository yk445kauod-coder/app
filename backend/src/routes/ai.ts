import express from 'express';
import { AIService } from '../services/ai.service';

const router = express.Router();

router.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;
    const response = await AIService.chatWithAssistant(message);
    res.json({ response });
  } catch (error) {
    res.status(500).json({ error: 'AI Error' });
  }
});

router.post('/insight', async (req, res) => {
  try {
    const { data } = req.body;
    const insight = await AIService.getManagerInsight(data);
    res.json({ insight });
  } catch (error) {
    res.status(500).json({ error: 'AI Error' });
  }
});

export const aiRouter = router;
