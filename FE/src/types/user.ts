export interface UserProfile {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatarUrl: string;
    gender?: number | string;
    phoneNumber?: string;
    birthDate?: string;
    address?: string;
} 