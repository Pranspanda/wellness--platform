'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { LayoutDashboard, Users, Calendar, Settings, Images, Menu, X, History } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <div className="min-h-screen flex bg-muted/20 relative">
            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-border z-30 flex items-center justify-between px-4">
                <span className="font-bold text-lg text-primary">Admin Panel</span>
                <Button variant="ghost" size="icon" onClick={toggleSidebar}>
                    {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </Button>
            </div>

            {/* Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            {/* Sidebar */}
            <aside className={cn(
                "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-border transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:block",
                isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="p-6 border-b border-border flex items-center justify-between">
                    <h1 className="text-xl font-bold text-primary">Admin Panel</h1>
                    <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsSidebarOpen(false)}>
                        <X className="w-5 h-5" />
                    </Button>
                </div>
                <nav className="p-4 space-y-2">
                    <Link
                        href="/admin/bookings"
                        className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-primary/5 hover:text-primary rounded-xl transition-colors"
                        onClick={() => setIsSidebarOpen(false)}
                    >
                        <Calendar className="w-5 h-5" />
                        Bookings
                    </Link>
                    <Link
                        href="/admin/history"
                        className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-primary/5 hover:text-primary rounded-xl transition-colors"
                        onClick={() => setIsSidebarOpen(false)}
                    >
                        <History className="w-5 h-5" />
                        Meeting History
                    </Link>
                    <Link
                        href="/admin/experts"
                        className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-primary/5 hover:text-primary rounded-xl transition-colors"
                        onClick={() => setIsSidebarOpen(false)}
                    >
                        <Users className="w-5 h-5" />
                        Experts
                    </Link>
                    <Link
                        href="/admin/customers"
                        className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-primary/5 hover:text-primary rounded-xl transition-colors"
                        onClick={() => setIsSidebarOpen(false)}
                    >
                        <LayoutDashboard className="w-5 h-5" />
                        Customers
                    </Link>
                    <Link
                        href="/admin/services"
                        className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-primary/5 hover:text-primary rounded-xl transition-colors"
                        onClick={() => setIsSidebarOpen(false)}
                    >
                        <LayoutDashboard className="w-5 h-5" />
                        Services
                    </Link>
                    <Link
                        href="/admin/gallery"
                        className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-primary/5 hover:text-primary rounded-xl transition-colors"
                        onClick={() => setIsSidebarOpen(false)}
                    >
                        <Images className="w-5 h-5" />
                        Gallery
                    </Link>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-8 overflow-y-auto pt-20 md:pt-8">
                {children}
            </main>
        </div>
    );
}
