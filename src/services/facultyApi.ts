// src/services/facultyApi.ts
import { apiClient } from '../libs/axios';
import { ProjectType } from '../types/project';
import { ApplicationStatus } from '../types/application';

// Faculty API calls

// Get faculty profile with projects
export const fetchFacultyProjects = async () => {
  const response = await apiClient.get('/api/faculty');
  return response.data;
};

// Project CRUD operations
export const createProject = async (projectData: Partial<ProjectType>) => {
  const response = await apiClient.post('/api/faculty/project', projectData);
  return response.data;
};

export const getProjectById = async (projectId: string) => {
  const response = await apiClient.get(`/api/project/${projectId}`);
  return response.data;
};

export const updateProject = async (projectId: string, projectData: Partial<ProjectType>) => {
  const response = await apiClient.put(`/api/faculty/project/${projectId}`, projectData);
  return response.data;
};

export const deleteProject = async (projectId: string) => {
  const response = await apiClient.delete(`/api/faculty/project/${projectId}`);
  return response.data;
};

// Application review APIs
export const getApplications = async () => {
  const response = await apiClient.get('/api/faculty/applications');
  return response.data;
};

export const getApplicationById = async (applicationId: string) => {
  const response = await apiClient.get(`/api/faculty/applications/${applicationId}`);
  return response.data;
};

export const reviewApplication = async (applicationId: string, status: ApplicationStatus) => {
  const response = await apiClient.put(`/api/faculty/applications/${applicationId}/review`, null, {
    params: { status }
  });
  return response.data;
};

// Group view API
export const getGroupById = async (groupId: string) => {
  const response = await apiClient.get(`/api/faculty/groups/${groupId}`);
  return response.data;
};

// === Assessment APIs ===

// Create a new assessment
export const createAssessment = async (assessmentData: {
  groupId: string;
  title: string;
  description: string;
  deadline: string | Date;
  startTime: string | Date;
  endTime: string | Date;
}) => {
  const response = await apiClient.post('/api/faculty/assessments', assessmentData);
  return response.data;
};

// Get all assessments for a faculty
export const getAssessmentsByFaculty = async () => {
  const response = await apiClient.get('/api/faculty/assessments');
  return response.data;
};

// Get a specific assessment by ID
export const getAssessmentById = async (assessmentId: string) => {
  const response = await apiClient.get(`/api/faculty/assessments/${assessmentId}`);
  return response.data;
};

// Grade a submission
export const gradeSubmission = async (submissionId: string, grade: number) => {
  const response = await apiClient.post('/api/faculty/submissions/grade', {
    submissionId,
    grade
  });
  return response.data;
};

// Get all submissions for an assessment
export const getSubmissionsByAssessment = async (assessmentId: string) => {
  const response = await apiClient.get(`/api/faculty/assessments/${assessmentId}/submissions`);
  return response.data;
};