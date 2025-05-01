import { apiClient } from '../libs/axios';


// Function to get all projects
export const getAllProjects = async () => {
    const response = await apiClient.get('/api/projects');
    return response.data; // This returns the entire response including status and data properties
};

// Function to get project by ID
export const getProjectById = async (id: string) => {
    const response = await apiClient.get(`/api/project/${id}`);
    return response.data;
};

// Function to check if student is a member of the project group
export const isMember = async (studentId: string, projectId: string) => {
    const response = await apiClient.get('/api/student/isMember', {
        params: { studentId, projectId }
    });
    return response.data;
};


// create Group
export const createGroup = async (projectId: string, grpName: string) => {
    
    const response = await apiClient.get('/api/student/createGroup', {
        params: { projectId, grpName }
    });
    return response.data;
};


export const applyForProject = async (projectId: string, groupId: string) => {
    const response = await apiClient.post('/api/student/createApplication', {
        projectId,
        groupId
    });
    return response.data;
};

export const getAllApplications = async () => {
    const response = await apiClient.get('/api/student/getAllApplication');
    return response.data;
};

export const getApplicationById = async (applicationId: string) => {
    const response = await apiClient.get(`/api/student/getApplicationById?applicationId=${applicationId}`);
    return response.data;
};

export const addGroupMember = async (inviteId: string) => {
    const response = await apiClient.put(`/api/student/addGroupMember?inviteId=${inviteId}`);
    return response.data;
};

export const removeMember = async (memberId: string, groupId: string) => {
    const response = await apiClient.delete(`/api/student/removeMember?memberId=${memberId}&groupId=${groupId}`);
    return response.data;
};

export const leaveGroup = async (groupId: string) => {
    const response = await apiClient.delete(`/api/student/leaveGroup?groupId=${groupId}`);
    return response.data;
};

// === Assessment APIs ===

// Get all assessments for student's groups
export const getStudentAssessments = async () => {
    const response = await apiClient.get('/api/student/assessments');
    return response.data;
};

// Get assessment by ID
export const getAssessmentById = async (assessmentId: string) => {
    const response = await apiClient.get(`/api/student/assessments/${assessmentId}`);
    return response.data;
};

// Submit an assessment
export const submitAssessment = async (submissionData: {
    assessmentId: string;
    content: string;
    attachments: string[];
}) => {
    const response = await apiClient.post('/api/student/submissions', submissionData);
    return response.data;
};

// Get all submissions by student
export const getSubmissionsByStudent = async () => {
    const response = await apiClient.get('/api/student/submissions');
    return response.data;
};

// Upload attachment for submission
export const uploadSubmissionAttachment = async (file: File, projectId: string) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await apiClient.post(
        `/api/student/submissions/upload?projectId=${projectId}`, 
        formData, 
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }
    );
    return response.data;
};

// Upload project report
export const uploadProjectReport = async (file: File, projectId: string) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await apiClient.post(
        `/api/student/submissions/report?projectId=${projectId}`, 
        formData, 
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }
    );
    return response.data;
};