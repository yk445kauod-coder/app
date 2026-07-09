import { GoogleGenerativeAI } from "@google/generative-ai";
import Groq from "groq-sdk";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || "" });

export class AIService {
  static async getManagerInsight(data: any) {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `As an AI Restaurant Manager, analyze this sales data and provide 3 actionable insights: ${JSON.stringify(data)}`;
    const result = await model.generateContent(prompt);
    return result.response.text();
  }

  static async chatWithAssistant(message: string) {
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: `You are an AI Assistant for a POS system. Help the staff with this: ${message}` }],
      model: "llama3-8b-8192",
    });
    return chatCompletion.choices[0]?.message?.content || "";
  }
}
