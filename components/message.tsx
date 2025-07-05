"use client";

import { motion } from "framer-motion";
import { UserIcon, TriangleCircleIcon } from "./icons";
import { ReactNode } from "react";
import { StreamableValue, useStreamableValue } from "ai/rsc";
import { Markdown } from "./markdown";
import { Hotel } from "./types";

function ensureBullets(markdown: string): string {
  // Convert numbered lists to bullets
  markdown = markdown.replace(/^(\s*)\d+\. /gm, '$1- ');
  // Add a bullet to lines that look like hotel entries but aren't already a list item
  // This regex looks for lines that start with a hotel icon/button or bold hotel name, not already starting with "-" or "•"
  return markdown.replace(
    /^(?![-•])([ \t]*)(\*\*|<span class=\"font-semibold\">|<button|<svg|🏨|🛏️|Hotel )/gm,
    '$1- $2'
  );
}

export const TextStreamMessage = ({
  content,
  hotels = [],
  onHotelClick,
}: {
  content: StreamableValue;
  hotels?: Hotel[];
  onHotelClick?: (hotel: Hotel) => void;
}) => {
  const [text] = useStreamableValue(content);

  console.log("TextStreamMessage props:", { hotels, onHotelClick });

  return (
    <motion.div
      className={`flex flex-row gap-4 px-4 w-full md:px-0 first-of-type:pt-5 font-sans`}
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <div className="size-[24px] flex flex-col justify-center items-center flex-shrink-0 text-zinc-400">
        <TriangleCircleIcon />
      </div>

      <div className="flex flex-col gap-1 w-full">
        <div className="text-zinc-800 flex flex-col gap-4">
          <Markdown hotels={hotels} onHotelClick={onHotelClick}>{ensureBullets(text)}</Markdown>
        </div>
      </div>
    </motion.div>
  );
};

export const Message = ({
  role,
  content,
  hotels = [],
  onHotelClick,
}: {
  role: "assistant" | "user";
  content: string | ReactNode;
  hotels?: Hotel[];
  onHotelClick?: (hotel: Hotel) => void;
}) => {
  console.log("Message props:", { hotels, onHotelClick });
  return (
    <motion.div
      className={`flex flex-row gap-4 px-4 w-full md:px-0 first-of-type:pt-5`}
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <div className="size-[24px] flex flex-col justify-center items-center flex-shrink-0 text-zinc-400">
        {role === "assistant" ? <TriangleCircleIcon /> : <UserIcon />}
      </div>

      <div className="flex flex-col gap-1 w-full">
        <div className="text-zinc-800 flex flex-col gap-4">
          {typeof content === 'string' ? <Markdown hotels={hotels} onHotelClick={onHotelClick}>{ensureBullets(content)}</Markdown> : content}
        </div>
      </div>
    </motion.div>
  );
};
