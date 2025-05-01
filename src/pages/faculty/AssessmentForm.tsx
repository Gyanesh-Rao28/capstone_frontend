// src/pages/faculty/AssessmentForm.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Calendar, Clock, Video, Users } from 'lucide-react';
import { createAssessment } from '../../services/facultyApi';
import Loading from '../../components/Loading';

interface Group {
  id: string;
  name: string;
  projectId: string;
  project: {
    id: string;
    title: string;
  };
}

// Mock function to get groups - replace with actual API call
const getGroupsByFaculty = async () => {
  // Simulating API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Sample data
  return {
    status: 'success',
    data: [
      {
        id: 'group-1',
        name: 'Team Alpha',
        projectId: 'project-1',
        project: {
          id: 'project-1',
          title: 'AI-powered Health Monitoring System'
        }
      },
      {
        id: 'group-2',
        name: 'Team Beta',
        projectId: 'project-2',
        project: {
          id: 'project-2',
          title: 'Cloud-based IoT Infrastructure'
        }
      },
      {
        id: 'group-3',
        name: 'Team Gamma',
        projectId: 'project-3',
        project: {
          id: 'project-3',
          title: 'Cybersecurity Threat Detection Framework'
        }
      }
    ]
  };
};

interface AssessmentFormData {
  groupId: string;
  title: string;
  description: string;
  deadline: string;
  startTime: string;
  endTime: string;
}

const AssessmentForm = () => {
  const navigate = useNavigate();
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<AssessmentFormData>({
    groupId: '',
    title: '',
    description: '',
    deadline: '',
    startTime: '',
    endTime: ''
  });

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        setLoading(true);
        const response = await getGroupsByFaculty();
        setGroups(response.data);
      } catch (err) {
        console.error('Error fetching groups:', err);
        setError('Failed to load groups. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  // Set default deadline to tomorrow and meeting times
  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const defaultStartTime = new Date();
    defaultStartTime.setHours(10, 0, 0, 0);
    
    const defaultEndTime = new Date();
    defaultEndTime.setHours(11, 0, 0, 0);
    
    setFormData(prev => ({
      ...prev,
      deadline: tomorrow.toISOString().split('T')[0],
      startTime: defaultStartTime.toTimeString().slice(0, 5),
      endTime: defaultEndTime.toTimeString().slice(0, 5)
    }));
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.groupId) {
      setError('Please select a group');
      return;
    }
    
    try {
      setSubmitting(true);
      setError(null);
      
      // Format date and times for API
      const deadlineDate = new Date(formData.deadline);
      
      // Create start and end datetime objects
      const startDate = new Date(formData.deadline);
      const [startHours, startMinutes] = formData.startTime.split(':').map(Number);
      startDate.setHours(startHours, startMinutes);
      
      const endDate = new Date(formData.deadline);
      const [endHours, endMinutes] = formData.endTime.split(':').map(Number);
      endDate.setHours(endHours, endMinutes);
      
      // Create assessment data object
      const assessmentData = {
        groupId: formData.groupId,
        title: formData.title,
        description: formData.description,
        deadline: deadlineDate.toISOString(),
        startTime: startDate.toISOString(),
        endTime: endDate.toISOString()
      };
      
      await createAssessment(assessmentData);
      
      // Navigate to assessments list after successful creation
      navigate('/faculty/assessments');
    } catch (err: any) {
      console.error('Error creating assessment:', err);
      setError(err.response?.data?.message || 'Failed to create assessment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };
  

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Back button */}
      <div className="mb-6">
        <button 
          onClick={() => navigate('/faculty/assessments')} 
          className="text-blue-600 flex items-center gap-1 hover:text-blue-800"
        >
          <ArrowLeft size={18} /> Back to Assessments
        </button>

      
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Assessment</h1>
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loading />
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Group Selection */}
              <div>
                <label htmlFor="groupId" className="block text-sm font-medium text-gray-700 mb-1">
                  Select Group *
                </label>
                {groups.length === 0 ? (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700">
                    No groups are available. Create a project and assign students to it first.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {groups.map(group => (
                      <div 
                        key={group.id}
                        className={`border rounded-lg p-4 cursor-pointer transition-colors
                          ${formData.groupId === group.id 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/30'}`}
                        onClick={() => setFormData(prev => ({ ...prev, groupId: group.id }))}
                      >
                        <div className="flex items-start">
                          <div className="flex-shrink-0 mt-1">
                            <div className={`w-4 h-4 rounded-full border ${formData.groupId === group.id ? 'border-blue-500 bg-blue-500' : 'border-gray-400'}`}>
                              {formData.groupId === group.id && (
                                <div className="w-full h-full flex items-center justify-center">
                                  <div className="w-2 h-2 rounded-full bg-white"></div>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="ml-3">
                            <div className="font-medium text-gray-900 mb-1">{group.name}</div>
                            <div className="flex items-center text-sm text-gray-500">
                              <Users className="w-4 h-4 mr-1" />
                              <span>Project: {group.project.title}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Assessment Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Assessment Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Midterm Project Review"
                  required
                />
              </div>
              
              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Provide instructions, requirements, and details for the assessment..."
                  required
                />
              </div>
              
              {/* Deadline Date */}
              <div>
                <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-1">
                  Deadline Date *
                </label>
                <div className="relative">
                  <Calendar className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="date"
                    id="deadline"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>
              
              {/* Meeting Times (For Google Meet Link Generation) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">
                    Meeting Start Time *
                  </label>
                  <div className="relative">
                    <Clock className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                      type="time"
                      id="startTime"
                      name="startTime"
                      value={formData.startTime}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-1">
                    Meeting End Time *
                  </label>
                  <div className="relative">
                    <Clock className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                      type="time"
                      id="endTime"
                      name="endTime"
                      value={formData.endTime}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>
              </div>
              
              {/* Google Meet Info */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <div className="flex items-start">
                  <Video className="h-5 w-5 text-blue-500 mt-0.5 mr-2" />
                  <div>
                    <h3 className="font-medium text-blue-800">Google Meet Link Generation</h3>
                    <p className="text-sm text-blue-700 mt-1">
                      A Google Meet link will be automatically generated based on the meeting times you've specified above. Students will use this link to join the assessment session.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Submit Button */}
            <div className="mt-8 flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/faculty/assessments')}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || groups.length === 0}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:bg-blue-300 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    <span>Create Assessment</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  </div>
  );
}

export default AssessmentForm;