// src/app/api/content-generation/route.ts
import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const groq = new Groq({ apiKey: GROQ_API_KEY });

export async function POST(request: Request) {
  const { title } = await request.json(); // Ensure you are receiving the title

  try {
    const response = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `
            You are an intelligent educational assistant designed to help users find relevant courses, tutorials , exercises, and goals. Your task is to suggest high-quality resources tailored to the learning path titled "${title}". 

            The suggestions should include:
            - A list of recommended online courses with links.
            - Tutorials that cover essential topics.
            - Exercises to practice the concepts learned.
            - Goals for tracking progress related to the learning path.
            Ensure the suggestions are suitable for various learning levels, from beginner to advanced.

            Return only valid JSON in the following format: 
            {
              "suggestedCourses": ["Course 1", "Course 2"],
              "tutorials": ["Tutorial 1", "Tutorial 2"],
              "exercises": ["Exercise 1", "Exercise 2"],
              "goals": ["Goal 1", "Goal 2"]
            } without any additional text or explanations.`,
        },
      ],
      model: "llama3-8b-8192",
    });

    const suggestions = response.choices[0]?.message?.content || '';

    // Check if suggestions are in valid JSON format
    let parsedSuggestions;
    try {
      parsedSuggestions = JSON.parse(suggestions);
    } catch (jsonError) {
      console.error("Error parsing suggestions: ", jsonError);
      return NextResponse.json({ suggestedCourses: [], tutorials: [], exercises: [], goals: [] }, { status: 500 });
    }

    return NextResponse.json(parsedSuggestions);
  } catch (error) {
    console.error("Error in content-generation route: ", error);
    return NextResponse.json({ suggestedCourses: [], tutorials: [], exercises: [], goals: [] }, { status: 500 });
  }
}
