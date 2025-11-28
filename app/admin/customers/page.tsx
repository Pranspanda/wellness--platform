'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, ChevronDown, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';

type Booking = {
    id: string;
    booking_date: string;
    status: string;
    customer_notes: string;
    profiles: { full_name: string; email: string; phone: string } | null;
};

type Customer = {
    id: string;
    full_name: string;
    email: string;
    phone: string;
    bookings: Booking[];
};

const extractCustomerDetails = (notes: string) => {
    if (!notes) return { name: '', email: '', phone: '' };
    const nameMatch = notes.match(/Name: ([^,]+)/);
    const emailMatch = notes.match(/Email: ([^,]+)/);
    const phoneMatch = notes.match(/Phone: ([^,]+)/);
    return {
        name: nameMatch ? nameMatch[1].trim() : '',
        email: emailMatch ? emailMatch[1].trim() : '',
        phone: phoneMatch ? phoneMatch[1].trim() : ''
    };
};

export default function CustomersPage() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedCustomerId, setExpandedCustomerId] = useState<string | null>(null);
    const supabase = createClient();

    useEffect(() => {
        const fetchCustomers = async () => {
            setLoading(true);
            // Fetch all bookings with profile info
            const { data: bookings } = await supabase
                .from('bookings')
                .select(`
                    *,
                    profiles (full_name, email, phone)
                `)
                .order('booking_date', { ascending: false });

            if (bookings) {
                const customerMap = new Map<string, Customer>();

                bookings.forEach((booking: any) => {
                    let email = '';
                    let name = '';
                    let phone = '';
                    let id = '';

                    // Always try to parse notes first as they contain the specific booking details
                    const details = extractCustomerDetails(booking.customer_notes);

                    if (details.email) {
                        // Use details from the form (prioritize this even if user is logged in)
                        email = details.email;
                        name = details.name;
                        phone = details.phone;
                        id = email;
                    } else if (booking.profiles) {
                        // Fallback to profile info if notes don't have email
                        email = booking.profiles.email;
                        name = booking.profiles.full_name;
                        phone = booking.profiles.phone;
                        id = booking.profiles.email;
                    } else {
                        // Guest with no parsed email (shouldn't happen often if validation is on)
                        name = 'Guest';
                        id = `guest-${booking.id}`;
                    }

                    if (email) {
                        if (!customerMap.has(email)) {
                            customerMap.set(email, {
                                id: email, // Use email as unique key
                                full_name: name,
                                email: email,
                                phone: phone,
                                bookings: []
                            });
                        }
                        customerMap.get(email)?.bookings.push(booking);
                    }
                });

                setCustomers(Array.from(customerMap.values()));
            }
            setLoading(false);
        };
        fetchCustomers();
    }, []);

    const toggleExpand = (id: string) => {
        setExpandedCustomerId(expandedCustomerId === id ? null : id);
    };

    if (loading) return <div className="flex items-center justify-center h-full"><Loader2 className="animate-spin" /></div>;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">Customer CRM</h1>

            <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-10"></TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>Total Bookings</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {customers.map((customer) => (
                            <React.Fragment key={customer.id}>
                                <TableRow className="cursor-pointer hover:bg-muted/50" onClick={() => toggleExpand(customer.id)}>
                                    <TableCell>
                                        {expandedCustomerId === customer.id ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                                    </TableCell>
                                    <TableCell className="font-medium">{customer.full_name}</TableCell>
                                    <TableCell>{customer.email}</TableCell>
                                    <TableCell>{customer.phone}</TableCell>
                                    <TableCell>{customer.bookings.length}</TableCell>
                                </TableRow>
                                {expandedCustomerId === customer.id && (
                                    <TableRow className="bg-muted/30">
                                        <TableCell colSpan={5} className="p-4">
                                            <div className="pl-10">
                                                <h4 className="font-semibold mb-2 text-sm uppercase text-muted-foreground">Booking History</h4>
                                                <Table>
                                                    <TableHeader>
                                                        <TableRow>
                                                            <TableHead className="text-xs">Date</TableHead>
                                                            <TableHead className="text-xs">Status</TableHead>
                                                            <TableHead className="text-xs">Notes</TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {customer.bookings.map((booking) => (
                                                            <TableRow key={booking.id}>
                                                                <TableCell className="text-sm">{format(new Date(booking.booking_date), 'PP')}</TableCell>
                                                                <TableCell className="text-sm">{booking.status}</TableCell>
                                                                <TableCell className="text-sm text-muted-foreground">{booking.customer_notes}</TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </React.Fragment>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
