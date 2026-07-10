import { useState, useEffect, useRef } from 'react';

type PhysicsBody = {
  el: HTMLSpanElement;
  x: number;
  y: number;
  vx: number;
  vy: number;
  w: number;
  h: number;
  origX: number;
  origY: number;
  scale: number;
};

export default function PhysicsText2() {
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
          origX: rect.left,
          origY: rect.top,
          scale: 1,
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
      const FRICTION = 0.994; // Normal interaction friction
      const BOUNCE = 0.7; 

      let state: 'IDLE' | 'COUNTDOWN' | 'BLACKHOLE' = 'IDLE';
      let countdownStartTime = 0;
      let blackholeStartTime = 0;

      const loop = () => {
        const now = performance.now();

        // Calculate mouse velocity (pixels per frame)
        if (lastMouseX !== -1000) {
          mouse.vx = mouse.x - lastMouseX;
          mouse.vy = mouse.y - lastMouseY;
        }
        lastMouseX = mouse.x;
        lastMouseY = mouse.y;

        const bodies = bodiesRef.current;
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

        if (state === 'COUNTDOWN') {
          if (now - countdownStartTime > 5000) {
            state = 'BLACKHOLE';
            blackholeStartTime = now;
          }
        }

        if (state === 'BLACKHOLE') {
          const timeInBlackhole = now - blackholeStartTime;
          // Cubic ease-in curve over 4 seconds: starts extremely slow and ramps up to full speed
          const progress = Math.min(1, timeInBlackhole / 4000);
          const ramp = progress * progress * progress;

          let allSuckedIn = true;

          for (let i = 0; i < bodies.length; i++) {
            const body = bodies[i];
            
            const dx = centerX - (body.x + body.w / 2);
            const dy = centerY - (body.y + body.h / 2);
            // Protect against 0 distance
            const dist = Math.max(1, Math.sqrt(dx * dx + dy * dy));

            const normalizedX = dx / dist;
            const normalizedY = dy / dist;

            // Gravity increases as it gets closer, but we clamp the denominator to 50 
            // so we don't get infinite gravity causing infinite slingshotting!
            const gravityForce = (2.0 + 3000 / Math.max(50, dist)) * ramp; 
            const pullX = normalizedX * gravityForce;
            const pullY = normalizedY * gravityForce;

            // Spin force is lower near the center to prevent wild orbits
            const spinForce = (5.0 * (dist / 800)) * ramp; 
            const spinX = -normalizedY * spinForce;
            const spinY = normalizedX * spinForce;

            // Heavy air resistance (0.8) 
            body.vx = body.vx * 0.8 + pullX + spinX;
            body.vy = body.vy * 0.8 + pullY + spinY;

            // CRITICAL EVENT HORIZON FIX: Prevent slingshot overshooting!
            // If they travel faster than their distance to the center, they shoot past it and orbit forever.
            // We force them to slow down right as they hit the singularity (like time dilation).
            if (dist < 200) {
              const speed = Math.sqrt(body.vx * body.vx + body.vy * body.vy);
              const maxSpeed = Math.max(1, dist * 0.15); // Cannot travel more than 15% of the remaining distance per frame
              if (speed > maxSpeed) {
                body.vx = (body.vx / speed) * maxSpeed;
                body.vy = (body.vy / speed) * maxSpeed;
              }
            }

            // Fisheye scale effect: as they cross the 300px threshold, they shrink
            if (dist < 300) {
              body.scale = Math.max(0, dist / 300);
            } else {
              body.scale = 1;
            }

            // Once scale hits 0.02 (dist < 6px), they are basically gone
            if (body.scale > 0.02) {
              allSuckedIn = false;
            }

            body.x += body.vx;
            body.y += body.vy;
            body.el.style.transform = `translate3d(${body.x}px, ${body.y}px, 0) scale(${body.scale})`;
          }

          // Reset everything once they vanish into the singularity, wait 1.5 seconds for effect
          if (allSuckedIn && timeInBlackhole > 1500) {
            for (let i = 0; i < bodies.length; i++) {
              const body = bodies[i];
              body.x = body.origX;
              body.y = body.origY;
              body.vx = 0;
              body.vy = 0;
              body.scale = 1;
              body.el.style.transform = `translate3d(${body.x}px, ${body.y}px, 0) scale(1)`;
            }
            state = 'IDLE';
          }

        } else {
          // IDLE or COUNTDOWN normal physics
          for (let i = 0; i < bodies.length; i++) {
            const body = bodies[i];
            
            let isColliding = false;
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
              // Trigger countdown on first touch
              if (state === 'IDLE') {
                state = 'COUNTDOWN';
                countdownStartTime = performance.now();
              }

              body.vx += mouse.vx * 0.1;
              body.vy += mouse.vy * 0.1;
              
              if (mouse.vx === 0 && mouse.vy === 0) {
                const cx = body.x + body.w / 2;
                const cy = body.y + body.h / 2;
                body.vx += (cx - mouse.x) * 0.005;
                body.vy += (cy - mouse.y) * 0.005;
              }
            }

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

            body.el.style.transform = `translate3d(${body.x}px, ${body.y}px, 0) scale(1)`;
          }
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
    <div className="w-full h-screen bg-black overflow-hidden flex items-center justify-center cursor-crosshair px-12 relative">
      <div className="flex flex-wrap justify-center gap-x-3 gap-y-2 font-normal text-3xl text-white select-none max-w-3xl text-center leading-relaxed z-10">
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
                    transform: isReady ? `translate3d(${bodiesRef.current[currentIdx]?.origX || 0}px, ${bodiesRef.current[currentIdx]?.origY || 0}px, 0) scale(1)` : 'none',
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
      
      {/* Background hint */}
      <div className="absolute inset-0 pointer-events-none flex items-end justify-center pb-8 opacity-30">
        <p className="text-zinc-500 font-mono text-sm">Disrupt text and wait 5 seconds for Blackhole</p>
      </div>
    </div>
  );
}
