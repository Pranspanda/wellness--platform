'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useRouter } from 'next/navigation';
import { Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function EditExpertPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = React.use(params);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const router = useRouter();
    const supabase = createClient();
    const expertId = id;

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        title: '',
        image_url: '',
        certifications: '',
        description: ''
    });

    useEffect(() => {
        const fetchExpert = async () => {
            const { data, error } = await supabase
                .from('experts')
                .select('*')
                .eq('id', expertId)
                .single();

            if (error) {
                console.error('Error fetching expert:', error);
                alert('Expert not found');
                router.push('/admin/experts');
                return;
            }

            if (data) {
                setFormData({
                    name: data.name,
                    email: data.email || '',
                    title: data.title,
                    image_url: data.image_url || '',
                    certifications: data.certifications ? data.certifications.join(', ') : '',
                    description: data.description ? data.description.join('\n') : ''
                });
            }
            setLoading(false);
        };
        if (expertId) {
            fetchExpert();
        }
    }, [expertId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        const file = e.target.files[0];
        setUploading(true);

        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('experts')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('experts')
                .getPublicUrl(filePath);

            setFormData(prev => ({ ...prev, image_url: publicUrl }));
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Failed to upload image');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        const certificationsArray = formData.certifications.split(',').map(c => c.trim()).filter(c => c);
        const descriptionArray = formData.description.split('\n').map(d => d.trim()).filter(d => d);

        const updateData = {
            name: formData.name,
            email: formData.email,
            title: formData.title,
            image_url: formData.image_url || null,
            certifications: certificationsArray,
            description: descriptionArray
        };

        const { error } = await supabase
            .from('experts')
            .update(updateData)
            .eq('id', expertId);

        if (error) {
            alert('Failed to update expert: ' + error.message);
            console.error('Update error:', error);
        } else {
            alert('Expert updated successfully!');
            router.push('/admin/experts');
        }
        setSaving(false);
    };

    if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <Link href="/admin/experts" className="flex items-center text-gray-500 hover:text-gray-900 mb-6">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Experts
            </Link>

            <div className="bg-white rounded-xl shadow-sm border p-8">
                <h1 className="text-2xl font-bold mb-6 text-gray-800">Edit Expert</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
                    </div>

                    <div>
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
                    </div>

                    <div>
                        <Label htmlFor="title">Professional Title</Label>
                        <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
                    </div>

                    <div>
                        <Label htmlFor="image">Profile Image</Label>
                        <div className="flex gap-4 items-center mt-2">
                            {formData.image_url && (
                                <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 border">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
                                </div>
                            )}
                            <div className="flex-1">
                                <Input id="image" type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                                {uploading && <p className="text-xs text-blue-500 mt-1">Uploading...</p>}
                            </div>
                        </div>

                    </div>

                    <div>
                        <Label htmlFor="certifications">Certifications (Comma separated)</Label>
                        <Input id="certifications" name="certifications" value={formData.certifications} onChange={handleChange} />
                    </div>

                    <div>
                        <Label htmlFor="description">Description (Each paragraph on a new line)</Label>
                        <Textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            className="min-h-[150px]"
                        />
                    </div>

                    <div className="pt-4">
                        <Button type="submit" className="w-full bg-pink-500 hover:bg-pink-600" disabled={saving || uploading}>
                            {saving ? <Loader2 className="animate-spin mr-2" /> : null}
                            Update Expert
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
