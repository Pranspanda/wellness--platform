import { createClient } from '@supabase/supabase-js';
import { google } from 'googleapis';
import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
            return NextResponse.json({ error: 'Missing SUPABASE_SERVICE_ROLE_KEY in environment variables' }, { status: 500 });
        }

        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY
        );

        const { bookingId, expertId, meetingTime } = await request.json();

        if (!bookingId || !expertId || !meetingTime) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // 1. Fetch Booking and Expert Details
        const { data: booking, error: bookingError } = await supabaseAdmin
            .from('bookings')
            .select('*, profiles(email, full_name)')
            .eq('id', bookingId)
            .single();

        if (bookingError || !booking) throw new Error('Booking not found');

        const { data: expert, error: expertError } = await supabaseAdmin
            .from('experts')
            .select('*')
            .eq('id', expertId)
            .single();

        if (expertError || !expert) throw new Error('Expert not found');

        let meetingLink = null;
        let googleEventId = null;

        // 2. Google Calendar Integration
        if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && process.env.GOOGLE_REFRESH_TOKEN) {
            try {
                const oauth2Client = new google.auth.OAuth2(
                    process.env.GOOGLE_CLIENT_ID,
                    process.env.GOOGLE_CLIENT_SECRET,
                    process.env.NEXT_PUBLIC_BASE_URL // Redirect URL
                );

                oauth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });

                const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

                const event = {
                    summary: `Wellness Session: ${booking.service_id} with ${expert.name}`,
                    description: `Customer: ${booking.profiles?.full_name || 'Guest'}\nConcern: ${booking.customer_notes}`,
                    start: {
                        dateTime: new Date(meetingTime).toISOString(),
                        timeZone: 'UTC', // Adjust as needed
                    },
                    end: {
                        dateTime: new Date(new Date(meetingTime).getTime() + 60 * 60 * 1000).toISOString(), // 1 hour duration
                        timeZone: 'UTC',
                    },
                    conferenceData: {
                        createRequest: {
                            requestId: Math.random().toString(36).substring(7),
                            conferenceSolutionKey: { type: 'hangoutsMeet' },
                        },
                    },
                    attendees: [
                        { email: expert.email },
                        { email: booking.profiles?.email },
                    ],
                };

                const response = await calendar.events.insert({
                    calendarId: 'primary',
                    requestBody: event,
                    conferenceDataVersion: 1,
                });

                meetingLink = response.data.hangoutLink;
                googleEventId = response.data.id;
                console.log('Google Event Created:', meetingLink);

            } catch (error) {
                console.error('Google Calendar Error:', error);
                // Continue without failing the whole request
            }
        }

        // 3. Email Notification (Nodemailer)
        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            try {
                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: process.env.EMAIL_USER,
                        pass: process.env.EMAIL_PASS,
                    },
                });

                const mailOptions = {
                    from: process.env.EMAIL_USER,
                    to: [expert.email, booking.profiles?.email].filter(Boolean).join(','),
                    subject: `Meeting Confirmed: ${booking.service_id}`,
                    text: `
                        Hello,

                        Your session has been confirmed!

                        Service: ${booking.service_id}
                        Expert: ${expert.name}
                        Time: ${new Date(meetingTime).toLocaleString()}
                        
                        Join Meeting: ${meetingLink || 'Link will be shared shortly'}

                        Best regards,
                        Wellness Platform
                    `,
                };

                await transporter.sendMail(mailOptions);
                console.log('Emails sent successfully');
            } catch (error) {
                console.error('Email Error:', error);
            }
        }

        // 4. Update Booking in Supabase
        const { error: updateError } = await supabaseAdmin
            .from('bookings')
            .update({
                expert_id: expertId,
                status: 'confirmed',
                meeting_link: meetingLink,
                google_event_id: googleEventId,
                booking_date: meetingTime // Update the booking date to the scheduled time
            })
            .eq('id', bookingId);

        if (updateError) throw updateError;

        return NextResponse.json({ success: true, meetingLink });

    } catch (error: any) {
        console.error('Assignment API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
