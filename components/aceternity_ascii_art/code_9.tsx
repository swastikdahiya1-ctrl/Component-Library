"use client";
import { AsciiArt } from "@/components/ui/ascii-art";
 
export function AsciiArtCirclesDemo() {
  return (
    <AsciiArt
      src="https://assets.aceternity.com/avatars/manu.webp"
      resolution={80}
      charset="circles"
      color="#eab308"
      inverted
      animated={false}
      className="mx-auto aspect-square w-full max-w-lg bg-neutral-950"
    />
  );
}
Copy
Select Language