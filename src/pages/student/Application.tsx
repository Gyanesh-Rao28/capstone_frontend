import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ArrowRight, UserPlus, Mail, Shield, OctagonAlert , PlusCircle, CircleX } from 'lucide-react'
import { getAllApplications } from '../../services/studentApi';
import Loading from '../../components/Loading';
import JoinTeamModal from '../../components/studentsComponents/JoinTeamModal';

// Define types based on the updated API response
interface User {
  name: string;
  email: string;
}

interface Faculty {
  user: User;
}

interface Project {
  title: string;
  description: string;
  domain: 'AIML' | 'Cloud' | 'Cyber' | 'IOT';
  course: 'IDP' | 'UROP' | 'Capstone';
  faculty: Faculty;
}

interface Application {
  id: string;
  groupId: string;
  projectId: string;
  applicationStatus: 'Pending' | 'Approved' | 'Rejected';
  project: Project;
}

const Application = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await getAllApplications();
      setApplications(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch applications');
      setLoading(false);
      console.error('Error fetching applications:', err);
    }
  };

  // Helper function to get domain badge color
  const getDomainColor = (domain: string) => {
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

  // Helper function to get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleJoinSuccess = () => {
    // Refresh the applications after successfully joining a team
    fetchApplications();
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="w-full max-w-7xl mx-auto p-4">
        <div className="bg-red-50 p-4 rounded-lg shadow-sm">
          <p className="text-red-800">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gray-50 overflow-y-auto">
      {/* Header Section */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Project Applications</h1>
          <button
            onClick={() => setIsJoinModalOpen(true)}
            className="flex items-center justify-center py-2 px-4 bg-blue-600 text-white hover:bg-blue-700 transition-colors rounded-md font-medium text-sm shadow-sm"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Join Team
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {applications.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-8 text-center">
              <div className="flex flex-col items-center justify-center">
                <div className="bg-blue-100 rounded-full p-4 mb-4">
                  <BookOpen className="h-10 w-10 text-blue-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">No Applications Yet</h2>
                <p className="text-gray-500 mt-2">You haven't applied to any projects yet.</p>
                <button
                  onClick={() => setIsJoinModalOpen(true)}
                  className="mt-6 flex items-center justify-center py-2 px-4 bg-blue-600 text-white hover:bg-blue-700 transition-colors rounded-md font-medium text-sm"
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Join Your First Team
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Status Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-md p-4 flex items-start space-x-4">
                <div className="bg-yellow-100 rounded-lg p-3">
                    <OctagonAlert  className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Pending Applications</h3>
                  <p className="mt-1 text-lg font-semibold text-gray-900">
                    {applications.filter(app => app.applicationStatus === 'Pending').length}
                  </p>
                </div>
              </div>

                

              <div className="bg-white rounded-lg shadow-md p-4 flex items-start space-x-4">
                <div className="bg-green-100 rounded-lg p-3">
                  <Shield className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Approved Applications</h3>
                  <p className="mt-1 text-lg font-semibold text-gray-900">
                    {applications.filter(app => app.applicationStatus === 'Approved').length}
                  </p>
                </div>
              </div>

                <div className="bg-white rounded-lg shadow-md p-4 flex items-start space-x-4">
                  <div className="bg-rose-100 rounded-lg p-3">
                    <CircleX className="h-6 w-6 text-rose-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Rejected Applications</h3>
                    <p className="mt-1 text-lg font-semibold text-gray-900">
                      {applications.filter(app => app.applicationStatus === 'Rejected').length}
                    </p>
                  </div>
                </div>

              <div className="bg-white rounded-lg shadow-md p-4 flex items-start space-x-4">
                <div className="bg-blue-100 rounded-lg p-3">
                  <Mail className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Total Applications</h3>
                  <p className="mt-1 text-lg font-semibold text-gray-900">
                    {applications.length}
                  </p>
                </div>
              </div>
            </div>

            {/* Applications List */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="border-b border-gray-200 px-6 py-4">
                <h2 className="text-lg font-semibold text-gray-900">Your Applications</h2>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {applications.map((application) => (
                    <div key={application.id} className="bg-gray-50 rounded-lg shadow-sm overflow-hidden flex flex-col h-full border border-gray-200">
                      {/* Status Badge - Top Right */}
                      <div className="relative">
                        <span className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(application.applicationStatus)}`}>
                          {application.applicationStatus}
                        </span>
                      </div>

                      {/* Card Content */}
                      <div className="p-5 flex-grow">
                        {/* Domain Badge */}
                        <span className={`inline-block px-2 py-1 rounded-md text-xs font-medium mb-2 ${getDomainColor(application.project.domain)}`}>
                          {application.project.domain}
                        </span>

                        {/* Course Badge */}
                        <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs font-medium mb-2 ml-2">
                          {application.project.course}
                        </span>

                        {/* Project Title */}
                        <h3 className="text-lg font-bold text-gray-900 mt-2 mb-2 line-clamp-2">{application.project.title}</h3>

                        {/* Project Description */}
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{application.project.description}</p>

                        {/* Faculty Info */}
                        <div className="mt-auto">
                          <p className="text-xs text-gray-500">Faculty</p>
                          <p className="text-sm font-medium text-gray-900">{application.project.faculty.user.name}</p>
                        </div>
                      </div>

                      {/* View More Button */}
                      <div className="border-t border-gray-200 p-4 bg-white">
                        <Link
                          to={`/application/${application.id}`}
                          className="flex items-center justify-center w-full py-2 px-4 bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors rounded-md font-medium text-sm"
                        >
                          View Details
                          <ArrowRight className="h-4 w-4 ml-1" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </main>

      {/* Join Team Modal */}
      <JoinTeamModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
        onSuccess={handleJoinSuccess}
      />
    </div>
  );
};

export default Application;