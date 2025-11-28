"use client";

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Users, Target } from 'lucide-react';
import { createClient } from '@/lib/supabase';

type Expert = {
    id: string;
    name: string;
    title: string;
    image_url: string | null;
    description: string[];
    certifications: string[];
};

const Experts = () => {
    const [experts, setExperts] = useState<Expert[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        const fetchExperts = async () => {
            const { data } = await supabase.from('experts').select('*');
            if (data) {
                // Ensure description is treated as an array if it comes as string or null
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const formattedData = data.map((expert: any) => ({
                    ...expert,
                    description: Array.isArray(expert.description) ? expert.description : [expert.description || ""]
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                })).sort((a: any, b: any) => {
                    if (a.name.includes("Manisha Jain")) return -1;
                    if (b.name.includes("Manisha Jain")) return 1;
                    return 0;
                });
                setExperts(formattedData);
            }
            setLoading(false);
        };
        fetchExperts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const nextExpert = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % experts.length);
    };

    const prevExpert = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + experts.length) % experts.length);
    };

    if (loading) {
        return <div className="py-20 text-center">Loading experts...</div>;
    }

    if (experts.length === 0) {
        return null;
    }

    const currentExpert = experts[currentIndex];

    return (
        <section className="py-12 md:py-20 px-4 md:px-6 bg-gradient-to-b from-white to-pink-50">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-pink-500 mb-2 md:mb-4">Our Experts</h2>
                    <p className="text-gray-500 max-w-2xl mx-auto text-sm md:text-base">
                        Meet our dedicated team of wellness professionals committed to guiding your journey of personal growth and transformation
                    </p>
                </div>

                {/* Expert Card Container */}
                <div className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-12 pb-16 md:pb-20 relative shadow-xl border border-pink-100 min-h-[500px] md:min-h-[600px] flex items-center">

                    {/* Navigation Buttons */}
                    <button
                        onClick={prevExpert}
                        className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white rounded-full shadow-lg border border-pink-100 flex items-center justify-center text-gray-400 hover:text-pink-600 hover:border-pink-200 transition-all z-20 hover:scale-110"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                        onClick={nextExpert}
                        className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white rounded-full shadow-lg border border-pink-100 flex items-center justify-center text-gray-400 hover:text-pink-600 hover:border-pink-200 transition-all z-20 hover:scale-110"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>

                    <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 w-full px-4 md:px-16">
                        {/* Image */}
                        <div className="w-full md:w-5/12 flex justify-center">
                            <div className="relative w-48 h-48 md:w-80 md:h-80">
                                <div className="absolute inset-0 bg-pink-200/50 rounded-full blur-3xl animate-pulse"></div>
                                <div className="relative w-full h-full rounded-full overflow-hidden border-8 border-white shadow-2xl">
                                    {/* Placeholder Image or Actual Image */}
                                    <div className="w-full h-full bg-gray-50 flex items-center justify-center text-gray-400">
                                        {currentExpert.image_url ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img src={currentExpert.image_url} alt={currentExpert.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="flex flex-col items-center gap-2">
                                                <Users className="w-12 h-12 opacity-20" />
                                                <span className="text-sm">No Image</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="w-full md:w-7/12 text-left">
                            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1 md:mb-2">{currentExpert.name}</h3>
                            <h4 className="text-lg md:text-xl font-medium text-pink-500 mb-4 md:mb-6">{currentExpert.title}</h4>

                            <div className="space-y-3 md:space-y-4 text-gray-600 text-xs md:text-sm leading-relaxed mb-6 md:mb-8">
                                {currentExpert.description && currentExpert.description.map((paragraph, index) => (
                                    <p key={index}>{paragraph}</p>
                                ))}
                            </div>

                            <div className="space-y-4">
                                <h5 className="font-bold text-gray-800 flex items-center gap-2">
                                    <Target className="w-4 h-4 text-pink-500" />
                                    Certifications & Expertise
                                </h5>
                                <div className="flex flex-wrap gap-3">
                                    {currentExpert.certifications && currentExpert.certifications.map((cert, index) => (
                                        <div key={index} className="flex items-center gap-2 bg-pink-50 px-4 py-2 rounded-xl border border-pink-100/50 hover:bg-pink-100/50 transition-colors">
                                            <div className="w-1.5 h-1.5 rounded-full bg-pink-400 shrink-0"></div>
                                            <span className="text-xs font-medium text-gray-700">{cert}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Pagination Dots */}
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex justify-center gap-2">
                        {experts.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${index === currentIndex ? 'bg-pink-500 w-8' : 'bg-pink-200 hover:bg-pink-300'
                                    }`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Experts;
