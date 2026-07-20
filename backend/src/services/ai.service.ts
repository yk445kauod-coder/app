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
        const prompt = `As the Sphinx POS AI Restaurant General Manager, analyze this restaurant sales and performance data. Provide high-level business strategy, operational optimizations, and marketing tips: ${JSON.stringify(data)}`;
        const result = await model.generateContent(prompt);
        return result.response.text();
      }
      throw new Error("No Gemini Key");
    } catch (error) {
      return this.fallbackChat(`As Sphinx POS General Manager, analyze this sales data and propose optimizations: ${JSON.stringify(data)}`);
    }
  }

  static async chatWithAssistant(message: string) {
    try {
      if (process.env.GROQ_API_KEY) {
        const chatCompletion = await groq.chat.completions.create({
          messages: [{ role: "user", content: `You are the Sphinx POS Virtual Staff Supervisor. Help the team optimize kitchen prep times, staff scheduling, customer support, and POS issues: ${message}` }],
          model: "llama3-8b-8192",
        });
        return chatCompletion.choices[0]?.message?.content || "";
      }
      throw new Error("No Groq Key");
    } catch (error) {
      return this.fallbackChat(`Sphinx POS Supervisor helper: ${message}`);
    }
  }

  private static async fallbackChat(message: string) {
    try {
      // Use pollinations.ai for premium free helper model
      const response = await axios.get(`https://text.pollinations.ai/${encodeURIComponent(message)}?model=openai`);
      return response.data;
    } catch (err) {
      console.error("Fallback AI failed:", err);
      return "Sphinx POS AI Agent is currently optimizing backend systems. Please try again shortly!";
    }
  }
}
