import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
    Users, Calendar, ArrowLeft,
    Tag, Award, CheckCircle, XCircle, Clock, Calendar as CalendarIcon,
    UserMinus, AlertCircle, LogOut, FileText
} from 'lucide-react';
import Loading from '../../components/Loading';
import { getApplicationById, removeMember, leaveGroup } from '../../services/studentApi';
import { useAuth } from '../../hooks/useAuth'; // Adjust path as needed
import LeaveGroupModal from '../../components/studentsComponents/LeaveGroupModal';
import RemoveMemberModal from '../../components/studentsComponents/RemoveMemberModal';

// Define types based on the updated API response
interface User {
    name: string;
    email: string;
}

interface Student {
    id: string;
    userId: string;
    studentId: string;
    batch: string;
    user: User;
}

interface Member {
    id: string;
    groupId: string;
    studentId: string;
    memberRole: 'Leader' | 'Member';
    joinedAt: string;
    student: Student;
}

interface Group {
    id: string;
    projectId: string;
    inviteCode: string;
    name: string;
    maxMembers: number;
    currentMember: number;
    isOpen: boolean;
    createdAt: string;
    updatedAt: string;
    members: Member[];
}

interface Faculty {
    user: User;
}

interface Project {
    title: string;
    description: string;
    domain: 'AIML' | 'Cloud' | 'Cyber' | 'IOT';
    course: 'IDP' | 'UROP' | 'Capstone';
    tags: string[];
    deadline: string;
    faculty: Faculty;
}

interface Application {
    id: string;
    groupId: string;
    projectId: string;
    applicationStatus: 'Pending' | 'Approved' | 'Rejected';
    project: Project;
    group: Group;
}

const ApplicationById = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth(); // Get current user
    const [application, setApplication] = useState<Application | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isLeader, setIsLeader] = useState<boolean>(false);
    const [isMember, setIsMember] = useState<boolean>(false);
    const [selectedMember, setSelectedMember] = useState<Member | null>(null);
    const [isRemoveModalOpen, setIsRemoveModalOpen] = useState<boolean>(false);
    const [isLeaveModalOpen, setIsLeaveModalOpen] = useState<boolean>(false);
    const [removingMember, setRemovingMember] = useState<boolean>(false);
    const [leavingGroup, setLeavingGroup] = useState<boolean>(false);
    const [actionError, setActionError] = useState<string | null>(null);

    useEffect(() => {
        const fetchApplication = async () => {
            try {
                setLoading(true);
                if (!id) {
                    throw new Error('Application ID is required');
                }
                const response = await getApplicationById(id);
                setApplication(response.data);

                // Check if current user is in the group and their role
                if (response.data?.group?.members && user?.student?.id) {
                    const currentUserMember = response.data.group.members.find(
                        (member: Member) => member.studentId === user.student?.id
                    );

                    if (currentUserMember) {
                        setIsMember(true);
                        setIsLeader(currentUserMember.memberRole === 'Leader');
                    } else {
                        setIsMember(false);
                        setIsLeader(false);
                    }
                }

                setLoading(false);
            } catch (err) {
                setError('Failed to fetch application details');
                setLoading(false);
                console.error('Error fetching application:', err);
            }
        };

        fetchApplication();
    }, [id, user?.student?.id]);

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

    // Helper function to get status icon and color
    const getStatusInfo = (status: string) => {
        switch (status) {
            case 'Pending':
                return {
                    icon: <Clock className="h-5 w-5" />,
                    color: 'text-yellow-500 bg-yellow-50',
                    text: 'Pending'
                };
            case 'Approved':
                return {
                    icon: <CheckCircle className="h-5 w-5" />,
                    color: 'text-green-500 bg-green-50',
                    text: 'Approved'
                };
            case 'Rejected':
                return {
                    icon: <XCircle className="h-5 w-5" />,
                    color: 'text-red-500 bg-red-50',
                    text: 'Rejected'
                };
            default:
                return {
                    icon: <Clock className="h-5 w-5" />,
                    color: 'text-gray-500 bg-gray-50',
                    text: 'Unknown'
                };
        }
    };

    // Format deadline date
    const formatDeadline = (dateString: string) => {
        const deadline = new Date(dateString);
        return deadline.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Calculate days remaining until deadline
    const getDaysRemaining = (dateString: string) => {
        const deadline = new Date(dateString);
        const today = new Date();
        const diffTime = deadline.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    // Handle opening the remove member modal
    const handleOpenRemoveModal = (member: Member) => {
        setSelectedMember(member);
        setIsRemoveModalOpen(true);
        setActionError(null);
    };

    // Handle member removal
    const handleRemoveMember = async () => {
        if (!selectedMember || !application) return;

        try {
            setRemovingMember(true);
            setActionError(null);

            await removeMember(selectedMember.id, application.group.id);

            // Refresh application data
            const response = await getApplicationById(id!);
            setApplication(response.data);

            setIsRemoveModalOpen(false);
            setSelectedMember(null);
            setRemovingMember(false);
        } catch (err: any) {
            setRemovingMember(false);
            setActionError(err.response?.data?.message || 'Failed to remove member. Please try again.');
            console.error('Error removing member:', err);
        }
    };

    // Handle leaving group
    const handleLeaveGroup = async () => {
        if (!application) return;

        try {
            setLeavingGroup(true);
            setActionError(null);

            await leaveGroup(application.group.id);

            setLeavingGroup(false);
            setIsLeaveModalOpen(false);

            // Redirect to applications page after leaving
            navigate('/applications');
        } catch (err: any) {
            setLeavingGroup(false);
            setActionError(err.response?.data?.message || 'Failed to leave group. Please try again.');
            console.error('Error leaving group:', err);
        }
    };

    // Handle navigation to assessments
    const handleNavigateToAssessments = () => {
        navigate('/assessments');
    };

    if (loading) {
        return <Loading />;
    }

    if (error || !application) {
        return (
            <div className="w-full max-w-7xl p-4 mx-auto">
                <div className="bg-red-50 p-4 rounded-lg shadow-sm">
                    <p className="text-red-800">Error: {error || 'Application not found'}</p>
                    <Link to="/applications" className="flex items-center mt-4 text-blue-600 hover:text-blue-800">
                        <ArrowLeft className="h-4 w-4 mr-1" />
                        Back to Applications
                    </Link>
                </div>
            </div>
        );
    }

    const statusInfo = getStatusInfo(application.applicationStatus);
    const daysRemaining = getDaysRemaining(application.project.deadline);
    const isApproved = application.applicationStatus === 'Approved';
    const showSubmissionButton = isApproved && isLeader;

    return (
        <div className="w-full max-w-7xl mx-auto p-4 overflow-y-auto max-h-screen">
            {/* Action error notification */}
            {actionError && (
                <div className="mb-4 flex items-center p-3 bg-red-50 rounded-lg text-red-700 text-sm">
                    <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                    {actionError}
                </div>
            )}

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Header with back button */}
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center">
                    <Link to="/applications" className="mr-3 p-1 rounded-full hover:bg-gray-200">
                        <ArrowLeft className="h-5 w-5 text-gray-600" />
                    </Link>
                    <h1 className="text-xl font-bold text-gray-900">Application Details</h1>

                    {/* Leave Group Button - Only for members, not leaders */}
                    {isMember && !isLeader && (
                        <button
                            onClick={() => setIsLeaveModalOpen(true)}
                            className="ml-auto mr-3 px-3 py-1 bg-red-50 text-red-600 hover:bg-red-100 rounded-md text-sm font-medium flex items-center"
                        >
                            <LogOut className="h-4 w-4 mr-1" />
                            Leave Group
                        </button>
                    )}

                    {/* Submission Button - Only for approved projects and leaders */}
                    {showSubmissionButton && (
                        <button
                            onClick={handleNavigateToAssessments}
                            className="ml-auto mr-3 px-3 py-1 bg-blue-600 text-white hover:bg-blue-700 rounded-md text-sm font-medium flex items-center"
                        >
                            <FileText className="h-4 w-4 mr-1" />
                            Manage Submissions
                        </button>
                    )}

                    <div className={`${(!isMember || (isLeader && !isApproved)) ? 'ml-auto' : ''} px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1 ${statusInfo.color}`}>
                        {statusInfo.icon}
                        <span>{statusInfo.text}</span>
                    </div>
                </div>

                <div className="p-4 md:p-6 overflow-y-auto">
                    {/* Project Details */}
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold mb-2">Project Information</h2>
                        <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex flex-wrap gap-2 mb-3">
                                <span className={`px-2 py-1 rounded-md text-xs font-medium ${getDomainColor(application.project.domain)}`}>
                                    {application.project.domain}
                                </span>
                                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs font-medium">
                                    {application.project.course}
                                </span>
                            </div>

                            <h3 className="text-lg font-bold text-gray-900 mb-3">{application.project.title}</h3>
                            <p className="text-gray-700 text-sm mb-4">{application.project.description}</p>

                            {/* Tags */}
                            {application.project.tags && application.project.tags.length > 0 && (
                                <div className="mb-4">
                                    <h4 className="text-xs font-medium text-gray-500 mb-2">Tags</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {application.project.tags.map((tag, index) => (
                                            <span key={index} className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Deadline */}
                            <div className="flex items-start space-x-3 mb-4">
                                <div className="bg-red-100 rounded-lg p-2 flex-shrink-0">
                                    <CalendarIcon className="h-5 w-5 text-red-600" />
                                </div>
                                <div>
                                    <h4 className="text-xs font-medium text-gray-500">Deadline</h4>
                                    <p className="text-sm font-medium text-gray-900">{formatDeadline(application.project.deadline)}</p>
                                    <p className={`text-xs ${daysRemaining <= 0 ? 'text-red-600 font-medium' : daysRemaining <= 3 ? 'text-orange-600' : 'text-gray-500'}`}>
                                        {daysRemaining <= 0
                                            ? 'Deadline passed'
                                            : daysRemaining === 1
                                                ? '1 day remaining'
                                                : `${daysRemaining} days remaining`}
                                    </p>
                                </div>
                            </div>

                            {/* Faculty */}
                            <div className="flex items-start space-x-3">
                                <div className="bg-blue-100 rounded-lg p-2 flex-shrink-0">
                                    <Award className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                    <h4 className="text-xs font-medium text-gray-500">Faculty</h4>
                                    <p className="text-sm font-medium text-gray-900">{application.project.faculty.user.name}</p>
                                    <p className="text-xs text-gray-500">{application.project.faculty.user.email}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Group Details */}
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold mb-2">Group Information</h2>
                        <div className="bg-gray-50 rounded-lg p-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                                {/* Group Name */}
                                <div className="flex items-center space-x-3">
                                    <div className="bg-green-100 rounded-lg p-2 flex-shrink-0">
                                        <Users className="h-5 w-5 text-green-600" />
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-medium text-gray-500">Group Name</h4>
                                        <p className="text-sm font-medium text-gray-900">{application.group.name}</p>
                                    </div>
                                </div>

                                {/* Invite Code */}
                                <div className="flex items-center space-x-3">
                                    <div className="bg-purple-100 rounded-lg p-2 flex-shrink-0">
                                        <Tag className="h-5 w-5 text-purple-600" />
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-medium text-gray-500">Invite Code</h4>
                                        <p className="text-sm font-medium text-gray-900">{application.group.inviteCode}</p>
                                    </div>
                                </div>

                                {/* Created Date */}
                                <div className="flex items-center space-x-3">
                                    <div className="bg-amber-100 rounded-lg p-2 flex-shrink-0">
                                        <Calendar className="h-5 w-5 text-amber-600" />
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-medium text-gray-500">Created</h4>
                                        <p className="text-sm font-medium text-gray-900">
                                            {new Date(application.group.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Group Capacity */}
                            <div className="mb-4">
                                <div className="flex justify-between items-center mb-1">
                                    <h4 className="text-xs font-medium text-gray-500">Capacity</h4>
                                    <span className="text-xs text-gray-500">
                                        {application.group.currentMember}/{application.group.maxMembers}
                                    </span>
                                </div>
                                <div className="bg-gray-200 rounded-full h-2 w-full">
                                    <div
                                        className="bg-blue-500 rounded-full h-2"
                                        style={{ width: `${(application.group.currentMember / application.group.maxMembers) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Members List */}
                    <div>
                        <h2 className="text-lg font-semibold mb-2">Group Members</h2>
                        <div className="space-y-3">
                            {application.group.members.map(member => (
                                <div key={member.id} className="bg-gray-50 rounded-lg p-3">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                        <div className="flex items-center space-x-3 mb-2 sm:mb-0">
                                            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-sm">
                                                {member.student.user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">{member.student.user.name}</p>
                                                <p className="text-xs text-gray-500">{member.student.user.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded">
                                                {member.student.studentId}
                                            </span>
                                            <span className={`text-xs px-2 py-0.5 rounded ${member.memberRole === 'Leader'
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-blue-100 text-blue-700'
                                                }`}>
                                                {member.memberRole}
                                            </span>

                                            {/* Kick Button - Only show for members (not leaders) and only if current user is a leader */}
                                            {isLeader && member.memberRole !== 'Leader' && (
                                                <button
                                                    onClick={() => handleOpenRemoveModal(member)}
                                                    className="ml-2 p-1 rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                                                    title="Remove member"
                                                >
                                                    <UserMinus className="h-4 w-4" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Remove Member Modal */}
            <RemoveMemberModal
                isOpen={isRemoveModalOpen}
                member={selectedMember}
                onClose={() => setIsRemoveModalOpen(false)}
                onConfirm={handleRemoveMember}
                loading={removingMember}
            />

            {/* Leave Group Modal */}
            <LeaveGroupModal
                isOpen={isLeaveModalOpen}
                groupName={application?.group.name || ''}
                onClose={() => setIsLeaveModalOpen(false)}
                onConfirm={handleLeaveGroup}
                loading={leavingGroup}
            />
        </div>
    );
};

export default ApplicationById;