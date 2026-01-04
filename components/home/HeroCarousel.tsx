"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CarouselSlide {
    id: number;
    image: string;
    alt: string;
}

// Placeholder slides - will be populated from web-paroki-content later
const slides: CarouselSlide[] = [
    {
        id: 1,
        image: "https://images.unsplash.com/photo-1548625149-fc4a29cf7092?q=80&w=2072&auto=format&fit=crop",
        alt: "Gereja Santo Yusuf Tambakrejo",
    },
    {
        id: 2,
        image: "https://images.unsplash.com/photo-1438032005730-c779502df39b?q=80&w=2070&auto=format&fit=crop",
        alt: "Gereja Paroki 2",
    },
    {
        id: 3,
        image: "https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?q=80&w=2071&auto=format&fit=crop",
        alt: "Gereja Paroki 3",
    },
];

export default function HeroCarousel() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    useEffect(() => {
        if (!isAutoPlaying) return;

        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000); // Change slide every 5 seconds

        return () => clearInterval(interval);
    }, [isAutoPlaying]);

    const goToSlide = (index: number) => {
        setCurrentSlide(index);
        setIsAutoPlaying(false);
    };

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
        setIsAutoPlaying(false);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
        setIsAutoPlaying(false);
    };

    return (
        <section className="relative h-[500px] md:h-[600px] w-full overflow-hidden bg-gray-900">
            {/* Slides */}
            {slides.map((slide, index) => (
                <div
                    key={slide.id}
                    className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? "opacity-100" : "opacity-0"
                        }`}
                >
                    <Image
                        src={slide.image}
                        alt={slide.alt}
                        fill
                        className="object-cover"
                        priority={index === 0}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50" />
                </div>
            ))}

            {/* Content Overlay */}
            <div className="relative z-10 flex h-full items-center justify-center text-center px-4">
                <div className="max-w-4xl text-white">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight drop-shadow-lg">
                        Selamat Datang di Website Resmi
                    </h1>
                    <p className="text-xl md:text-3xl font-light mb-8 opacity-95 drop-shadow-md">
                        Paroki Brayut - Santo Yohanes Paulus II
                    </p>
                </div>
            </div>

            {/* Navigation Arrows */}
            <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 rounded-full bg-white/30 p-2 backdrop-blur-sm transition-all hover:bg-white/50"
                aria-label="Previous slide"
            >
                <ChevronLeft className="h-6 w-6 text-white" />
            </button>
            <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 rounded-full bg-white/30 p-2 backdrop-blur-sm transition-all hover:bg-white/50"
                aria-label="Next slide"
            >
                <ChevronRight className="h-6 w-6 text-white" />
            </button>

            {/* Dot Indicators */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`h-2 rounded-full transition-all ${index === currentSlide
                            ? "w-8 bg-white"
                            : "w-2 bg-white/50 hover:bg-white/75"
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </section>
    );
}
