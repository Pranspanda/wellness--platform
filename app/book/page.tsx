'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { format } from 'date-fns';
import { Loader2, CheckCircle, Star, Search, Heart, Target, TrendingUp, Flower2, Users, Eye } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Service } from '@/types';

// Helper to map categories to icons
const getIconForCategory = (category: string) => {
    const lower = category.toLowerCase();
    if (lower.includes('divination') || lower.includes('tarot')) return <Star className="w-6 h-6 text-white" />;
    if (lower.includes('wellness') || lower.includes('health')) return <Heart className="w-6 h-6 text-white" />;
    if (lower.includes('analysis') || lower.includes('finger')) return <Search className="w-6 h-6 text-white" />;
    if (lower.includes('training') || lower.includes('meditation')) return <Flower2 className="w-6 h-6 text-white" />;
    if (lower.includes('growth') || lower.includes('development')) return <TrendingUp className="w-6 h-6 text-white" />;
    if (lower.includes('connection') || lower.includes('relationship')) return <Users className="w-6 h-6 text-white" />;
    if (lower.includes('spiritual') || lower.includes('akashic')) return <Eye className="w-6 h-6 text-white" />;
    if (lower.includes('healing')) return <Heart className="w-6 h-6 text-white" />;
    return <Target className="w-6 h-6 text-white" />;
};

// Form Schema
const bookingSchema = z.object({
    name: z.string().min(2, "Name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "Valid phone number is required"),
    age: z.string().optional(),
    concern: z.string().min(10, "Please describe your concern briefly"),
});

export default function BookingPage() {
    const [step, setStep] = useState(1);
    const [services, setServices] = useState<Service[]>([]);
    const [loadingServices, setLoadingServices] = useState(true);
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
    const [submitting, setSubmitting] = useState(false);

    const supabase = createClient();
    const router = useRouter();

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(bookingSchema)
    });

    useEffect(() => {
        const fetchServices = async () => {
            const { data, error } = await supabase
                .from('services')
                .select('*')
                .eq('is_active', true)
                .order('created_at', { ascending: true });

            if (error) {
                console.error('Error fetching services:', error);
            } else {
                setServices(data || []);
            }
            setLoadingServices(false);
        };

        fetchServices();
    }, []);

    const onSubmit = async (data: z.infer<typeof bookingSchema>) => {
        if (!selectedService || !selectedDate) return;
        setSubmitting(true);

        // Get current user (assuming user is logged in, or handle guest booking)
        const { data: { user } } = await supabase.auth.getUser();

        const { error } = await supabase.from('bookings').insert({
            user_id: user?.id || null,
            service_id: selectedService.title, // Storing title as ID for now if services table isn't linked by FK yet, or use ID if schema updated
            expert_id: null, // No expert selection
            booking_date: selectedDate.toISOString(),
            status: 'pending',
            customer_notes: `Service: ${selectedService.title}, Name: ${data.name}, Email: ${data.email}, Phone: ${data.phone}, Age: ${data.age}, Concern: ${data.concern}`
        });

        if (error) {
            console.error('Booking failed:', error);
            alert(`Booking failed: ${error.message} \nDetails: ${error.details || 'No details'}`);
        } else {
            router.push('/thank-you');
        }
        setSubmitting(false);
    };

    // Generate next 20 days (starting from tomorrow)
    const next20Days = Array.from({ length: 20 }).map((_, i) => {
        const date = new Date();
        date.setDate(date.getDate() + i + 1);
        return date;
    });

    return (
        <div className="min-h-screen bg-muted/30 py-6 px-4 md:py-12">
            <div className="max-w-5xl mx-auto bg-white rounded-2xl md:rounded-3xl shadow-card p-4 md:p-8">
                <h1 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8 text-gradient">Book Your Session</h1>

                {/* Progress Steps */}
                <div className="flex justify-between mb-8 md:mb-12 relative max-w-[300px] md:max-w-md mx-auto">
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-10"></div>
                    {[1, 2, 3].map((s) => (
                        <div key={s} className={`w-8 h-8 md:w-10 md:h-10 text-sm md:text-base rounded-full flex items-center justify-center font-bold transition-colors ${step >= s ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'}`}>
                            {s}
                        </div>
                    ))}
                </div>

                {/* Step 1: Select Service */}
                {step === 1 && (
                    <div>
                        <h2 className="text-2xl font-semibold mb-6 text-center">Select a Service</h2>
                        {loadingServices ? (
                            <div className="flex justify-center p-12">
                                <Loader2 className="animate-spin w-8 h-8 text-pink-500" />
                            </div>
                        ) : (
                            <div className="grid grid-cols-3 gap-2 md:gap-6">
                                {services.map((service) => (
                                    <div
                                        key={service.id}
                                        onClick={() => setSelectedService(service)}
                                        className={`group relative rounded-2xl md:rounded-3xl p-2 md:p-6 cursor-pointer transition-all duration-300 border-2 overflow-hidden ${selectedService?.id === service.id ? 'border-pink-500 shadow-xl scale-105' : 'border-transparent hover:border-pink-200 hover:shadow-lg bg-white shadow-md'}`}
                                    >
                                        {/* Gradient Background on Hover/Active */}
                                        <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient || 'from-pink-500 to-orange-400'} opacity-0 ${selectedService?.id === service.id ? 'opacity-10' : 'group-hover:opacity-5'} transition-opacity duration-300`}></div>

                                        <div className="relative z-10">
                                            <div className="flex flex-col md:flex-row md:items-center justify-between mb-2 md:mb-4">
                                                <span className="text-[10px] md:text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 md:mb-0">
                                                    {service.category}
                                                </span>
                                                <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-gradient-to-br ${service.gradient || 'from-pink-500 to-orange-400'} flex items-center justify-center shadow-md`}>
                                                    {getIconForCategory(service.category)}
                                                </div>
                                            </div>

                                            <h3 className="text-xs md:text-xl font-bold text-gray-900 mb-1 md:mb-2 group-hover:text-pink-600 transition-colors leading-tight">
                                                {service.title}
                                            </h3>
                                            <p className="hidden md:block text-sm text-gray-600 mb-4 line-clamp-2">
                                                {service.description}
                                            </p>

                                            <div className="flex items-center justify-end text-sm font-medium text-gray-500 mt-auto">
                                                <span className={`font-bold ${service.price === 0 ? 'text-green-600' : 'text-pink-600'}`}>
                                                    {service.price === 0 ? 'Free' : `₹${service.price}`}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        <div className="mt-12 flex justify-end">
                            <Button onClick={() => setStep(2)} disabled={!selectedService} className="w-full md:w-auto px-6 py-4 md:px-8 md:py-6 text-base md:text-lg rounded-full bg-gradient-to-r from-pink-500 to-orange-400 hover:from-pink-600 hover:to-orange-500 border-0">
                                Next Step
                            </Button>
                        </div>
                    </div>
                )}

                {/* Step 2: Select Date */}
                {step === 2 && (
                    <div className="max-w-xl mx-auto">
                        <h2 className="text-2xl font-semibold mb-6 text-center">Select Date</h2>
                        <div className="w-full flex flex-col items-center">
                            <div className="w-full max-w-sm">
                                <Label className="mb-2 block text-gray-600">Choose a Date</Label>
                                <Select onValueChange={(value) => setSelectedDate(new Date(value))}>
                                    <SelectTrigger className="w-full h-14 text-lg rounded-xl border-2 border-gray-200 focus:border-pink-500 focus:ring-pink-200">
                                        <SelectValue placeholder="Select a date" />
                                    </SelectTrigger>
                                    <SelectContent className="max-h-[300px]">
                                        {next20Days.map((date) => (
                                            <SelectItem key={date.toISOString()} value={date.toISOString()} className="py-3 cursor-pointer">
                                                {format(date, "EEEE, MMMM do")}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {selectedDate && (
                                <div className="mt-8 text-center p-6 bg-gradient-to-r from-pink-50 to-orange-50 rounded-2xl border border-pink-100 animate-in fade-in slide-in-from-bottom-4 w-full max-w-sm">
                                    <p className="text-sm text-gray-500 mb-2 uppercase tracking-wide font-semibold">Selected Date</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {format(selectedDate, "EEEE, MMMM do, yyyy")}
                                    </p>
                                </div>
                            )}
                        </div>
                        <div className="mt-12 flex justify-between">
                            <Button variant="outline" onClick={() => setStep(1)} className="px-6 py-4 md:px-8 md:py-6 text-base md:text-lg rounded-full">Back</Button>
                            <Button onClick={() => setStep(3)} disabled={!selectedDate} className="px-6 py-4 md:px-8 md:py-6 text-base md:text-lg rounded-full bg-gradient-to-r from-pink-500 to-orange-400 hover:from-pink-600 hover:to-orange-500 border-0">
                                Next Step
                            </Button>
                        </div>
                    </div>
                )}

                {/* Step 3: Details & Confirm */}
                {step === 3 && (
                    <div className="max-w-2xl mx-auto">
                        <h2 className="text-2xl font-semibold mb-6 text-center">Your Details</h2>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input id="name" {...register('name')} className="rounded-xl border-gray-200 focus:border-pink-500 focus:ring-pink-200" />
                                    {errors.name && <p className="text-red-500 text-sm">{errors.name.message as string}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input id="email" type="email" {...register('email')} className="rounded-xl border-gray-200 focus:border-pink-500 focus:ring-pink-200" />
                                    {errors.email && <p className="text-red-500 text-sm">{errors.email.message as string}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <Input id="phone" {...register('phone')} className="rounded-xl border-gray-200 focus:border-pink-500 focus:ring-pink-200" />
                                    {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message as string}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="age">Age</Label>
                                    <Input id="age" {...register('age')} className="rounded-xl border-gray-200 focus:border-pink-500 focus:ring-pink-200" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="concern">Primary Concern</Label>
                                <Textarea id="concern" {...register('concern')} className="rounded-xl border-gray-200 focus:border-pink-500 focus:ring-pink-200 min-h-[100px]" />
                                {errors.concern && <p className="text-red-500 text-sm">{errors.concern.message as string}</p>}
                            </div>

                            <div className="bg-gradient-to-br from-pink-50 to-orange-50 p-6 rounded-2xl mt-8 border border-pink-100">
                                <h3 className="font-bold text-gray-800 mb-4 text-lg">Booking Summary</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center pb-3 border-b border-pink-200/50">
                                        <span className="text-gray-600">Service</span>
                                        <span className="font-semibold text-gray-900">{selectedService?.title}</span>
                                    </div>
                                    <div className="flex justify-between items-center pb-3 border-b border-pink-200/50">
                                        <span className="text-gray-600">Date</span>
                                        <span className="font-semibold text-gray-900">{selectedDate ? format(selectedDate, 'PPP') : ''}</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-2">
                                        <span className="text-gray-600">Price</span>
                                        <span className={`font-bold text-lg ${selectedService?.price === 0 ? 'text-green-600' : 'text-pink-600'}`}>
                                            {selectedService?.price === 0 ? 'Free' : `₹${selectedService?.price}`}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-12 flex justify-between">
                                <Button type="button" variant="outline" onClick={() => setStep(2)} className="px-6 py-4 md:px-8 md:py-6 text-base md:text-lg rounded-full">Back</Button>
                                <Button type="submit" disabled={submitting} className="px-6 py-4 md:px-8 md:py-6 text-base md:text-lg rounded-full bg-gradient-to-r from-pink-500 to-orange-400 hover:from-pink-600 hover:to-orange-500 border-0 shadow-lg shadow-pink-200">
                                    {submitting ? <Loader2 className="animate-spin mr-2" /> : <CheckCircle className="mr-2" />}
                                    Confirm Booking
                                </Button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}
