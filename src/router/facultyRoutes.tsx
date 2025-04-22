// src/routes/facultyRoutes.tsx
import { RouteObject } from 'react-router-dom';
import FacultyLayout from '../layout/FacultyLayout';
import FacultyDashboard from '../pages/faculty/Dashboard';
import ProjectForm from '../pages/faculty/ProjectForm';
import ApplicationsReview from '../pages/faculty/ApplicationReview';
import ApplicationDetail from '../pages/faculty/ApplicationDetail';
import GroupDetail from '../pages/faculty/GroupDetail';

const facultyRoutes: RouteObject[] = [
  {
    path: '/faculty',
    element: <FacultyLayout />,
    children: [
      {
        path: '',
        element: <FacultyDashboard />,
      },
      {
        path: 'dashboard',
        element: <FacultyDashboard />,
      },
      {
        path: 'project/create',
        element: <ProjectForm />,
      },
      {
        path: 'project/edit/:projectId',
        element: <ProjectForm />,
      },
      {
        path: 'applications',
        element: <ApplicationsReview />,
      },
      {
        path: 'applications/:applicationId',
        element: <ApplicationDetail />,
      },
      {
        path: 'groups/:groupId',
        element: <GroupDetail />,
      },
    ],
  },
];

export default facultyRoutes;