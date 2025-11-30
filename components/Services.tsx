'use client';

import React from 'react';
import { Star, Search, Heart, Target, TrendingUp, Flower2, Users, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Service } from '@/types';

// Map categories to icons (fallback if no dynamic icon system yet)
const getIconForCategory = (category: string) => {
    const lower = category.toLowerCase();
    if (lower.includes('divination') || lower.includes('tarot')) return <Star className="w-3 h-3 md:w-6 md:h-6" />;
    if (lower.includes('wellness') || lower.includes('health')) return <Heart className="w-3 h-3 md:w-6 md:h-6" />;
    if (lower.includes('analysis') || lower.includes('finger')) return <Search className="w-3 h-3 md:w-6 md:h-6" />;
    if (lower.includes('training') || lower.includes('meditation')) return <Flower2 className="w-3 h-3 md:w-6 md:h-6" />;
    if (lower.includes('growth') || lower.includes('development')) return <TrendingUp className="w-3 h-3 md:w-6 md:h-6" />;
    if (lower.includes('connection') || lower.includes('relationship')) return <Users className="w-3 h-3 md:w-6 md:h-6" />;
    if (lower.includes('spiritual') || lower.includes('akashic')) return <Eye className="w-3 h-3 md:w-6 md:h-6" />;
    if (lower.includes('healing')) return <Heart className="w-3 h-3 md:w-6 md:h-6" />;
    return <Target className="w-3 h-3 md:w-6 md:h-6" />;
};

interface ServicesProps {
    services: Service[];
}

const Services = ({ services }: ServicesProps) => {
    // Filter only active services
    const activeServices = services.filter(s => s.is_active);

    return (
        <section className="py-8 px-2 md:py-24 md:px-6 bg-gradient-to-b from-white via-pink-50/30 to-white relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute top-20 left-0 w-96 h-96 bg-gradient-to-br from-pink-200/40 to-orange-200/40 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-40 right-0 w-80 h-80 bg-gradient-to-br from-rose-200/40 to-pink-200/40 rounded-full blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-br from-orange-200/30 to-pink-200/30 rounded-full blur-3xl animate-pulse delay-500"></div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header */}
                <div className="text-center mb-10 md:mb-20">
                    <div className="inline-block mb-4">
                        <span className="px-6 py-2 bg-gradient-to-r from-pink-500 to-orange-400 text-white text-sm font-semibold rounded-full shadow-lg">
                            Services & Offerings
                        </span>
                    </div>
                    <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-pink-600 via-rose-500 to-orange-500 bg-clip-text text-transparent">
                        Transform Your Journey
                    </h2>
                    <p className="text-gray-600 text-sm md:text-lg max-w-3xl mx-auto leading-relaxed">
                        Explore comprehensive holistic wellness solutions designed to nurture your emotional, mental, and spiritual wellbeing through personalized guidance and transformative practices.
                    </p>
                </div>

                {/* Services Grid */}
                <div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-8">
                    {activeServices.map((service) => (
                        <div
                            key={service.id}
                            className="group relative bg-white rounded-xl md:rounded-3xl p-2 md:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-pink-100/50 hover:border-pink-200 hover:-translate-y-2 flex flex-col"
                        >
                            {/* Gradient Background on Hover */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient || 'from-pink-500 to-orange-400'} opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity duration-500`}></div>

                            <div className="relative z-10 flex flex-col h-full">
                                {/* Category Badge */}
                                <div className="flex items-center justify-between mb-2 md:mb-6">
                                    <span className="text-[8px] md:text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        {service.category}
                                    </span>
                                    <div className={`w-6 h-6 md:w-12 md:h-12 rounded-lg md:rounded-2xl bg-gradient-to-br ${service.gradient || 'from-pink-500 to-orange-400'} flex items-center justify-center text-white shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500`}>
                                        {getIconForCategory(service.category)}
                                    </div>
                                </div>

                                {/* Content */}
                                <h3 className="text-[10px] md:text-2xl font-bold text-gray-900 mb-1 md:mb-4 group-hover:text-pink-600 transition-colors leading-tight">
                                    {service.title}
                                </h3>
                                <p className="text-gray-600 text-[8px] md:text-base leading-tight mb-2 md:mb-8 flex-grow line-clamp-3 md:line-clamp-none">
                                    {service.description}
                                </p>

                                {/* CTA Button */}
                                <Link href="/book" className="w-full mt-auto">
                                    <Button className={`w-full py-1 h-6 md:h-auto md:py-6 rounded-md md:rounded-xl text-[8px] md:text-base font-semibold text-white bg-gradient-to-r ${service.gradient || 'from-pink-500 to-orange-400'} hover:shadow-lg transform hover:scale-105 transition-all duration-300 border-0`}>
                                        {service.price === 0 ? 'Book Free Session' : 'Book Session'}
                                    </Button>
                                </Link>
                            </div>

                            {/* Decorative Corner */}
                            <div className={`absolute top-0 right-0 w-8 h-8 md:w-20 md:h-20 bg-gradient-to-br ${service.gradient || 'from-pink-500 to-orange-400'} opacity-10 rounded-bl-full rounded-tr-3xl`}></div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default Services;