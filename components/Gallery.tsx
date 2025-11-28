'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase';

const Gallery = () => {
    const [images, setImages] = useState<string[]>([]);
    const [activeIndex, setActiveIndex] = useState(3);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        const fetchImages = async () => {
            const { data, error } = await supabase
                .storage
                .from('gallery')
                .list('', {
                    limit: 100,
                    offset: 0,
                    sortBy: { column: 'name', order: 'asc' },
                });

            if (error) {
                console.error('Error fetching gallery images:', error);
            } else if (data && data.length > 0) {
                const imageUrls = data
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    .filter((file: any) => file.name !== '.emptyFolderPlaceholder') // Filter out placeholder
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    .map((file: any) => {
                        const { data: { publicUrl } } = supabase
                            .storage
                            .from('gallery')
                            .getPublicUrl(file.name);
                        return publicUrl;
                    });

                if (imageUrls.length > 0) {
                    setImages(imageUrls);
                    setActiveIndex(Math.floor(imageUrls.length / 2)); // Start in the middle
                }
            }
        };

        fetchImages();
    }, []);

    useEffect(() => {
        if (!isAutoPlaying || images.length === 0) return;
        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % images.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [isAutoPlaying, images.length]);

    const handleNext = () => {
        if (images.length === 0) return;
        setActiveIndex((prev) => (prev + 1) % images.length);
        setIsAutoPlaying(false);
    };

    const handlePrev = () => {
        if (images.length === 0) return;
        setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
        setIsAutoPlaying(false);
    };

    const getStyles = (index: number) => {
        if (images.length === 0) return { opacity: 0, display: 'none' };

        const diff = (index - activeIndex + images.length) % images.length;
        // Adjust diff to be between -length/2 and length/2
        const centeredDiff = diff > images.length / 2 ? diff - images.length : diff < -images.length / 2 ? diff + images.length : diff;

        const absDiff = Math.abs(centeredDiff);
        const isVisible = absDiff <= 2; // Only show 2 items on each side

        if (!isVisible) return { opacity: 0, display: 'none' };

        const zIndex = 10 - absDiff;
        const scale = 1 - absDiff * 0.15;
        const translateX = centeredDiff * 60; // Percentage overlap
        const rotateY = centeredDiff * -25; // Rotation angle
        const opacity = 1 - absDiff * 0.3;
        const blur = absDiff * 2;

        return {
            transform: `translateX(${translateX}%) scale(${scale}) perspective(1000px) rotateY(${rotateY}deg)`,
            zIndex,
            opacity,
            filter: `blur(${blur}px)`,
            display: 'block'
        };
    };



    return (
        <section className="py-12 md:py-20 px-4 bg-gradient-to-b from-white to-pink-50 overflow-hidden">
            <div className="max-w-6xl mx-auto text-center">
                <h2 className="text-3xl md:text-5xl font-bold mb-2 md:mb-4 text-gray-900">
                    Capturing <span className="text-pink-500">Moments</span>
                </h2>
                <p className="text-gray-500 mb-10 md:mb-16 max-w-2xl mx-auto text-sm md:text-base">
                    Glimpses of our journey, workshops, and the beautiful souls we&apos;ve connected with along the way.
                </p>

                <div className="relative h-[300px] md:h-[500px] flex items-center justify-center perspective-1000">
                    {images.map((src, index) => {
                        const styles = getStyles(index);
                        return (
                            <div
                                key={index}
                                className="absolute w-[200px] md:w-[400px] aspect-[3/4] rounded-2xl md:rounded-3xl shadow-2xl transition-all duration-500 ease-out cursor-pointer bg-white border-2 md:border-4 border-white"
                                style={styles}
                                onClick={() => {
                                    setActiveIndex(index);
                                    setIsAutoPlaying(false);
                                }}
                            >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={src}
                                    alt={`Gallery image ${index + 1}`}
                                    className="w-full h-full object-cover rounded-2xl"
                                />
                                <div className={cn(
                                    "absolute inset-0 bg-black/20 rounded-2xl transition-opacity duration-500",
                                    index === activeIndex ? "opacity-0" : "opacity-100"
                                )}></div>
                            </div>
                        );
                    })}

                    {/* Navigation Buttons */}
                    <button
                        onClick={handlePrev}
                        className="absolute left-4 md:left-10 z-20 w-12 h-12 bg-white/80 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center text-gray-800 hover:bg-pink-500 hover:text-white transition-all"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                        onClick={handleNext}
                        className="absolute right-4 md:right-10 z-20 w-12 h-12 bg-white/80 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center text-gray-800 hover:bg-pink-500 hover:text-white transition-all"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>
                </div>

                {/* Dots */}
                <div className="flex justify-center gap-2 mt-8">
                    {images.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                setActiveIndex(index);
                                setIsAutoPlaying(false);
                            }}
                            className={cn(
                                "w-2 h-2 rounded-full transition-all duration-300",
                                index === activeIndex ? "w-8 bg-pink-500" : "bg-gray-300 hover:bg-pink-300"
                            )}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Gallery;
