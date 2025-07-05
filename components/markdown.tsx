import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { HotelTextProcessor } from "./hotel-text-processor";
import { Hotel } from "./types";
import { HotelLink } from "./hotel-link";

interface MarkdownProps {
  children: string;
  hotels?: Hotel[];
  onHotelClick?: (hotel: Hotel) => void;
}

export const NonMemoizedMarkdown = ({ children, hotels = [], onHotelClick }: MarkdownProps) => {
  const processChildren = (children: any) => {
    // If children is a string and hotels are available, process it
    if (typeof children === 'string' && hotels.length > 0) {
      return <HotelTextProcessor text={children} hotels={hotels} onHotelClick={onHotelClick} />;
    }
    // If children is an array, process each child
    if (Array.isArray(children) && hotels.length > 0) {
      return children.map((child, idx) =>
        typeof child === 'string'
          ? <HotelTextProcessor key={idx} text={child} hotels={hotels} onHotelClick={onHotelClick} />
          : child
      );
    }
    return children;
  };

  // Factory function to generate components with the latest props
  const getComponents = () => ({
    code: ({ node, inline, className, children, ...props }: any) => {
      const match = /language-(\w+)/.exec(className || "");
      return !inline && match ? (
        <pre
          {...props}
          className={`${className} text-sm w-[80dvw] md:max-w-[500px] overflow-x-scroll bg-zinc-100 p-2 rounded mt-2`}
        >
          <code className={match[1]}>{children}</code>
        </pre>
      ) : (
        <code
          className={`${className} text-sm bg-zinc-100 py-0.5 px-1 rounded`}
          {...props}
        >
          {children}
        </code>
      );
    },
    ol: ({ node, children, ...props }: any) => {
      return (
        <ul className="list-disc list-inside ml-4" {...props}>
          {children}
        </ul>
      );
    },
    li: ({ node, children, ...props }: any) => {
      return (
        <li className="py-1" {...props}>
          {children}
        </li>
      );
    },
    ul: ({ node, children, ...props }: any) => {
      return (
        <ul className="list-disc list-inside ml-4" {...props}>
          {children}
        </ul>
      );
    },
    strong: ({ node, children, ...props }: any) => {
      console.log("strong handler onClick:", onHotelClick);
      if (
        typeof children[0] === "string" &&
        hotels &&
        hotels.some(h => h.name === children[0])
      ) {
        const hotel = hotels.find(h => h.name === children[0]);
        if (!hotel) {
          return <span className="font-semibold" {...props}>{processChildren(children)}</span>;
        }
        return (
          <HotelLink hotel={hotel} onClick={onHotelClick}>
            {children[0]}
          </HotelLink>
        );
      }
      return (
        <span className="font-semibold" {...props}>
          {processChildren(children)}
        </span>
      );
    },
    p: ({ node, children, ...props }: any) => {
      return <p {...props}>{processChildren(children)}</p>;
    },
    h1: ({ node, children, ...props }: any) => <h1 {...props}>{processChildren(children)}</h1>,
    h2: ({ node, children, ...props }: any) => <h2 {...props}>{processChildren(children)}</h2>,
    h3: ({ node, children, ...props }: any) => <h3 {...props}>{processChildren(children)}</h3>,
    h4: ({ node, children, ...props }: any) => <h4 {...props}>{processChildren(children)}</h4>,
    h5: ({ node, children, ...props }: any) => <h5 {...props}>{processChildren(children)}</h5>,
    h6: ({ node, children, ...props }: any) => <h6 {...props}>{processChildren(children)}</h6>,
  });

  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={getComponents()}>
      {children}
    </ReactMarkdown>
  );
};

export const Markdown = React.memo(
  NonMemoizedMarkdown,
  (prevProps, nextProps) => prevProps.children === nextProps.children && prevProps.hotels === nextProps.hotels && prevProps.onHotelClick === nextProps.onHotelClick,
);
