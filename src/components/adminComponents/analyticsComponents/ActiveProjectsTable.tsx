import { useState } from 'react';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';

interface Project {
    id: string;
    title: string;
    faculty: string;
    domain: string;
    course: string;
    deadlineDate: string;
    daysRemaining: number;
    applications: number;
}

const ActiveProjectsTable = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const projectsPerPage = 5;

    // Fake data for active projects
    const projects: Project[] = [
        {
            id: "proj1",
            title: "Smart Traffic Management System",
            faculty: "Dr. Sambit Kumar Mishra",
            domain: "IOT",
            course: "Capstone",
            deadlineDate: "Nov 15, 2025",
            daysRemaining: 12,
            applications: 8
        },
        {
            id: "proj2",
            title: "Federated Learning for Healthcare Data",
            faculty: "Dr. Anuj Deshpande",
            domain: "AIML",
            course: "UROP",
            deadlineDate: "Dec 5, 2025",
            daysRemaining: 32,
            applications: 15
        },
        {
            id: "proj3",
            title: "Cloud-Native Microservices Architecture",
            faculty: "Dr. Ajay Bhardwaj",
            domain: "Cloud",
            course: "IDP",
            deadlineDate: "Nov 20, 2025",
            daysRemaining: 17,
            applications: 6
        },
        {
            id: "proj4",
            title: "Blockchain for Supply Chain Verification",
            faculty: "Dr Amit Kumar Mandal",
            domain: "Cyber",
            course: "Capstone",
            deadlineDate: "Dec 10, 2025",
            daysRemaining: 37,
            applications: 12
        },
        {
            id: "proj5",
            title: "Advanced NLP for Customer Service",
            faculty: "Dr. Prasanthi Boyapati",
            domain: "AIML",
            course: "IDP",
            deadlineDate: "Nov 25, 2025",
            daysRemaining: 22,
            applications: 10
        },
        {
            id: "proj6",
            title: "Smart Agricultural Monitoring System",
            faculty: "Dr Manjula R",
            domain: "IOT",
            course: "UROP",
            deadlineDate: "Dec 15, 2025",
            daysRemaining: 42,
            applications: 5
        },
        {
            id: "proj7",
            title: "Serverless Computing Applications",
            faculty: "Dr Amit Kumar Singh",
            domain: "Cloud",
            course: "Capstone",
            deadlineDate: "Nov 30, 2025",
            daysRemaining: 27,
            applications: 9
        }
    ];

    // Calculate pagination
    const indexOfLastProject = currentPage * projectsPerPage;
    const indexOfFirstProject = indexOfLastProject - projectsPerPage;
    const currentProjects = projects.slice(indexOfFirstProject, indexOfLastProject);
    const totalPages = Math.ceil(projects.length / projectsPerPage);

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const getDomainBadgeClass = (domain: string) => {
        switch (domain) {
            case 'AIML':
                return 'bg-purple-100 text-purple-800';
            case 'Cloud':
                return 'bg-blue-100 text-blue-800';
            case 'Cyber':
                return 'bg-teal-100 text-teal-800';
            case 'IOT':
                return 'bg-orange-100 text-orange-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getCourseBadgeClass = (course: string) => {
        switch (course) {
            case 'IDP':
                return 'bg-blue-100 text-blue-800';
            case 'UROP':
                return 'bg-green-100 text-green-800';
            case 'Capstone':
                return 'bg-amber-100 text-amber-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Project
                            </th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Faculty
                            </th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Type
                            </th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Deadline
                            </th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Applications
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {currentProjects.map((project) => (
                            <tr key={project.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{project.title}</div>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                    <div className="text-sm text-gray-500">{project.faculty}</div>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                    <div className="flex flex-wrap gap-1">
                                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${getDomainBadgeClass(project.domain)}`}>
                                            {project.domain}
                                        </span>
                                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${getCourseBadgeClass(project.course)}`}>
                                            {project.course}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <Clock className="h-4 w-4 text-gray-400 mr-1" />
                                        <div className="text-sm text-gray-500">
                                            {project.deadlineDate}
                                            <span className={`ml-1 text-xs ${project.daysRemaining <= 7 ? 'text-red-600 font-medium' :
                                                    project.daysRemaining <= 14 ? 'text-orange-600' : 'text-gray-500'
                                                }`}>
                                                ({project.daysRemaining} days)
                                            </span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                    <div className="text-sm font-medium text-gray-900">{project.applications}</div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 bg-gray-50">
                <div className="text-sm text-gray-500">
                    Showing {indexOfFirstProject + 1} to {Math.min(indexOfLastProject, projects.length)} of {projects.length} projects
                </div>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`p-1 rounded-md ${currentPage === 1
                                ? 'text-gray-300 cursor-not-allowed'
                                : 'text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </button>

                    <div className="flex space-x-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                onClick={() => handlePageChange(page)}
                                className={`px-3 py-1 rounded-md ${currentPage === page
                                        ? 'bg-blue-600 text-white'
                                        : 'text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {page}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`p-1 rounded-md ${currentPage === totalPages
                                ? 'text-gray-300 cursor-not-allowed'
                                : 'text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        <ChevronRight className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ActiveProjectsTable;