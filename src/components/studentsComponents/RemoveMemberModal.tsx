import { X, UserMinus, AlertTriangle } from 'lucide-react';

interface Member {
    id: string;
    student: {
        user: {
            name: string;
            email: string;
        };
        studentId: string;
    };
}

interface RemoveMemberModalProps {
    isOpen: boolean;
    member: Member | null;
    onClose: () => void;
    onConfirm: () => void;
    loading: boolean;
}

const RemoveMemberModal = ({ isOpen, member, onClose, onConfirm, loading }: RemoveMemberModalProps) => {
    if (!isOpen || !member) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <div className="flex items-center">
                        <div className="bg-red-100 p-2 rounded-full mr-3">
                            <UserMinus className="h-5 w-5 text-red-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">Remove Member</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-500 focus:outline-none"
                        disabled={loading}
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="flex items-center mb-4">
                        <div className="bg-yellow-100 p-2 rounded-full mr-3">
                            <AlertTriangle className="h-5 w-5 text-yellow-600" />
                        </div>
                        <p className="text-gray-700">
                            Are you sure you want to remove this member from your group?
                        </p>
                    </div>

                    {/* Member details */}
                    <div className="bg-gray-50 p-4 rounded-lg mb-6">
                        <div className="flex items-start space-x-3">
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-sm">
                                {member.student.user.name.charAt(0)}
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-900">{member.student.user.name}</p>
                                <p className="text-xs text-gray-500">{member.student.user.email}</p>
                                <p className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded mt-1 inline-block">
                                    {member.student.studentId}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={onConfirm}
                            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none"
                            disabled={loading}
                        >
                            {loading ? 'Removing...' : 'Remove Member'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RemoveMemberModal;