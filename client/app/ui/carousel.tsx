import React, { useCallback } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid'
import { Button } from '@heroui/react'

export function EmblaCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 4000, stopOnInteraction: true })])

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  return (
    <div className="flex items-center justify-between w-full mt-12 px-4"> 
      {/*left arrow*/}
      <Button 
        className="bg-[--bark] text-white"
        onPress={scrollPrev}
      >
        <ChevronLeftIcon className="w-6 h-6 text-liver-700" />
      </Button>

      {/*carousel wrapper*/}
      <div className="embla w-full max-w-screen-lg mx-auto overflow-hidden" ref={emblaRef}>
        <div className="embla__container flex h-56">
          <div className="embla__slide flex items-center justify-center w-full flex-shrink-0">
            <img className="w-full h-full object-cover" src="images/slide1.png" alt="cat"  />
          </div>
          <div className="embla__slide flex items-center justify-center w-full flex-shrink-0">
            <img className="w-full h-full object-cover" src="images/slide2.png" alt="dogs" />
          </div>
          <div className="embla__slide flex items-center justify-center w-full flex-shrink-0">
            <img className="w-full h-full object-cover" src="images/slide3.png" alt="" />
          </div>
        </div>
      </div>

      {/*right arrow*/}
      <Button 
        className="bg-[--bark] text-white"
        onPress={scrollNext}
      >
        <ChevronRightIcon className="w-6 h-6 text-liver-700" />
      </Button>
    </div>
  )
}