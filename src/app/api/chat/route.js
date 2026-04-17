import { generateText } from 'ai';
import { groq } from '@ai-sdk/groq';
import { generatePlantPrompt } from '@/lib/plantPrompt';

export const runtime = 'edge'; // Use Edge Runtime for better stability on Vercel

export async function POST(req) {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    
    // Safety check for environment variables
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "GROQ_API_KEY is missing in Vercel environment variables." }), { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' } 
      });
    }

    const body = await req.json().catch(() => ({}));
    const { plantInfo } = body;
    let messages = body.messages || [];

    // Handle direct text payload
    const directText = body.text || body.content || body.message;
    if (directText && (!messages || messages.length === 0)) {
      messages = [{ role: 'user', content: String(directText) }];
    }

    // Clean and validate messages
    const validatedMessages = messages.map(m => {
      let content = m.content || m.text || '';
      if (!content && m.parts && Array.isArray(m.parts)) {
        content = m.parts.filter(p => p.type === 'text').map(p => p.text).join(' ');
      }
      return {
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: String(content)
      };
    }).filter(m => m.content.trim() !== '');

    if (validatedMessages.length === 0) {
       return new Response("No valid messages provided.", { status: 400 });
    }

    const systemPrompt = generatePlantPrompt(plantInfo);

    const response = await generateText({
      model: groq('llama3-70b-8192'),
      messages: validatedMessages,
      system: systemPrompt,
    });

    // Artificial delay for professionalism
    await new Promise(resolve => setTimeout(resolve, 1200));

    return new Response(response.text || "I'm a bit shy right now, try again?", {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache'
      },
    });

  } catch (error) {
    console.error("Critical Chat API Error:", error);
    return new Response(JSON.stringify({ 
      error: error.message || "Internal Server Error",
      type: "v-edge-failure"
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
