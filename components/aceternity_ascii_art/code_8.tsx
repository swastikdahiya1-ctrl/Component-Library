"use client";
import { AsciiArt } from "@/components/ui/ascii-art";
 
export function AsciiArtDenseDemo() {
  return (
    <AsciiArt
      src="https://assets.aceternity.com/avatars/manu.webp"
      resolution={80}
      charset="dense"
      color="#f97316"
      inverted
      animated={false}
      className="mx-auto aspect-square w-full max-w-lg bg-neutral-950"
    />
  );
}
Copy
Select Language