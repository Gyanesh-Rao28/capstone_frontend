import { useState } from 'react';
import { X, Users } from 'lucide-react';
import { addGroupMember } from '../../services/studentApi';

interface JoinTeamModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const JoinTeamModal = ({ isOpen, onClose, onSuccess }: JoinTeamModalProps) => {
    const [inviteCode, setInviteCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inviteCode.trim()) {
            setError('Please enter an invite code');
            return;
        }

        try {
            setLoading(true);
            setError(null);
            await addGroupMember(inviteCode);
            setLoading(false);
            setInviteCode('');
            onSuccess();
            onClose();
        } catch (err: any) {
            setLoading(false);
            setError(err.response?.data?.message || 'Failed to join group. Please try again.');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md relative">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <div className="flex items-center">
                        <div className="bg-blue-100 p-2 rounded-full mr-3">
                            <Users className="h-5 w-5 text-blue-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">Join Team</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-500 focus:outline-none"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <p className="text-gray-600 mb-4">
                        Enter the invite code provided by the team leader to join their group.
                    </p>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="inviteCode" className="block text-sm font-medium text-gray-700 mb-1">
                                Invite Code
                            </label>
                            <input
                                type="text"
                                id="inviteCode"
                                value={inviteCode}
                                onChange={(e) => setInviteCode(e.target.value)}
                                placeholder="Enter invite code (e.g., 2b46-55715)"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                disabled={loading}
                            />
                        </div>

                        {error && (
                            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
                                {error}
                            </div>
                        )}

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
                                type="submit"
                                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                                disabled={loading}
                            >
                                {loading ? 'Joining...' : 'Join Team'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default JoinTeamModal;