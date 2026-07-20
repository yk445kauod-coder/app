"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIService = void 0;
const generative_ai_1 = require("@google/generative-ai");
const groq_sdk_1 = __importDefault(require("groq-sdk"));
const genAI = new generative_ai_1.GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const groq = new groq_sdk_1.default({ apiKey: process.env.GROQ_API_KEY || "" });
class AIService {
    static async getManagerInsight(data) {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const prompt = `As an AI Restaurant Manager, analyze this sales data and provide 3 actionable insights: ${JSON.stringify(data)}`;
        const result = await model.generateContent(prompt);
        return result.response.text();
    }
    static async chatWithAssistant(message) {
        const chatCompletion = await groq.chat.completions.create({
            messages: [{ role: "user", content: `You are an AI Assistant for a POS system. Help the staff with this: ${message}` }],
            model: "llama3-8b-8192",
        });
        return chatCompletion.choices[0]?.message?.content || "";
    }
}
exports.AIService = AIService;
