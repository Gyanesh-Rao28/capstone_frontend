import { X, LogOut, AlertTriangle } from 'lucide-react';

interface LeaveGroupModalProps {
    isOpen: boolean;
    groupName: string;
    onClose: () => void;
    onConfirm: () => void;
    loading: boolean;
}

const LeaveGroupModal = ({ isOpen, groupName, onClose, onConfirm, loading }: LeaveGroupModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <div className="flex items-center">
                        <div className="bg-red-100 p-2 rounded-full mr-3">
                            <LogOut className="h-5 w-5 text-red-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">Leave Group</h3>
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
                    <div className="flex items-start space-x-3 mb-6">
                        <div className="bg-yellow-100 p-2 rounded-full flex-shrink-0">
                            <AlertTriangle className="h-5 w-5 text-yellow-600" />
                        </div>
                        <div>
                            <h4 className="font-medium text-gray-900 mb-1">Confirm leaving group</h4>
                            <p className="text-gray-600 text-sm">
                                Are you sure you want to leave the group "{groupName}"? This action cannot be undone.
                            </p>
                        </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg mb-6">
                        <p className="text-sm text-gray-700">
                            When you leave a group:
                        </p>
                        <ul className="mt-2 text-xs text-gray-600 space-y-1 pl-5 list-disc">
                            <li>You'll lose access to this project</li>
                            <li>You'll need a new invite code to rejoin</li>
                            <li>Your submissions will remain with the group</li>
                        </ul>
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
                            {loading ? 'Leaving...' : 'Leave Group'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LeaveGroupModal;