import Header from "@/app/ui/header";

'use client'
export default function Home() {
  return (
    <>
      <div className="ml-30 mr-30 border-black border-2 text-center flex flex-col">
        <h3>Landing Page</h3>
      </div>
    </>
  );
}

import React from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'

export function EmblaCarousel() {
  const [emblaRef] = useEmblaCarousel({ loop: true }, [Autoplay({delay:2000})])

  return (
    <div className="embla">
      <div className="embla viewport max-w-lg mt-12 mx-auto h-56 border" ref={emblaRef}>
        <div className="embla__container h-full">
          <div className="embla__slide flex items-center justify-center">Slide 1</div>
          <div className="embla__slide flex items-center justify-center">Slide 2</div>
          <div className="embla__slide flex items-center justify-center">Slide 3</div>
        </div>
      </div>
      
      <div>

      </div>
    </div>
  )
}

