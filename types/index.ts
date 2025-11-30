export interface Service {
    id: string;
    title: string;
    description: string;
    category: string;
    price: number;
    duration: string;
    gradient?: string;
    image_url?: string;
    is_active: boolean;
}
