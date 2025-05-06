// src/pages/student/Project.tsx

import { useState, useEffect } from 'react';
import { Search, Filter, X, BookOpen , Calendar, Server } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getAllProjects } from '../../services/studentApi';
import Loading from '../../components/Loading';

export enum ProjectDomain {
  AIML = 'AIML',
  Cloud = 'Cloud',
  Cyber = 'Cyber',
  IOT = 'IOT'
}

export enum ProjectStatus {
  draft = 'draft',
  active = 'active',
  completed = 'completed',
  archived = 'archived'
}

export enum CourseType {
  IDP = 'IDP',
  UROP = 'UROP',
  Capstone = 'Capstone'
}

export interface ProjectType {
  id: string;
  facultyId: string;
  title: string;
  description: string;
  domain: ProjectDomain;
  status: ProjectStatus;
  course: CourseType;
  tags: string[];
  deadline: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const Project = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<ProjectDomain | ''>('');
  const [selectedCourse, setSelectedCourse] = useState<CourseType | ''>('');
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  // Fetch projects from API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        const response = await getAllProjects();

        // The API returns { status: "success", data: [...] }
        const projectsData = response.data || [];

        // Convert string dates to Date objects
        const formattedProjects = projectsData.map((project: any) => ({
          ...project,
          deadline: project.deadline ? new Date(project.deadline) : null,
          createdAt: new Date(project.createdAt),
          updatedAt: new Date(project.updatedAt)
        }));

        setProjects(formattedProjects);
        setError(null);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError('Failed to load projects. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Handle View Details button click
  const handleViewDetails = (projectId: string) => {
    navigate(`/project/${projectId}`);
  };

  // Get domain badge color
  const getDomainColor = (domain: ProjectDomain) => {
    switch (domain) {
      case ProjectDomain.AIML:
        return 'bg-purple-100 text-purple-800';
      case ProjectDomain.Cloud:
        return 'bg-blue-100 text-blue-800';
      case ProjectDomain.Cyber:
        return 'bg-teal-100 text-teal-800';
      case ProjectDomain.IOT:
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get course badge color
  const getCourseColor = (course: CourseType) => {
    switch (course) {
      case CourseType.Capstone:
        return 'bg-blue-100 text-blue-800';
      case CourseType.IDP:
        return 'bg-green-100 text-green-800';
      case CourseType.UROP:
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Handle reset filters
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedDomain('');
    setSelectedCourse('');
  };

  // Filter projects based on search term, domain, and course
  const filteredProjects = projects.filter(project => {
    const matchesSearch = searchTerm.trim() === '' ||
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesDomain = selectedDomain === '' || project.domain === selectedDomain;
    const matchesCourse = selectedCourse === '' || project.course === selectedCourse;

    return matchesSearch && matchesDomain && matchesCourse;
  });

  // Toggle filter sidebar for mobile view
  const toggleFilterSidebar = () => {
    setIsFilterVisible(!isFilterVisible);
  };

  // Check if any filters are active
  const hasActiveFilters = searchTerm.trim() !== '' || selectedDomain !== '' || selectedCourse !== '';

  return (
    <div className="w-full h-full max-h-screen overflow-hidden flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Projects</h1>

          {/* Mobile Filter Toggle Button */}
          <button
            onClick={toggleFilterSidebar}
            className="md:hidden flex items-center space-x-1 py-2 px-3 bg-blue-50 text-blue-600 rounded-md"
          >
            <Filter className="h-4 w-4" />
            <span>Filters</span>
          </button>
        </div>
      </header>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Filter Sidebar - Mobile (Overlay) */}
        <div className={`
          md:hidden fixed inset-0 bg-gray-800 bg-opacity-75 z-50 transition-opacity duration-300
          ${isFilterVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        `}>
          <div className={`
            fixed inset-y-0 right-0 max-w-xs w-full bg-white shadow-xl transform transition-transform duration-300 ease-in-out overflow-y-auto
            ${isFilterVisible ? 'translate-x-0' : 'translate-x-full'}
          `}>
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold">Filters</h2>
              <button
                onClick={toggleFilterSidebar}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <div className="p-4 space-y-6">
              {/* Mobile Search */}
              <div>
                <label htmlFor="mobile-search" className="block text-sm font-medium text-gray-700 mb-1">
                  Search
                </label>
                <div className="relative">
                  <input
                    id="mobile-search"
                    type="text"
                    placeholder="Search projects..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <Search className="h-5 w-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2" />
                </div>
              </div>

              {/* Mobile Domain Filter */}
              <div>
                <label htmlFor="mobile-domain" className="block text-sm font-medium text-gray-700 mb-1">
                  Domain
                </label>
                <select
                  id="mobile-domain"
                  value={selectedDomain}
                  onChange={(e) => setSelectedDomain(e.target.value as ProjectDomain | '')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Domains</option>
                  {Object.values(ProjectDomain).map((domain) => (
                    <option key={domain} value={domain}>{domain}</option>
                  ))}
                </select>
              </div>

              {/* Mobile Course Type Filter */}
              <div>
                <label htmlFor="mobile-course" className="block text-sm font-medium text-gray-700 mb-1">
                  Course Type
                </label>
                <select
                  id="mobile-course"
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value as CourseType | '')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Courses</option>
                  {Object.values(CourseType).map((course) => (
                    <option key={course} value={course}>{course}</option>
                  ))}
                </select>
              </div>

              {/* Mobile Reset Filters Button */}
              <button
                onClick={resetFilters}
                className="w-full mt-4 py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
              >
                Reset Filters
              </button>

              {/* Mobile Apply Button */}
              <button
                onClick={toggleFilterSidebar}
                className="w-full mt-2 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>

        {/* Filter Sidebar - Desktop */}
        <div className="hidden md:block w-64 bg-white shadow-md overflow-y-auto">
          <div className="p-6 space-y-8">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800">Filters</h2>

              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <Search className="h-5 w-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2" />
              </div>

              {/* Divider */}
              <div className="border-t border-gray-200 my-4"></div>

              {/* Domain Filter */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Domain
                </label>
                <select
                  value={selectedDomain}
                  onChange={(e) => setSelectedDomain(e.target.value as ProjectDomain | '')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Domains</option>
                  {Object.values(ProjectDomain).map((domain) => (
                    <option key={domain} value={domain}>{domain}</option>
                  ))}
                </select>
              </div>

              {/* Course Type Filter */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Course Type
                </label>
                <select
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value as CourseType | '')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Courses</option>
                  {Object.values(CourseType).map((course) => (
                    <option key={course} value={course}>{course}</option>
                  ))}
                </select>
              </div>

              {/* Reset Filters */}
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="w-full mt-4 py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 flex items-center justify-center"
                >
                  <X className="h-4 w-4 mr-2" />
                  Reset Filters
                </button>
              )}
            </div>

            {/* Filter Stats */}
            <div className="text-sm text-gray-600">
              <p>Showing {filteredProjects.length} of {projects.length} projects</p>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          {/* Filter Summary (Desktop) */}
          <div className="hidden md:flex mb-6 items-center gap-2 flex-wrap">
            <span className="text-gray-700">Filters:</span>

            {searchTerm && (
              <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm flex items-center">
                Search: {searchTerm}
                <button onClick={() => setSearchTerm('')} className="ml-1 text-blue-500 hover:text-blue-700">
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            {selectedDomain && (
              <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm flex items-center">
                Domain: {selectedDomain}
                <button onClick={() => setSelectedDomain('')} className="ml-1 text-blue-500 hover:text-blue-700">
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            {selectedCourse && (
              <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm flex items-center">
                Course: {selectedCourse}
                <button onClick={() => setSelectedCourse('')} className="ml-1 text-blue-500 hover:text-blue-700">
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            {!hasActiveFilters && (
              <span className="text-gray-500 text-sm">No active filters</span>
            )}
          </div>

          {/* Projects Grid */}
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loading />
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md flex items-start">
              <div className="flex-shrink-0 mr-3">
                <X className="h-5 w-5" />
              </div>
              <p>{error}</p>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="flex flex-col items-center justify-center">
                <div className="bg-blue-100 rounded-full p-4 mb-4">
                  <BookOpen className="h-10 w-10 text-blue-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">No Projects Found</h2>
                <p className="text-gray-500 mt-2 mb-4">No projects match your current filters.</p>
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow border border-gray-200"
                >
                  <div className="p-5 flex-grow">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className={`px-2 py-1 rounded-md text-xs font-medium ${getDomainColor(project.domain)}`}>
                        {project.domain}
                      </span>
                      <span className={`px-2 py-1 rounded-md text-xs font-medium ${getCourseColor(project.course)}`}>
                        {project.course}
                      </span>
                    </div>

                    <h2 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                      {project.title}
                    </h2>

                    <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {project.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-0.5 text-xs bg-gray-100 text-gray-700 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                      {project.tags.length > 3 && (
                        <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-700 rounded-full">
                          +{project.tags.length - 3} more
                        </span>
                      )}
                    </div>

                    <div className="mt-auto flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center">
                        <Server className="h-3.5 w-3.5 mr-1 text-gray-400" />
                        <span>Created {new Date(project.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-3.5 w-3.5 mr-1 text-gray-400" />
                        <span>
                          {project.deadline
                            ? `Due ${project.deadline.toLocaleDateString()}`
                            : 'No deadline'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="px-5 py-3 bg-gray-50 border-t border-gray-200">
                    <button
                      onClick={() => handleViewDetails(project.id)}
                      className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Project;