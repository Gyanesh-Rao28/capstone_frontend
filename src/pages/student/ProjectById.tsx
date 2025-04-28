import { useState, useEffect, FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Calendar, Tag, ChevronLeft, BookOpen, User, X,
    Clock, Users, AlertCircle, Check, Shield
} from 'lucide-react';
import { ProjectType, ProjectDomain, ProjectStatus, CourseType } from './Project';
import { getProjectById, isMember, createGroup, applyForProject } from '../../services/studentApi';
import { useAuth } from '../../hooks/useAuth';
import Loading from '../../components/Loading'; // Import your loading component

// Extended project type to include faculty information
interface ProjectWithFaculty extends ProjectType {
    faculty?: {
        user: {
            email: string;
            name: string;
        }
    };
}

// Member type
interface MemberData {
    id: string;
    groupId: string;
    studentId: string;
    memberRole: string;
    joinedAt: string;
}

const ProjectById = () => {
    const { projectId } = useParams<{ projectId: string }>();
    const navigate = useNavigate();
    const [project, setProject] = useState<ProjectWithFaculty | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isMemberStatus, setIsMemberStatus] = useState<boolean>(false);
    const [memberData, setMemberData] = useState<MemberData | null>(null);
    const [isMemberLoading, setIsMemberLoading] = useState(true);

    // State for create group modal
    const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);
    const [groupName, setGroupName] = useState('');

    // State for apply project modal
    const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);

    const { user } = useAuth();

    useEffect(() => {
        // Redirect if no projectId or student id
        if (!projectId || !user?.student?.id) {
            navigate('/login');
            return;
        }

        // Check membership status
        const checkMembership = async () => {
            try {
                setIsMemberLoading(true);
                const studentId = user.student?.id !!;

                // Get the response data directly
                const data = await isMember(studentId, projectId);

                // Check if there's member data in the response
                if (data && data.isInProject) {
                    setIsMemberStatus(true);
                    setMemberData(data.isInProject);
                } else {
                    setIsMemberStatus(false);
                    setMemberData(null);
                }
            } catch (err) {
                console.error('Error checking membership status:', err);
                setIsMemberStatus(false);
                setMemberData(null);
            } finally {
                setIsMemberLoading(false);
            }
        };

        checkMembership();
    }, [projectId, user?.student?.id, navigate]);

    useEffect(() => {
        const fetchProjectDetails = async () => {
            if (!projectId) return;

            try {
                setIsLoading(true);
                const response = await getProjectById(projectId);

                // Format the project data
                const projectData = response.data;
                const formattedProject = {
                    ...projectData,
                    deadline: projectData.deadline ? new Date(projectData.deadline) : null,
                    createdAt: new Date(projectData.createdAt),
                    updatedAt: new Date(projectData.updatedAt)
                };

                setProject(formattedProject);
            } catch (err) {
                console.error('Error fetching project details:', err);
                setError('Failed to load project details. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchProjectDetails();
    }, [projectId]);

    // Function to format date as "Month Day, Year"
    const formatDate = (date: Date | null) => {
        if (!date) return 'No deadline';
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Calculate days remaining until deadline
    const getDaysRemaining = (deadline: Date | null) => {
        if (!deadline) return null;
        const today = new Date();
        const diffTime = deadline.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    // Status badge color mapping
    const getStatusColor = (status: ProjectStatus) => {
        switch (status) {
            case ProjectStatus.active:
                return 'bg-green-100 text-green-800';
            case ProjectStatus.draft:
                return 'bg-yellow-100 text-yellow-800';
            case ProjectStatus.completed:
                return 'bg-blue-100 text-blue-800';
            case ProjectStatus.archived:
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Domain badge color mapping
    const getDomainColor = (domain: ProjectDomain) => {
        switch (domain) {
            case ProjectDomain.AIML:
                return 'bg-purple-100 text-purple-800';
            case ProjectDomain.Cloud:
                return 'bg-blue-100 text-blue-800';
            case ProjectDomain.Cyber:
                return 'bg-teal-100 text-teal-800';
            case ProjectDomain.IOT:
                return 'bg-orange-100 text-orange-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Course badge color mapping
    const getCourseColor = (course: CourseType) => {
        switch (course) {
            case CourseType.IDP:
                return 'bg-green-100 text-green-800';
            case CourseType.UROP:
                return 'bg-indigo-100 text-indigo-800';
            case CourseType.Capstone:
                return 'bg-amber-100 text-amber-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Handle apply for project click - Open the confirmation modal
    const handleApplyForProject = () => {
        setFormError(null);
        setIsApplyModalOpen(true);
    };

    // Handle apply project submission
    const handleSubmitApplication = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!projectId || !memberData) {
            setFormError("Missing project or group information");
            return;
        }

        if (memberData.memberRole !== 'Leader') {
            setFormError("Only group leaders can apply for projects");
            return;
        }

        try {
            setIsSubmitting(true);
            setFormError(null);

            // Get the groupId from memberData
            const groupId = memberData.groupId;

            // Call API to apply for the project
            await applyForProject(projectId, groupId);

            setIsApplyModalOpen(false);
            navigate('/applications');
        } catch (err: any) {
            console.error('Error applying for project:', err);
            setFormError(err.response?.data?.message || "Failed to apply for project. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Updated to open the create group modal
    const handleCreateGroup = () => {
        setFormError(null);
        setIsCreateGroupModalOpen(true);
    };

    // Handle form submission for create group
    const handleSubmitGroupCreation = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!groupName.trim()) {
            setFormError("Group name is required");
            return;
        }

        if (!projectId) {
            setFormError("Project ID is missing");
            return;
        }

        try {
            setIsSubmitting(true);
            setFormError(null);

            await createGroup(projectId, groupName);
            setIsCreateGroupModalOpen(false);
            navigate(`/create-group/${projectId}`);
        } catch (err: any) {
            console.error('Error creating group:', err);
            setFormError(err.response?.data?.message || "Failed to create group. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-full  h-full max-h-screen overflow-auto bg-gray-50 p-4 md:p-6">
            {/* Back button */}
            <button
                onClick={() => navigate('/projects')}
                className="mb-4 flex items-center text-blue-600 hover:text-blue-800 transition-colors"
            >
                <ChevronLeft className="h-4 w-4 mr-1" />
                <span>Back to Projects</span>
            </button>

            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <Loading />
                </div>
            ) : error ? (
                <div className="bg-red-50 p-4 rounded-lg border border-red-200 flex items-start">
                    <AlertCircle className="h-5 w-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
                    <div>
                        <h3 className="text-red-800 font-medium mb-1">Error</h3>
                        <p className="text-red-700">{error}</p>
                    </div>
                </div>
            ) : project ? (
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    {/* Project Header */}
                    <div className="bg-gray-50 p-4 md:p-6 border-b border-gray-200">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                            <h1 className="text-xl md:text-2xl font-bold text-gray-900">{project.title}</h1>
                            <div className="flex flex-wrap gap-2">
                                <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(project.status)}`}>
                                    {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                                </span>
                                <span className={`px-3 py-1 text-xs font-medium rounded-full ${getDomainColor(project.domain)}`}>
                                    {project.domain}
                                </span>
                                <span className={`px-3 py-1 text-xs font-medium rounded-full ${getCourseColor(project.course)}`}>
                                    {project.course}
                                </span>
                            </div>
                        </div>

                        {/* Project Meta Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {/* Faculty Info */}
                            {project.faculty && (
                                <div className="flex items-center text-gray-600">
                                    <div className="bg-blue-100 p-2 rounded-full mr-3">
                                        <User className="h-4 w-4 text-blue-600" />
                                    </div>
                                    <div className="overflow-hidden">
                                        <div className="text-sm font-medium text-gray-900">{project.faculty.user.name}</div>
                                        <div className="text-xs text-gray-500 truncate">{project.faculty.user.email}</div>
                                    </div>
                                </div>
                            )}

                            {/* Deadline */}
                            <div className="flex items-center text-gray-600">
                                <div className="bg-red-100 p-2 rounded-full mr-3">
                                    <Calendar className="h-4 w-4 text-red-600" />
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-gray-900">{formatDate(project.deadline)}</div>
                                    {project.deadline && (
                                        <div className={`text-xs ${getDaysRemaining(project.deadline) && getDaysRemaining(project.deadline)! <= 0
                                                ? 'text-red-600 font-medium'
                                                : getDaysRemaining(project.deadline) && getDaysRemaining(project.deadline)! <= 3
                                                    ? 'text-orange-600'
                                                    : 'text-gray-500'
                                            }`}>
                                            {getDaysRemaining(project.deadline) && getDaysRemaining(project.deadline)! <= 0
                                                ? 'Deadline passed'
                                                : getDaysRemaining(project.deadline) === 1
                                                    ? '1 day remaining'
                                                    : getDaysRemaining(project.deadline)
                                                        ? `${getDaysRemaining(project.deadline)} days remaining`
                                                        : ''}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Project Body */}
                    <div className="p-4 md:p-6">
                        {/* Description */}
                        <div className="mb-6">
                            <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                                <BookOpen className="h-5 w-5 mr-2 text-blue-600" />
                                <span>Description</span>
                            </h2>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-gray-700 whitespace-pre-line">{project.description}</p>
                            </div>
                        </div>

                        {/* Tags */}
                        {project.tags && project.tags.length > 0 && (
                            <div className="mb-6">
                                <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                                    <Tag className="h-5 w-5 mr-2 text-blue-600" />
                                    <span>Tags</span>
                                </h2>
                                <div className="flex flex-wrap gap-2">
                                    {project.tags.map((tag, index) => (
                                        <span
                                            key={index}
                                            className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Group Status */}
                        <div className="mb-6">
                            <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                                <Users className="h-5 w-5 mr-2 text-blue-600" />
                                <span>Group Status</span>
                            </h2>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                {isMemberLoading ? (
                                    <div className="flex items-center space-x-2">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                                        <span className="text-gray-600">Checking group status...</span>
                                    </div>
                                ) : isMemberStatus && memberData ? (
                                    <div className="flex flex-col space-y-2">
                                        <div className="flex items-center text-green-700">
                                            <Check className="h-5 w-5 mr-2" />
                                            <span className="font-medium">You're a member of a group</span>
                                        </div>
                                        <p className="text-sm text-gray-600">
                                            Your role: <span className="font-medium">{memberData.memberRole}</span>
                                        </p>
                                        {memberData.memberRole !== 'Leader' && (
                                            <p className="text-sm text-amber-600 mt-2">
                                                Note: Only group leaders can apply for projects
                                            </p>
                                        )}
                                    </div>
                                ) : (
                                    <div className="flex items-center text-gray-700">
                                        <AlertCircle className="h-5 w-5 mr-2 text-amber-500" />
                                        <span>You need to create or join a group first</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="p-4 md:p-6 bg-gray-50 border-t border-gray-200">
                        <div className="flex justify-end">
                            {isMemberLoading ? (
                                <button disabled className="px-6 py-2.5 bg-gray-400 text-white rounded-lg flex items-center">
                                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                                    Loading...
                                </button>
                            ) : isMemberStatus ? (
                                <button
                                    onClick={handleApplyForProject}
                                    className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center shadow-sm"
                                    disabled={memberData?.memberRole !== 'Leader'}
                                >
                                    <Shield className="h-4 w-4 mr-2" />
                                    Apply for Project
                                </button>
                            ) : (
                                <button
                                    onClick={handleCreateGroup}
                                    className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center shadow-sm"
                                >
                                    <Users className="h-4 w-4 mr-2" />
                                    Create Group
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 flex items-start">
                    <AlertCircle className="h-5 w-5 text-yellow-500 mr-3 flex-shrink-0 mt-0.5" />
                    <div>
                        <h3 className="text-yellow-800 font-medium mb-1">Project Not Found</h3>
                        <p className="text-yellow-700">The project may have been removed or is no longer available.</p>
                    </div>
                </div>
            )}

            {/* Create Group Modal */}
            {isCreateGroupModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
                        <div className="flex justify-between items-center border-b border-gray-200 p-4">
                            <h3 className="text-lg font-medium text-gray-900 flex items-center">
                                <Users className="h-5 w-5 mr-2 text-blue-600" />
                                Create Group
                            </h3>
                            <button
                                onClick={() => setIsCreateGroupModalOpen(false)}
                                className="text-gray-400 hover:text-gray-500 p-1 rounded-full hover:bg-gray-100"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmitGroupCreation} className="p-6">
                            {formError && (
                                <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm flex items-start">
                                    <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0 mt-0.5" />
                                    {formError}
                                </div>
                            )}

                            <div className="mb-4">
                                <label htmlFor="groupName" className="block text-sm font-medium text-gray-700 mb-1">
                                    Group Name
                                </label>
                                <input
                                    type="text"
                                    id="groupName"
                                    value={groupName}
                                    onChange={(e) => setGroupName(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter your group name"
                                    required
                                />
                                <p className="mt-1 text-xs text-gray-500">Choose a name that represents your team</p>
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsCreateGroupModalOpen(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting || !groupName.trim()}
                                    className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center
                                        ${(isSubmitting || !groupName.trim()) ? 'opacity-70 cursor-not-allowed' : ''}`}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Clock className="h-4 w-4 mr-2 animate-spin" />
                                            Creating...
                                        </>
                                    ) : (
                                        <>
                                            <Check className="h-4 w-4 mr-2" />
                                            Create Group
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Apply Project Confirmation Modal */}
            {isApplyModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
                        <div className="flex justify-between items-center border-b border-gray-200 p-4">
                            <h3 className="text-lg font-medium text-gray-900 flex items-center">
                                <Shield className="h-5 w-5 mr-2 text-blue-600" />
                                Apply for Project
                            </h3>
                            <button
                                onClick={() => setIsApplyModalOpen(false)}
                                className="text-gray-400 hover:text-gray-500 p-1 rounded-full hover:bg-gray-100"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmitApplication} className="p-6">
                            {formError && (
                                <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm flex items-start">
                                    <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0 mt-0.5" />
                                    {formError}
                                </div>
                            )}

                            <div className="mb-4">
                                <div className="flex items-start mb-4">
                                    <div className="bg-blue-100 p-2 rounded-full mr-3 mt-0.5">
                                        <AlertCircle className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-900 mb-1">Confirm Application</h4>
                                        <p className="text-gray-600 text-sm">
                                            Are you sure you want to apply for "{project?.title}"?
                                            Once submitted, your application will be reviewed by the faculty.
                                        </p>
                                    </div>
                                </div>

                                {memberData && memberData.memberRole !== 'Leader' && (
                                    <div className="bg-amber-50 border border-amber-200 rounded-md p-3 mt-4">
                                        <p className="text-amber-700 text-sm flex items-center">
                                            <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                                            Only group leaders can apply for projects. Your current role is: {memberData.memberRole}
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsApplyModalOpen(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={!!(isSubmitting || (memberData && memberData.memberRole !== 'Leader'))}
                                    className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center
                                    ${(isSubmitting || (memberData && memberData.memberRole !== 'Leader')) ? 'opacity-70 cursor-not-allowed' : ''}`}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Clock className="h-4 w-4 mr-2 animate-spin" />
                                            Applying...
                                        </>
                                    ) : (
                                        <>
                                            <Check className="h-4 w-4 mr-2" />
                                            Confirm Application
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectById;