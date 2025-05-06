import { apiClient } from "../libs/axios";  // Update with your actual path

// Get all users
export const getAllUsers = async () => {
    const response = await apiClient.get('/api/admin/getAllusers');
    return response.data;
};

// Assign faculty role
export const assignFacultyRole = async (userId: string, department: string, designation: string) => {
    const response = await apiClient.post(`/api/admin/assignFacultyRole?userId=${userId}&department=${department}&designation=${designation}`);
    return response.data;
};

// Assign student role
export const assignStudentRole = async (userId: string, rollNumber: string, batch: string) => {
    const response = await apiClient.post(`/api/admin/assignStudentRole?userId=${userId}&rollNumber=${rollNumber}&batch=${batch}`);
    return response.data;
};

// Assign admin role
export const assignAdminRole = async (userId: string) => {
    const response = await apiClient.post(`/api/admin/assignAdminRole?userId=${userId}`);
    return response.data;
};