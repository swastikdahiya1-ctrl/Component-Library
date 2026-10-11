import { useEffect, useRef, type RefObject } from "react";

// Gallery-only input playback. The source components and their motion settings
// remain untouched; these are the same events their live previews receive.
export function PreviewAutoplay({
  id,
  root,
  enabled,
}: {
  id: string;
  root: RefObject<HTMLDivElement | null>;
  enabled: boolean;
}) {
  const timers = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());
  const frames = useRef<Set<number>>(new Set());
  useEffect(() => {
    if (!enabled || !root.current || id === "typewriter") return;
    const stage = root.current;
    const pendingTimers = timers.current;
    const pendingFrames = frames.current;
    let stopped = false;
    let hovered: HTMLElement | null = null;
    function later(delay: number, action: () => void) {
      const timer = setTimeout(() => {
        pendingTimers.delete(timer);
        if (!stopped) action();
      }, delay);
      pendingTimers.add(timer);
    }
    function target(selector: string, index = 0) {
      return stage.querySelectorAll<HTMLElement>(selector)[index];
    }
    function button(text: string) {
      return [...stage.querySelectorAll<HTMLButtonElement>("button")].find(
        (el) => el.textContent?.trim() === text,
      );
    }
    function click(element?: HTMLElement) {
      element?.click();
    }
    function point(
      element: HTMLElement,
      type: string,
      x: number,
      y: number,
      buttons = 0,
    ) {
      element.dispatchEvent(
        new PointerEvent(type, {
          bubbles: true,
          pointerType: "mouse",
          pointerId: 1,
          isPrimary: true,
          button: 0,
          buttons,
          clientX: x,
          clientY: y,
          view: window,
        }),
      );
    }
    function hover(element?: HTMLElement, position?: [number, number]) {
      if (!element) return;
      const rect = element.getBoundingClientRect();
      const [x, y] = position || [
        rect.left + rect.width / 2,
        rect.top + rect.height / 2,
      ];
      if (hovered !== element) {
        if (hovered) {
          hovered.dispatchEvent(
            new MouseEvent("mouseout", {
              bubbles: true,
              relatedTarget: element,
              clientX: x,
              clientY: y,
            }),
          );
          point(hovered, "pointerleave", x, y);
        }
        element.dispatchEvent(
          new MouseEvent("mouseover", {
            bubbles: true,
            relatedTarget: hovered,
            clientX: x,
            clientY: y,
          }),
        );
        point(element, "pointerenter", x, y);
        hovered = element;
      }
      element.dispatchEvent(
        new MouseEvent("mousemove", { bubbles: true, clientX: x, clientY: y }),
      );
      point(element, "pointermove", x, y);
    }
    function leave() {
      if (!hovered) return;
      hovered.dispatchEvent(
        new MouseEvent("mouseout", {
          bubbles: true,
          relatedTarget: document.body,
          clientX: 30,
          clientY: 30,
        }),
      );
      point(hovered, "pointerleave", 30, 30);
      hovered = null;
    }
    function sweep(
      element: HTMLElement | undefined,
      from: [number, number],
      to: [number, number],
      duration: number,
      drag = false,
    ) {
      if (!element) return;
      const start = performance.now();
      if (drag) point(element, "pointerdown", ...from, 1);
      function tick(now: number) {
        if (stopped) return;
        const progress = Math.min(1, (now - start) / duration);
        const x = from[0] + (to[0] - from[0]) * progress;
        const y = from[1] + (to[1] - from[1]) * progress;
        point(element!, "pointermove", x, y, drag ? 1 : 0);
        element!.dispatchEvent(
          new MouseEvent("mousemove", {
            bubbles: true,
            clientX: x,
            clientY: y,
          }),
        );
        if (progress < 1) {
          const frame = requestAnimationFrame((time) => {
            pendingFrames.delete(frame);
            tick(time);
          });
          pendingFrames.add(frame);
        } else if (drag) point(element!, "pointerup", x, y);
      }
      tick(start);
    }
    function cycle() {
      let duration = 8000;
      switch (id) {
        case "perspective-deck":
          [0, 2400, 4800].forEach((time) =>
            later(time, () => click(target('[aria-label="Next card"]'))),
          );
          break;
        case "shutter-switcher":
          [0, 2400, 4800].forEach((time) =>
            later(time, () => click(target('[aria-label="Next composition"]'))),
          );
          break;
        case "focus-cards":
          [1, 2, 0, 1].forEach((index, i) =>
            later(i * 1800, () => {
              hover(target("button", index));
              click(target("button", index));
            }),
          );
          later(6500, leave);
          break;
        case "expandable-dock":
          [1, 2, 3, 4, 0, 2].forEach((index, i) =>
            later(i * 1000, () => {
              hover(target("button", index));
              click(target("button", index));
            }),
          );
          later(6500, leave);
          break;
        case "rolling-counter":
          [0, 2300, 4600].forEach((time) =>
            later(time, () =>
              click(target('[aria-label="Cycle sample values"]')),
            ),
          );
          break;
        case "sliding-tabs":
          [1, 2, 0].forEach((index, i) =>
            later(i * 2300, () => click(target('[role="tab"]', index))),
          );
          break;
        case "filterable-list":
          ["Docs", "Images", "Video", "All"].forEach((name, i) =>
            later(i * 1800, () => click(button(name))),
          );
          break;
        case "process-stepper":
          [0, 1900, 3800, 6200].forEach((time) =>
            later(time, () => click(target("button"))),
          );
          break;
        case "swipe-actions":
          click(target('[aria-label="Show actions"]'));
          later(2600, () => click(target('[aria-label="Archive message"]')));
          later(5200, () => click(target('[aria-label="Restore message"]')));
          break;
        case "hold-to-confirm": {
          const item = target('[aria-label="Hold to confirm"]');
          if (item) {
            const rect = item.getBoundingClientRect();
            point(
              item,
              "pointerdown",
              rect.left + rect.width / 2,
              rect.top + rect.height / 2,
              1,
            );
            later(1500, () =>
              point(
                item,
                "pointerup",
                rect.left + rect.width / 2,
                rect.top + rect.height / 2,
              ),
            );
          }
          later(4600, () => click(button("Reset confirmation")));
          break;
        }
        case "studio-hover-anim":
          [0, 1, 2].forEach((row, i) =>
            later(i * 2000, () => hover(target(".cursor-pointer", row))),
          );
          later(6200, leave);
          break;
        case "mega-menu":
          [0, 1, 2].forEach((item, i) =>
            later(i * 1900, () => hover(target(".cursor-pointer", item))),
          );
          later(6000, leave);
          break;
        case "radial-menu":
          click(target("button:last-child"));
          later(3400, () => click(target("button:last-child")));
          break;
        case "menu-bar":
          click(button("File"));
          later(2100, () => hover(button("Edit")));
          later(4200, () => hover(button("View")));
          later(6500, () =>
            stage.dispatchEvent(new MouseEvent("mousedown", { bubbles: true })),
          );
          break;
        case "context-menu": {
          target(".min-h-screen")?.dispatchEvent(
            new MouseEvent("contextmenu", {
              bubbles: true,
              cancelable: true,
              button: 2,
              clientX: 300,
              clientY: 80,
            }),
          );
          later(4500, () =>
            stage.dispatchEvent(new MouseEvent("mousedown", { bubbles: true })),
          );
          break;
        }
        case "animated-sidebar":
          click(target("button"));
          later(4000, () => click(target("button")));
          break;
        case "magnetic-cursor": {
          const item = target("button");
          if (item) {
            hover(item);
            const rect = item.getBoundingClientRect();
            later(1000, () =>
              sweep(
                item,
                [rect.left + 20, rect.top + 15],
                [rect.right - 20, rect.bottom - 15],
                1500,
              ),
            );
          }
          later(4300, leave);
          break;
        }
        case "hover-image-reveal":
          [0, 1, 2].forEach((item, i) =>
            later(i * 2200, () =>
              hover(target(".cursor-pointer", item), [
                270 + item * 35,
                210 + item * 25,
              ]),
            ),
          );
          later(6800, leave);
          duration = 9000;
          break;
        case "alert-dialog":
          click(button("Open Dialog"));
          later(2300, () => hover(button("Continue")));
          later(3400, leave);
          later(4800, () => click(button("Cancel")));
          break;
        case "toaster":
          [0, 850, 1700].forEach((time) =>
            later(time, () => click(button("Add toast"))),
          );
          duration = 9000;
          break;
        case "ios-slider": {
          const item =
            target('[style*="translateY"]') || target(".absolute.inset-0");
          if (item) {
            const rect = item.getBoundingClientRect();
            const x = rect.left + rect.width / 2;
            sweep(item, [x, rect.top + 35], [x, rect.top + 115], 1100, true);
            later(2900, () => {
              const next = item.getBoundingClientRect();
              sweep(item, [x, next.top + 35], [x, next.top - 115], 1200, true);
            });
          }
          break;
        }
        case "chat-interface":
          click(target("button", 1));
          later(3500, () => click(target("button", 1)));
          later(8000, () => click(target("button")));
          duration = 11000;
          break;
        case "accordion":
          click(target("button"));
          later(2800, () => click(target("button", 1)));
          later(5800, () => click(target("button", 1)));
          duration = 9000;
          break;
        case "copy-button":
          click(target("button"));
          later(3600, () => click(button("Reset State")));
          break;
        case "physics-text-2": {
          const letter = target("span.inline-block");
          const container = target(".cursor-crosshair");
          if (letter && container) {
            const rect = letter.getBoundingClientRect();
            sweep(
              container,
              [rect.left, rect.top + rect.height / 2],
              [rect.left + 300, rect.top + rect.height / 2],
              1000,
            );
            later(1200, () => point(container, "pointerleave", -1000, -1000));
          }
          duration = 19000;
          break;
        }
      }
      later(duration, cycle);
    }
    later(900, cycle);
    return () => {
      stopped = true;
      pendingTimers.forEach(clearTimeout);
      pendingTimers.clear();
      pendingFrames.forEach(cancelAnimationFrame);
      pendingFrames.clear();
    };
  }, [id, root, enabled]);
  return null;
}
