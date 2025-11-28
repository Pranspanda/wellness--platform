'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Plus } from 'lucide-react';

type Expert = {
    id: string;
    name: string;
    email: string;
    title: string;
    certifications: string[];
};

export default function AdminExpertsPage() {
    const [experts, setExperts] = useState<Expert[]>([]);
    const supabase = createClient();

    useEffect(() => {
        const fetchExperts = async () => {
            const { data } = await supabase.from('experts').select('*');
            if (data) setExperts(data);
        };
        fetchExperts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Expert Management</h1>
                <Link href="/admin/experts/add">
                    <Button className="bg-pink-500 hover:bg-pink-600 text-white">
                        <Plus className="w-4 h-4 mr-2" /> Add New Expert
                    </Button>
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="p-4 font-medium text-gray-500">Name</th>
                            <th className="p-4 font-medium text-gray-500">Email</th>
                            <th className="p-4 font-medium text-gray-500">Title</th>
                            <th className="p-4 font-medium text-gray-500">Certifications</th>
                            <th className="p-4 font-medium text-gray-500 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {experts.map((expert) => (
                            <tr key={expert.id} className="hover:bg-gray-50">
                                <td className="p-4 font-medium text-gray-900">{expert.name}</td>
                                <td className="p-4 text-gray-600">{expert.email || '-'}</td>
                                <td className="p-4 text-gray-600">{expert.title}</td>
                                <td className="p-4 text-gray-600">
                                    {expert.certifications?.slice(0, 2).join(', ')}
                                    {expert.certifications?.length > 2 && '...'}
                                </td>
                                <td className="p-4 text-right">
                                    <Link href={`/admin/experts/edit/${expert.id}`}>
                                        <Button variant="outline" size="sm">Edit</Button>
                                    </Link>
                                </td>
                            </tr>
                        ))}
                        {experts.length === 0 && (
                            <tr>
                                <td colSpan={4} className="p-8 text-center text-gray-500">
                                    No experts found. Add one to get started.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
