"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiRouter = void 0;
const express_1 = __importDefault(require("express"));
const ai_service_1 = require("../services/ai.service");
const router = express_1.default.Router();
router.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;
        const response = await ai_service_1.AIService.chatWithAssistant(message);
        res.json({ response });
    }
    catch (error) {
        res.status(500).json({ error: 'AI Error' });
    }
});
router.post('/insight', async (req, res) => {
    try {
        const { data } = req.body;
        const insight = await ai_service_1.AIService.getManagerInsight(data);
        res.json({ insight });
    }
    catch (error) {
        res.status(500).json({ error: 'AI Error' });
    }
});
exports.aiRouter = router;
