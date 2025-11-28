'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Trash2, Upload, ImageIcon } from 'lucide-react';

export default function GalleryAdminPage() {
    const [images, setImages] = useState<{ name: string; url: string }[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const supabase = createClient();

    const fetchImages = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .storage
            .from('gallery')
            .list('', {
                limit: 100,
                offset: 0,
                sortBy: { column: 'name', order: 'asc' },
            });

        if (error) {
            console.error('Error fetching gallery images:', error);
            alert('Failed to fetch images');
        } else if (data) {
            const loadedImages = data
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .filter((file: any) => file.name !== '.emptyFolderPlaceholder')
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .map((file: any) => {
                    const { data: { publicUrl } } = supabase
                        .storage
                        .from('gallery')
                        .getPublicUrl(file.name);
                    return { name: file.name, url: publicUrl };
                });
            setImages(loadedImages);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchImages();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        if (images.length >= 10) {
            alert('Maximum 10 images allowed. Please delete some images first.');
            return;
        }

        const file = e.target.files[0];
        setUploading(true);

        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from('gallery')
                .upload(fileName, file);

            if (uploadError) throw uploadError;

            await fetchImages();
            alert('Image uploaded successfully');
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Failed to upload image');
        } finally {
            setUploading(false);
            // Reset the input
            e.target.value = '';
        }
    };

    const handleDelete = async (imageName: string) => {
        if (!confirm('Are you sure you want to delete this image?')) return;

        try {
            const { error } = await supabase.storage
                .from('gallery')
                .remove([imageName]);

            if (error) throw error;

            await fetchImages();
        } catch (error) {
            console.error('Error deleting image:', error);
            alert('Failed to delete image');
        }
    };

    if (loading) {
        return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>;
    }

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Gallery Management</h1>
                    <p className="text-gray-500 mt-2">Manage the images displayed in the gallery carousel.</p>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                        {images.length} / 10 Images
                    </span>
                </div>
            </div>

            {/* Upload Section */}
            <div className="bg-white p-6 rounded-xl shadow-sm border mb-8">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Upload className="w-5 h-5 text-pink-500" /> Upload New Image
                </h2>
                <div className="flex gap-4 items-end">
                    <div className="flex-1 max-w-md">
                        <Label htmlFor="image-upload">Select Image</Label>
                        <Input
                            id="image-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleUpload}
                            disabled={uploading || images.length >= 10}
                            className="mt-2"
                        />
                    </div>
                    {uploading && <div className="flex items-center text-pink-500 text-sm mb-2"><Loader2 className="w-4 h-4 animate-spin mr-2" /> Uploading...</div>}
                </div>
                {images.length >= 10 && (
                    <p className="text-red-500 text-sm mt-2">Maximum limit of 10 images reached. Delete some images to upload new ones.</p>
                )}
            </div>

            {/* Images Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {images.map((image) => (
                    <div key={image.name} className="group relative aspect-[4/3] bg-gray-100 rounded-xl overflow-hidden border shadow-sm hover:shadow-md transition-all">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={image.url}
                            alt={image.name}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDelete(image.name)}
                                className="flex items-center gap-2"
                            >
                                <Trash2 className="w-4 h-4" /> Delete
                            </Button>
                        </div>
                    </div>
                ))}

                {images.length === 0 && (
                    <div className="col-span-full py-12 flex flex-col items-center justify-center text-gray-400 bg-gray-50 rounded-xl border-2 border-dashed">
                        <ImageIcon className="w-12 h-12 mb-4 opacity-50" />
                        <p>No images in gallery yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
