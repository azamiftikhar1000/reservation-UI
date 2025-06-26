"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

interface ResizablePanelsProps {
  leftPanel: React.ReactNode;
  rightPanel: React.ReactNode;
  minLeftWidth?: number;
  maxLeftWidth?: number;
  defaultLeftWidth?: number;
}

export const ResizablePanels = ({
  leftPanel,
  rightPanel,
  minLeftWidth = 300,
  maxLeftWidth = 800,
  defaultLeftWidth = 50,
}: ResizablePanelsProps) => {
  const [leftWidth, setLeftWidth] = useState(defaultLeftWidth);
  const [isDragging, setIsDragging] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  // Tooltip state
  const [showTooltip, setShowTooltip] = useState(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const newLeftWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;

      // Constrain to min/max values
      const constrainedWidth = Math.max(
        minLeftWidth / containerRect.width * 100,
        Math.min(maxLeftWidth / containerRect.width * 100, newLeftWidth)
      );

      setLeftWidth(constrainedWidth);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isDragging, minLeftWidth, maxLeftWidth]);

  // Expand/collapse button with tooltip
  const ExpandCollapseButton = (
    <div className="sticky top-0 left-0 z-50 p-2 pointer-events-none">
      <div className="relative w-fit pointer-events-auto">
        <button
          onClick={() => setIsExpanded((prev) => !prev)}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          className="bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 shadow rounded-full p-2 flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
          style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
          aria-label={isExpanded ? "Collapse panel" : "Expand panel"}
        >
          {isExpanded ? (
            // Expand icon (arrow right)
            <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><path d="M7 4l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          ) : (
            // Collapse icon (arrow left)
            <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><path d="M13 16l-5-5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          )}
        </button>
        {showTooltip && (
          <div className="absolute left-1/2 -translate-x-1/2 mt-2 flex flex-col items-center">
            <div className="bg-zinc-900 text-white text-xs rounded px-2 py-1 shadow-lg whitespace-nowrap">
              {isExpanded ? "Collapse" : "Expand"}
            </div>
            <div className="w-2 h-2 bg-zinc-900 rotate-45 -mt-1" />
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div
      ref={containerRef}
      className="flex flex-row h-dvh bg-white dark:bg-zinc-900 relative"
    >
      {/* Left Panel */}
      <motion.div
        initial={false}
        animate={{
          width: !isExpanded ? `${leftWidth}%` : 0,
          opacity: !isExpanded ? 1 : 0,
          pointerEvents: !isExpanded ? 'auto' : 'none',
        }}
        transition={isDragging ? { duration: 0, ease: 'linear' } : { type: 'tween', duration: 0.35 }}
        className="flex flex-col justify-between gap-4 border-r border-zinc-200 dark:border-zinc-800 overflow-hidden"
        style={{ display: !isExpanded || leftWidth > 0 ? 'flex' : 'none' }}
      >
        {!isExpanded && leftPanel}
      </motion.div>

      {/* Resizable Divider */}
      {!isExpanded && (
        <div
          className={`relative w-1 bg-zinc-200 dark:bg-zinc-800 cursor-col-resize hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors ${
            isDragging ? "bg-zinc-400 dark:bg-zinc-600" : ""
          }`}
          onMouseDown={handleMouseDown}
        >
          <div className="absolute inset-y-0 -left-1 -right-1" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-8 bg-zinc-400 dark:bg-zinc-600 rounded-full opacity-0 hover:opacity-100 transition-opacity" />
        </div>
      )}

      {/* Right Panel */}
      <motion.div
        initial={false}
        animate={{
          width: isExpanded ? '100%' : `${100 - leftWidth}%`,
          x: isExpanded ? 0 : 0,
        }}
        transition={isDragging ? { duration: 0, ease: 'linear' } : { type: 'tween', duration: 0.35 }}
        className="overflow-y-auto p-4 relative flex-1"
        style={{ minWidth: 0 }}
      >
        {/* Expand/Collapse Button */}
        {ExpandCollapseButton}
        {rightPanel}
      </motion.div>

      {/* Overlay to prevent text selection while dragging */}
      {isDragging && (
        <div className="fixed inset-0 z-50" style={{ pointerEvents: "none" }} />
      )}
    </div>
  );
}; 