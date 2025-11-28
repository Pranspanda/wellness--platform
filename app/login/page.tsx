'use client';

import React, { useState } from 'react';
import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Lock } from 'lucide-react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const supabase = createClient();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            router.push('/admin/bookings');
            router.refresh();
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-pink-100">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mb-4">
                        <Lock className="w-6 h-6 text-pink-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">Admin Login</h1>
                    <p className="text-gray-500 mt-2 text-center">Enter your credentials to access the dashboard</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="admin@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="rounded-xl border-gray-200 focus:border-pink-500 focus:ring-pink-200"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="rounded-xl border-gray-200 focus:border-pink-500 focus:ring-pink-200"
                        />
                    </div>

                    {error && (
                        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                            {error}
                        </div>
                    )}

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full py-6 text-lg rounded-xl bg-gradient-to-r from-pink-500 to-orange-400 hover:from-pink-600 hover:to-orange-500 border-0 shadow-lg shadow-pink-200"
                    >
                        {loading ? <Loader2 className="animate-spin mr-2" /> : null}
                        Sign In
                    </Button>
                </form>
            </div>
        </div>
    );
}
