export interface User {
    id: string;
    email: string;
    role: 'ADMIN' | 'EDITOR' | 'VIEWER';
    createdAt: Date;
}
export interface ContentType {
    id: string;
    name: string;
    slug: string;
    fields: ContentField[];
}
export interface ContentField {
    name: string;
    type: 'text' | 'number' | 'boolean' | 'date' | 'image';
    required: boolean;
}
export interface RegisterDto {
    email: string;
    password: string;
    name: string
}
export interface LoginDto {
    email: string;
    password: string;
}
export interface AuthResponse {
    accessToken: string;
    user: Omit<User, 'password'>;
}
