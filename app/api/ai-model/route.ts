import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    const session = await auth()

    if (!session || !session.user) {
        return redirect('/login')
    }

    const { prompt } = await request.json()

    if (!prompt) {
        return NextResponse.json({ error: 'Prompt megadása kötelező!' }, { status: 400 })
    }

    const response = await fetch(
		"https://api-inference.huggingface.co/models/bigscience/bloomz-560m",
		{
			headers: {
				Authorization: process.env.HUGGING_FACE_API_KEY!,
				"Content-Type": "application/json",
			},
			method: "POST",
			body: JSON.stringify({
                inputs: prompt,
                options: { wait_for_model: true }
            }),
		}
	);

    if (!response.ok) {
        return NextResponse.json({ error: 'Hiba az API hívás közben' }, { status: response.status });
    }

	const result = await response.json();
	
    return NextResponse.json(result, { status: response.status })
}