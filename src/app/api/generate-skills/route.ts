import { NextResponse } from 'next/server';
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(request: Request) {
  const { jobTitle, courseName } = await request.json();

  try {
    // Interact with Groq to generate skills
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `You are an intelligent educational assistant designed to help users generate a list of skills and brief descriptions required for the job "${jobTitle}" or the university course "${courseName}" in the current day and time.
          Return only valid JSON in the following format: 
            {
              "skills": ["Skill 1", "Skill 2"],
              "descriptions": ["Description 1", "Description 2"]
            } without any additional text or explanations.`,
        },
      ],
      model: "llama3-8b-8192",
    });

    const generatedSkills = chatCompletion.choices[0]?.message?.content || "";

    // Parse the generated skills into JSON format
    let parsedSkills;
    try {
      parsedSkills = JSON.parse(generatedSkills);
    } catch (jsonError) {
      console.error("Error parsing generated skills: ", jsonError);
      return NextResponse.json({ message: 'Failed to parse skills', error: jsonError }, { status: 500 });
    }

    // Ensure the parsed skills is structured correctly
    if (Array.isArray(parsedSkills.skills) && Array.isArray(parsedSkills.descriptions)) {
      return NextResponse.json({
        message: 'Skills generated successfully',
        skills: parsedSkills.skills,
        descriptions: parsedSkills.descriptions,
      });
    } else {
      return NextResponse.json({
        message: 'Invalid skills structure',
        skills: [],
        descriptions: [],
      }, { status: 400 });
    }
  } catch (error) {
    console.error("Error in generate-skills route: ", error);
    return NextResponse.json({ message: 'Failed to generate skills', error }, { status: 500 });
  }
}
