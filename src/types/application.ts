// src/types/application.ts
import { ProjectStatus } from './enum';

export enum ApplicationStatus {
  Pending = 'Pending',
  Approved = 'Approved',
  Rejected = 'Rejected'
}

export interface ProjectApplication {
  id: string;
  projectId: string;
  groupId: string;
  applicationStatus: ApplicationStatus;
  createdAt: string;
  updatedAt: string;
  project: {
    id: string;
    title: string;
    domain: string;
    status: ProjectStatus;
  };
  group: {
    id: string;
    name: string;
    currentMember: number;
    members: Array<{
      memberRole: string;
      student: {
        studentId: string;
        user?: {
          name: string;
          email: string;
        };
      };
    }>;
  };
}

export interface ApplicationDetailType extends ProjectApplication {
    project: {
      id: string;
      title: string;
      description: string;
      domain: string;
      status: ProjectStatus; // Change from string to ProjectStatus
    };
    group: {
      id: string; // Added the missing 'id' property
      name: string;
      currentMember: number;
      maxMembers: number;
      members: Array<{
        memberRole: string;
        student: {
          id: string;
          studentId: string;
          user: {
            name: string;
            email: string;
          };
        };
      }>;
    };
  }