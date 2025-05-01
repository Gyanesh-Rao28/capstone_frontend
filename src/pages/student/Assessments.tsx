// src/pages/student/Assessments.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, FileText, Award, CheckCircle, AlertCircle, ChevronRight } from 'lucide-react';
import { getSubmissionsByStudent } from '../../services/studentApi';
import Loading from '../../components/Loading';

interface Submission {
  id: string;
  assessmentId: string;
  studentId: string;
  content: string;
  attachments: string[];
  grade: number | null;
  createdAt: string;
  updatedAt: string;
  assessment: {
    id: string;
    title: string;
    description: string;
    deadline: string;
    groupId: string;
    group: {
      id: string;
      name: string;
      projectId: string;
      project: {
        id: string;
        title: string;
      };
    };
  };
}

const Assessments = () => {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [activeTab, setActiveTab] = useState<'pending' | 'completed'>('pending');

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setLoading(true);
        const response = await getSubmissionsByStudent();
        
        // Convert date strings to Date objects
        const formattedSubmissions = response.data.map((submission: any) => ({
          ...submission,
          createdAt: new Date(submission.createdAt),
          updatedAt: new Date(submission.updatedAt),
          assessment: {
            ...submission.assessment,
            deadline: new Date(submission.assessment.deadline),
          },
        }));
        
        setSubmissions(formattedSubmissions);
        setError(null);
      } catch (err) {
        console.error('Error fetching submissions:', err);
        setError('Failed to load assessments. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  // Sort and filter assessments based on tab
  const sortedSubmissions = [...submissions].sort((a, b) => {
    const dateA = new Date(a.assessment.deadline);
    const dateB = new Date(b.assessment.deadline);
    return dateA.getTime() - dateB.getTime();
  });

  // Use sample data if no real data and not in loading state
  const sampleSubmissions: Submission[] = [
    {
      id: 'sub-1',
      assessmentId: 'assess-1',
      studentId: 'student-1',
      content: 'Here is my midterm presentation focusing on the frontend architecture.',
      attachments: ['https://example.com/presentation.pdf'],
      grade: 85,
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      assessment: {
        id: 'assess-1',
        title: 'Midterm Project Progress Review',
        description: 'Present your project progress and current architecture.',
        deadline: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
        groupId: 'group-1',
        group: {
          id: 'group-1',
          name: 'Team Alpha',
          projectId: 'project-1',
          project: {
            id: 'project-1',
            title: 'AI-powered Health Monitoring System'
          }
        }
      }
    },
    {
      id: 'sub-2',
      assessmentId: 'assess-2',
      studentId: 'student-1',
      content: '',
      attachments: [],
      grade: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      assessment: {
        id: 'assess-2',
        title: 'Final Project Presentation',
        description: 'Present your completed project including demo and documentation.',
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        groupId: 'group-1',
        group: {
          id: 'group-1',
          name: 'Team Alpha',
          projectId: 'project-1',
          project: {
            id: 'project-1',
            title: 'AI-powered Health Monitoring System'
          }
        }
      }
    }
  ];

  const displaySubmissions = !loading && submissions.length === 0 ? sampleSubmissions : sortedSubmissions;

  // Filter assessments based on tab
  const filteredSubmissions = displaySubmissions.filter(submission => {
    const now = new Date();
    const deadline = new Date(submission.assessment.deadline);
    
    if (activeTab === 'pending') {
      // Show assessments where deadline hasn't passed or no submission exists
      return deadline >= now || !submission.content;
    } else {
      // Show assessments where either submitted before deadline or graded
      return (deadline < now && submission.content) || submission.grade !== null;
    }
  });

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Get status badge based on assessment and submission status
  const getStatusBadge = (submission: Submission) => {
    const now = new Date();
    const deadline = new Date(submission.assessment.deadline);
    
    if (!submission.content) {
      // No submission yet
      return deadline >= now 
        ? { color: 'bg-blue-100 text-blue-800', text: 'Pending Submission', icon: <Clock className="h-4 w-4 mr-1" /> }
        : { color: 'bg-red-100 text-red-800', text: 'Missed Deadline', icon: <AlertCircle className="h-4 w-4 mr-1" /> };
    } else if (submission.grade !== null) {
      // Graded
      return { color: 'bg-green-100 text-green-800', text: `Graded: ${submission.grade}/100`, icon: <CheckCircle className="h-4 w-4 mr-1" /> };
    } else {
      // Submitted but not graded
      return { color: 'bg-amber-100 text-amber-800', text: 'Submitted (Not Graded)', icon: <FileText className="h-4 w-4 mr-1" /> };
    }
  };

  // Handle navigation to assessment details
  const handleViewAssessment = (assessmentId: string) => {
    navigate(`/assessment/${assessmentId}`);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Assessments</h1>
          <p className="text-gray-600">View and submit your project assessments</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-4 py-2 font-medium text-sm flex items-center ${
            activeTab === 'pending'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Clock className="w-4 h-4 mr-2" />
          Pending
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`px-4 py-2 font-medium text-sm flex items-center ${
            activeTab === 'completed'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          Completed
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
      ) : filteredSubmissions.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="flex flex-col items-center justify-center">
            <div className="bg-blue-100 rounded-full p-4 mb-4">
              <FileText className="h-10 w-10 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">No {activeTab} assessments</h2>
            <p className="text-gray-500 mt-2 mb-4">
              {activeTab === 'pending'
                ? "You don't have any pending assessments."
                : "You don't have any completed assessments yet."}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredSubmissions.map((submission) => {
            const status = getStatusBadge(submission);
            
            return (
              <div
                key={submission.assessment.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-900 mb-2 md:mb-0">{submission.assessment.title}</h2>
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${status.color}`}>
                      {status.icon}
                      {status.text}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Project</h3>
                      <p className="text-gray-900">{submission.assessment.group.project.title}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Due Date</h3>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                        <p className="text-gray-900">{formatDate(submission.assessment.deadline)}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600 mb-6 line-clamp-2">
                    {submission.assessment.description}
                  </div>
                  
                  <div className="flex justify-between items-center">
                    {submission.content ? (
                      <div className="text-sm text-gray-500">
                        Submitted on {formatDate(submission.createdAt)}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500">
                        Not submitted yet
                      </div>
                    )}
                    
                    <button
                      onClick={() => handleViewAssessment(submission.assessment.id)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                    >
                      {!submission.content ? (
                        <>
                          <FileText className="w-4 h-4 mr-2" />
                          <span>Submit</span>
                        </>
                      ) : submission.grade === null ? (
                        <>
                          <FileText className="w-4 h-4 mr-2" />
                          <span>View Submission</span>
                        </>
                      ) : (
                        <>
                          <Award className="w-4 h-4 mr-2" />
                          <span>View Grade</span>
                        </>
                      )}
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </button>
                  </div>
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