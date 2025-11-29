'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';

const Hero = () => {
    const supabase = createClient();
    const { data: { publicUrl } } = supabase.storage.from('static-assets').getPublicUrl('logo.png');

    return (
        <section className="relative min-h-[80vh] pt-2 pb-2 md:pt-8 md:pb-8 flex flex-col items-center justify-center text-center px-4 md:px-6 bg-gradient-to-b from-white via-pink-50/30 to-white overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute top-20 left-0 w-96 h-96 bg-gradient-to-br from-pink-200/40 to-orange-200/40 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-40 right-0 w-80 h-80 bg-gradient-to-br from-rose-200/40 to-pink-200/40 rounded-full blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-br from-orange-200/30 to-pink-200/30 rounded-full blur-3xl animate-pulse delay-500"></div>

            <div className="relative z-10 max-w-4xl mx-auto">
                {/* Logo Placeholder */}
                <div className="mb-2 md:mb-2 w-32 h-32 md:w-48 md:h-48 flex items-center justify-center p-2 mx-auto">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={publicUrl} alt="Pranspanda Logo" className="w-full h-full object-contain" />
                </div>

                <h1 className="text-4xl md:text-8xl font-black mb-2 md:mb-2 tracking-tight font-dancing-script">
                    <span className="bg-gradient-to-r from-pink-600 via-rose-500 to-orange-500 bg-clip-text text-transparent">
                        Pranspanda
                    </span>
                </h1>

                <h2 className="text-lg md:text-3xl font-medium text-gray-600 mb-2 md:mb-2">
                    A Youth Society
                </h2>

                <p className="text-gray-500 mb-6 md:mb-6 max-w-2xl mx-auto text-[10px] md:text-lg font-light tracking-wide whitespace-nowrap">
                    Guiding Youth Through Mindfulness, Healing & Conscious Growth
                </p>

                <div className="flex items-center justify-center gap-1 md:gap-4 mb-6 md:mb-6 whitespace-nowrap">
                    <span className="text-pink-400 text-sm md:text-2xl animate-pulse">✨</span>
                    <h3 className="text-sm md:text-4xl font-bold text-gray-800">
                        Balance Within, <span className="text-pink-500">Brilliance Outside</span>
                    </h3>
                    <span className="text-pink-400 text-sm md:text-2xl animate-pulse">✨</span>
                </div>

                <p className="text-gray-600 mb-8 md:mb-12 max-w-4xl mx-auto leading-relaxed text-sm md:text-lg">
                    Empowering youth to overcome emotional struggles, unlock potential, and live consciously.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 md:gap-6 justify-center items-center">
                    <Link href="https://www.instagram.com/pranspanda.vitbhopal/?g=5" className="w-3/4 sm:w-auto">
                        <Button className="w-3/4 sm:w-auto bg-gradient-to-r from-pink-500 to-orange-400 hover:from-pink-600 hover:to-orange-500 text-white rounded-full px-6 py-2 md:px-10 md:py-7 text-sm md:text-lg shadow-xl shadow-pink-200 transition-all hover:scale-105 hover:shadow-2xl border-0 h-auto">
                            Join the Youth Community <ArrowRight className="ml-2 w-4 h-4 md:w-5 md:h-5" />
                        </Button>
                    </Link>

                    <Link href="/book" className="w-3/4 sm:w-auto">
                        <Button variant="outline" className="w-full border-2 border-pink-200 text-pink-600 hover:bg-pink-50 hover:border-pink-300 rounded-full px-6 py-2 md:px-10 md:py-7 text-sm md:text-lg font-medium transition-all hover:scale-105 bg-white/50 backdrop-blur-sm h-auto">
                            Book Your Session Now
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default Hero;