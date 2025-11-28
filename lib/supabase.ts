import { createBrowserClient, createServerClient, type CookieOptions } from '@supabase/ssr';

export const createClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.warn('Supabase credentials missing. Using mock client for testing.');
    return createMockClient();
  }

  return createBrowserClient(supabaseUrl, supabaseKey);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createServerSupabaseClient = async (cookieStore: any) => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return createMockClient();
  }

  return createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch {
            // The `delete` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
};

// Mock Client Implementation
const createMockClient = () => {
  return {
    from: (table: string) => ({
      select: async () => {
        if (table === 'services') {
          return {
            data: [
              { id: '1', title: 'Yoga Session', category: 'Wellness', price: 50, duration: '60 min' },
              { id: '2', title: 'Meditation', category: 'Wellness', price: 30, duration: '30 min' },
              { id: '3', title: 'Nutrition Consultation', category: 'Health', price: 80, duration: '45 min' },
            ],
            error: null,
          };
        }
        if (table === 'experts') {
          return {
            data: [
              {
                id: '0',
                name: 'Dr. Manisha Jain',
                title: 'Emotional Intelligence Trainer & Founder',
                image_url: '/manisha-jain.jpg',
                certifications: ["PhD in Psychology", "Certified Life Coach"],
                description: [
                  "Dr. Manisha Jain is a renowned Emotional Intelligence Trainer...",
                  "She has empowered thousands of individuals..."
                ]
              },
              {
                id: '1',
                name: 'Nitika Sethi',
                title: 'Holistic Life Coach & Energy Healer',
                image_url: '/nitika-sethi.jpg',
                certifications: ["Reiki Master", "Tarot Reader"],
                description: [
                  "Nitika has more than two decades of coaching experience...",
                  "She works with individuals in a holistic manner..."
                ]
              },
              {
                id: '2',
                name: 'Aruna Puri',
                title: 'Multidisciplinary Artist & Vastu Expert',
                image_url: '/aruna-puri.jpg',
                certifications: ["Vastu Shastra Authority", "Theta Healing"],
                description: [
                  "With over 30 years of cross-disciplinary experience...",
                  "She is the creator of 70+ public artworks..."
                ]
              },
            ],
            error: null,
          };
        }
        return { data: [], error: null };
      },
      insert: async (data: unknown) => {
        console.log(`[Mock] Insert into ${table}:`, data);
        return { data: null, error: null };
      },
    }),
    auth: {
      getUser: async () => {
        return {
          data: {
            user: { id: 'mock-user-id', email: 'test@example.com' },
          },
          error: null,
        };
      },
    },
    storage: {
      from: (bucket: string) => ({
        upload: async (path: string, file: File) => {
          console.log(`[Mock] Uploading ${file.name} to ${bucket}/${path}`);
          return { data: { path }, error: null };
        },
        getPublicUrl: (path: string) => {
          return { data: { publicUrl: `https://mock-storage.com/${bucket}/${path}` } };
        },
      }),
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any;
};
