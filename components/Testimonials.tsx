import React from 'react';
import { Quote } from 'lucide-react';

const testimonials = [
    {
        quote: "I learned how to manage my stress during exams — and now I'm more confident in every challenge.",
        author: "Student"
    },
    {
        quote: "Her meditation techniques changed my focus, energy, and positivity.",
        author: "Young Professional"
    }
];

const Testimonials = () => {
    return (
        <section className="py-12 md:py-20 px-4 md:px-6 bg-white relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-soft opacity-50 pointer-events-none"></div>

            <div className="max-w-4xl mx-auto relative z-10">
                <h2 className="text-2xl md:text-4xl font-bold text-center mb-10 md:mb-16 text-gradient">Success Stories</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                    {testimonials.map((item, index) => (
                        <div key={index} className="bg-card p-6 md:p-8 rounded-2xl md:rounded-3xl shadow-card border border-border/50 relative">
                            <Quote className="absolute top-6 left-6 w-8 h-8 text-primary/20" />
                            <p className="text-sm md:text-lg text-muted-foreground mb-4 md:mb-6 pt-4 md:pt-6 italic relative z-10">
                                &quot;{item.quote}&quot;
                            </p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold text-sm">
                                    {item.author[0]}
                                </div>
                                <span className="font-semibold text-foreground">{item.author}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
