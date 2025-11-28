import React from 'react';
import { Target, Brain, Briefcase, Heart, Moon, DollarSign } from 'lucide-react';

const benefits = [
    {
        title: "Sharper Focus & Consistency",
        description: "Learn proven mind-mapping techniques to stay on track with studies and goals.",
        icon: <Target className="w-5 h-5 md:w-8 md:h-8 text-white" />,
        color: "bg-red-400"
    },
    {
        title: "Stress-Free Exam & Deadline Management",
        description: "Master emotional control to handle pressure without burnout.",
        icon: <Brain className="w-5 h-5 md:w-8 md:h-8 text-white" />,
        color: "bg-orange-400"
    },
    {
        title: "Workplace Resilience",
        description: "Build confidence to deal with job stress, deadlines, and professional challenges.",
        icon: <Briefcase className="w-5 h-5 md:w-8 md:h-8 text-white" />,
        color: "bg-pink-500"
    },
    {
        title: "Healthy & Fulfilling Relationships",
        description: "Gain tools to resolve conflicts and maintain emotional balance.",
        icon: <Heart className="w-5 h-5 md:w-8 md:h-8 text-white" />,
        color: "bg-red-400"
    },
    {
        title: "Calm & Clarity",
        description: "Reduce overthinking and improve sleep through simple relaxation practices.",
        icon: <Moon className="w-5 h-5 md:w-8 md:h-8 text-white" />,
        color: "bg-orange-400"
    },
    {
        title: "Smart Money Skills",
        description: "Develop early financial habits to avoid money stress and plan for the future.",
        icon: <DollarSign className="w-5 h-5 md:w-8 md:h-8 text-white" />,
        color: "bg-pink-500"
    }
];

const Benefits = () => {
    return (
        <section className="py-12 md:py-20 px-4 md:px-6 bg-white">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-10 md:mb-16">
                    <h2 className="text-2xl md:text-5xl font-bold text-gray-900 mb-2 md:mb-4">
                        What You&apos;ll Gain from This <span className="text-pink-500">Program</span>
                    </h2>
                    <p className="text-gray-500 max-w-2xl mx-auto text-sm md:text-base">
                        Transform your mind, unlock your potential, and experience lasting positive change in every area of your life.
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8">
                    {benefits.map((benefit, index) => (
                        <div key={index} className="bg-white p-4 md:p-8 rounded-2xl md:rounded-3xl shadow-sm hover:shadow-md transition-all border border-pink-50 flex flex-col items-center text-center h-full">
                            <div className={`w-10 h-10 md:w-16 md:h-16 rounded-full ${benefit.color} flex items-center justify-center mb-3 md:mb-6 shadow-lg shadow-pink-100`}>
                                {benefit.icon}
                            </div>
                            <h3 className="text-sm md:text-xl font-bold text-gray-800 mb-2 md:mb-4 leading-tight">{benefit.title}</h3>
                            <p className="text-gray-600 mb-0 md:mb-4 text-[10px] md:text-base leading-tight">
                                {benefit.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Benefits;
