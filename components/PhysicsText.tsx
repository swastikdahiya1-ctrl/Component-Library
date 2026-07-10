import { useState, useEffect, useRef } from 'react';

type PhysicsBody = {
  el: HTMLSpanElement;
  x: number;
  y: number;
  vx: number;
  vy: number;
  w: number;
  h: number;
};

export default function PhysicsText() {
  const paragraph = "The quick brown fox jumps over the lazy dog effortlessly. Physics based text interaction allows for truly dynamic typography. This is exactly what makes modern web design absolutely amazing. Elements floating around the screen bouncing off the edges.";
  const text = paragraph.split(" ");
  
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const bodiesRef = useRef<PhysicsBody[]>([]);
  const [isReady, setIsReady] = useState(false);
  const reqRef = useRef<number>();

  useEffect(() => {
    // 1. Initial DOM Measurement
    const init = () => {
      const bodies: PhysicsBody[] = letterRefs.current.map((el) => {
        if (!el) return null;
        const rect = el.getBoundingClientRect();
        return {
          el,
          x: rect.left,
          y: rect.top,
          vx: 0,
          vy: 0,
          w: rect.width,
          h: rect.height,
        };
      }).filter(Boolean) as PhysicsBody[];

      bodiesRef.current = bodies;
      setIsReady(true);

      // Start physics loop next frame after React switches to position: fixed
      requestAnimationFrame(() => {
        startPhysics();
      });
    };

    // Give DOM a tiny moment to ensure fonts are fully loaded/painted
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => setTimeout(init, 100));
    } else {
      setTimeout(init, 200);
    }

    // 2. Physics Engine Setup
    const mouse = { x: -1000, y: -1000, vx: 0, vy: 0 };
    let lastMouseX = -1000;
    let lastMouseY = -1000;

    const handleMove = (e: PointerEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener('pointermove', handleMove);

    const startPhysics = () => {
      const FRICTION = 0.994; // Increased heavily so they slide 60% longer
      const BOUNCE = 0.7; 

      const loop = () => {
        // Calculate mouse velocity (pixels per frame)
        if (lastMouseX !== -1000) {
          mouse.vx = mouse.x - lastMouseX;
          mouse.vy = mouse.y - lastMouseY;
        }
        lastMouseX = mouse.x;
        lastMouseY = mouse.y;

        const bodies = bodiesRef.current;

        // 1. Mouse to Text Collision (Strict Cursor Collision with Sub-stepping)
        for (let i = 0; i < bodies.length; i++) {
          const body = bodies[i];
          
          let isColliding = false;
          // Sub-step the mouse movement to prevent teleporting through words during fast flicks
          const steps = Math.max(1, Math.ceil((Math.abs(mouse.vx) + Math.abs(mouse.vy)) / 10));
          
          for(let s = 0; s <= steps; s++) {
             const t = s / steps; 
             const checkX = (lastMouseX - mouse.vx) + mouse.vx * t;
             const checkY = (lastMouseY - mouse.vy) + mouse.vy * t;
             
             if (checkX >= body.x && checkX <= body.x + body.w && checkY >= body.y && checkY <= body.y + body.h) {
                isColliding = true;
                break;
             }
          }

          if (isColliding) {
            // Applied instantly (0.5ms delay is virtually 0 frames, so applied immediately to save memory allocations)
            body.vx += mouse.vx * 0.1;
            body.vy += mouse.vy * 0.1;
            
            if (mouse.vx === 0 && mouse.vy === 0) {
              const cx = body.x + body.w / 2;
              const cy = body.y + body.h / 2;
              body.vx += (cx - mouse.x) * 0.005;
              body.vy += (cy - mouse.y) * 0.005;
            }
          }
        }

        // 2. Text to Text Collision was removed as requested.

        // 3. Movement, Bounds, and Rendering
        for (let i = 0; i < bodies.length; i++) {
          const body = bodies[i];

          body.vx *= FRICTION;
          body.vy *= FRICTION;

          body.x += body.vx;
          body.y += body.vy;

          if (body.x < 0) { 
            body.x = 0; 
            body.vx *= -BOUNCE; 
          }
          if (body.x + body.w > window.innerWidth) { 
            body.x = window.innerWidth - body.w; 
            body.vx *= -BOUNCE; 
          }
          if (body.y < 0) { 
            body.y = 0; 
            body.vy *= -BOUNCE; 
          }
          if (body.y + body.h > window.innerHeight) { 
            body.y = window.innerHeight - body.h; 
            body.vy *= -BOUNCE; 
          }

          body.el.style.transform = `translate3d(${body.x}px, ${body.y}px, 0)`;
        }

        reqRef.current = requestAnimationFrame(loop);
      };
      
      loop();
    };

    return () => {
      window.removeEventListener('pointermove', handleMove);
      if (reqRef.current) cancelAnimationFrame(reqRef.current);
    };
  }, []);

  let globalCharIndex = 0;

  return (
    <div className="w-full h-screen bg-black overflow-hidden flex items-center justify-center cursor-crosshair px-12">
      <div className="flex flex-wrap justify-center gap-x-3 gap-y-2 font-normal text-3xl text-white select-none max-w-3xl text-center leading-relaxed">
        {text.map((word, wIdx) => (
          <span key={wIdx} className="inline-flex whitespace-nowrap">
            {word.split("").map((char, cIdx) => {
              const currentIdx = globalCharIndex++;
              return (
                <span
                  key={cIdx}
                  ref={(el) => (letterRefs.current[currentIdx] = el)}
                  style={{
                    position: isReady ? 'fixed' : 'relative',
                    left: 0,
                    top: 0,
                    transform: isReady ? `translate3d(${bodiesRef.current[currentIdx]?.x || 0}px, ${bodiesRef.current[currentIdx]?.y || 0}px, 0)` : 'none',
                    ...(isReady ? {} : { left: 'auto', top: 'auto' }),
                  }}
                  className="inline-block"
                >
                  {char}
                </span>
              );
            })}
          </span>
        ))}
      </div>
    </div>
  );
}
