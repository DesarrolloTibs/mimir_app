/*export interface User {
    id: string;
    email: string;
    name: string;
    // Agrega más campos según tu API
}
*//*
export interface User {
    id: string;
    nombre: string;
    apellido: string;
    email: string;
    role: 'admin' | 'executive';
}*/

/*export enum Role {
    Admin = 'admin',
    Executive = 'executive',
}
*/
export interface User {
    id?: string;
    fullName: string;
    email: string;
    password?: string;
    role: 'Admin' | 'Developer' | 'Architect';
    isActive?: boolean;
    profileImageUrl?: string;
}
