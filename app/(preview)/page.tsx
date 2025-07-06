"use client";

import React from 'react';
import { ReactNode, useEffect, useRef, useState } from "react";
import { useActions, useAIState } from "ai/rsc";
import { Message } from "@/components/message";
import { useScrollToBottom } from "@/components/use-scroll-to-bottom";
import { motion } from "framer-motion";
import Link from "next/link";
import { HotelView } from "@/components/hotel-view";
import { HotelDetailPanel } from "@/components/hotel-detail-panel";
import { ResizablePanels } from "@/components/resizable-panels";
import { Hotel } from "@/components/types";
import { PlusIcon, WaveIcon, SendIcon, TriangleCircleIcon } from "@/components/icons";
import { HotelClickContext } from '@/components/HotelClickContext';
import { useRouter } from "next/navigation";

function useIsDesktop(breakpointPx = 1024) {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    // run only in the browser
    const media = window.matchMedia(`(min-width:${breakpointPx}px)`);
    const handler = () => setIsDesktop(media.matches);

    handler();                     // set initial value
    media.addEventListener("change", handler);   // watch for resizes
    return () => media.removeEventListener("change", handler);
  }, [breakpointPx]);

  return isDesktop;
}

export default function Home() {
  const isDesktop = useIsDesktop(); 
  const { sendMessage } = useActions();
  const [history, setHistory] = useAIState();
  const router = useRouter();

  const [input, setInput] = useState<string>("");
  const [messages, setMessages] = useState<Array<ReactNode>>([]);

  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedHotelName, setSelectedHotelName] = useState<string | null>(null);
  const [isDetailPanelOpen, setIsDetailPanelOpen] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const [messagesContainerRef, messagesEndRef] =
    useScrollToBottom<HTMLDivElement>();

  const selectedHotelNameRef = useRef<string | null>(null);

  const [showNewChatTooltip, setShowNewChatTooltip] = useState(false);
  const [canHover, setCanHover] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCanHover(window.matchMedia("(hover: hover)").matches);
    }
  }, []);

  // Load all hotels on mount for default display
  useEffect(() => {
    if (hotels.length === 0) {
      fetch('/config.json')
        .then(res => res.json())
        .then(data => {
          setHotels(data.allHotels || []);
        });
    }
  }, []);

  useEffect(() => {
    if (history.messages.length > 0) {
      const lastMessage = history.messages[history.messages.length - 1];
      if (lastMessage.role === "tool" && lastMessage.content) {
        const toolCalls = JSON.parse(JSON.stringify(lastMessage.content));
        const findHotelResult = toolCalls.find(
          (call: any) => call.toolName === "findhotel"
        );
  
        if (findHotelResult) {
          const { hotels, searchQuery } = findHotelResult.result;
          setHotels(hotels);
          setSearchQuery(searchQuery);
        }
      }
    }
  }, [history.messages]);

  const handleHotelClick = (hotel: Hotel) => {
    console.log("handleHotelClick called with:", hotel);
    selectedHotelNameRef.current = hotel.name;
    setSelectedHotelName(hotel.name);
    setIsDetailPanelOpen(true);
  };

  const handleCloseDetailPanel = () => {
    setIsDetailPanelOpen(false);
    setSelectedHotelName(null);
  };

  const suggestedActions = [
    { title: "Find", label: "hotels in Paris", action: "Find hotels in Paris" },
    { title: "Check", label: "availability for next weekend", action: "Check availability for next weekend" },
    { title: "Show", label: "rooms with a sea view", action: "Show rooms with sea view" },
    { title: "Book", label: "a room from June 10–12", action: "Book room June 10 to June 12" },
  ];

  // Helper function to wrap AI responses with proper props
  const wrapAIResponse = (response: ReactNode): ReactNode => {
    if (React.isValidElement(response) && response.type === Message) {
      return React.cloneElement(response, {
        ...response.props,
        hotels: hotels,
        onHotelClick: handleHotelClick,
      });
    }
    return response;
  };

  // Left Panel Content
  const handleTopLeftPlusClick = () => {
    setMessages([]);   // Clear chat messages
    setInput("");     // Clear input field
    setHotels(allHotels);      // Reset right panel to all hotels
    setSearchQuery("");       // Clear search query
    setIsDetailPanelOpen(false); // Close hotel detail panel
    setSelectedHotelName(null);  // Clear selected hotel
    router.push("/");  // Navigate to home
  };
  const leftPanelContent = (
    <>
      <section className="flex flex-col h-dvh w-full max-w-5xl py-2 border-r border-zinc-200 thin-scrollbar bg-white">
        <div className="flex-1 overflow-y-auto thin-scrollbar p-5 m-4">
          {/* Sticky New Chat button inside scrollable area */}
          {messages.length > 0 && (
            <div className="sticky top-4 z-30 bg-transparent w-fit ml-0 mt-0">
              <div className="relative inline-block">
                <button
                  className="bg-white border border-zinc-300 shadow rounded-full p-2 flex items-center justify-center hover:bg-zinc-100 transition-colors"
                  aria-label="New chat"
                  type="button"
                  onClick={handleTopLeftPlusClick}
                  onMouseEnter={canHover ? () => setShowNewChatTooltip(true) : undefined}
                  onMouseLeave={canHover ? () => setShowNewChatTooltip(false) : undefined}
                  onFocus={canHover ? () => setShowNewChatTooltip(true) : undefined}
                  onBlur={canHover ? () => setShowNewChatTooltip(false) : undefined}
                >
                  <PlusIcon className="w-5 h-5" />
                </button>
                {canHover && showNewChatTooltip && (
                  <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 flex items-center z-50">
                    {/* Arrow */}
                    <div className="w-2 h-2 bg-zinc-900 rotate-45 -ml-1" style={{ marginRight: '-4px' }} />
                    {/* Tooltip */}
                    <div className="bg-zinc-900 text-white text-xs rounded px-2 py-1 shadow-lg whitespace-nowrap">
                      New Chat
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Message Area */}
          <div
            ref={messagesContainerRef}
            className="flex flex-col gap-3 p-2 sm:p-6 w-full"
          >
            {messages.length === 0 && (
              <motion.div>
                <div className="flex flex-col gap-6 rounded-xl lg:p-5 lg:m-4 sm:p-0 sm:m-0">
                  <h1 className="text-3xl font-bold text-center tracking-tight text-black">
                    InHotel Reservations Agent
                  </h1>
                  <div className="flex flex-row items-start gap-4">
                    <span className="size-[32px] flex flex-col justify-center items-center flex-shrink-0 text-zinc-900 mt-1">
                      <TriangleCircleIcon />
                    </span>
                    <p className="text-lg leading-relaxed text-zinc-600 !text-black">
                      I can help you find and book hotels. Ask about destinations, check
                      availability, view hotel options, and make reservations — all in one
                      place.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Messages */}
            {messages.map((msg, idx) => (
              <div key={idx}>{msg}</div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Buttons fixed just above input */}
        {/* {messages.length === 0 && (
          <div className="w-full px-4 pt-2 pb-4">
            <div className="mx-auto max-w-[500px] grid grid-cols-1 sm:grid-cols-2 gap-2">
              {suggestedActions.map((action, idx) => (
                <motion.button
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={async () => {
                    setInput("");
                    setMessages((messages) => [
                      ...messages,
                      <Message
                        key={messages.length}
                        role="user"
                        content={action.action}
                        hotels={hotels}
                        onHotelClick={handleHotelClick}
                      />,
                    ]);
                    const response: ReactNode = await sendMessage(action.action);
                    setMessages((messages) => [...messages, wrapAIResponse(response)]);
                  }}
                  className="flex flex-col rounded-lg border border-zinc-200 p-2 text-left text-sm text-zinc-800 transition-colors hover:bg-zinc-100"
                >
                  <span className="font-medium">{action.title}</span>
                  <span className="text-zinc-500">{action.label}</span>
                </motion.button>
              ))}
            </div>
          </div>
        )} */}
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (!input.trim()) return;
            setMessages((messages) => [
              ...messages,
              <Message key={messages.length} role="user" content={input} hotels={hotels} onHotelClick={handleHotelClick} />, 
            ]);
            const response: ReactNode = await sendMessage(input.trim());
            setMessages((messages) => [...messages, wrapAIResponse(response)]);
            setInput("");
          }}
          className="pointer-events-none"
        >
          <div className="pointer-events-auto sticky bottom-0 flex flex-col items-center gap-1 p-4">
            <div className="relative w-full max-w-3xl px-2 sm:px-4 md:px-0">
              <input
                ref={inputRef}
                placeholder="Ask anything…"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="peer h-12 sm:h-14 w-full rounded-[28px] border-2 border-black bg-white px-12 sm:px-14 pr-16 sm:pr-20 text-sm text-black outline-none transition-colors focus:border-black"
              />

              {/* Plus icon */}
              <button
                type="button"
                className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-black transition hover:bg-zinc-100"
                onClick={() => {}}
                tabIndex={-1}
                aria-label="Add"
              >
                <PlusIcon className="w-5 h-5 text-black" />
              </button>

              {/* Wave (audio) icon */}
              <button
                type="button"
                className="absolute right-12 sm:right-14 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-black transition hover:bg-zinc-100"
                onClick={() => {}}
                tabIndex={-1}
                aria-label="Audio input"
              >
                <WaveIcon className="w-5 h-5 text-black" />
              </button>

              {/* Send icon */}
              <button
                type="submit"
                className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-black transition hover:bg-zinc-100"
                aria-label="Send"
              >
                <SendIcon className="w-5 h-5 text-black" />
              </button>
            </div>
          </div>
        </form>
      </section>
    </>
  );

  // Show all hotels by default until LLM input (messages.length === 0)
  const [allHotels, setAllHotels] = useState<Hotel[]>([]);
  useEffect(() => {
    fetch('/config.json')
      .then(res => res.json())
      .then(data => {
        setAllHotels(data.allHotels || []);
      });
  }, []);

  // Right Panel Content
  console.log("selectedHotelName:", selectedHotelName, "hotels:", hotels);
  const selectedHotel = hotels.find(h => h.name === selectedHotelName);
  console.log("selectedHotel", selectedHotel, "isDetailPanelOpen", isDetailPanelOpen);
  const rightPanelContent = (
    <div className="thin-scrollbar overflow-y-auto min-h-screen bg-white">
      {selectedHotel && isDetailPanelOpen ? (
        <HotelDetailPanel
          hotel={selectedHotel}
          isOpen={isDetailPanelOpen}
          onClose={handleCloseDetailPanel}
          className={isDesktop ? "lg:relative lg:inset-auto lg:right-0 lg:top-0 lg:shadow-none" : ""}
        />
      ) : (
        <HotelView hotels={messages.length === 0 ? allHotels : hotels} searchQuery={searchQuery} onHotelClick={handleHotelClick} />
      )}
    </div>
  );

  useEffect(() => {
    console.log("useEffect (hotels) running. selectedHotelNameRef:", selectedHotelNameRef.current);
    if (selectedHotelNameRef.current) {
      setSelectedHotelName(selectedHotelNameRef.current);
      setIsDetailPanelOpen(true);
    }
  }, [hotels]);

  return (
    <HotelClickContext.Provider value={handleHotelClick}>
      {isDesktop ? (
        <ResizablePanels
          leftPanel={leftPanelContent}
          rightPanel={rightPanelContent}
          onCloseDetailPanel={handleCloseDetailPanel}
          isDetailPanelOpen={isDetailPanelOpen}
        />
      ) : (
        <div className="flex flex-col lg:h-[100dvh] bg-white">
          <div className="lg:flex-1 lg:min-h-0 lg:overflow-y-auto">
            {leftPanelContent}
          </div>
          <div className="h-px w-full my-2" />
          <div className="px-4 pb-4 lg:flex-none lg:max-h-[45vh] lg:overflow-y-auto">
            {rightPanelContent}
          </div>
        </div>
      )}
    </HotelClickContext.Provider>
  );
}


