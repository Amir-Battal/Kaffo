import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import CarouselProblemCard from "./CarouselProblemCard"

export function ProblemsCarousel() {
  return (
    <Carousel
      opts={{
        align: "start",
      }}
      className="mx-20 mt-10"
      dir="ltr"
    >
      <CarouselContent>
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
            <CarouselProblemCard />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="cursor-pointer" />
      <CarouselNext className="cursor-pointer" />
    </Carousel>
  )
}
