// src/pages/faculty/ApplicationDetail.tsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, X, Users, BookOpen } from 'lucide-react';
import { ProjectStatus } from '../../types/enum';
import { ApplicationStatus } from '../../types/application';
import { getApplicationById, reviewApplication } from '../../services/facultyApi';

interface StudentMember {
  memberRole: string;
  student: {
    id: string;
    studentId: string;
    user: {
      name: string;
      email: string;
    };
  };
}

interface ApplicationDetail {
  id: string;
  projectId: string;
  groupId: string;
  applicationStatus: ApplicationStatus;
  createdAt: string;
  updatedAt: string;
  project: {
    id: string;
    title: string;
    description: string;
    domain: string;
    status: string;
  };
  group: {
    name: string;
    currentMember: number;
    maxMembers: number;
    members: StudentMember[];
  };
}

const ApplicationDetail = () => {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  
  const [application, setApplication] = useState<ApplicationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  
  useEffect(() => {
    const loadApplication = async () => {
      try {
        setLoading(true);
        if (!applicationId) return;
        
        const response = await getApplicationById(applicationId);
        setApplication(response.data);
      } catch (err) {
        setError('Failed to load application details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    loadApplication();
  }, [applicationId]);
  
  const handleApprove = async () => {
    try {
      if (!applicationId) return;
      
      setActionLoading(true);
      await reviewApplication(applicationId, ApplicationStatus.Approved);
      
      // Update local state
      setApplication(prev => prev ? {
        ...prev,
        applicationStatus: ApplicationStatus.Approved
      } : null);
      
    } catch (err) {
      setError('Failed to approve application');
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };
  
  const handleReject = async () => {
    try {
      if (!applicationId) return;
      
      setActionLoading(true);
      await reviewApplication(applicationId, ApplicationStatus.Rejected);
      
      // Update local state
      setApplication(prev => prev ? {
        ...prev,
        applicationStatus: ApplicationStatus.Rejected
      } : null);
      
    } catch (err) {
      setError('Failed to reject application');
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };
  
  const getStatusBadge = (status: ApplicationStatus) => {
    const statusStyles = {
      [ApplicationStatus.Pending]: "bg-yellow-100 text-yellow-800",
      [ApplicationStatus.Approved]: "bg-green-100 text-green-800",
      [ApplicationStatus.Rejected]: "bg-red-100 text-red-800"
    };
    
    return (
      <span className={`px-3 py-1 text-sm font-medium rounded-full ${statusStyles[status]}`}>
        {status}
      </span>
    );
  };
  
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  if (error || !application) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-red-600 text-center">
          <p className="text-xl font-semibold">{error || 'Application not found'}</p>
          <button 
            onClick={() => navigate(-1)} 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft size={18} /> Back to Applications
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Application Details</h1>
            {getStatusBadge(application.applicationStatus)}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Submitted:</span>
              <span className="ml-2 text-gray-800">
                {new Date(application.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Last Updated:</span>
              <span className="ml-2 text-gray-800">
                {new Date(application.updatedAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          <div className="bg-blue-50 p-6 rounded-lg">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="text-blue-600" size={20} />
              <h2 className="text-lg font-semibold text-blue-800">Project Details</h2>
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 mb-2">{application.project.title}</h3>
            <div className="mb-3">
              <span className="px-2 py-1 text-xs font-medium rounded bg-blue-100 text-blue-800">
                {application.project.domain}
              </span>
              <span className="ml-2 px-2 py-1 text-xs font-medium rounded bg-gray-100 text-gray-800">
                {application.project.status}
              </span>
            </div>
            
            <p className="text-gray-700 mb-4">{application.project.description}</p>
          </div>
          
          <div className="bg-green-50 p-6 rounded-lg">
            <div className="flex items-center gap-2 mb-4">
              <Users className="text-green-600" size={20} />
              <h2 className="text-lg font-semibold text-green-800">Group Details</h2>
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 mb-2">{application.group.name}</h3>
            <p className="text-gray-700 mb-4">
              {application.group.currentMember} of {application.group.maxMembers} members
            </p>
            
            <div className="space-y-2">
              <h4 className="font-medium text-gray-700">Members:</h4>
              {application.group.members.map((member, index) => (
                <div key={index} className="bg-white p-3 rounded shadow-sm">
                  <div className="flex justify-between">
                    <span className="font-medium">
                      {member.student.user.name}
                    </span>
                    <span className="text-sm px-2 bg-gray-100 rounded-full">
                      {member.memberRole}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <div>ID: {member.student.studentId}</div>
                    <div>{member.student.user.email}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {application.applicationStatus === ApplicationStatus.Pending && (
          <div className="bg-gray-50 border-t border-gray-200 p-6 flex justify-end gap-4">
            <button
              onClick={handleReject}
              disabled={actionLoading}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
            >
              {actionLoading ? (
                <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <X size={18} />
              )}
              Reject Application
            </button>
            
            <button
              onClick={handleApprove}
              disabled={actionLoading}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
            >
              {actionLoading ? (
                <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <Check size={18} />
              )}
              Approve Application
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationDetail;