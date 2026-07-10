"use client";
import { AsciiArt } from "@/components/ui/ascii-art";
 
export function AsciiArtTypewriterDemo() {
  return (
    <AsciiArt
      src="https://assets.aceternity.com/avatars/manu.webp"
      resolution={80}
      color="#fbbf24"
      animationStyle="typewriter"
      inverted
      animateOnView={false}
      className="mx-auto aspect-square w-full max-w-lg bg-neutral-900"
    />
  );
}
Copy
Select Language