-- FULL DATABASE SCHEMA
-- Combined from setup.sql, 01_create_services.sql, and 03_force_restore_services.sql

-- ==========================================
-- SECTION 1: Base Schema (Experts, Storage)
--From setup.sql
-- ==========================================

-- Create experts table
create table if not exists experts (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  title text not null,
  image_url text,
  certifications text[] default '{}',
  description text[] default '{}',
  email text, -- Added from Section 3.1
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table experts enable row level security;

-- Create policies
create policy "Public experts are viewable by everyone."
  on experts for select
  using ( true );

create policy "Experts are insertable by everyone."
  on experts for insert
  with check ( true );

create policy "Experts are updateable by everyone."
  on experts for update
  using ( true );

-- Create storage bucket for experts
insert into storage.buckets (id, name, public)
values ('experts', 'experts', true)
on conflict (id) do nothing;

create policy "Experts images are publicly accessible."
  on storage.objects for select
  using ( bucket_id = 'experts' );

create policy "Anyone can upload an expert image."
  on storage.objects for insert
  with check ( bucket_id = 'experts' );

-- Create storage bucket for gallery
insert into storage.buckets (id, name, public)
values ('gallery', 'gallery', true)
on conflict (id) do nothing;

create policy "Gallery images are publicly accessible."
  on storage.objects for select
  using ( bucket_id = 'gallery' );

create policy "Authenticated users can upload gallery images."
  on storage.objects for insert
  with check ( bucket_id = 'gallery' and auth.role() = 'authenticated' );

create policy "Authenticated users can delete gallery images."
  on storage.objects for delete
  using ( bucket_id = 'gallery' and auth.role() = 'authenticated' );

-- Create storage bucket for static-assets
insert into storage.buckets (id, name, public)
values ('static-assets', 'static-assets', true)
on conflict (id) do nothing;

create policy "Static assets are publicly accessible."
  on storage.objects for select
  using ( bucket_id = 'static-assets' );

create policy "Authenticated users can upload static assets."
  on storage.objects for insert
  with check ( bucket_id = 'static-assets' and auth.role() = 'authenticated' );

create policy "Authenticated users can delete static assets."
  on storage.objects for delete
  using ( bucket_id = 'static-assets' and auth.role() = 'authenticated' );


-- ==========================================
-- SECTION 2: Bookings Table Setup
-- From setup.sql (implicit creation assumed, but adding explicit creation here for completeness if missing, otherwise ALTERs handle it)
-- ==========================================

create table if not exists bookings (
  id uuid default gen_random_uuid() primary key,
  user_id uuid, -- Nullable for guest bookings
  expert_id uuid references experts(id) on delete set null,
  service_id text, -- Changed to text to support service titles/ids
  booking_date timestamp with time zone not null,
  status text default 'pending',
  customer_notes text,
  meeting_link text,
  google_event_id text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table bookings enable row level security;

-- Drop existing policies to avoid conflicts
drop policy if exists "Allow public bookings" on bookings;
drop policy if exists "Allow viewing bookings" on bookings;
drop policy if exists "Allow updates" on bookings;

-- Create Policy: Allow anyone (including guests) to create a booking
create policy "Allow public bookings" 
on bookings for insert 
with check (true);

-- Create Policy: Allow admins (or everyone for now) to view bookings
create policy "Allow viewing bookings" 
on bookings for select 
using (true);

-- Create Policy: Allow updates (for assigning experts)
create policy "Allow updates" 
on bookings for update 
using (true);


-- ==========================================
-- SECTION 3: Services Table Setup
-- From 01_create_services.sql
-- ==========================================

-- Create services table
create table if not exists services (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text not null,
  category text not null,
  price numeric not null default 0,
  duration text not null default '60 min',
  image_url text, 
  gradient text, 
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table services enable row level security;

-- Drop existing policies to avoid conflicts
drop policy if exists "Services are viewable by everyone." on services;
drop policy if exists "Services are insertable by admins." on services;
drop policy if exists "Services are updateable by admins." on services;
drop policy if exists "Services are deletable by admins." on services;

-- Re-create Policies
create policy "Services are viewable by everyone."
  on services for select
  using ( true );

create policy "Services are insertable by admins."
  on services for insert
  with check ( auth.role() = 'authenticated' );

create policy "Services are updateable by admins."
  on services for update
  using ( auth.role() = 'authenticated' );

create policy "Services are deletable by admins."
  on services for delete
  using ( auth.role() = 'authenticated' );


-- ==========================================
-- SECTION 4: Services Data Seeding
-- From 03_force_restore_services.sql
-- ==========================================

-- 1. Clear existing data to ensure clean state
DELETE FROM services;

-- 2. Insert the 9 Correct Services with INR Prices
INSERT INTO services (title, description, category, price, duration, gradient, is_active) VALUES
('Tarot Card Reading', 'Gain clarity and insight into your life''s journey through personalized tarot readings', 'Divination', 500, '60 min', 'from-orange-400 to-pink-500', true),
('Emotional & Mental Health', 'Stress, anxiety management and building emotional resilience for lasting wellbeing', 'Wellness', 800, '60 min', 'from-pink-500 to-rose-500', true),
('Finger Print Analysis', 'Discover your innate talents and personality through scientific dermatoglyphics', 'Analysis', 1000, '90 min', 'from-rose-400 to-orange-400', true),
('Mindfulness & Meditation', 'Customized meditation techniques and heart-brain coherence for emotional balance', 'Training', 400, '45 min', 'from-pink-500 to-purple-500', true),
('Personal Development', 'Self-awareness, career guidance, and time management for personal growth', 'Growth', 700, '60 min', 'from-orange-400 to-pink-500', true),
('Relationship Skills', 'Build healthy connections and improve parent-youth communication', 'Connection', 900, '60 min', 'from-rose-400 to-orange-400', true),
('Akashic Recording', 'Access your soul''s records for deep insights into life patterns and healing', 'Spiritual', 1200, '90 min', 'from-pink-500 to-purple-500', true),
('Inner Childhood Healing', 'Transform past wounds and reconnect with your authentic self', 'Healing', 1100, '90 min', 'from-orange-400 to-pink-500', true),
('Balance Within Program', 'Comprehensive program for achieving inner balance and outer brilliance', 'Program', 5000, 'Multi-session', 'from-pink-500 to-rose-500', true);
