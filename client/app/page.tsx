'use client'

import { EmblaCarousel } from "./ui/carousel";

export default function Landing() {

  return (
    <>
      <div>
        <EmblaCarousel/>
      </div>
      <div className="w-full max-w-256 m-auto border-2 border-var(--dark-brown) p-4 text-center rounded-lg mt-6">
        Our mission: 
      </div>

    </>
  );
}

