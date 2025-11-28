import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
            return NextResponse.json({ error: 'Missing SUPABASE_SERVICE_ROLE_KEY' }, { status: 500 });
        }

        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY
        );

        const { bookingId, status } = await request.json();

        if (!bookingId || !status) {
            return NextResponse.json({ error: 'Missing bookingId or status' }, { status: 400 });
        }

        const { error } = await supabaseAdmin
            .from('bookings')
            .update({ status })
            .eq('id', bookingId);

        if (error) throw error;

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error('Status update error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
