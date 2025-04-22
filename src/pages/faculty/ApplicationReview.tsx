// src/pages/faculty/ApplicationsReview.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, X, Eye, Clock } from 'lucide-react';
import { ProjectStatus } from '../../types/enum';
import { ApplicationStatus } from '../../types/application';
import { getApplications, reviewApplication } from '../../services/facultyApi';

interface ProjectApplication {
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
      };
    }>;
  };
}

const ApplicationsReview = () => {
  const [applications, setApplications] = useState<ProjectApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadApplications = async () => {
      try {
        setLoading(true);
        const response = await getApplications();
        setApplications(response.data);
      } catch (err) {
        setError('Failed to load applications');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadApplications();
  }, []);

  const handleViewApplication = (applicationId: string) => {
    navigate(`/faculty/applications/${applicationId}`);
  };

  const handleViewGroup = (groupId: string) => {
    navigate(`/faculty/groups/${groupId}`);
  };

  const handleApproveApplication = async (applicationId: string) => {
    try {
      setActionLoading(applicationId);
      await reviewApplication(applicationId, ApplicationStatus.Approved);
      
      // Update local state
      setApplications(prev => 
        prev.map(app => 
          app.id === applicationId 
            ? { ...app, applicationStatus: ApplicationStatus.Approved }
            : app
        )
      );
    } catch (err) {
      setError('Failed to approve application');
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectApplication = async (applicationId: string) => {
    try {
      setActionLoading(applicationId);
      await reviewApplication(applicationId, ApplicationStatus.Rejected);
      
      // Update local state
      setApplications(prev => 
        prev.map(app => 
          app.id === applicationId 
            ? { ...app, applicationStatus: ApplicationStatus.Rejected }
            : app
        )
      );
    } catch (err) {
      setError('Failed to reject application');
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status: ApplicationStatus) => {
    const badges = {
      [ApplicationStatus.Pending]: <span className="flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800"><Clock size={14} /> Pending</span>,
      [ApplicationStatus.Approved]: <span className="flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800"><Check size={14} /> Approved</span>,
      [ApplicationStatus.Rejected]: <span className="flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800"><X size={14} /> Rejected</span>,
    };
    return badges[status];
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
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Project Applications</h1>
        <p className="text-gray-600">Review and manage student applications for your projects</p>
      </div>

      {applications.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Applications Yet</h3>
          <p className="text-gray-600">
            You haven't received any applications for your projects yet. 
            Check back later or create more projects to attract students.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Project
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Group
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Submitted
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {applications.map((application) => (
                  <tr key={application.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{application.project.title}</div>
                      <div className="text-sm text-gray-500">{application.project.domain}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{application.group.name}</div>
                      <div className="text-sm text-gray-500">{application.group.currentMember} members</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(application.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(application.applicationStatus)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleViewApplication(application.id)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Eye size={18} />
                        </button>
                        
                        {application.applicationStatus === ApplicationStatus.Pending && (
                          <>
                            <button
                              onClick={() => handleApproveApplication(application.id)}
                              disabled={actionLoading === application.id}
                              className="text-green-600 hover:text-green-900 disabled:opacity-50"
                            >
                              {actionLoading === application.id ? (
                                <span className="inline-block h-4 w-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></span>
                              ) : (
                                <Check size={18} />
                              )}
                            </button>
                            <button
                              onClick={() => handleRejectApplication(application.id)}
                              disabled={actionLoading === application.id}
                              className="text-red-600 hover:text-red-900 disabled:opacity-50"
                            >
                              <X size={18} />
                            </button>
                          </>
                        )}
                        
                        <button
                          onClick={() => handleViewGroup(application.group.id)}
                          className="text-purple-600 hover:text-purple-900"
                        >
                          View Group
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationsReview;