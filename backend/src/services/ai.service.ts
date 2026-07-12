import { GoogleGenerativeAI } from "@google/generative-ai";
import Groq from "groq-sdk";
import axios from 'axios';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || "" });

export class AIService {
  static async getManagerInsight(data: any) {
    try {
      if (process.env.GEMINI_API_KEY) {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const prompt = `As an AI Restaurant Manager, analyze this sales data and provide 3 actionable insights: ${JSON.stringify(data)}`;
        const result = await model.generateContent(prompt);
        return result.response.text();
      }
      throw new Error("No Gemini Key");
    } catch (error) {
      return this.fallbackChat(`Analyze this sales data: ${JSON.stringify(data)}`);
    }
  }

  static async chatWithAssistant(message: string) {
    try {
      if (process.env.GROQ_API_KEY) {
        const chatCompletion = await groq.chat.completions.create({
          messages: [{ role: "user", content: `You are an AI Assistant for a POS system. Help the staff with this: ${message}` }],
          model: "llama3-8b-8192",
        });
        return chatCompletion.choices[0]?.message?.content || "";
      }
      throw new Error("No Groq Key");
    } catch (error) {
      return this.fallbackChat(message);
    }
  }

  private static async fallbackChat(message: string) {
    try {
      // Using pollinations.ai for free, fast AI response as fallback
      const response = await axios.get(`https://text.pollinations.ai/${encodeURIComponent(message)}?model=openai`);
      return response.data;
    } catch (err) {
      console.error("Fallback AI failed:", err);
      return "I'm currently offline, but I'll be back soon to help!";
    }
  }
}
