import Hero from '@/components/Hero';
import Benefits from '@/components/Benefits';
import About from '@/components/About';

import Services from '@/components/Services';
import Experts from '@/components/Experts';
import Testimonials from '@/components/Testimonials';
import Gallery from '@/components/Gallery';
import Impact from '@/components/Impact';
import { createServerSupabaseClient } from '@/lib/supabase';
import { cookies } from 'next/headers';

export default async function Home() {
  const cookieStore = await cookies();
  const supabase = await createServerSupabaseClient(cookieStore);
  const { data: services } = await supabase
    .from('services')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: true });

  return (
    <main className="min-h-screen flex flex-col">
      <Hero />
      <Benefits />
      <About />
      <Impact />

      <Services services={services || []} />
      <Experts />
      <Testimonials />
      <Gallery />
    </main>
  );
}
