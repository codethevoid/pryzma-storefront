import { useEffect, useState } from "react";

export function useScrollSpy(headings: { id: string; text: string }[]) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const mdxContainer = document.querySelector("[data-mdx-container]") as HTMLElement;
    if (!mdxContainer) return;

    const offsetTop = mdxContainer.offsetTop - 1;
    const siblings = new Map();

    // Build siblings map
    headings.forEach(({ id }, index) => {
      const element = document.getElementById(id);
      if (element) {
        siblings.set(element, {
          prev: index > 0 ? document.getElementById(headings[index - 1].id) : null,
          next:
            index < headings.length - 1 ? document.getElementById(headings[index + 1].id) : null,
        });
      }
    });

    const checkVisibleHeadings = () => {
      const visibleHeading = headings.find(({ id }) => {
        const element = document.getElementById(id);
        if (!element) return false;
        const rect = element.getBoundingClientRect();
        return rect.top >= offsetTop && rect.bottom <= window.innerHeight;
      });

      if (visibleHeading) {
        setActiveId(visibleHeading.id);
      } else {
        setActiveId(headings[0].id);
      }
    };

    checkVisibleHeadings();

    const observer = new IntersectionObserver(
      (entries) => {
        let currentEntry = entries[0];
        if (!currentEntry) return;

        const offsetBottom = (currentEntry.rootBounds?.height || 0) * 0.3 + offsetTop;

        for (let i = 1; i < entries.length; i++) {
          const entry = entries[i];
          if (!entry) break;

          if (
            entry.boundingClientRect.top < currentEntry.boundingClientRect.top ||
            currentEntry.boundingClientRect.bottom < offsetTop
          ) {
            currentEntry = entry;
          }
        }

        let target: Element | undefined = currentEntry.target;

        // if the target is too high up, we need to find the next sibling
        while (target && target.getBoundingClientRect().bottom < offsetTop) {
          target = siblings.get(target)?.next;
        }

        // if the target is too low, we need to find the previous sibling
        while (target && target.getBoundingClientRect().top > offsetBottom) {
          target = siblings.get(target)?.prev;
        }

        if (target) setActiveId(target.id);
      },
      {
        threshold: 1,
        rootMargin: `-${offsetTop}px 0px 0px 0px`,
      },
    );

    headings.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [headings]);

  return { activeId: activeId, setActiveId };
}
