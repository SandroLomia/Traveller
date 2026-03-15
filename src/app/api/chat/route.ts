import { openai } from '@ai-sdk/openai';
import { streamText, tool } from 'ai';
import { z } from 'zod';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: openai('gpt-4o'),
    messages,
    system: `You are a helpful travel assistant.
    Your goal is to help users plan their travels by suggesting destinations, activities, and itineraries.
    When you suggest a specific place, always try to provide its coordinates (latitude and longitude) using the 'add_location' tool so they can be displayed on the map.
    Keep your responses friendly, concise, and inspiring.
    Always format your suggestions in a clear, readable way.`,
    tools: {
      add_location: tool({
        description: 'Add a location to the map',
        parameters: z.object({
          name: z.string().describe('The name of the place'),
          lat: z.number().describe('Latitude of the place'),
          lng: z.number().describe('Longitude of the place'),
          description: z.string().optional().describe('A short description of why this place is interesting'),
        }),
        execute: async ({ name, lat, lng, description }) => {
          return { name, lat, lng, description };
        },
      }),
    },
  });

  return result.toDataStreamResponse();
}
