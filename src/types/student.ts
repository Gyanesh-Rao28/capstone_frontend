
// Student Type (matching Prisma schema)
export interface Student {
    id: string;
    userId: string;
    rollNumber: string;
    batch: string | null;
}