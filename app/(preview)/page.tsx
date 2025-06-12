"use client";

import { ReactNode, useRef, useState } from "react";
import { useActions } from "ai/rsc";
import { Message } from "@/components/message";
import { useScrollToBottom } from "@/components/use-scroll-to-bottom";
import { motion } from "framer-motion";
import { MasonryIcon, VercelIcon } from "@/components/icons";
import Link from "next/link";

export default function Home() {
  const { sendMessage } = useActions();

  const [input, setInput] = useState<string>("");
  const [messages, setMessages] = useState<Array<ReactNode>>([]);

  const inputRef = useRef<HTMLInputElement>(null);
  const [messagesContainerRef, messagesEndRef] =
    useScrollToBottom<HTMLDivElement>();

    const suggestedActions = [
      { title: "Find", label: "hotels in Paris", action: "Find hotels in Paris" },
      { title: "Check", label: "availability for next weekend", action: "Check availability for next weekend" },
      { title: "Show", label: "rooms with a sea view", action: "Show rooms with sea view" },
      { title: "Book", label: "a room from June 10–12", action: "Book room June 10 to June 12" },
    ];
    

  return (
    <div className="flex flex-row h-dvh bg-white dark:bg-zinc-900">
      {/* Left side - Chat */}
      <div className="flex flex-col justify-between gap-4 w-1/2 border-r border-zinc-200 dark:border-zinc-800">
        <div
          ref={messagesContainerRef}
          className="flex flex-col gap-3 h-full overflow-y-scroll px-4"
        >
          {messages.length === 0 && (
            <motion.div className="h-[350px] w-full pt-20">
              <div className="border rounded-lg p-6 flex flex-col gap-4 text-zinc-500 text-sm dark:text-zinc-400 dark:border-zinc-700">
                <p className="text-center text-[20px] font-semibold" style={{ color: "rgb(136,196,164)" }}>
                  InHotel Reservations Agent
                </p>
                <p>
                  I can help you find and book hotels.
                  Ask about destinations, check availability, view hotel options, and make reservations — all in one place.
                </p>
              </div>
            </motion.div>
          )}
          {messages.map((message) => message)}
          <div ref={messagesEndRef} />
        </div>

        <div className="grid sm:grid-cols-2 gap-2 w-full px-4 mb-4">
          {messages.length === 0 &&
            suggestedActions.map((action, index) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.01 * index }}
                key={index}
                className={index > 1 ? "hidden sm:block" : "block"}
              >
                <button
                  onClick={async () => {
                    setMessages((messages) => [
                      ...messages,
                      <Message
                        key={messages.length}
                        role="user"
                        content={action.action}
                      />,
                    ]);
                    const response: ReactNode = await sendMessage(
                      action.action,
                    );
                    setMessages((messages) => [...messages, response]);
                  }}
                  className="w-full text-left border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-300 rounded-lg p-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex flex-col"
                >
                  <span className="font-medium">{action.title}</span>
                  <span className="text-zinc-500 dark:text-zinc-400">
                    {action.label}
                  </span>
                </button>
              </motion.div>
            ))}
        </div>

        <form
          className="flex flex-col gap-2 relative items-center px-4 pb-4"
          onSubmit={async (event) => {
            event.preventDefault();

            setMessages((messages) => [
              ...messages,
              <Message key={messages.length} role="user" content={input} />,
            ]);
            setInput("");

            const response: ReactNode = await sendMessage(input);
            setMessages((messages) => [...messages, response]);
          }}
        >
          <input
            ref={inputRef}
            className="bg-zinc-100 rounded-md px-2 py-1.5 w-full outline-none dark:bg-zinc-700 text-zinc-800 dark:text-zinc-300"
            placeholder="Send a message..."
            value={input}
            onChange={(event) => {
              setInput(event.target.value);
            }}
          />
        </form>
      </div>

      {/* Right side - Hotel Cards */}
      <div className="w-1/2 overflow-y-auto p-4">
        <div className="max-w-[800px] mx-auto">
          {/* Hotel cards will be rendered here */}
        </div>
      </div>
    </div>
  );
}
