'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Loader2, Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const serviceSchema = z.object({
    title: z.string().min(2, 'Title is required'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    category: z.string().min(2, 'Category is required'),
    price: z.coerce.number().min(0, 'Price must be a positive number'),
    duration: z.string().min(1, 'Duration is required'),
    gradient: z.string().optional(),
    is_active: z.boolean().default(true),
});

type ServiceFormValues = z.infer<typeof serviceSchema>;

interface ServiceFormProps {
    initialData?: ServiceFormValues & { id?: string };
    isEditing?: boolean;
}

const GRADIENT_OPTIONS = [
    { label: 'Orange to Pink', value: 'from-orange-400 to-pink-500' },
    { label: 'Pink to Rose', value: 'from-pink-500 to-rose-500' },
    { label: 'Rose to Orange', value: 'from-rose-400 to-orange-400' },
    { label: 'Pink to Purple', value: 'from-pink-500 to-purple-500' },
    { label: 'Blue to Purple', value: 'from-blue-400 to-purple-500' },
    { label: 'Green to Teal', value: 'from-green-400 to-teal-500' },
];

export default function ServiceForm({ initialData, isEditing = false }: ServiceFormProps) {
    const [submitting, setSubmitting] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<ServiceFormValues>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(serviceSchema) as any,
        defaultValues: {
            title: initialData?.title || '',
            description: initialData?.description || '',
            category: initialData?.category || '',
            price: initialData?.price ? Number(initialData.price) : 0,
            duration: initialData?.duration || '60 min',
            gradient: initialData?.gradient || 'from-orange-400 to-pink-500',
            is_active: initialData?.is_active ?? true,
        },
    });

    const onSubmit = async (data: ServiceFormValues) => {
        setSubmitting(true);
        try {
            if (isEditing && initialData?.id) {
                const { error } = await supabase
                    .from('services')
                    .update(data)
                    .eq('id', initialData.id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('services')
                    .insert(data);
                if (error) throw error;
            }
            router.push('/admin/services');
            router.refresh();
        } catch (error) {
            console.error('Error saving service:', error);
            const message = error instanceof Error ? error.message : 'An unknown error occurred';
            alert(`Error saving service: ${message}`);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <div className="mb-6">
                <Link href="/admin/services" className="text-gray-500 hover:text-gray-700 flex items-center text-sm mb-4">
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Back to Services
                </Link>
                <h1 className="text-3xl font-bold text-gray-800">{isEditing ? 'Edit Service' : 'Add New Service'}</h1>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="title">Service Title</Label>
                        <Input id="title" {...register('title')} placeholder="e.g. Tarot Card Reading" />
                        {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Input id="category" {...register('category')} placeholder="e.g. Wellness, Divination" />
                        {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="price">Price (₹)</Label>
                            <Input id="price" type="number" {...register('price')} />
                            {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="duration">Duration</Label>
                            <Input id="duration" {...register('duration')} placeholder="e.g. 60 min" />
                            {errors.duration && <p className="text-red-500 text-sm">{errors.duration.message}</p>}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" {...register('description')} className="min-h-[100px]" placeholder="Brief description of the service..." />
                        {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label>Color Theme (Gradient)</Label>
                        <Select onValueChange={(val) => setValue('gradient', val)} defaultValue={watch('gradient')}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a gradient" />
                            </SelectTrigger>
                            <SelectContent>
                                {GRADIENT_OPTIONS.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        <div className="flex items-center">
                                            <div className={`w-4 h-4 rounded-full bg-gradient-to-br ${option.value} mr-2`}></div>
                                            {option.label}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="is_active"
                            {...register('is_active')}
                            className="h-4 w-4 rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                        />
                        <Label htmlFor="is_active" className="cursor-pointer">Active (Visible to public)</Label>
                    </div>
                </div>

                <div className="pt-4 flex justify-end">
                    <Button type="submit" disabled={submitting} className="bg-pink-600 hover:bg-pink-700 text-white min-w-[150px]">
                        {submitting ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2 w-4 h-4" />}
                        {isEditing ? 'Update Service' : 'Create Service'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
