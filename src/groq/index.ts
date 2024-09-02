import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function getGroqChatCompletion(skill: string) {
  return groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: `Generate personalized learning materials for the skill: ${skill}`,
      },
    ],
    model: "llama3-8b-8192",
  });
}
