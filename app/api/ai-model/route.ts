import { auth } from '@/auth';
import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from "openai";

const client = new OpenAI({
    baseURL: "https://api-inference.huggingface.co/v1/",
    apiKey: process.env.HUGGING_FACE_API_KEY!
});

export async function POST(request: NextRequest) {
    const { prompt } = await request.json()

    if (!prompt) {
        return NextResponse.json({ error: 'Prompt megadása kötelező!' }, { status: 400 })
    }

    const chatCompletion = await client.chat.completions.create({
        model: "mistralai/Mistral-7B-Instruct-v0.3",
        messages: [
            {
                role: "user",
                content: prompt
            }
        ],
        max_tokens: 500
    });
	
    return NextResponse.json(chatCompletion.choices[0].message.content, { status: 200 })
}