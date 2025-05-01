// src/pages/faculty/Assessments.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, ClipboardCheck, Clock, AlertCircle, Check, Award, ChevronRight } from 'lucide-react';
import { getAssessmentsByFaculty } from '../../services/facultyApi';
import Loading from '../../components/Loading';

interface Submission {
  id: string;
  studentId: string;
  assessmentId: string;
  content: string;
  attachments: string[];
  grade: number | null;
  createdAt: string;
  updatedAt: string;
}

interface Assessment {
  id: string;
  groupId: string;
  facultyId: string;
  title: string;
  description: string;
  googleMeetLink: string;
  deadline: string;
  createdAt: string;
  updatedAt: string;
  group: {
    id: string;
    name: string;
    projectId: string;
  };
  submissions: Submission[];
}

const Assessments = () => {
  const navigate = useNavigate();
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        setLoading(true);
        const response = await getAssessmentsByFaculty();
        
        // Convert date strings to Date objects
        const formattedAssessments = response.data.map((assessment: any) => ({
          ...assessment,
          deadline: new Date(assessment.deadline),
          createdAt: new Date(assessment.createdAt),
          updatedAt: new Date(assessment.updatedAt),
        }));
        
        setAssessments(formattedAssessments);
        setError(null);
      } catch (err) {
        console.error('Error fetching assessments:', err);
        setError('Failed to load assessments. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAssessments();
  }, []);

  // Filter assessments based on deadline (upcoming or past)
  const filteredAssessments = assessments.filter((assessment) => {
    const now = new Date();
    if (activeTab === 'upcoming') {
      return new Date(assessment.deadline) >= now;
    } else {
      return new Date(assessment.deadline) < now;
    }
  });

  // Sorted assessments (upcoming: by deadline asc, past: by deadline desc)
  const sortedAssessments = [...filteredAssessments].sort((a, b) => {
    if (activeTab === 'upcoming') {
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
    } else {
      return new Date(b.deadline).getTime() - new Date(a.deadline).getTime();
    }
  });

  // Calculate submission status for an assessment
  const getSubmissionStatus = (assessment: Assessment) => {
    const submissionCount = assessment.submissions.length;
    const gradedCount = assessment.submissions.filter(sub => sub.grade !== null).length;
    
    return {
      total: submissionCount,
      graded: gradedCount,
      pending: submissionCount - gradedCount
    };
  };

  // Get status badge color and text
  const getStatusBadge = (assessment: Assessment) => {
    const now = new Date();
    const deadline = new Date(assessment.deadline);
    const submissionStatus = getSubmissionStatus(assessment);
    
    if (deadline < now && submissionStatus.pending > 0) {
      return {
        color: 'bg-amber-100 text-amber-800',
        icon: <AlertCircle className="h-4 w-4 mr-1" />,
        text: 'Pending Grades'
      };
    } else if (deadline < now && submissionStatus.pending === 0) {
      return {
        color: 'bg-green-100 text-green-800',
        icon: <Check className="h-4 w-4 mr-1" />,
        text: 'Completed'
      };
    } else {
      return {
        color: 'bg-blue-100 text-blue-800',
        icon: <Clock className="h-4 w-4 mr-1" />,
        text: 'Upcoming'
      };
    }
  };

  // Format date to display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  // Navigation handlers
  const handleCreateAssessment = () => {
    navigate('/faculty/assessments/create');
  };

  const handleViewAssessment = (assessmentId: string) => {
    navigate(`/faculty/assessments/${assessmentId}`);
  };

  // Sample data if no assessments are available yet
  const sampleAssessments: Assessment[] = [
    {
      id: 'sample-1',
      groupId: 'group-1',
      facultyId: 'faculty-1',
      title: 'Midterm Project Review',
      description: 'Present your project progress and current architecture.',
      googleMeetLink: 'https://meet.google.com/abc-defg-hij',
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      group: {
        id: 'group-1',
        name: 'Team Alpha',
        projectId: 'project-1'
      },
      submissions: []
    },
    {
      id: 'sample-2',
      groupId: 'group-2',
      facultyId: 'faculty-1',
      title: 'Final Project Presentation',
      description: 'Present your completed project including demo and documentation.',
      googleMeetLink: 'https://meet.google.com/xyz-abcd-efg',
      deadline: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      group: {
        id: 'group-2',
        name: 'Team Beta',
        projectId: 'project-2'
      },
      submissions: [
        {
          id: 'sub-1',
          studentId: 'student-1',
          assessmentId: 'sample-2',
          content: 'Here is our final presentation',
          attachments: ['https://example.com/file.pdf'],
          grade: 85,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]
    }
  ];

  // Use sample data if no real data and not in loading state
  const displayAssessments = !loading && assessments.length === 0 ? sampleAssessments : sortedAssessments;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Assessments</h1>
          <p className="text-gray-600">Manage group assessments and review submissions</p>
        </div>
        <button
          onClick={handleCreateAssessment}
          className="mt-4 md:mt-0 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center"
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          <span>Create Assessment</span>
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`px-4 py-2 font-medium text-sm flex items-center ${
            activeTab === 'upcoming'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Clock className="w-4 h-4 mr-2" />
          Upcoming
        </button>
        <button
          onClick={() => setActiveTab('past')}
          className={`px-4 py-2 font-medium text-sm flex items-center ${
            activeTab === 'past'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <ClipboardCheck className="w-4 h-4 mr-2" />
          Past
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loading />
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
          <p>{error}</p>
        </div>
      ) : displayAssessments.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="flex flex-col items-center justify-center">
            <div className="bg-blue-100 rounded-full p-4 mb-4">
              <ClipboardCheck className="h-10 w-10 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">No {activeTab} assessments</h2>
            <p className="text-gray-500 mt-2 mb-6">
              {activeTab === 'upcoming'
                ? "You don't have any upcoming assessments scheduled."
                : "You don't have any past assessments."}
            </p>
            <button
              onClick={handleCreateAssessment}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
            >
              <PlusCircle className="w-5 h-5 mr-2" />
              Create New Assessment
            </button>
          </div>
        </div>
      ) : (
        <div className="grid gap-6">
          {displayAssessments.map((assessment) => {
            const status = getStatusBadge(assessment);
            const submissionStats = getSubmissionStatus(assessment);
            
            return (
              <div
                key={assessment.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-900 mb-2 md:mb-0">{assessment.title}</h2>
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${status.color}`}>
                      {status.icon}
                      {status.text}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Group</h3>
                      <p className="text-gray-900">{assessment.group.name}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Deadline</h3>
                      <p className="text-gray-900">{formatDate(assessment.deadline.toString())}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Submissions</h3>
                      <div className="flex items-center">
                        <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-md mr-2">
                          {submissionStats.graded} Graded
                        </div>
                        {submissionStats.pending > 0 && (
                          <div className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-md">
                            {submissionStats.pending} Pending
                          </div>
                        )}
                        {submissionStats.total === 0 && (
                          <div className="text-gray-500 text-sm">No submissions yet</div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600 mb-6 line-clamp-2">
                    {assessment.description}
                  </div>
                  
                  <button
                    onClick={() => handleViewAssessment(assessment.id)}
                    className="w-full md:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center"
                  >
                    <Award className="w-4 h-4 mr-2" />
                    <span>View Details</span>
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Assessments;