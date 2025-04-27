// src/pages/faculty/ProjectForm.tsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Save, 
  X, 
  ArrowLeft, 
  Calendar, 
  Tag, 
  AlertTriangle, 
  CheckCircle, 
  Loader, 
  Info,
  FileText,
  BookOpen,
  Globe,
  Clock,
  User,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import { ProjectDomain, ProjectStatus, CourseType } from '../../types/enum';
import { createProject, updateProject, getProjectById } from '../../services/facultyApi';

interface ProjectFormData {
  title: string;
  description: string;
  domain: ProjectDomain;
  status: ProjectStatus;
  course: CourseType;
  tags: string[];
  deadline: string;
}

// Form steps
enum FormStep {
  BasicInfo = 0,
  Details = 1,
  Publication = 2,
  Review = 3
}

const ProjectForm = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(projectId);
  
  // Current step state
  const [currentStep, setCurrentStep] = useState<FormStep>(FormStep.BasicInfo);
  
  const [formData, setFormData] = useState<ProjectFormData>({
    title: '',
    description: '',
    domain: ProjectDomain.AIML,
    status: ProjectStatus.draft,
    course: CourseType.IDP,
    tags: [],
    deadline: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState('');
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
  const [descriptionCharCount, setDescriptionCharCount] = useState(0);
  
  // Character count limits
  const MAX_DESCRIPTION_LENGTH = 500;
  const MAX_TITLE_LENGTH = 100;
  
  // Step validation
  const validateStep = (step: FormStep): boolean => {
    switch (step) {
      case FormStep.BasicInfo:
        return Boolean(formData.title && formData.description);
      case FormStep.Details:
        return Boolean(formData.domain && formData.course);
      case FormStep.Publication:
        return true; // No required fields in publication
      default:
        return true;
    }
  };
  
  // Step labels
  const stepLabels = [
    "Basic Information",
    "Project Details",
    "Publication Settings",
    "Review"
  ];
  
  useEffect(() => {
    const loadProject = async () => {
      if (!isEditMode) return;
      
      try {
        setLoading(true);
        const projectData = await getProjectById(projectId as string);
        
        if (!projectData?.data) {
          throw new Error('Project not found');
        }
        
        setFormData({
          title: projectData.data.title || '',
          description: projectData.data.description || '',
          domain: projectData.data.domain || ProjectDomain.AIML,
          status: projectData.data.status || ProjectStatus.draft,
          course: projectData.data.course || CourseType.IDP,
          tags: projectData.data.tags || [],
          deadline: projectData.data.deadline ? 
            new Date(projectData.data.deadline).toISOString().split('T')[0] : '',
        });
        
        setDescriptionCharCount(projectData.data.description?.length || 0);
      } catch (err) {
        setError('Failed to load project data. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    loadProject();
  }, [projectId, isEditMode]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Update character count for description
    if (name === 'description') {
      setDescriptionCharCount(value.length);
    }
    
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Mark field as touched
    setTouchedFields((prev) => ({ ...prev, [name]: true }));
  };
  
  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name } = e.target;
    setTouchedFields((prev) => ({ ...prev, [name]: true }));
  };
  
  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      if (formData.tags.length >= 10) {
        setError('Maximum 10 tags allowed');
        setTimeout(() => setError(null), 3000);
        return;
      }
      
      setFormData((prev) => ({ 
        ...prev, 
        tags: [...prev.tags, tagInput.trim()] 
      }));
      setTagInput('');
    }
  };
  
  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };
  
  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, FormStep.Review));
    } else {
      // Mark required fields for current step as touched
      const newTouchedFields = { ...touchedFields };
      
      if (currentStep === FormStep.BasicInfo) {
        newTouchedFields.title = true;
        newTouchedFields.description = true;
      } else if (currentStep === FormStep.Details) {
        newTouchedFields.domain = true;
        newTouchedFields.course = true;
      }
      
      setTouchedFields(newTouchedFields);
      setError('Please fill in all required fields before continuing');
    }
  };
  
  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
    setError(null);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all steps
    const requiredFields = ['title', 'description', 'domain', 'course'];
    const emptyFields = requiredFields.filter(field => !formData[field as keyof ProjectFormData]);
    
    if (emptyFields.length > 0) {
      // Mark all required fields as touched
      const newTouchedFields = { ...touchedFields };
      requiredFields.forEach(field => {
        newTouchedFields[field] = true;
      });
      setTouchedFields(newTouchedFields);
      
      setError('Please fill in all required fields');
      
      // Navigate to the earliest incomplete step
      if (!formData.title || !formData.description) {
        setCurrentStep(FormStep.BasicInfo);
      } else if (!formData.domain || !formData.course) {
        setCurrentStep(FormStep.Details);
      }
      
      return;
    }
    
    try {
      setSubmitLoading(true);
      setError(null);
      
      // Create the project payload
      const projectPayload = {
        ...formData,
        // Convert deadline to a Date object if it exists
        deadline: formData.deadline ? new Date(formData.deadline) : null
      };
      
      if (isEditMode) {
        await updateProject(projectId as string, projectPayload);
        setSuccess('Project updated successfully');
      } else {
        await createProject(projectPayload);
        setSuccess('Project created successfully');
      }
      
      // Delay navigation to show success message
      setTimeout(() => {
        navigate('/faculty'); // or '/faculty/dashboard'
      }, 1500);
    } catch (err) {
      const errorMsg = `Failed to ${isEditMode ? 'update' : 'create'} project. Please try again.`;
      setError(errorMsg);
      console.error(err);
    } finally {
      setSubmitLoading(false);
    }
  };
  
  // Get validation state for a field
  const getFieldState = (fieldName: string) => {
    const isTouched = touchedFields[fieldName];
    const isEmpty = !formData[fieldName as keyof ProjectFormData];
    const isInvalid = isTouched && isEmpty;
    
    return {
      isTouched,
      isEmpty,
      isInvalid,
      className: `w-full px-4 py-3 border rounded-lg transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
        isInvalid 
          ? 'border-red-300 bg-red-50' 
          : isTouched && !isEmpty 
            ? 'border-green-300' 
            : 'border-gray-300'
      }`
    };
  };
  
  if (loading && isEditMode) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-600">Loading project data...</p>
      </div>
    );
  }
  
  // Define step completion for progress indicator
  const getStepStatus = (step: FormStep) => {
    if (step < currentStep) return 'completed';
    if (step === currentStep) return 'current';
    return 'upcoming';
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-6">
          <button 
            onClick={() => navigate(-1)} 
            className="text-blue-600 flex items-center gap-2 hover:text-blue-800 transition-colors"
          >
            <ArrowLeft size={18} /> Back
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          {/* Header */}
          <div className="bg-white p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">
              {isEditMode ? 'Edit Project' : 'Create New Project'}
            </h1>
            <p className="text-gray-500 mt-1">
              Fill in the required information to create a new project
            </p>
          </div>
          
          {/* Progress Bar */}
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center justify-between">
              {stepLabels.map((label, index) => (
                <div 
                  key={index} 
                  className={`flex flex-col items-center relative ${
                    index < stepLabels.length - 1 ? 'flex-1' : ''
                  }`}
                >
                  {/* Connector line */}
                  {index < stepLabels.length - 1 && (
                    <div className="absolute w-full h-1 top-4 left-0 flex items-center">
                      <div 
                        className={`h-1 w-full ${
                          getStepStatus(index) === 'completed' 
                            ? 'bg-green-500' 
                            : 'bg-gray-300'
                        }`}
                      ></div>
                    </div>
                  )}
                  
                  {/* Step circle */}
                  <div 
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-medium text-sm z-10 ${
                      getStepStatus(index) === 'completed' 
                        ? 'bg-green-500 text-white' 
                        : getStepStatus(index) === 'current' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {getStepStatus(index) === 'completed' ? (
                      <CheckCircle size={16} />
                    ) : (
                      index + 1
                    )}
                  </div>
                  
                  {/* Step label */}
                  <span className={`mt-2 text-xs text-center hidden md:block ${
                    getStepStatus(index) === 'current' 
                      ? 'text-blue-600 font-medium' 
                      : getStepStatus(index) === 'completed'
                        ? 'text-green-600'
                        : 'text-gray-500'
                  }`}>
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Error/Success messages */}
          {(error || success) && (
            <div className="px-6 pt-4">
              {error && (
                <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-md flex items-start gap-3 animate-fadeIn">
                  <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-red-700">{error}</p>
                </div>
              )}
              
              {success && (
                <div className="mb-4 p-4 bg-green-50 border-l-4 border-green-500 rounded-md flex items-start gap-3 animate-fadeIn">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="text-green-700">{success}</p>
                </div>
              )}
            </div>
          )}
          
          {/* Form content */}
          <form onSubmit={handleSubmit}>
            <div className="p-6">
              {/* Step 1: Basic Information */}
              {currentStep === FormStep.BasicInfo && (
                <div className="space-y-6">
                  <div className="flex items-center mb-4">
                    <FileText className="h-5 w-5 text-blue-600 mr-2" />
                    <h2 className="text-lg font-medium text-gray-900">Basic Information</h2>
                  </div>
                  
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                      Project Title <span className="text-red-500 ml-1">*</span>
                      <div className="ml-auto text-xs text-gray-500">
                        {formData.title.length}/{MAX_TITLE_LENGTH}
                      </div>
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      maxLength={MAX_TITLE_LENGTH}
                      placeholder="Enter a descriptive title for your project"
                      className={getFieldState('title').className}
                      required
                    />
                    {getFieldState('title').isInvalid && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertTriangle size={14} className="mr-1" /> Title is required
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                      Description <span className="text-red-500 ml-1">*</span>
                      <div className="ml-auto text-xs text-gray-500">
                        {descriptionCharCount}/{MAX_DESCRIPTION_LENGTH}
                      </div>
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      rows={5}
                      maxLength={MAX_DESCRIPTION_LENGTH}
                      placeholder="Detail your project objectives, requirements, and scope"
                      className={getFieldState('description').className}
                      required
                    />
                    {getFieldState('description').isInvalid && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertTriangle size={14} className="mr-1" /> Description is required
                      </p>
                    )}
                  </div>
                </div>
              )}
              
              {/* Step 2: Project Details */}
              {currentStep === FormStep.Details && (
                <div className="space-y-6">
                  <div className="flex items-center mb-4">
                    <BookOpen className="h-5 w-5 text-blue-600 mr-2" />
                    <h2 className="text-lg font-medium text-gray-900">Project Details</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="domain" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                        Domain <span className="text-red-500 ml-1">*</span>
                      </label>
                      <div className="relative">
                        <select
                          id="domain"
                          name="domain"
                          value={formData.domain}
                          onChange={handleInputChange}
                          onBlur={handleBlur}
                          className={`${getFieldState('domain').className} appearance-none`}
                          required
                        >
                          {Object.values(ProjectDomain).map((domain) => (
                            <option key={domain} value={domain}>{domain}</option>
                          ))}
                        </select>
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                          <Globe className="h-5 w-5 text-gray-400" />
                        </div>
                      </div>
                      {getFieldState('domain').isInvalid && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <AlertTriangle size={14} className="mr-1" /> Domain is required
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="course" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                        Course Type <span className="text-red-500 ml-1">*</span>
                      </label>
                      <div className="relative">
                        <select
                          id="course"
                          name="course"
                          value={formData.course}
                          onChange={handleInputChange}
                          onBlur={handleBlur}
                          className={`${getFieldState('course').className} appearance-none`}
                          required
                        >
                          {Object.values(CourseType).map((course) => (
                            <option key={course} value={course}>{course}</option>
                          ))}
                        </select>
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                          <BookOpen className="h-5 w-5 text-gray-400" />
                        </div>
                      </div>
                      {getFieldState('course').isInvalid && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <AlertTriangle size={14} className="mr-1" /> Course type is required
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <div className="flex items-center mb-2">
                      <Tag className="h-5 w-5 text-blue-600 mr-2" />
                      <h3 className="text-md font-medium text-gray-900">Tags</h3>
                      <span className="ml-2 text-xs text-gray-500">(max 10)</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                          placeholder="Add keywords related to your project"
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      </div>
                      <button
                        type="button"
                        onClick={handleAddTag}
                        disabled={!tagInput.trim() || formData.tags.length >= 10}
                        className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-all duration-300"
                      >
                        Add
                      </button>
                    </div>
                    
                    <div className="mt-3 flex flex-wrap gap-2">
                      {formData.tags.length === 0 && (
                        <p className="text-sm text-gray-500 italic">No tags added yet</p>
                      )}
                      
                      {formData.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full flex items-center gap-1 border border-blue-100 transition-all duration-300 hover:bg-blue-100"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="text-blue-500 hover:text-red-600 transition-colors"
                            aria-label={`Remove ${tag} tag`}
                          >
                            <X size={14} />
                          </button>
                        </span>
                      ))}
                    </div>
                    <p className="mt-2 text-xs text-gray-500 flex items-center">
                      <Info size={12} className="mr-1" /> 
                      Tags help students find your project more easily
                    </p>
                  </div>
                </div>
              )}
              
              {/* Step 3: Publication Settings */}
              {currentStep === FormStep.Publication && (
                <div className="space-y-6">
                  <div className="flex items-center mb-4">
                    <Clock className="h-5 w-5 text-blue-600 mr-2" />
                    <h2 className="text-lg font-medium text-gray-900">Publication Settings</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <div className="relative">
                        <select
                          id="status"
                          name="status"
                          value={formData.status}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                        >
                          {Object.values(ProjectStatus).map((status) => (
                            <option key={status} value={status}>
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </option>
                          ))}
                        </select>
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                      <p className="mt-1 text-xs text-gray-500 flex items-center">
                        <Info size={12} className="mr-1" /> 
                        Draft projects are only visible to you
                      </p>
                    </div>
                    
                    <div>
                      <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-1">
                        Deadline
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          id="deadline"
                          name="deadline"
                          value={formData.deadline}
                          onChange={handleInputChange}
                          min={new Date().toISOString().split('T')[0]} // Ensures date is not in the past
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Step 4: Review */}
              {currentStep === FormStep.Review && (
                <div className="space-y-6">
                  <div className="flex items-center mb-4">
                    <CheckCircle className="h-5 w-5 text-blue-600 mr-2" />
                    <h2 className="text-lg font-medium text-gray-900">Review Your Project</h2>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-1">Project Title</h3>
                        <p className="text-gray-900">{formData.title}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-1">Domain</h3>
                        <p className="text-gray-900">{formData.domain}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-1">Course Type</h3>
                        <p className="text-gray-900">{formData.course}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-1">Status</h3>
                        <p className="text-gray-900">{formData.status.charAt(0).toUpperCase() + formData.status.slice(1)}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-1">Deadline</h3>
                        <p className="text-gray-900">
                          {formData.deadline 
                            ? new Date(formData.deadline).toLocaleDateString() 
                            : 'No deadline set'}
                        </p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-1">Tags</h3>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {formData.tags.length > 0 ? (
                            formData.tags.map((tag, index) => (
                              <span key={index} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                                {tag}
                              </span>
                            ))
                          ) : (
                            <p className="text-gray-500 text-sm">No tags added</p>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Description</h3>
                      <p className="text-gray-900 whitespace-pre-line">{formData.description}</p>
                    </div>
                  </div>
                  
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 flex items-start gap-2">
                    <Info className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-yellow-800 font-medium">Ready to submit?</p>
                      <p className="text-yellow-700 text-sm mt-1">
                        Please review all information carefully before finalizing your project.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            {/* Form Actions */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between">
  <div>
    {currentStep > FormStep.BasicInfo && (
      <button
        type="button"
        onClick={handlePrevStep}
        className="px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100 border border-gray-300 transition-all duration-300 flex items-center gap-1"
      >
        <ChevronLeft size={16} />
        Previous
      </button>
    )}
  </div>
  
  <div className="flex items-center text-sm text-gray-500">
    {currentStep < FormStep.Review && (
      <span><span className="text-red-500">*</span> Required fields</span>
    )}
  </div>
  
  <div>
    {currentStep < FormStep.Review ? (
      <button
        type="button"
        onClick={handleNextStep}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 flex items-center gap-1"
      >
        Next
        <ChevronRight size={16} />
      </button>
    ) : (
      <button
        type="submit"
        disabled={submitLoading}
        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300 disabled:bg-green-400 disabled:cursor-not-allowed flex items-center gap-2"
      >
        {submitLoading ? (
          <>
            <Loader size={16} className="animate-spin" />
            {isEditMode ? 'Updating...' : 'Creating...'}
          </>
        ) : (
          <>
            <Save size={16} />
            {isEditMode ? 'Update Project' : 'Create Project'}
          </>
        )}
      </button>
    )}
  </div>
            </div>
          </form>
        </div>
        
        {/* Cancel button */}
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            Cancel and return
          </button>
        </div>
      </div>
      
      {/* CSS Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default ProjectForm;