import Image from "next/image";
import Hero from '@/components/Hero';
import Benefits from '@/components/Benefits';
import About from '@/components/About';

import Services from '@/components/Services';
import Experts from '@/components/Experts';
import Testimonials from '@/components/Testimonials';
import Gallery from '@/components/Gallery';
import Impact from '@/components/Impact';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <Hero />
      <Benefits />
      <About />
      <Impact />

      <Services />
      <Experts />
      <Testimonials />
      <Gallery />
    </main>
  );
}
