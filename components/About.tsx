import React from 'react';
import { createClient } from '@/lib/supabase';

const About = () => {
    const supabase = createClient();
    const { data: { publicUrl } } = supabase.storage.from('static-assets').getPublicUrl('manisha mam.png');

    return (
        <section className="py-8 md:py-20 px-4 md:px-6 bg-white overflow-hidden relative">
            {/* Background Decorations */}
            <div className="absolute top-10 left-10 w-32 h-32 bg-pink-100 rounded-full blur-3xl opacity-50"></div>
            <div className="absolute bottom-10 right-10 w-48 h-48 bg-pink-100 rounded-full blur-3xl opacity-50"></div>

            <div className="max-w-6xl mx-auto">
                {/* Mobile Layout Container */}
                <div className="flex flex-col md:hidden">
                    {/* 1. Heading Top */}
                    <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
                        About <span className="text-pink-500">Dr. Manisha</span>
                    </h2>

                    {/* 2. Image Left + Description Right */}
                    <div className="flex flex-row items-start gap-4 mb-6">
                        {/* Image Left */}
                        <div className="w-5/12 relative flex-shrink-0">
                            <div className="relative w-full aspect-square">
                                <div className="absolute inset-0 rounded-full border-2 border-pink-200 shadow-[0_0_20px_rgba(236,72,153,0.3)]"></div>
                                <div className="absolute inset-1 rounded-full overflow-hidden bg-gray-100">
                                    <img src={publicUrl} alt="Dr. Manisha Jain" className="w-full h-full object-cover" />
                                </div>
                            </div>
                        </div>

                        {/* Description Right */}
                        <div className="w-7/12 text-xs text-gray-600 leading-relaxed text-left">
                            <p className="mb-2">
                                Dr. Manisha Jain is an educator by profession and a Holistic Wellness Coach by passion. With over two decades of experience, she blends science-backed mindfulness with powerful healing modalities.
                            </p>
                            <p>
                                She integrates mind, body, and energy work into every coaching session, creating a comprehensive approach to personal growth.
                            </p>
                        </div>
                    </div>

                    {/* 3. Certifications Bottom */}
                    <div className="mt-2">
                        <h3 className="text-lg font-bold text-gray-900 mb-3 text-center">Certifications & Expertise</h3>
                        <div className="flex flex-wrap gap-2 justify-center">
                            {[
                                "Certified Quanto Coach",
                                "Reiki Grand Master",
                                "Tarot Reader",
                                "Genetic Brain Profiling Expert",
                                "Numerologist"
                            ].map((cert, index) => (
                                <span key={index} className="px-3 py-1 bg-pink-50 text-pink-600 rounded-full text-[10px] font-medium border border-pink-100">
                                    {cert}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Desktop Layout (Original) */}
                <div className="hidden md:flex flex-row items-center gap-24">
                    {/* Content Section */}
                    <div className="w-1/2 order-2">
                        <h2 className="text-5xl font-bold text-gray-900 mb-2 text-left">
                            About <span className="text-pink-500">Dr. Manisha</span>
                        </h2>

                        <div className="mt-8 space-y-6 text-gray-600 leading-relaxed text-base text-left">
                            <p>
                                Dr. Manisha Jain is an educator by profession and a Holistic Wellness Coach by passion. With over two decades of experience, she blends science-backed mindfulness with powerful healing modalities to help young people handle academic pressure, emotional challenges, and life transitions.
                            </p>
                            <p>
                                She integrates mind, body, and energy work into every coaching session, creating a comprehensive approach to personal growth and emotional wellbeing.
                            </p>
                        </div>

                        <div className="mt-10">
                            <h3 className="text-xl font-bold text-gray-900 mb-4 text-left">Certifications & Expertise</h3>
                            <div className="flex flex-wrap gap-3 justify-start">
                                {[
                                    "Certified Quanto Coach",
                                    "Reiki Grand Master",
                                    "Tarot Reader",
                                    "Genetic Brain Profiling Expert",
                                    "Numerologist"
                                ].map((cert, index) => (
                                    <span key={index} className="px-4 py-2 bg-pink-50 text-pink-600 rounded-full text-sm font-medium border border-pink-100">
                                        {cert}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Image Section */}
                    <div className="w-1/2 order-1 relative flex justify-center">
                        <div className="relative w-96 h-96">
                            <div className="absolute inset-0 rounded-full border-4 border-pink-200 shadow-[0_0_40px_rgba(236,72,153,0.3)]"></div>
                            <div className="absolute inset-2 rounded-full overflow-hidden bg-gray-100">
                                <img src={publicUrl} alt="Dr. Manisha Jain" className="w-full h-full object-cover" />
                            </div>
                            <div className="absolute -top-4 -right-4 w-8 h-8 bg-pink-200 rounded-full opacity-60"></div>
                            <div className="absolute top-1/2 -left-8 w-6 h-6 bg-pink-300 rounded-full opacity-60"></div>
                            <div className="absolute -bottom-2 right-10 w-12 h-12 bg-pink-100 rounded-full opacity-60"></div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default About;
