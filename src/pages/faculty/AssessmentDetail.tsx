// src/pages/faculty/AssessmentDetail.tsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Video, Calendar, Clock, Download, ExternalLink, Users, UserCircle, FileText, Award } from 'lucide-react';
import { getAssessmentById, gradeSubmission } from '../../services/facultyApi';
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
  student: {
    id: string;
    name: string;
    email: string;
  };
}

interface Group {
  id: string;
  name: string;
  projectId: string;
  members: {
    id: string;
    studentId: string;
    student: {
      id: string;
      name: string;
      email: string;
    };
  }[];
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
  group: Group;
  submissions: Submission[];
}

const AssessmentDetail = () => {
  const { assessmentId } = useParams<{ assessmentId: string }>();
  const navigate = useNavigate();

  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'submissions'>('details');
  const [expandedSubmission, setExpandedSubmission] = useState<string | null>(null);
  const [gradingSubmission, setGradingSubmission] = useState<string | null>(null);
  const [gradeValue, setGradeValue] = useState<number>(0);
  const [submittingGrade, setSubmittingGrade] = useState(false);
  const [gradeError, setGradeError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAssessmentDetails = async () => {
      if (!assessmentId) return;

      try {
        setLoading(true);
        const response = await getAssessmentById(assessmentId);
        
        // Process the data
        const assessmentData = {
          ...response.data,
          deadline: new Date(response.data.deadline),
          createdAt: new Date(response.data.createdAt),
          updatedAt: new Date(response.data.updatedAt),
        };
        
        setAssessment(assessmentData);
        setError(null);
      } catch (err) {
        console.error('Error fetching assessment details:', err);
        setError('Failed to load assessment details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAssessmentDetails();
  }, [assessmentId]);

  // Use sample data if real data isn't available (and not in loading state)
  useEffect(() => {
    if (!loading && !assessment && !error) {
      // Create sample assessment data
      const sampleAssessment: Assessment = {
        id: 'sample-1',
        groupId: 'group-1',
        facultyId: 'faculty-1',
        title: 'Final Project Presentation',
        description: 'Present your completed project including demo and documentation. Each team member should contribute to the presentation. Prepare a 15-minute presentation followed by a 5-minute Q&A session.',
        googleMeetLink: 'https://meet.google.com/abc-defg-hij',
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        group: {
          id: 'group-1',
          name: 'Team Alpha',
          projectId: 'project-1',
          members: [
            {
              id: 'member-1',
              studentId: 'student-1',
              student: {
                id: 'student-1',
                name: 'John Smith',
                email: 'john.smith@example.com'
              }
            },
            {
              id: 'member-2',
              studentId: 'student-2',
              student: {
                id: 'student-2',
                name: 'Emily Johnson',
                email: 'emily.johnson@example.com'
              }
            },
            {
              id: 'member-3',
              studentId: 'student-3',
              student: {
                id: 'student-3',
                name: 'Michael Chen',
                email: 'michael.chen@example.com'
              }
            }
          ]
        },
        submissions: [
          {
            id: 'submission-1',
            studentId: 'student-1',
            assessmentId: 'sample-1',
            content: 'Here is my part of the final presentation focusing on the backend architecture.',
            attachments: ['https://example.com/presentation.pdf', 'https://example.com/demo.mp4'],
            grade: 85,
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            student: {
              id: 'student-1',
              name: 'John Smith',
              email: 'john.smith@example.com'
            }
          },
          {
            id: 'submission-2',
            studentId: 'student-2',
            assessmentId: 'sample-1',
            content: 'I\'ve completed the frontend components and user experience design as per our project plan.',
            attachments: ['https://example.com/ui-design.pdf'],
            grade: null,
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            student: {
              id: 'student-2',
              name: 'Emily Johnson',
              email: 'emily.johnson@example.com'
            }
          }
        ]
      };
      
      setAssessment(sampleAssessment);
    }
  }, [loading, assessment, error]);

  // Format date
  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Format time
  const formatTime = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Toggle submission details
  const toggleSubmissionDetails = (submissionId: string) => {
    if (expandedSubmission === submissionId) {
      setExpandedSubmission(null);
    } else {
      setExpandedSubmission(submissionId);
    }
  };

  // Start grading a submission
  const startGrading = (submissionId: string, currentGrade: number | null) => {
    setGradeValue(currentGrade || 0);
    setGradingSubmission(submissionId);
    setGradeError(null);
  };

  // Cancel grading
  const cancelGrading = () => {
    setGradingSubmission(null);
    setGradeValue(0);
    setGradeError(null);
  };

  // Submit grade
  const submitGrade = async (submissionId: string) => {
    try {
      setSubmittingGrade(true);
      setGradeError(null);
      
      if (gradeValue < 0 || gradeValue > 100) {
        setGradeError('Grade must be between 0 and 100');
        setSubmittingGrade(false);
        return;
      }
      
      await gradeSubmission(submissionId, gradeValue);
      
      // Update local state
      if (assessment) {
        const updatedSubmissions = assessment.submissions.map(sub => {
          if (sub.id === submissionId) {
            return { ...sub, grade: gradeValue };
          }
          return sub;
        });
        
        setAssessment({
          ...assessment,
          submissions: updatedSubmissions
        });
      }
      
      setGradingSubmission(null);
    } catch (err) {
      console.error('Error submitting grade:', err);
      setGradeError('Failed to submit grade. Please try again.');
    } finally {
      setSubmittingGrade(false);
    }
  };

  // Check deadline status
  const isDeadlinePassed = () => {
    if (!assessment) return false;
    const now = new Date();
    const deadline = new Date(assessment.deadline);
    return now > deadline;
  };

  // Get list of students who haven't submitted
  const getMissingSubmissions = () => {
    if (!assessment) return [];
    
    const submittedStudentIds = assessment.submissions.map(s => s.studentId);
    return assessment.group.members.filter(
      member => !submittedStudentIds.includes(member.studentId)
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="mb-6">
          <button 
            onClick={() => navigate('/faculty/assessments')} 
            className="text-blue-600 flex items-center gap-1 hover:text-blue-800"
          >
            <ArrowLeft size={18} /> Back to Assessments
          </button>
        </div>
        
        <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-2">Error</h2>
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="mb-6">
          <button 
            onClick={() => navigate('/faculty/assessments')} 
            className="text-blue-600 flex items-center gap-1 hover:text-blue-800"
          >
            <ArrowLeft size={18} /> Back to Assessments
          </button>
        </div>
        
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-2">Assessment Not Found</h2>
          <p>The requested assessment could not be found.</p>
        </div>
      </div>
    );
  }

  const missingSubmissions = getMissingSubmissions();

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <button 
          onClick={() => navigate('/faculty/assessments')} 
          className="text-blue-600 flex items-center gap-1 hover:text-blue-800"
        >
          <ArrowLeft size={18} /> Back to Assessments
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Assessment Header */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">{assessment.title}</h1>
          <div className="text-sm text-gray-500 flex items-center mb-4">
            <Users className="h-4 w-4 mr-1" />
            <span>{assessment.group.name}</span>
            <span className="mx-2">•</span>
            <Calendar className="h-4 w-4 mr-1" />
            <span>Due {formatDate(assessment.deadline)}</span>
          </div>
          
          {/* Status indicator */}
          <div className="flex items-center">
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              isDeadlinePassed() 
                ? assessment.submissions.length === 0 
                  ? 'bg-red-100 text-red-800' 
                  : assessment.submissions.some(s => s.grade === null) 
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-green-100 text-green-800'
                : 'bg-blue-100 text-blue-800'
            }`}>
              {isDeadlinePassed() 
                ? assessment.submissions.length === 0 
                  ? 'No Submissions' 
                  : assessment.submissions.some(s => s.grade === null) 
                    ? 'Pending Grades'
                    : 'All Graded'
                : 'Upcoming'}
            </div>
          </div>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('details')}
            className={`px-4 py-3 font-medium text-sm flex items-center ${
              activeTab === 'details'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <FileText className="w-4 h-4 mr-2" />
            Assessment Details
          </button>
          <button
            onClick={() => setActiveTab('submissions')}
            className={`px-4 py-3 font-medium text-sm flex items-center ${
              activeTab === 'submissions'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Award className="w-4 h-4 mr-2" />
            Submissions {assessment.submissions.length > 0 && `(${assessment.submissions.length})`}
          </button>
        </div>
        
        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'details' ? (
            <div className="space-y-6">
              {/* Assessment Description */}
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-2">Description</h2>
                <div className="bg-gray-50 p-4 rounded-lg text-gray-700 whitespace-pre-line">
                  {assessment.description}
                </div>
              </div>
              
              {/* Google Meet Link */}
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-2">Meeting Link</h2>
                <div className="bg-blue-50 p-4 rounded-lg flex items-start">
                  <Video className="h-5 w-5 text-blue-500 mt-0.5 mr-3" />
                  <div>
                    <div className="font-medium text-blue-800 mb-1">Google Meet Link</div>
                    <a 
                      href={assessment.googleMeetLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 flex items-center"
                    >
                      {assessment.googleMeetLink}
                      <ExternalLink className="h-4 w-4 ml-1" />
                    </a>
                    <p className="text-sm text-blue-700 mt-2">
                      Share this link with students to join the assessment meeting at the scheduled time.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Deadline Information */}
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-2">Deadline Information</h2>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Calendar className="h-5 w-5 text-gray-500 mr-2" />
                    <div>
                      <div className="font-medium">Due Date</div>
                      <div className="text-gray-700">{formatDate(assessment.deadline)}</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-gray-500 mr-2" />
                    <div>
                      <div className="font-medium">Time</div>
                      <div className="text-gray-700">{formatTime(new Date(assessment.createdAt))}</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Group Members */}
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-2">Group Members</h2>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <ul className="divide-y divide-gray-200">
                    {assessment.group.members.map(member => (
                      <li key={member.id} className="py-3 flex items-center">
                        <UserCircle className="h-6 w-6 text-gray-400 mr-3" />
                        <div>
                          <div className="font-medium">{member.student.name}</div>
                          <div className="text-sm text-gray-500">{member.student.email}</div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Submission Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="font-medium text-blue-800 mb-2">Total Members</div>
                  <div className="text-2xl font-bold text-blue-900">{assessment.group.members.length}</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="font-medium text-green-800 mb-2">Submissions</div>
                  <div className="text-2xl font-bold text-green-900">{assessment.submissions.length}</div>
                </div>
                <div className={`p-4 rounded-lg ${assessment.submissions.some(s => s.grade === null) ? 'bg-amber-50' : 'bg-gray-50'}`}>
                  <div className={`font-medium mb-2 ${assessment.submissions.some(s => s.grade === null) ? 'text-amber-800' : 'text-gray-800'}`}>
                    Pending Grades
                  </div>
                  <div className={`text-2xl font-bold ${assessment.submissions.some(s => s.grade === null) ? 'text-amber-900' : 'text-gray-900'}`}>
                    {assessment.submissions.filter(s => s.grade === null).length}
                  </div>
                </div>
              </div>
              
              {/* Missing Submissions */}
              {missingSubmissions.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <h3 className="font-medium text-yellow-800 mb-2">Missing Submissions</h3>
                  <ul className="space-y-2">
                    {missingSubmissions.map(member => (
                      <li key={member.id} className="text-yellow-700 flex items-center">
                        <UserCircle className="h-4 w-4 mr-2" />
                        {member.student.name} ({member.student.email})
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Submissions List */}
              {assessment.submissions.length === 0 ? (
                <div className="text-center py-12 px-4">
                  <div className="bg-gray-100 rounded-full p-3 w-12 h-12 flex items-center justify-center mx-auto mb-4">
                    <FileText className="h-6 w-6 text-gray-500" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No Submissions Yet</h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    {isDeadlinePassed() 
                      ? "The deadline has passed and no submissions were received."
                      : "The submission deadline has not passed yet. Check back later."}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {assessment.submissions.map(submission => (
                    <div 
                      key={submission.id} 
                      className="border border-gray-200 rounded-lg overflow-hidden"
                    >
                      {/* Submission Header */}
                      <div 
                        className={`p-4 flex items-center justify-between cursor-pointer ${
                          expandedSubmission === submission.id ? 'bg-gray-50' : 'bg-white'
                        }`}
                        onClick={() => toggleSubmissionDetails(submission.id)}
                      >
                        <div className="flex items-center">
                          <UserCircle className="h-6 w-6 text-gray-400 mr-3" />
                          <div>
                            <div className="font-medium">{submission.student.name}</div>
                            <div className="text-sm text-gray-500">
                              Submitted {formatDate(submission.createdAt)} at {formatTime(submission.createdAt)}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          {submission.grade !== null ? (
                            <div className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full mr-4">
                              Grade: {submission.grade}/100
                            </div>
                          ) : (
                            <div className="bg-amber-100 text-amber-800 text-sm font-medium px-3 py-1 rounded-full mr-4">
                              Not Graded
                            </div>
                          )}
                          <svg 
                            className={`w-5 h-5 text-gray-500 transform transition-transform ${
                              expandedSubmission === submission.id ? 'rotate-180' : ''
                            }`} 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                      
                      {/* Expanded Submission Content */}
                      {expandedSubmission === submission.id && (
                        <div className="p-4 border-t border-gray-200 bg-white">
                          {/* Submission Content */}
                          <div className="mb-4">
                            <h3 className="text-sm font-medium text-gray-500 mb-2">Submission Content</h3>
                            <div className="bg-gray-50 p-4 rounded-lg text-gray-700 whitespace-pre-line">
                              {submission.content}
                            </div>
                          </div>
                          
                          {/* Attachments */}
                          {submission.attachments.length > 0 && (
                            <div className="mb-6">
                              <h3 className="text-sm font-medium text-gray-500 mb-2">Attachments</h3>
                              <ul className="space-y-2">
                                {submission.attachments.map((attachment, index) => {
                                  const fileName = attachment.split('/').pop() || `File ${index + 1}`;
                                  return (
                                    <li key={index}>
                                      <a 
                                        href={attachment} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="flex items-center text-blue-600 hover:text-blue-800"
                                      >
                                        <Download className="h-4 w-4 mr-2" />
                                        {fileName}
                                      </a>
                                    </li>
                                  );
                                })}
                              </ul>
                            </div>
                          )}
                          
                          {/* Grading Section */}
                          {gradingSubmission !== submission.id ? (
                            <div className="flex justify-end">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  startGrading(submission.id, submission.grade);
                                }}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                              >
                                <Award className="w-4 h-4 mr-2" />
                                {submission.grade !== null ? 'Update Grade' : 'Grade Submission'}
                              </button>
                            </div>
                          ) : (
                            <div className="border border-gray-200 rounded-lg p-4">
                              <h3 className="text-sm font-medium text-gray-500 mb-3">
                                {submission.grade !== null ? 'Update Grade' : 'Add Grade'}
                              </h3>
                              
                              {gradeError && (
                                <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                                  {gradeError}
                                </div>
                              )}
                              
                              <div className="flex flex-col sm:flex-row items-center mb-4">
                                <input
                                  type="number"
                                  min="0"
                                  max="100"
                                  value={gradeValue}
                                  onChange={(e) => setGradeValue(Number(e.target.value))}
                                  className="w-full sm:w-24 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                                <span className="mx-2 text-gray-500 mt-2 sm:mt-0">/</span>
                                <span className="text-gray-700">100</span>
                              </div>
                              
                              <div className="flex justify-end space-x-3">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    cancelGrading();
                                  }}
                                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                                  disabled={submittingGrade}
                                >
                                  Cancel
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    submitGrade(submission.id);
                                  }}
                                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center disabled:bg-blue-300"
                                  disabled={submittingGrade}
                                >
                                  {submittingGrade ? (
                                    <>
                                      <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                                      <span>Saving...</span>
                                    </>
                                  ) : (
                                    <>
                                      <Award className="w-4 h-4 mr-2" />
                                      <span>Save Grade</span>
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssessmentDetail;