import React from 'react';
import { Boxes, Users, BookOpen } from 'lucide-react';

interface Project {
    id: number;
    title: string;
    description: string;
    image: string;
    stats: {
        students: number;
        faculty: number;
        status: string;
    };
}

const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-48 bg-gradient-to-r from-blue-500 to-indigo-600 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                    <h3 className="text-2xl font-semibold text-white">{project.title}</h3>
                </div>
            </div>
            <div className="p-6">
                <p className="text-gray-600 mb-4">{project.description}</p>
                <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                        <div className="flex items-center justify-center bg-blue-100 rounded-lg p-2 mb-2">
                            <Users className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="text-sm text-gray-600">Students</div>
                        <div className="font-semibold">{project.stats.students}</div>
                    </div>
                    <div className="text-center">
                        <div className="flex items-center justify-center bg-green-100 rounded-lg p-2 mb-2">
                            <BookOpen className="h-5 w-5 text-green-600" />
                        </div>
                        <div className="text-sm text-gray-600">Faculty</div>
                        <div className="font-semibold">{project.stats.faculty}</div>
                    </div>
                    <div className="text-center">
                        <div className="flex items-center justify-center bg-purple-100 rounded-lg p-2 mb-2">
                            <Boxes className="h-5 w-5 text-purple-600" />
                        </div>
                        <div className="text-sm text-gray-600">Status</div>
                        <div className="font-semibold">{project.stats.status}</div>
                    </div>
                </div>
                <button className="w-full bg-gray-50 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors duration-200">
                    View Details
                </button>
            </div>
        </div>
    );
};

const FeaturedProjects: React.FC = () => {
    const projects: Project[] = [
        {
            id: 1,
            title: "AI-Powered Crop Management",
            description: "Machine learning system optimizing agricultural yields through intelligent monitoring and prediction.",
            image: "/crops.jpg",
            stats: {
                students: 12,
                faculty: 3,
                status: "Active"
            }
        },
        {
            id: 2,
            title: "Smart City Traffic Control",
            description: "IoT-based traffic management solution reducing urban congestion using real-time data analytics.",
            image: "/smartcity.jpg",
            stats: {
                students: 8,
                faculty: 2,
                status: "Ongoing"
            }
        },
        {
            id: 3,
            title: "Renewable Energy Forecasting",
            description: "Advanced algorithms for accurate prediction of renewable energy generation patterns.",
            image: "/energy.jpg",
            stats: {
                students: 15,
                faculty: 4,
                status: "Planning"
            }
        }
    ];

    return (
        <section className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                ))}
            </div>
        </section>
    );
};

const Home: React.FC = () => {
    return (
        <div className="h-full w-full bg-gray-50">
            {/* <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <h1 className="text-3xl font-bold text-gray-900">Project Management Portal</h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Discover and collaborate on innovative research projects
                    </p>
                </div>
            </header> */}

            <main className="max-w-7xl mx-auto px-4 py-8">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center">
                            <div className="bg-blue-100 rounded-lg p-3">
                                <Users className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="ml-4">
                                <h2 className="text-sm font-medium text-gray-500">Total Students</h2>
                                <p className="text-2xl font-semibold text-gray-900">35</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center">
                            <div className="bg-green-100 rounded-lg p-3">
                                <BookOpen className="h-6 w-6 text-green-600" />
                            </div>
                            <div className="ml-4">
                                <h2 className="text-sm font-medium text-gray-500">Active Faculty</h2>
                                <p className="text-2xl font-semibold text-gray-900">9</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center">
                            <div className="bg-purple-100 rounded-lg p-3">
                                <Boxes className="h-6 w-6 text-purple-600" />
                            </div>
                            <div className="ml-4">
                                <h2 className="text-sm font-medium text-gray-500">Total Projects</h2>
                                <p className="text-2xl font-semibold text-gray-900">3</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Projects Section */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-6">Featured Projects</h2>
                    <FeaturedProjects />
                </div>
            </main>
        </div>
    );
};

export default Home;