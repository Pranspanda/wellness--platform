'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Loader2 } from 'lucide-react';

type Booking = {
    id: string;
    created_at: string;
    booking_date: string;
    status: string;
    customer_notes: string;
    service_id: string;
    expert_id: string | null;
    profiles: { full_name: string; email: string; phone: string };
};

type Expert = {
    id: string;
    name: string;
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
    // Use [\s\S]+ to match any character including newlines
    const concernMatch = notes.match(/Concern: ([\s\S]+)$/);
    return {
        name: nameMatch ? nameMatch[1].trim() : '',
        email: emailMatch ? emailMatch[1].trim() : '',
        phone: phoneMatch ? phoneMatch[1].trim() : '',
        concern: concernMatch ? concernMatch[1].trim() : ''
    };
};

export default function BookingsPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [experts, setExperts] = useState<Expert[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
    const [assignExpertId, setAssignExpertId] = useState<string>('');
    const [meetingTime, setMeetingTime] = useState<string>('');
    const [assigning, setAssigning] = useState(false);

    const supabase = createClient();

    const fetchData = async () => {
        setLoading(true);
        const { data: bookingsData, error } = await supabase
            .from('bookings')
            .select(`
        *,
        profiles (full_name, email, phone)
      `)
            .order('booking_date', { ascending: false });

        const { data: expertsData } = await supabase.from('experts').select('id, name');

        if (bookingsData) setBookings(bookingsData as any);
        if (expertsData) setExperts(expertsData);
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Generate time slots from 8 AM to 10 PM in 30 min intervals
    const generateTimeSlots = () => {
        const slots = [];
        let start = 8 * 60; // 8:00 AM in minutes
        const end = 22 * 60; // 10:00 PM in minutes

        while (start <= end) {
            const hours = Math.floor(start / 60);
            const minutes = start % 60;
            const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
            const displayTime = new Date(0, 0, 0, hours, minutes).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
            slots.push({ value: timeString, label: displayTime });
            start += 30;
        }
        return slots;
    };

    const timeSlots = generateTimeSlots();

    const handleStatusChange = async (bookingId: string, newStatus: string) => {
        try {
            const response = await fetch('/api/bookings/update-status', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ bookingId, status: newStatus })
            });

            if (!response.ok) throw new Error('Failed to update status');

            // Refresh data
            fetchData();
            alert('Status updated successfully');
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Failed to update status');
        }
    };

    const handleAssignExpert = async () => {
        if (!selectedBookingId || !assignExpertId || !meetingTime) return;
        setAssigning(true);

        try {
            // Find the booking to get the date
            const booking = bookings.find(b => b.id === selectedBookingId);
            if (!booking) throw new Error('Booking not found');

            // Combine booking date and selected time
            // booking.booking_date is ISO string, we need just the date part
            const datePart = new Date(booking.booking_date).toISOString().split('T')[0];
            const finalDateTime = new Date(`${datePart}T${meetingTime}:00`);

            const response = await fetch('/api/bookings/assign', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    bookingId: selectedBookingId,
                    expertId: assignExpertId,
                    meetingTime: finalDateTime.toISOString()
                })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Failed to assign expert');
            }

            alert('Expert assigned and meeting scheduled successfully!');
            fetchData();
            setSelectedBookingId(null);
            setAssignExpertId('');
            setMeetingTime('');
        } catch (error: any) {
            console.error('Assignment error:', error);
            alert(`Error: ${error.message}`);
        } finally {
            setAssigning(false);
        }
    };

    const getExpertName = (expertId: string | null) => {
        if (!expertId) return null;
        const expert = experts.find(e => e.id === expertId);
        return expert ? expert.name : 'Unknown Expert';
    };

    if (loading) return <div className="flex items-center justify-center h-full"><Loader2 className="animate-spin" /></div>;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">Booking Management</h1>

            <div className="bg-white rounded-xl shadow-sm border border-border overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Booking Timestamp</TableHead>
                            <TableHead>Appointment Date</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Service</TableHead>
                            <TableHead>Primary Concern</TableHead>
                            <TableHead>Expert</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {bookings.map((booking) => (
                            <TableRow key={booking.id}>
                                <TableCell className="text-muted-foreground text-xs">
                                    {booking.created_at ? format(new Date(booking.created_at), 'PP p') : '-'}
                                </TableCell>
                                <TableCell>
                                    {['confirmed', 'completed'].includes(booking.status)
                                        ? format(new Date(booking.booking_date), 'PP p')
                                        : format(new Date(booking.booking_date), 'PP')}
                                </TableCell>
                                <TableCell>
                                    <div className="font-medium">
                                        {extractCustomerDetails(booking.customer_notes).name || booking.profiles?.full_name || 'Guest'}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        {extractCustomerDetails(booking.customer_notes).email || booking.profiles?.email || ''}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        {extractCustomerDetails(booking.customer_notes).phone || booking.profiles?.phone || ''}
                                    </div>
                                </TableCell>
                                <TableCell>{SERVICE_TITLES[booking.service_id] || booking.service_id}</TableCell>
                                <TableCell className="max-w-[200px] truncate" title={extractCustomerDetails(booking.customer_notes).concern}>
                                    {extractCustomerDetails(booking.customer_notes).concern || '-'}
                                </TableCell>
                                <TableCell>
                                    {booking.expert_id ? (
                                        <span className="font-medium text-primary">{getExpertName(booking.expert_id)}</span>
                                    ) : (
                                        <Badge variant="secondary" className="bg-orange-100 text-orange-700 hover:bg-orange-200">Unassigned</Badge>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <Select
                                        defaultValue={booking.status}
                                        onValueChange={(value) => handleStatusChange(booking.id, value)}
                                    >
                                        <SelectTrigger className={`w-[130px] h-8 ${booking.status === 'confirmed' ? 'bg-green-100 text-green-700 border-green-200' :
                                            booking.status === 'completed' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                                                booking.status === 'cancelled' ? 'bg-red-100 text-red-700 border-red-200' :
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
                                <TableCell>
                                    {!booking.expert_id && (
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button size="sm" variant="outline" onClick={() => setSelectedBookingId(booking.id)}>
                                                    Assign Expert
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Assign Expert & Schedule Meeting</DialogTitle>
                                                </DialogHeader>
                                                <div className="py-4 space-y-4">
                                                    <div className="space-y-2">
                                                        <label className="text-sm font-medium">Select Expert</label>
                                                        <Select onValueChange={setAssignExpertId}>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select an expert" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {experts.map((expert) => (
                                                                    <SelectItem key={expert.id} value={expert.id}>{expert.name}</SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-sm font-medium">Meeting Time (Date is pre-selected by user)</label>
                                                        <Select onValueChange={setMeetingTime}>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select time slot" />
                                                            </SelectTrigger>
                                                            <SelectContent className="max-h-[200px]">
                                                                {timeSlots.map((slot) => (
                                                                    <SelectItem key={slot.value} value={slot.value}>
                                                                        {slot.label}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>
                                                <Button onClick={handleAssignExpert} disabled={!assignExpertId || !meetingTime || assigning}>
                                                    {assigning ? <Loader2 className="animate-spin mr-2" /> : null}
                                                    Confirm & Schedule
                                                </Button>
                                            </DialogContent>
                                        </Dialog>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
