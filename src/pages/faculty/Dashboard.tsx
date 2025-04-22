// src/pages/faculty/Dashboard.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { ProjectType } from '../../types/project';
import { fetchFacultyProjects } from '../../services/facultyApi';

const FacultyDashboard = () => {
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true);
        const facultyData = await fetchFacultyProjects();
        setProjects(facultyData.faculty.projects);
      } catch (err) {
        setError('Failed to load projects');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  const handleCreateProject = () => {
    navigate('/faculty/project/create');
  };

  const handleEditProject = (projectId: string) => {
    navigate(`/faculty/project/edit/${projectId}`);
  };

  const handleViewProject = (projectId: string) => {
    navigate(`/faculty/project/${projectId}`);
  };

  const getDomainColor = (domain: string) => {
    const colors = {
      'AIML': 'bg-purple-100 text-purple-800',
      'Cloud': 'bg-blue-100 text-blue-800',
      'Cyber': 'bg-red-100 text-red-800',
      'IOT': 'bg-green-100 text-green-800',
    };
    return colors[domain as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'draft': 'bg-gray-100 text-gray-800',
      'active': 'bg-green-100 text-green-800',
      'completed': 'bg-blue-100 text-blue-800',
      'archived': 'bg-red-100 text-red-800',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-red-600 text-center">
          <p className="text-xl font-semibold">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Projects</h1>
          <p className="text-gray-600">Manage your projects and review applications</p>
        </div>
        <button
          onClick={handleCreateProject}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus size={18} />
          Create Project
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Projects Yet</h3>
          <p className="text-gray-600 mb-6">Create your first project to get started</p>
          <button
            onClick={handleCreateProject}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 inline-flex items-center gap-2"
          >
            <Plus size={18} />
            Create Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden border border-gray-100"
            >
              <div className="p-6">
                <div className="flex flex-wrap gap-2 mb-2">
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${getDomainColor(project.domain)}`}>
                    {project.domain}
                  </span>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(project.status)}`}>
                    {project.status}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{project.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-3">{project.description}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags?.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>{project.course}</span>
                  {project.deadline && (
                    <span>Due: {new Date(project.deadline).toLocaleDateString()}</span>
                  )}
                </div>
              </div>

              <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-between">
                <button 
                  onClick={() => handleViewProject(project.id)} 
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                >
                  <Eye size={16} /> View
                </button>
                <button 
                  onClick={() => handleEditProject(project.id)} 
                  className="flex items-center gap-1 text-green-600 hover:text-green-800"
                >
                  <Edit size={16} /> Edit
                </button>
                <button className="flex items-center gap-1 text-red-600 hover:text-red-800">
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Applications</h2>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 bg-blue-50 border-b border-blue-100 text-blue-800">
            <p>Check the Applications tab to review student applications for your projects</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboard;