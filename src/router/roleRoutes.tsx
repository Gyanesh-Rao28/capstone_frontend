// src/router/roleRoutes.tsx
import { RoleBasedRoute } from "../providers/RoleBasedProvider";
// import ManageStudent from "../pages/admin/ManageStudent";
// import ManageFaculty from "../pages/admin/ManageFaculty";
// import ManageAdmin from "../pages/admin/ManageAdmin";
import ManageUser from "../pages/admin/ManageUser";
import Analytic from "../pages/admin/Analytic";
import Project from "../pages/student/Project";
import Application from "../pages/student/Application";
import { UserRole } from "../types/enum";
import FacultyDashboard from "../pages/faculty/Dashboard";
import ProjectForm from "../pages/faculty/ProjectForm";
import ApplicationsReview from "../pages/faculty/ApplicationReview";
import ApplicationDetail from "../pages/faculty/ApplicationDetail";
import GroupDetail from "../pages/faculty/GroupDetail";
import ProjectById from "../pages/student/ProjectById";
import ApplicationById from "../pages/student/ApplicationById";

const adminRoutes = [
    // {
    //     path: "manage/students",
    //     element: (
    //         <RoleBasedRoute allowedRoles={[UserRole.admin]}>
    //             <ManageStudent />
    //         </RoleBasedRoute>
    //     )
    // },
    // {
    //     path: "manage/faculty",
    //     element: (
    //         <RoleBasedRoute allowedRoles={[UserRole.admin]}>
    //             <ManageFaculty />
    //         </RoleBasedRoute>
    //     )
    // },
    // {
    //     path: "manage/admin",
    //     element: (
    //         <RoleBasedRoute allowedRoles={[UserRole.admin]}>
    //             <ManageAdmin />
    //         </RoleBasedRoute>
    //     )
    // },
    {
        path: "manage/user",
        element: (
            <RoleBasedRoute allowedRoles={[UserRole.admin]}>
                <ManageUser />
            </RoleBasedRoute>
        )
    },
    {
        path: "analytics",
        element: (
            <RoleBasedRoute allowedRoles={[UserRole.admin]}>
                <Analytic />
            </RoleBasedRoute>
        )
    },
] as const;

const facultyRoutes = [
    {
        path: "faculty",
        element: (
            <RoleBasedRoute allowedRoles={[UserRole.faculty]}>
                <FacultyDashboard />
            </RoleBasedRoute>
        )
    },
    {
        path: "faculty/dashboard",
        element: (
            <RoleBasedRoute allowedRoles={[UserRole.faculty]}>
                <FacultyDashboard />
            </RoleBasedRoute>
        )
    },
    {
        path: "faculty/project/create",
        element: (
            <RoleBasedRoute allowedRoles={[UserRole.faculty]}>
                <ProjectForm />
            </RoleBasedRoute>
        )
    },
    {
        path: "faculty/project/edit/:projectId",
        element: (
            <RoleBasedRoute allowedRoles={[UserRole.faculty]}>
                <ProjectForm />
            </RoleBasedRoute>
        )
    },
    {
        path: "faculty/applications",
        element: (
            <RoleBasedRoute allowedRoles={[UserRole.faculty]}>
                <ApplicationsReview />
            </RoleBasedRoute>
        )
    },
    {
        path: "faculty/applications/:applicationId",
        element: (
            <RoleBasedRoute allowedRoles={[UserRole.faculty]}>
                <ApplicationDetail />
            </RoleBasedRoute>
        )
    },
    {
        path: "faculty/groups/:groupId",
        element: (
            <RoleBasedRoute allowedRoles={[UserRole.faculty]}>
                <GroupDetail />
            </RoleBasedRoute>
        )
    },
] as const;

const studentRoutes = [
    {
        path: "projects",
        element: (
            <RoleBasedRoute allowedRoles={[UserRole.student]}>
                <Project />
            </RoleBasedRoute>
        )
    },
    {
        path: "project/:projectId",
        element: (
            <RoleBasedRoute allowedRoles={[UserRole.student]}>
                <ProjectById />
            </RoleBasedRoute>
        )
    },
    {
        path: "applications",
        element: (
            <RoleBasedRoute allowedRoles={[UserRole.student]}>
                <Application />
            </RoleBasedRoute>
        )
    },
    {
        path: "application/:id",
        element: (
            <RoleBasedRoute allowedRoles={[UserRole.student]}>
                <ApplicationById />
            </RoleBasedRoute>
        )
    }
] as const;

const routes = {
    adminRoutes,
    facultyRoutes,
    studentRoutes
};

export default routes;