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