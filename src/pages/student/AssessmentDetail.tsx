// src/pages/student/AssessmentDetail.tsx
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Video, FileText, Upload, X, CheckCircle, Award, ExternalLink, Download } from 'lucide-react';
import { getAssessmentById, submitAssessment, uploadSubmissionAttachment } from '../../services/studentApi';
import Loading from '../../components/Loading';

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
    project: {
      id: string;
      title: string;
    };
  };
  faculty: {
    id: string;
    name: string;
    email: string;
  };
  submissions: {
    id: string;
    studentId: string;
    content: string;
    attachments: string[];
    grade: number | null;
    createdAt: string;
    updatedAt: string;
  }[];
}

interface SubmissionFormData {
  content: string;
  attachments: {
    name: string;
    url: string;
    size: string;
    type: string;
  }[];
}

const AssessmentDetail = () => {
  const { assessmentId } = useParams<{ assessmentId: string }>();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [mySubmission, setMySubmission] = useState<Assessment['submissions'][0] | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [fileUploadError, setFileUploadError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<SubmissionFormData>({
    content: '',
    attachments: []
  });

  // Fetch assessment details
  useEffect(() => {
    const fetchAssessmentDetails = async () => {
      if (!assessmentId) return;

      try {
        setLoading(true);
        const response = await getAssessmentById(assessmentId);
        
        // Format dates
        const assessmentData = {
          ...response.data,
          deadline: new Date(response.data.deadline),
          createdAt: new Date(response.data.createdAt),
          updatedAt: new Date(response.data.updatedAt),
          submissions: response.data.submissions.map((sub: any) => ({
            ...sub,
            createdAt: new Date(sub.createdAt),
            updatedAt: new Date(sub.updatedAt)
          }))
        };
        
        setAssessment(assessmentData);
        
        // Find user's submission if exists
        // In a real app, you'd use the actual student ID from auth context
        const studentId = 'student-1'; // Replace with actual student ID
        const userSubmission = assessmentData.submissions.find(
          (sub: any) => sub.studentId === studentId
        );
        
        if (userSubmission) {
          setMySubmission(userSubmission);
          // Pre-fill the form with existing submission data
          setFormData({
            content: userSubmission.content,
            attachments: userSubmission.attachments.map((url: string) => {
              const fileName = url.split('/').pop() || 'file';
              return {
                name: fileName,
                url: url,
                size: 'N/A',
                type: getFileTypeFromName(fileName)
              };
            })
          });
        }
        
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

  // Use sample data if no real data is available (and not in loading state)
  useEffect(() => {
    if (!loading && !assessment && !error) {
      // Sample assessment data
      const sampleAssessment: Assessment = {
        id: 'sample-1',
        groupId: 'group-1',
        facultyId: 'faculty-1',
        title: 'Final Project Presentation',
        description: 'Present your completed project including demo and documentation. Each team member should contribute to the presentation. Include a summary of your project architecture, key features, and lessons learned.',
        googleMeetLink: 'https://meet.google.com/abc-defg-hij',
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        group: {
          id: 'group-1',
          name: 'Team Alpha',
          projectId: 'project-1',
          project: {
            id: 'project-1',
            title: 'AI-powered Health Monitoring System'
          }
        },
        faculty: {
          id: 'faculty-1',
          name: 'Dr. Sarah Johnson',
          email: 'sarah.johnson@example.edu'
        },
        submissions: []
      };
      
      setAssessment(sampleAssessment);
    }
  }, [loading, assessment, error]);

  // Helper function to get file type from name
  const getFileTypeFromName = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase() || '';
    
    const imageTypes = ['jpg', 'jpeg', 'png', 'gif', 'svg'];
    const documentTypes = ['pdf', 'doc', 'docx', 'txt', 'md'];
    const presentationTypes = ['ppt', 'pptx'];
    const spreadsheetTypes = ['xls', 'xlsx', 'csv'];
    const codeTypes = ['js', 'ts', 'html', 'css', 'py', 'java', 'cpp', 'c'];
    
    if (imageTypes.includes(extension)) return 'image';
    if (documentTypes.includes(extension)) return 'document';
    if (presentationTypes.includes(extension)) return 'presentation';
    if (spreadsheetTypes.includes(extension)) return 'spreadsheet';
    if (codeTypes.includes(extension)) return 'code';
    
    return 'file';
  };

  // Format date for display
  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Format time for display
  const formatTime = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Check if deadline has passed
  const isDeadlinePassed = () => {
    if (!assessment) return false;
    const now = new Date();
    const deadline = new Date(assessment.deadline);
    return now > deadline;
  };

  // Format file size for display
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Handle form input changes
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      content: e.target.value
    }));
  };

  // Handle file input changes
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !assessment) return;
    
    const file = e.target.files[0];
    
    // Check file size (limit to 10MB for example)
    if (file.size > 10 * 1024 * 1024) {
      setFileUploadError('File size exceeds 10MB limit.');
      return;
    }
    
    try {
      setUploadingFile(true);
      setFileUploadError(null);
      
      // Upload file to server/cloud storage
      const response = await uploadSubmissionAttachment(file, assessment.group.projectId);
      
      // Add file to attachments list
      setFormData(prev => ({
        ...prev,
        attachments: [
          ...prev.attachments,
          {
            name: file.name,
            url: response.data.url,
            size: formatFileSize(file.size),
            type: getFileTypeFromName(file.name)
          }
        ]
      }));
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      console.error('Error uploading file:', err);
      setFileUploadError('Failed to upload file. Please try again.');
    } finally {
      setUploadingFile(false);
    }
  };

  // Remove attachment
  const removeAttachment = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!assessment) return;
    
    if (formData.content.trim() === '' && formData.attachments.length === 0) {
      setError('Please add content or attach files before submitting.');
      return;
    }
    
    try {
      setSubmitting(true);
      setError(null);
      
      const submissionData = {
        assessmentId: assessment.id,
        content: formData.content,
        attachments: formData.attachments.map(file => file.url)
      };
      
      const response = await submitAssessment(submissionData);
      
      // Update local state with new submission
      setMySubmission(response.data);
      
      // Show success notification or redirect
      navigate('/assessments');
    } catch (err) {
      console.error('Error submitting assessment:', err);
      setError('Failed to submit. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loading />
      </div>
    );
  }

  if (error && !assessment) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="mb-6">
          <button 
            onClick={() => navigate('/assessments')} 
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
            onClick={() => navigate('/assessments')} 
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

  const deadlinePassed = isDeadlinePassed();
  const isSubmitted = !!mySubmission;
  const isGraded = isSubmitted && mySubmission.grade !== null;
  
  // Determine if student can still submit (either not yet submitted or submitted but deadline not passed)
  const canSubmit = !deadlinePassed || !isSubmitted;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <button 
          onClick={() => navigate('/assessments')} 
          className="text-blue-600 flex items-center gap-1 hover:text-blue-800"
        >
          <ArrowLeft size={18} /> Back to Assessments
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Assessment Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900 mb-2 md:mb-0">{assessment.title}</h1>
            
            {/* Status badge */}
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              isGraded 
                ? 'bg-green-100 text-green-800' 
                : isSubmitted 
                  ? 'bg-amber-100 text-amber-800' 
                  : deadlinePassed 
                    ? 'bg-red-100 text-red-800' 
                    : 'bg-blue-100 text-blue-800'
            }`}>
              {isGraded 
                ? <><Award className="h-4 w-4 mr-1" /> Graded: {mySubmission.grade}/100</> 
                : isSubmitted 
                  ? <><CheckCircle className="h-4 w-4 mr-1" /> Submitted</> 
                  : deadlinePassed 
                    ? <><Clock className="h-4 w-4 mr-1" /> Deadline Passed</> 
                    : <><Clock className="h-4 w-4 mr-1" /> Due {formatDate(assessment.deadline)}</>
              }
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              <span>Deadline: {formatDate(assessment.deadline)}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <span>Time: {formatTime(assessment.deadline)}</span>
            </div>
          </div>
        </div>
        
        {/* Assessment Content */}
        <div className="p-6">
          {/* Project & Group Info */}
          <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="text-sm font-medium text-gray-500 mb-1">Project</h2>
              <p className="text-gray-900">{assessment.group.project.title}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="text-sm font-medium text-gray-500 mb-1">Group</h2>
              <p className="text-gray-900">{assessment.group.name}</p>
            </div>
          </div>
          
          {/* Assessment Description */}
          <div className="mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-3">Description</h2>
            <div className="bg-gray-50 p-4 rounded-lg text-gray-700 whitespace-pre-line">
              {assessment.description}
            </div>
          </div>
          
          {/* Google Meet Link */}
          <div className="mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-3">Meeting Link</h2>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-start">
                <Video className="h-5 w-5 text-blue-500 mt-0.5 mr-3" />
                <div>
                  <div className="font-medium text-blue-800 mb-1">Google Meet</div>
                  <a 
                    href={assessment.googleMeetLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 flex items-center"
                  >
                    Join Meeting <ExternalLink className="h-4 w-4 ml-1" />
                  </a>
                  <p className="text-sm text-blue-700 mt-2">
                    Use this link to join the assessment meeting at the scheduled time.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Submission Section */}
          <div className="mt-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              {isSubmitted 
                ? isGraded 
                  ? 'Graded Submission' 
                  : 'Your Submission' 
                : 'Submit Your Work'
              }
            </h2>
            
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                {error}
              </div>
            )}
            
            {isGraded ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-green-800">Grade</h3>
                  <div className="bg-white px-4 py-2 rounded-full text-green-800 font-bold text-lg">
                    {mySubmission.grade}/100
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-green-800 mb-2">Your Submission</h3>
                  <div className="bg-white p-4 rounded-lg text-gray-700 whitespace-pre-line">
                    {mySubmission.content || '(No text content submitted)'}
                  </div>
                </div>
                
                {mySubmission.attachments.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-green-800 mb-2">Attachments</h3>
                    <ul className="space-y-2">
                      {mySubmission.attachments.map((url, index) => {
                        const fileName = url.split('/').pop() || `File ${index + 1}`;
                        return (
                          <li key={index}>
                            <a 
                              href={url} 
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
              </div>
            ) : isSubmitted ? (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-amber-800">Submission Status</h3>
                  <div className="bg-white px-3 py-1 rounded-full text-amber-800 text-sm font-medium flex items-center">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Submitted - Awaiting Grade
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-amber-800 mb-2">Your Submission</h3>
                  <div className="bg-white p-4 rounded-lg text-gray-700 whitespace-pre-line">
                    {mySubmission.content || '(No text content submitted)'}
                  </div>
                </div>
                
                {mySubmission.attachments.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-amber-800 mb-2">Attachments</h3>
                    <ul className="space-y-2">
                      {mySubmission.attachments.map((url, index) => {
                        const fileName = url.split('/').pop() || `File ${index + 1}`;
                        return (
                          <li key={index}>
                            <a 
                              href={url} 
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
                
                {!deadlinePassed && (
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={() => setMySubmission(null)}
                      className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 flex items-center"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      <span>Edit Submission</span>
                    </button>
                  </div>
                )}
              </div>
            ) : deadlinePassed ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <div className="mb-4">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-500">
                    <Clock className="h-6 w-6" />
                  </div>
                </div>
                <h3 className="text-lg font-medium text-red-800 mb-2">Deadline has passed</h3>
                <p className="text-red-700">
                  Unfortunately, the deadline for this assessment has passed and you did not submit your work.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Submission Text Content */}
                <div>
                  <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                    Submission Content
                  </label>
                  <textarea
                    id="content"
                    name="content"
                    value={formData.content}
                    onChange={handleContentChange}
                    rows={6}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your submission details here..."
                  />
                </div>
                
                {/* File Attachments */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Attachments
                  </label>
                  
                  {/* Existing Attachments */}
                  {formData.attachments.length > 0 && (
                    <div className="mb-4">
                      <ul className="space-y-2">
                        {formData.attachments.map((file, index) => (
                          <li key={index} className="bg-gray-50 p-3 rounded-lg flex items-center justify-between">
                            <div className="flex items-center">
                              <FileText className="h-5 w-5 text-gray-400 mr-3" />
                              <div>
                                <div className="font-medium text-gray-800">{file.name}</div>
                                <div className="text-sm text-gray-500">{file.size}</div>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeAttachment(index)}
                              className="text-gray-400 hover:text-red-500"
                            >
                              <X className="h-5 w-5" />
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {/* File Upload Error */}
                  {fileUploadError && (
                    <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                      {fileUploadError}
                    </div>
                  )}
                  
                  {/* File Upload Input */}
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="file-upload"
                      className="w-full flex flex-col items-center justify-center px-4 py-6 bg-white text-blue-500 rounded-lg tracking-wide border border-blue-200 cursor-pointer hover:bg-blue-50"
                    >
                      <Upload className="w-8 h-8" />
                      <span className="mt-2 text-base">
                        {uploadingFile 
                          ? 'Uploading...' 
                          : 'Click or drag files to upload'
                        }
                      </span>
                      <span className="mt-1 text-sm text-gray-500">
                        PDF, DOCX, PPTX, XLSX up to 10MB
                      </span>
                      <input
                        id="file-upload"
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        onChange={handleFileChange}
                        disabled={uploadingFile}
                      />
                    </label>
                  </div>
                </div>
                
                {/* Submit Button */}
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={submitting || uploadingFile}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:bg-blue-300 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <>
                        <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <FileText className="w-4 h-4 mr-1" />
                        <span>Submit Assessment</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentDetail;