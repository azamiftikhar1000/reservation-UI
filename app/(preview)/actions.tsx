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
import { HubView } from "@/components/hub-view";
import { UsageView } from "@/components/usage-view";

interface Hotel {
  name: string;
  location: string;
  price: number;
  description: string;
  image: string;
  amenities: string[];
  rating: number;
  reviews: number;
  availability: string;
  booked: boolean;
}

export interface Hub {
  climate: Record<"low" | "high", number>;
  lights: Array<{ name: string; status: boolean }>;
  locks: Array<{ name: string; isLocked: boolean }>;
}

let hub: Hub = {
  climate: {
    low: 23,
    high: 25,
  },
  lights: [
  { name: "patio", status: true },
    { name: "kitchen", status: false },
    { name: "garage", status: true },
  ],
  locks: [{ name: "back door", isLocked: true }],
};

const sendMessage = async (message: string) => {
  "use server";

  const messages = getMutableAIState<typeof AI>("messages");

  messages.update([
    ...(messages.get() as CoreMessage[]),
    { role: "user", content: message },
  ]);

  const contentStream = createStreamableValue("");
  const textComponent = <TextStreamMessage content={contentStream.value} />;

  const { value: stream } = await streamUI({
    model: google("gemini-2.5-flash-preview-04-17"),
    system: `\\
      - You are a helpful, friendly, and efficient virtual travel assistant specializing in hotel reservations. Your primary role is to assist users in finding and booking hotel accommodations that match their preferences.

      - You can help users find hotels by location (e.g., "New York", "Los Angeles") or by hotel name (e.g., "Hotel 1").
      
      - When users ask about hotels, use the findhotel tool to search for available accommodations.
      
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

      return textComponent;
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
          const configPath = path.join(process.cwd(), 'static_data', 'config.json');
          const configData = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
          const allHotels = configData.allHotels;

          // Filter hotels based on search query (location or name)
          const filteredHotels = allHotels.filter((hotel: any) => 
            hotel.name.toLowerCase().includes(query.toLowerCase()) ||
            hotel.location.toLowerCase().includes(query.toLowerCase())
          );

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
                  },
                },
              ],
            },
          ]);

          return (
            <Message
              role="assistant"
              content={`Found ${filteredHotels.length} hotel(s) matching "${query}"`}
            />
          );
        },
      },
      viewHub: {
        description:
          "view the hub that contains current quick summary and actions for temperature, lights, and locks",
        parameters: z.object({}),
        generate: async function* ({}) {
          const toolCallId = generateId();

          messages.done([
            ...(messages.get() as CoreMessage[]),
            {
              role: "assistant",
              content: [
                {
                  type: "tool-call",
                  toolCallId,
                  toolName: "viewHub",
                  args: {},
                },
              ],
            },
            {
              role: "tool",
              content: [
                {
                  type: "tool-result",
                  toolName: "viewHub",
                  toolCallId,
                  result: hub,
                },
              ],
            },
          ]);

          return <Message role="assistant" content={<HubView hub={hub} />} />;
        },
      },
      updateHub: {
        description: "update the hub with new values",
        parameters: z.object({
          hub: z.object({
            climate: z.object({
              low: z.number(),
              high: z.number(),
            }),
            lights: z.array(
              z.object({ name: z.string(), status: z.boolean() }),
            ),
            locks: z.array(
              z.object({ name: z.string(), isLocked: z.boolean() }),
            ),
          }),
        }),
        generate: async function* ({ hub: newHub }) {
          hub = newHub;
          const toolCallId = generateId();

          messages.done([
            ...(messages.get() as CoreMessage[]),
            {
              role: "assistant",
              content: [
                {
                  type: "tool-call",
                  toolCallId,
                  toolName: "updateHub",
                  args: { hub },
                },
              ],
            },
            {
              role: "tool",
              content: [
                {
                  type: "tool-result",
                  toolName: "updateHub",
                  toolCallId,
                  result: newHub,
                },
              ],
            },
          ]);

          return <Message role="assistant" content={<HubView hub={hub} />} />;
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
    updateHub: async (hub: Hub) => {
      "use server";

      const newHub = {
        climate: hub.climate,
        lights: hub.lights,
        locks: hub.locks,
      };

      const aiState = getMutableAIState<typeof AI>();
      const toolCallId = generateId();

      aiState.done({
        ...aiState.get(),
        messages: [
          ...aiState.get().messages,
          {
            role: "assistant",
            content: [
              {
                type: "tool-call",
                toolCallId,
                toolName: "updateHub",
                args: { hub },
              },
            ],
          },
          {
            role: "tool",
            content: [
              {
                type: "tool-result",
                toolCallId,
                toolName: "updateHub",
                result: newHub,
              },
            ],
          },
        ],
      });
    },
  },
  onSetAIState: async ({ state, done }) => {
    "use server";

    if (done) {
      // save to database
    }
  },
});
