-- MASTER SETUP SCRIPT
-- Combined from previous individual scripts

-- ==========================================
-- SECTION 1: Base Schema
-- (Originally from supabase_schema.sql)
-- ==========================================

-- Create experts table
create table if not exists experts (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  title text not null,
  image_url text,
  certifications text[] default '{}',
  description text[] default '{}',
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
-- SECTION 2: Storage Setup (Redundant but ensures consistency)
-- (Originally from supabase_storage_migration.sql)
-- ==========================================

-- Create storage bucket for gallery
insert into storage.buckets (id, name, public)
values ('gallery', 'gallery', true)
on conflict (id) do nothing;

-- Policies for gallery (using DO blocks to avoid errors if they exist, or just relying on the previous section)
-- Note: The previous section already covers these policies. 
-- If you need to re-run them, you might need to drop them first or use IF NOT EXISTS logic which Postgres policies don't support directly without DO blocks.
-- For simplicity, we assume the previous section handles it.


-- ==========================================
-- SECTION 3: Modifications & Fixes
-- ==========================================

-- 3.1 Calendar Fields
-- (Originally from add_calendar_fields.sql)
-- Add email column to experts table
ALTER TABLE experts ADD COLUMN IF NOT EXISTS email TEXT;

-- Add meeting_link and google_event_id to bookings table
-- Note: Assuming 'bookings' table exists. If not, it should be created. 
-- Since it wasn't in supabase_schema.sql, it might have been created manually or via another method.
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS meeting_link TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS google_event_id TEXT;


-- 3.2 Fix Booking RLS
-- (Originally from fix_booking_rls.sql)
-- 1. Ensure columns allow NULL
ALTER TABLE bookings ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE bookings ALTER COLUMN expert_id DROP NOT NULL;

-- 2. Enable RLS (if not already enabled)
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- 3. Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Allow public bookings" ON bookings;
DROP POLICY IF EXISTS "Allow admins to view all bookings" ON bookings;
DROP POLICY IF EXISTS "Allow viewing bookings" ON bookings;
DROP POLICY IF EXISTS "Allow updates" ON bookings;

-- 4. Create Policy: Allow anyone (including guests) to create a booking
CREATE POLICY "Allow public bookings" 
ON bookings 
FOR INSERT 
WITH CHECK (true);

-- 5. Create Policy: Allow admins (or everyone for now, to be safe) to view bookings
CREATE POLICY "Allow viewing bookings" 
ON bookings 
FOR SELECT 
USING (true);

-- 6. Create Policy: Allow updates (for assigning experts)
CREATE POLICY "Allow updates" 
ON bookings 
FOR UPDATE 
USING (true);


-- 3.3 Fix Guest Booking
-- (Originally from fix_guest_booking.sql)
-- Redundant with 3.2, but ensuring user_id is nullable
ALTER TABLE bookings ALTER COLUMN user_id DROP NOT NULL;


-- 3.4 Fix Service ID Type
-- (Originally from fix_service_id_type.sql)
-- 1. Drop the foreign key constraint if it exists
ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_service_id_fkey;

-- 2. Change the column type to TEXT to accept string IDs
ALTER TABLE bookings ALTER COLUMN service_id TYPE text;


-- ==========================================
-- SECTION 4: Fix Missing Relationships
-- (Originally from fix_relationships.sql)
-- ==========================================

-- 1. Add Foreign Key for Experts
-- This allows Supabase to join 'bookings' with 'experts'
ALTER TABLE bookings
DROP CONSTRAINT IF EXISTS bookings_expert_id_fkey;

ALTER TABLE bookings
ADD CONSTRAINT bookings_expert_id_fkey
FOREIGN KEY (expert_id) REFERENCES experts(id)
ON DELETE SET NULL;

-- 2. Add Foreign Key for Profiles (if missing)
-- Assuming 'profiles' table exists and 'user_id' links to it
-- Uncomment if needed, but likely already exists if Admin Bookings page works
/*
ALTER TABLE bookings
DROP CONSTRAINT IF EXISTS bookings_user_id_fkey;

ALTER TABLE bookings
ADD CONSTRAINT bookings_user_id_fkey
FOREIGN KEY (user_id) REFERENCES profiles(id)
ON DELETE SET NULL;
*/


-- ==========================================
-- SECTION 5: Utilities (DANGEROUS)
-- ==========================================

-- Reset Database
-- (Originally from reset_database.sql)
-- UNCOMMENT THE BELOW BLOCK ONLY IF YOU WANT TO WIPE DATA
/*
-- 1. Reset: Drop existing objects with CASCADE to handle dependencies (like bookings)
drop policy if exists "Public experts are viewable by everyone." on experts;
drop policy if exists "Experts are insertable by everyone." on experts;
drop policy if exists "Experts are updateable by everyone." on experts;
drop table if exists experts cascade;

-- 2. Recreate Table: Create the experts table with ALL required columns
create table experts (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  title text not null,
  image_url text,
  certifications text[] default '{}',
  description text[] default '{}',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Security: Enable Row Level Security (RLS)
alter table experts enable row level security;

-- 4. Policies: Allow access
create policy "Public experts are viewable by everyone."
  on experts for select
  using ( true );

create policy "Experts are insertable by everyone."
  on experts for insert
  with check ( true );

create policy "Experts are updateable by everyone."
  on experts for update
  using ( true );

-- 5. Storage: Ensure the storage bucket exists
insert into storage.buckets (id, name, public)
values ('experts', 'experts', true)
on conflict (id) do nothing;

-- 6. Storage Policies: Allow image uploads
drop policy if exists "Experts images are publicly accessible." on storage.objects;
create policy "Experts images are publicly accessible."
  on storage.objects for select
  using ( bucket_id = 'experts' );

drop policy if exists "Anyone can upload an expert image." on storage.objects;
create policy "Anyone can upload an expert image."
  on storage.objects for insert
  with check ( bucket_id = 'experts' );
*/
