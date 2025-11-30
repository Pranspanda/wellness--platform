'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2, Loader2, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Service } from '@/types';

const DEFAULT_SERVICES = [
    {
        title: "Tarot Card Reading",
        description: "Gain clarity and insight into your life's journey through personalized tarot readings",
        category: "Divination",
        price: 500,
        duration: "60 min",
        gradient: "from-orange-400 to-pink-500",
        is_active: true
    },
    {
        title: "Emotional & Mental Health",
        description: "Stress, anxiety management and building emotional resilience for lasting wellbeing",
        category: "Wellness",
        price: 800,
        duration: "60 min",
        gradient: "from-pink-500 to-rose-500",
        is_active: true
    },
    {
        title: "Finger Print Analysis",
        description: "Discover your innate talents and personality through scientific dermatoglyphics",
        category: "Analysis",
        price: 1000,
        duration: "90 min",
        gradient: "from-rose-400 to-orange-400",
        is_active: true
    },
    {
        title: "Mindfulness & Meditation",
        description: "Customized meditation techniques and heart-brain coherence for emotional balance",
        category: "Training",
        price: 400,
        duration: "45 min",
        gradient: "from-pink-500 to-purple-500",
        is_active: true
    },
    {
        title: "Personal Development",
        description: "Self-awareness, career guidance, and time management for personal growth",
        category: "Growth",
        price: 700,
        duration: "60 min",
        gradient: "from-orange-400 to-pink-500",
        is_active: true
    },
    {
        title: "Relationship Skills",
        description: "Build healthy connections and improve parent-youth communication",
        category: "Connection",
        price: 900,
        duration: "60 min",
        gradient: "from-rose-400 to-orange-400",
        is_active: true
    },
    {
        title: "Akashic Recording",
        description: "Access your soul's records for deep insights into life patterns and healing",
        category: "Spiritual",
        price: 1200,
        duration: "90 min",
        gradient: "from-pink-500 to-purple-500",
        is_active: true
    },
    {
        title: "Inner Childhood Healing",
        description: "Transform past wounds and reconnect with your authentic self",
        category: "Healing",
        price: 1100,
        duration: "90 min",
        gradient: "from-orange-400 to-pink-500",
        is_active: true
    },
    {
        title: "Balance Within Program",
        description: "Comprehensive program for achieving inner balance and outer brilliance",
        category: "Program",
        price: 5000,
        duration: "Multi-session",
        gradient: "from-pink-500 to-rose-500",
        is_active: true
    }
];

export default function AdminServicesPage() {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [restoring, setRestoring] = useState(false);
    const supabase = createClient();
    const router = useRouter();

    const fetchServices = useCallback(async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('services')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching services:', error);
        } else {
            setServices(data || []);
        }
        setLoading(false);
    }, [supabase]);

    useEffect(() => {
        fetchServices();
    }, [fetchServices]);

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this service?')) return;

        const { error } = await supabase
            .from('services')
            .delete()
            .eq('id', id);

        if (error) {
            alert('Error deleting service');
            console.error(error);
        } else {
            fetchServices();
        }
    };

    const handleRestoreDefaults = async () => {
        if (!confirm('This will add the default 9 services to your database. Continue?')) return;
        setRestoring(true);

        try {
            const { error } = await supabase
                .from('services')
                .insert(DEFAULT_SERVICES);

            if (error) throw error;

            alert('Default services restored successfully!');
            fetchServices();
        } catch (error: any) {
            console.error('Error restoring services:', error);
            alert(`Error restoring services: ${error.message}`);
        } finally {
            setRestoring(false);
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin w-8 h-8 text-pink-500" /></div>;
    }

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Manage Services</h1>
                <div className="flex gap-2">
                    {services.length === 0 && (
                        <Button
                            onClick={handleRestoreDefaults}
                            disabled={restoring}
                            variant="outline"
                            className="border-pink-200 text-pink-700 hover:bg-pink-50"
                        >
                            {restoring ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
                            Restore Defaults
                        </Button>
                    )}
                    <Link href="/admin/services/new">
                        <Button className="bg-pink-600 hover:bg-pink-700 text-white">
                            <Plus className="w-4 h-4 mr-2" />
                            Add New Service
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="p-4 font-semibold text-gray-600">Title</th>
                                <th className="p-4 font-semibold text-gray-600">Category</th>
                                <th className="p-4 font-semibold text-gray-600">Price</th>
                                <th className="p-4 font-semibold text-gray-600">Duration</th>
                                <th className="p-4 font-semibold text-gray-600">Status</th>
                                <th className="p-4 font-semibold text-gray-600 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {services.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-gray-500">
                                        No services found. Click "Restore Defaults" to load initial data.
                                    </td>
                                </tr>
                            ) : (
                                services.map((service) => (
                                    <tr key={service.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4 font-medium text-gray-900">{service.title}</td>
                                        <td className="p-4 text-gray-600">
                                            <span className="px-2 py-1 bg-gray-100 rounded-full text-xs font-medium">
                                                {service.category}
                                            </span>
                                        </td>
                                        <td className="p-4 text-gray-600">
                                            {service.price === 0 ? (
                                                <span className="text-green-600 font-medium">Free</span>
                                            ) : (
                                                `₹${service.price}`
                                            )}
                                        </td>
                                        <td className="p-4 text-gray-600">{service.duration}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${service.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {service.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right space-x-2">
                                            <Link href={`/admin/services/edit/${service.id}`}>
                                                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                                                    <Pencil className="w-4 h-4" />
                                                </Button>
                                            </Link>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                onClick={() => handleDelete(service.id)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
