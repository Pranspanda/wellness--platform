import React from 'react';
import { createClient } from '@/lib/supabase';

const About = () => {
    const supabase = createClient();
    const { data: { publicUrl } } = supabase.storage.from('static-assets').getPublicUrl('manisha mam.png');

    return (
        <section className="py-12 md:py-20 px-4 md:px-6 bg-white overflow-hidden relative">
            {/* Background Decorations */}
            <div className="absolute top-10 left-10 w-32 h-32 bg-pink-100 rounded-full blur-3xl opacity-50"></div>
            <div className="absolute bottom-10 right-10 w-48 h-48 bg-pink-100 rounded-full blur-3xl opacity-50"></div>

            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-8 md:gap-24">

                {/* Content Section */}
                <div className="w-full md:w-1/2 order-2 md:order-2">
                    <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-2">
                        About <span className="text-pink-500">Dr. Manisha</span>
                    </h2>

                    <div className="mt-6 md:mt-8 space-y-4 md:space-y-6 text-gray-600 leading-relaxed text-sm md:text-base">
                        <p>
                            Dr. Manisha Jain is an educator by profession and a Holistic Wellness Coach by passion. With over two decades of experience, she blends science-backed mindfulness with powerful healing modalities to help young people handle academic pressure, emotional challenges, and life transitions.
                        </p>
                        <p>
                            She integrates mind, body, and energy work into every coaching session, creating a comprehensive approach to personal growth and emotional wellbeing.
                        </p>
                    </div>

                    <div className="mt-8 md:mt-10">
                        <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3 md:mb-4">Certifications & Expertise</h3>
                        <div className="flex flex-wrap gap-3">
                            {[
                                "Certified Quanto Coach",
                                "Reiki Grand Master",
                                "Tarot Reader",
                                "Genetic Brain Profiling Expert",
                                "Numerologist"
                            ].map((cert, index) => (
                                <span key={index} className="px-3 py-1 md:px-4 md:py-2 bg-pink-50 text-pink-600 rounded-full text-xs md:text-sm font-medium border border-pink-100">
                                    {cert}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Image Section */}
                <div className="w-full md:w-1/2 order-1 md:order-1 relative flex justify-center">
                    <div className="relative w-64 h-64 md:w-96 md:h-96">
                        {/* Pink Glow/Border */}
                        <div className="absolute inset-0 rounded-full border-4 border-pink-200 shadow-[0_0_40px_rgba(236,72,153,0.3)]"></div>

                        {/* Image Container */}
                        <div className="absolute inset-2 rounded-full overflow-hidden bg-gray-100">
                            {/* Placeholder for Dr. Manisha Image */}
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                                <img src={publicUrl} alt="Dr. Manisha Jain" className="w-full h-full object-cover" />
                            </div>
                        </div>

                        {/* Decorative Dots */}
                        <div className="absolute -top-4 -right-4 w-8 h-8 bg-pink-200 rounded-full opacity-60"></div>
                        <div className="absolute top-1/2 -left-8 w-6 h-6 bg-pink-300 rounded-full opacity-60"></div>
                        <div className="absolute -bottom-2 right-10 w-12 h-12 bg-pink-100 rounded-full opacity-60"></div>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default About;
