import React, { useCallback } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid'

export function EmblaCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  return (
    <div className="flex items-center justify-between w-full mt-12 px-4"> 
      {/*left arrow*/}
      <button 
        className="p-1 m-1 bg-transparent border-none focus:outline-none hover:bg-transparent active:bg-transparent"
        onClick={scrollPrev}
      >
        <ChevronLeftIcon className="w-10 h-10 text-liver-700" />
      </button>

      {/*carousel wrapper*/}
      <div className="embla w-full max-w-screen-lg mx-auto overflow-hidden" ref={emblaRef}>
        <div className="embla__container flex h-56">
          <div className="embla__slide flex items-center justify-center w-full flex-shrink-0">
            <img className="w-full h-full object-cover" src="images/resource2d.webp" alt="cat"  />
          </div>
          <div className="embla__slide flex items-center justify-center w-full flex-shrink-0">
            <img className="w-full h-full object-cover" src="images/resource2b.png" alt="dogs" />
          </div>
          <div className="embla__slide flex items-center justify-center w-full flex-shrink-0">
            <img className="w-full h-full object-cover" src="images/slide3.png" alt="" />
          </div>
        </div>
      </div>

      {/*right arrow*/}
      <button 
        onClick={scrollNext}
        className="p-1 m-1 bg-transparent border-none focus:outline-none hover:bg-transparent active:bg-transparent"
      >
        <ChevronRightIcon className="w-10 h-10 text-liver-700" />
      </button>
    </div>
  )
}