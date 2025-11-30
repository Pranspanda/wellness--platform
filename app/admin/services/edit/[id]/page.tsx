'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import ServiceForm from '@/components/admin/ServiceForm';
import { Loader2 } from 'lucide-react';
import { useParams } from 'next/navigation';

export default function EditServicePage() {
    const params = useParams();
    const [service, setService] = useState(null);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        const fetchService = async () => {
            if (!params.id) return;

            const { data, error } = await supabase
                .from('services')
                .select('*')
                .eq('id', params.id)
                .single();

            if (error) {
                console.error('Error fetching service:', error);
                alert('Error loading service details');
            } else {
                setService(data);
            }
            setLoading(false);
        };

        fetchService();
    }, [params.id]);

    if (loading) {
        return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin w-8 h-8 text-pink-500" /></div>;
    }

    if (!service) {
        return <div className="text-center p-8">Service not found</div>;
    }

    return <ServiceForm initialData={service} isEditing={true} />;
}
