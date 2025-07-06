import { Message, TextStreamMessage } from "@/components/message";
import { google } from "@ai-sdk/google";
import { CoreMessage, generateId } from "ai";
import {
  createAI,
  createStreamableValue,
  getMutableAIState,
  streamUI,
} from "ai/rsc";
import { ReactNode } from "react";
import { z } from "zod";
import { HotelView } from "@/components/hotel-view";
import { Hotel } from "@/components/types";

const sendMessage = async (message: string) => {
  "use server";

  const messages = getMutableAIState<typeof AI>("messages");

  messages.update([
    ...(messages.get() as CoreMessage[]),
    { role: "user", content: message },
  ]);

  const contentStream = createStreamableValue("");
  const textComponent = <TextStreamMessage content={contentStream.value} />;

  // Load all hotels for processing
  const fs = await import('fs');
  const path = await import('path');
  const configPath = path.join(process.cwd(), 'public', 'config.json');
  const configData = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  const allHotels = configData.allHotels;

  const { value: stream } = await streamUI({
    model: google("gemini-2.5-flash-preview-04-17"),
    system: `\
      - You are a helpful, friendly, and efficient virtual travel assistant specializing in hotel reservations. Your primary role is to assist users in finding and booking hotel accommodations that match their preferences.

      - You can help users find hotels by location (e.g., "New York", "Los Angeles") or by hotel name (e.g., "Hotel 1").
      
      - When users ask about hotels, use the findhotel tool to search for available accommodations.
      
      - When hotel data is provided to you, generate a comprehensive and engaging summary that includes:
        * Hotel name and location
        * Price range and value proposition
        * Key amenities and features
        * Rating and review count
        * Availability status
        * A brief description highlighting what makes each hotel special
      
      - Present the information in a conversational, helpful manner that helps users make informed decisions.
      
      - Always present hotel lists as Markdown bullet points (never numbers).
      
      - Always be concise, polite, and professional. Speak in natural, conversational English.
    `,

    messages: messages.get() as CoreMessage[],
    text: async function* ({ content, done }) {
      if (done) {
        messages.done([
          ...(messages.get() as CoreMessage[]),
          { role: "assistant", content },
        ]);

        contentStream.done();
      } else {
        contentStream.update(content);
      }

      return <TextStreamMessage content={contentStream.value} hotels={allHotels} />;
    },
    tools: {
      findhotel: {
        description: "find hotels based on location or hotel name",
        parameters: z.object({
          query: z.string().describe("search query for location or hotel name"),
        }),
        generate: async function* ({ query }) {
          const toolCallId = generateId();

          // Read hotel data from config.json
          const fs = await import('fs');
          const path = await import('path');
          const configPath = path.join(process.cwd(), 'public', 'config.json');
          const configData = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
          const allHotels = configData.allHotels;

          // Filter hotels based on search query (location or name)
          const filteredHotels = allHotels.filter((hotel: any) => 
            hotel.name.toLowerCase().includes(query.toLowerCase()) ||
            hotel.location.toLowerCase().includes(query.toLowerCase())
          );

          // Create a detailed summary of the found hotels
          let summaryText = "";
          if (filteredHotels.length === 0) {
            summaryText = `I couldn't find any hotels matching "${query}". Please try a different search term or location.`;
          } else if (filteredHotels.length === 1) {
            const hotel = filteredHotels[0];
            summaryText = `**${hotel.name}**: ${hotel.description}`;
          } else {
            summaryText = `I found ${filteredHotels.length} hotels matching "${query}":\n\n`;

            filteredHotels.forEach((hotel: any) => {
              summaryText += `• **${hotel.name}**: ${hotel.description}\n\n`;
            });
            // summaryText = `I found ${filteredHotels.length} hotels matching "${query}":\n\n`;
            
            // filteredHotels.forEach((hotel: any, index: number) => {
            //   summaryText += `### ${index + 1}. **${hotel.name}** - ${hotel.location}\n\n- **Price**: $${hotel.price}/night\n- **Rating**: ${hotel.rating}/5 (${hotel.reviews} reviews)\n- **Description**: ${hotel.description}\n- **Amenities**: ${hotel.amenities.join(', ')}\n- **Status**: ${hotel.availability}${hotel.booked ? ' (Currently booked)' : ''}\n\n`;
            // });
            
            // summaryText += `These hotels range in price from $${Math.min(...filteredHotels.map((h: any) => h.price))} to $${Math.max(...filteredHotels.map((h: any) => h.price))} per night. Would you like more details about any specific hotel?`;
          }

          messages.done([
            ...(messages.get() as CoreMessage[]),
            {
              role: "assistant",
              content: [
                {
                  type: "tool-call",
                  toolCallId,
                  toolName: "findhotel",
                  args: { query },
                },
              ],
            },
            {
              role: "tool",
              content: [
                {
                  type: "tool-result",
                  toolName: "findhotel",
                  toolCallId,
                  result: {
                    hotels: filteredHotels,
                    searchQuery: query,
                    summary: summaryText,
                  },
                },
              ],
            },
          ]);

          return (
            <Message
              role="assistant"
              content={summaryText}
              hotels={allHotels}
            />
          );
        },
      },
    },
  });

  return stream;
};

export type UIState = Array<ReactNode>;

export type AIState = {
  chatId: string;
  messages: Array<CoreMessage>;
};

export const AI = createAI<AIState, UIState>({
  initialAIState: {
    chatId: generateId(),
    messages: [],
  },
  initialUIState: [],
  actions: {
    sendMessage,
  },
  onSetAIState: async ({ state, done }) => {
    "use server";

    if (done) {
      // save to database
    }
  },
});
