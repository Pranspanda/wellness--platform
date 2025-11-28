'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { Loader2, ExternalLink } from 'lucide-react';

type Booking = {
    id: string;
    created_at: string;
    booking_date: string;
    status: string;
    customer_notes: string;
    service_id: string;
    expert_id: string | null;
    meeting_link: string | null;
    profiles: { full_name: string; email: string; phone: string };
    experts: { name: string; email: string };
};

const SERVICE_TITLES: Record<string, string> = {
    'tarot-reading': "Tarot Card Reading",
    'emotional-health': "Emotional & Mental Health",
    'fingerprint-analysis': "Finger Print Analysis",
    'mindfulness': "Mindfulness & Meditation",
    'personal-development': "Personal Development",
    'relationship-skills': "Relationship Skills",
    'akashic-recording': "Akashic Recording",
    'inner-child-healing': "Inner Childhood Healing",
    'balance-within': "Balance Within Program"
};

const extractCustomerDetails = (notes: string) => {
    if (!notes) return { name: '', email: '', phone: '', concern: '' };
    const nameMatch = notes.match(/Name: ([^,]+)/);
    const emailMatch = notes.match(/Email: ([^,]+)/);
    const phoneMatch = notes.match(/Phone: ([^,]+)/);
    const concernMatch = notes.match(/Concern: ([\s\S]+)$/);
    return {
        name: nameMatch ? nameMatch[1].trim() : '',
        email: emailMatch ? emailMatch[1].trim() : '',
        phone: phoneMatch ? phoneMatch[1].trim() : '',
        concern: concernMatch ? concernMatch[1].trim() : ''
    };
};

export default function MeetingHistoryPage() {
    const [meetings, setMeetings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        fetchMeetings();
    }, []);

    const fetchMeetings = async () => {
        const { data, error } = await supabase
            .from('bookings')
            .select(`
                *,
                profiles (full_name, email, phone),
                experts (name, email)
            `)
            .order('booking_date', { ascending: false }); // Show all bookings, not just confirmed, so we can manage them

        if (error) {
            console.error('Error fetching meetings:', error);
        }
        if (data) setMeetings(data as any);
        setLoading(false);
    };

    const handleStatusChange = async (bookingId: string, newStatus: string) => {
        try {
            const response = await fetch('/api/bookings/update-status', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ bookingId, status: newStatus })
            });

            if (!response.ok) throw new Error('Failed to update status');

            // Refresh data
            fetchMeetings();
            alert('Status updated successfully');
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Failed to update status');
        }
    };

    if (loading) return <div className="flex items-center justify-center h-full"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Meeting History</h1>

            <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Service</TableHead>
                            <TableHead>Expert</TableHead>
                            <TableHead>Meeting Link</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {meetings.map((meeting) => (
                            <TableRow key={meeting.id}>
                                <TableCell>{format(new Date(meeting.booking_date), 'PP p')}</TableCell>
                                <TableCell>
                                    <div className="font-medium">{extractCustomerDetails(meeting.customer_notes).name || meeting.profiles?.full_name || 'Guest'}</div>
                                    <div className="text-xs text-muted-foreground">{extractCustomerDetails(meeting.customer_notes).email || meeting.profiles?.email}</div>
                                </TableCell>
                                <TableCell>{SERVICE_TITLES[meeting.service_id] || meeting.service_id}</TableCell>
                                <TableCell>
                                    <div className="font-medium">{meeting.experts?.name || 'Unknown'}</div>
                                    <div className="text-xs text-muted-foreground">{meeting.experts?.email}</div>
                                </TableCell>
                                <TableCell>
                                    {meeting.meeting_link ? (
                                        <a href={meeting.meeting_link} target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-600 hover:underline">
                                            Join Meet <ExternalLink className="w-3 h-3 ml-1" />
                                        </a>
                                    ) : (
                                        <span className="text-muted-foreground text-sm">Not scheduled</span>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <Select
                                        defaultValue={meeting.status}
                                        onValueChange={(value) => handleStatusChange(meeting.id, value)}
                                    >
                                        <SelectTrigger className={`w-[130px] h-8 ${meeting.status === 'confirmed' ? 'bg-green-100 text-green-700 border-green-200' :
                                                meeting.status === 'completed' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                                                    meeting.status === 'cancelled' ? 'bg-red-100 text-red-700 border-red-200' :
                                                        'bg-gray-100 text-gray-700 border-gray-200'
                                            }`}>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="pending">Pending</SelectItem>
                                            <SelectItem value="confirmed">Confirmed</SelectItem>
                                            <SelectItem value="completed">Completed</SelectItem>
                                            <SelectItem value="cancelled">Cancelled</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </TableCell>
                            </TableRow>
                        ))}
                        {meetings.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                    No confirmed meetings found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
