import { streamText } from 'ai';
import { createGroq } from '@ai-sdk/groq';
import { generatePlantPrompt } from '@/lib/plantPrompt';

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY || '',
});

export async function POST(req) {
  try {
    const body = await req.json();
    console.log("Chat API Body:", JSON.stringify(body));

    const { plantInfo } = body;
    let messages = body.messages || [];

    // Extremely resilient payload check: handle direct text, content, or message keys
    const directText = body.text || body.content || body.message;
    if (directText && (!messages || messages.length === 0)) {
      messages = [{ role: 'user', content: String(directText) }];
    }

    // Ensure messages is a valid array of ModelMessage for the AI SDK
    const validatedMessages = messages.map(m => {
      let content = m.content || m.text || m.message || '';

      // Handle AI Core 'parts' format found in newer SDK versions
      if (!content && m.parts && Array.isArray(m.parts)) {
        content = m.parts
          .filter(p => p.type === 'text')
          .map(p => p.text)
          .join(' ');
      }

      return {
        role: m.role || 'user',
        content: String(content)
      };
    }).filter(m => m.content && m.content.trim() !== '');

    const systemPrompt = generatePlantPrompt(plantInfo);

    const { generateText } = await import('ai');
    const response = await generateText({
      model: groq('llama-3.1-8b-instant'),
      messages: validatedMessages,
      system: systemPrompt,
    });

    // Artificial delay to make it feel more professional/realistic
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Return plain text for manual handling
    return new Response(response.text || "", {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache'
      },
    });
  } catch (error) {
    console.error("Error in chat API:", error.message || error);
    return new Response(JSON.stringify({ error: error.message || "Failed" }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
