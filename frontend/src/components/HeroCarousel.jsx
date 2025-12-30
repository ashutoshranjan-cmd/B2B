import { useState, useEffect } from "react";

const slides = [
  { image: "/carousel/c1.webp" },
  { image: "/carousel/c2.webp" },
  { image: "/carousel/c3.webp" },
  { image: "/carousel/c4.webp" },
];

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  const prevSlide = () => {
    setCurrent((current - 1 + slides.length) % slides.length);
  };

  const nextSlide = () => {
    setCurrent((current + 1) % slides.length);
  };

  return (
    <div className="relative w-full mt-14">
      {/* Carousel Box */}
      <div className="relative h-64 md:h-72 bg-white border border-gray-200 overflow-hidden">

        {/* Slide */}
        <img
          src={slides[current].image}
          alt="carousel-banner"
          className="h-full w-full object-contain"
        />

        {/* Left Control */}
        <button
          onClick={prevSlide}
          className="absolute left-0 top-1/2 -translate-y-1/2 
                     h-24 w-10 bg-white shadow-md 
                     flex items-center justify-center 
                     rounded-r-lg hover:bg-gray-100"
        >
          <span className="text-2xl text-gray-600">‹</span>
        </button>

        {/* Right Control */}
        <button
          onClick={nextSlide}
          className="absolute right-0 top-1/2 -translate-y-1/2 
                     h-24 w-10 bg-white shadow-md 
                     flex items-center justify-center 
                     rounded-l-lg hover:bg-gray-100"
        >
          <span className="text-2xl text-gray-600">›</span>
        </button>

        {/* Dots — SAME STYLING, ONLY POSITION CHANGED */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, index) => (
            <span
              key={index}
              className={`h-2 w-6 rounded-full ${
                index === current ? "bg-blue-600" : "bg-gray-300"
              }`}
            />
          ))}
        </div>

      </div>
    </div>
  );
}
