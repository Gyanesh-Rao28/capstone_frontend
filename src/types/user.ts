// src/types/user.ts

export enum UserRole {
    admin = 'admin',
    faculty = 'faculty',
    student = 'student',
    user = 'user'
}

export interface Admin {
    id: string;
    userId: string;
}

export interface Faculty {
    id: string;
    userId: string;
    department: string | null;
    designation: string | null;
}

export interface Student {
    id: string;
    userId: string;
    rollNumber: string;
    batch: string | null;
}

export interface User {
    id: string;
    googleId: string;
    email: string;
    name: string;
    role: UserRole;
    profilePicture: string | null;
    createdAt: string;
    updatedAt: string;
    faculty: Faculty | null;
    student: Student | null;
    admin: Admin | null;
}