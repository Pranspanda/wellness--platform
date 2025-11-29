'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight, MessageCircle } from 'lucide-react';

export default function ThankYouPage() {
    return (
        <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden text-center p-8 md:p-12 animate-in fade-in zoom-in duration-500">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-4">Booking Confirmed!</h1>
                <p className="text-gray-600 mb-8">
                    Thank you for booking your session. We have sent a confirmation email with all the details.
                </p>

                <div className="bg-green-50 rounded-2xl p-6 mb-8 border border-green-100">
                    <h3 className="font-semibold text-green-800 mb-2 flex items-center justify-center gap-2">
                        <MessageCircle className="w-5 h-5" />
                        Join our Community
                    </h3>
                    <p className="text-sm text-green-700 mb-4">
                        Connect with like-minded individuals and get exclusive wellness tips in our WhatsApp group. More details about the timing and sessions will be shared there.
                    </p>
                    <a
                        href="https://chat.whatsapp.com/YOUR_GROUP_LINK_HERE"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full"
                    >
                        <Button className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white rounded-xl py-6 text-lg shadow-lg shadow-green-200 transition-all hover:scale-105">
                            Join WhatsApp Group
                        </Button>
                    </a>
                </div>

                <div className="space-y-3">
                    <Link href="/">
                        <Button variant="outline" className="w-full rounded-xl py-6 border-2 hover:bg-gray-50">
                            Return to Home
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
