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
  const rightPanelRef = useRef<HTMLDivElement>(null);
  // Tooltip state
  const [showTooltip, setShowTooltip] = useState(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  // Smooth scroll animation for expand/collapse
  const handleExpandCollapse = () => {
    const newExpandedState = !isExpanded;
    setIsExpanded(newExpandedState);
    
    // Smooth scroll to top when expanding, or maintain position when collapsing
    if (rightPanelRef.current) {
      if (newExpandedState) {
        // When expanding, smoothly scroll to top
        rightPanelRef.current.scrollTo({
          top: 0,
          behavior: "smooth"
        });
      }
      // When collapsing, maintain current scroll position
    }
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
    <div className="sticky top-4 z-30 bg-transparent w-fit ml-0 mt-0 pointer-events-auto">
      <button
        onClick={handleExpandCollapse}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="bg-white border border-zinc-300 shadow rounded-full p-2 flex items-center justify-center hover:bg-zinc-100 transition-colors"
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
        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 flex items-center z-50">
          {/* Arrow */}
          <div className="w-2 h-2 bg-zinc-900 rotate-45 -ml-1" style={{ marginRight: '-4px' }} />
          {/* Tooltip */}
          <div className="bg-zinc-900 text-white text-xs rounded px-2 py-1 shadow-lg whitespace-nowrap">
            {isExpanded ? "Collapse" : "Expand"}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div
      ref={containerRef}
      className="flex flex-row h-dvh bg-white relative"
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
        {leftPanel}
      </motion.div>

      {/* Resizable Divider */}
      <motion.div
        initial={false}
        animate={{
          width: !isExpanded ? '1px' : 0,
          opacity: !isExpanded ? 1 : 0,
        }}
        transition={isDragging ? { duration: 0, ease: 'linear' } : { type: 'tween', duration: 0.35 }}
        className={`relative bg-transparent cursor-col-resize hover:bg-zinc-100 transition-colors ${
          isDragging ? "bg-zinc-100" : ""
        }`}
        onMouseDown={handleMouseDown}
        style={{ display: !isExpanded ? 'block' : 'none' }}
      />

      {/* Right Panel */}
      <motion.div
        ref={rightPanelRef}
        initial={false}
        animate={{
          width: isExpanded ? '100%' : `${100 - leftWidth}%`,
          x: isExpanded ? 0 : 0,
        }}
        transition={isDragging ? { duration: 0, ease: 'linear' } : { type: 'tween', duration: 0.35 }}
        className="overflow-y-auto relative flex-1"
        style={{ minWidth: 0 }}
      >
        {/* White stripe at the top with expand button */}
        <div className="sticky top-0 z-30 bg-white px-4 py-2">
          <div className="w-fit">
            {ExpandCollapseButton}
          </div>
        </div>
        <div className="p-4">
          {rightPanel}
        </div>
      </motion.div>

      {/* Overlay to prevent text selection while dragging */}
      {isDragging && (
        <div className="fixed inset-0 z-50" style={{ pointerEvents: "none" }} />
      )}
    </div>
  );
}; 