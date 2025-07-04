"use client";

import { Text, clx } from "@medusajs/ui";
import { useState, useEffect, useRef } from "react";
import { useScrollSpy } from "@/hooks/utils/use-scroll-spy";
import { useWindowWidth } from "@react-hook/window-size";

export const ScrollSpy = ({ headings }: { headings: { id: string; text: string }[] }) => {
  // const [activeId, setActiveId] = useState<string>("");
  const [indicatorStyle, setIndicatorStyle] = useState<React.CSSProperties>({ top: 0, height: 0 });
  const activeRef = useRef<HTMLAnchorElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { activeId, setActiveId } = useScrollSpy(headings);
  const width = useWindowWidth();

  useEffect(() => {
    if (activeRef.current && containerRef.current) {
      const containerTop = containerRef.current.getBoundingClientRect().top;
      const activeTop = activeRef.current.getBoundingClientRect().top;
      setIndicatorStyle({
        height: activeRef.current.offsetHeight,
        top: activeTop - containerTop,
      });
    }
  }, [activeId, width]);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <AlignLeftIcon />
        <Text className="text-subtle-foreground">On this page</Text>
      </div>
      <div className="grid grid-cols-[16px_1fr] gap-2">
        <div className="relative left-[1px] h-full">
          <div className="relative h-full w-0.5 rounded-full bg-border" ref={containerRef}>
            <span
              className={clx(
                "delay-[50ms] absolute left-0 w-0.5 rounded-full bg-foreground transition-all duration-300 ease-in-out",
              )}
              style={indicatorStyle}
            />
          </div>
        </div>
        <div className="space-y-2.5">
          {headings.map((heading) => (
            <div key={heading.id}>
              <a
                href={`#${heading.id}`}
                ref={activeId === heading.id ? activeRef : null}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(heading.id)?.scrollIntoView({});
                  setTimeout(() => {
                    setActiveId(heading.id);
                  }, 20);
                }}
              >
                <Text
                  size="small"
                  className={clx(
                    "text-subtle-foreground transition-colors",
                    activeId === heading.id && "text-foreground",
                  )}
                >
                  {heading.text}
                </Text>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const AlignLeftIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-4 text-subtle-foreground"
    >
      <path d="M15 12H3" />
      <path d="M17 18H3" />
      <path d="M21 6H3" />
    </svg>
  );
};
