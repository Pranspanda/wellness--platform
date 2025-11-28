import React from 'react';
import { createClient } from '@/lib/supabase';


const Impact = () => {
    const supabase = createClient();
    const { data: { publicUrl: groupWorkshopsUrl } } = supabase.storage.from('static-assets').getPublicUrl('group-workshops.png');
    const { data: { publicUrl: oneOnOneUrl } } = supabase.storage.from('static-assets').getPublicUrl('one-on-one.png');
    return (
        <section className="py-20 px-6 bg-white">
            <div className="max-w-6xl mx-auto">

                {/* Stats Section */}
                <div className="text-center mb-20">
                    <h2 className="text-3xl font-bold text-pink-500 mb-12">Impact in Numbers</h2>

                    <div className="grid grid-cols-3 md:grid-cols-3 gap-2 md:gap-8">
                        <div>
                            <div className="text-5xl font-bold text-pink-500 mb-2">1500+</div>
                            <p className="text-gray-500 text-sm">Youth experienced her meditation techniques</p>
                        </div>
                        <div>
                            <div className="text-5xl font-bold text-orange-400 mb-2">20+</div>
                            <p className="text-gray-500 text-sm">Years of teaching & coaching experience</p>
                        </div>
                        <div>
                            <div className="text-5xl font-bold text-gray-800 mb-2">Multiple</div>
                            <p className="text-gray-500 text-sm">Healing Modalities integrated for lasting change</p>
                        </div>
                    </div>
                </div>

                {/* Sessions Section */}
                <div className="text-center">
                    <h3 className="text-2xl font-bold text-gray-900 mb-12">Both Group & Individual Sessions Available</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Group Workshops */}
                        <div className="group cursor-pointer">
                            <div className="rounded-3xl overflow-hidden mb-6 shadow-lg">
                                {/* Placeholder Image */}
                                <img src={groupWorkshopsUrl} alt="Group Workshops" className="w-full h-auto" />
                            </div>
                            <h4 className="text-xl font-bold text-pink-500 mb-2">Group Workshops</h4>
                            <p className="text-gray-500 text-sm">Interactive sessions fostering peer learning and collective growth</p>
                        </div>

                        {/* One-on-One Coaching */}
                        <div className="group cursor-pointer">
                            <div className="rounded-3xl overflow-hidden mb-6 shadow-lg">
                                {/* Placeholder Image */}
                                <img src={oneOnOneUrl} alt="One-on-One Coaching" className="w-full h-auto" />
                            </div>
                            <h4 className="text-xl font-bold text-orange-400 mb-2">One-on-One Coaching</h4>
                            <p className="text-gray-500 text-sm">Personalized guidance tailored to individual needs and goals</p>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default Impact;
