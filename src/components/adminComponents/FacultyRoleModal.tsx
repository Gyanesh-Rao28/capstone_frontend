import { useState, FormEvent } from 'react';
import { X, Briefcase, GraduationCap, ShieldCheck, AlertCircle } from 'lucide-react';
import { User } from '../../types/user';
import { assignFacultyRole, assignStudentRole, assignAdminRole } from '../../services/adminApi';

interface RoleModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    user: User | null;
}

export const FacultyRoleModal = ({ isOpen, onClose, onSuccess, user }: RoleModalProps) => {
    const [department, setDepartment] = useState(user?.faculty?.department || '');
    const [designation, setDesignation] = useState(user?.faculty?.designation || '');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!user) return;

        try {
            setIsSubmitting(true);
            setError(null);
            await assignFacultyRole(user.id, department, designation);
            onSuccess();
            onClose();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to assign faculty role. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                <div className="flex justify-between items-center border-b border-gray-200 p-4">
                    <h3 className="text-lg font-medium text-gray-900 flex items-center">
                        <Briefcase className="h-5 w-5 text-blue-600 mr-2" />
                        Assign Faculty Role
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-500 p-1 rounded-full hover:bg-gray-100"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm flex items-start">
                            <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0 mt-0.5" />
                            {error}
                        </div>
                    )}

                    <div className="mb-4">
                        <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
                            Department
                        </label>
                        <input
                            type="text"
                            id="department"
                            value={department}
                            onChange={(e) => setDepartment(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., CSE, ECE, ME"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="designation" className="block text-sm font-medium text-gray-700 mb-1">
                            Designation
                        </label>
                        <input
                            type="text"
                            id="designation"
                            value={designation}
                            onChange={(e) => setDesignation(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., Asst. Prof., Assoc. Prof."
                            required
                        />
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                                }`}
                        >
                            {isSubmitting ? 'Assigning...' : 'Assign Faculty Role'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export const StudentRoleModal = ({ isOpen, onClose, onSuccess, user }: RoleModalProps) => {
    const [studentId, setStudentId] = useState(user?.student?.studentId || '');
    const [batch, setBatch] = useState(user?.student?.batch || '');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!user) return;

        try {
            setIsSubmitting(true);
            setError(null);
            await assignStudentRole(user.id, studentId, batch);
            onSuccess();
            onClose();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to assign student role. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                <div className="flex justify-between items-center border-b border-gray-200 p-4">
                    <h3 className="text-lg font-medium text-gray-900 flex items-center">
                        <GraduationCap className="h-5 w-5 text-blue-600 mr-2" />
                        Assign Student Role
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-500 p-1 rounded-full hover:bg-gray-100"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm flex items-start">
                            <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0 mt-0.5" />
                            {error}
                        </div>
                    )}

                    <div className="mb-4">
                        <label htmlFor="studentId" className="block text-sm font-medium text-gray-700 mb-1">
                            Student ID
                        </label>
                        <input
                            type="text"
                            id="studentId"
                            value={studentId}
                            onChange={(e) => setStudentId(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., AP21110010239"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="batch" className="block text-sm font-medium text-gray-700 mb-1">
                            Batch
                        </label>
                        <input
                            type="text"
                            id="batch"
                            value={batch}
                            onChange={(e) => setBatch(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., 2021"
                            required
                        />
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                                }`}
                        >
                            {isSubmitting ? 'Assigning...' : 'Assign Student Role'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export const AdminRoleModal = ({ isOpen, onClose, onSuccess, user }: RoleModalProps) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!user) return;

        try {
            setIsSubmitting(true);
            setError(null);
            await assignAdminRole(user.id);
            onSuccess();
            onClose();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to assign admin role. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                <div className="flex justify-between items-center border-b border-gray-200 p-4">
                    <h3 className="text-lg font-medium text-gray-900 flex items-center">
                        <ShieldCheck className="h-5 w-5 text-blue-600 mr-2" />
                        Assign Admin Role
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-500 p-1 rounded-full hover:bg-gray-100"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm flex items-start">
                            <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0 mt-0.5" />
                            {error}
                        </div>
                    )}

                    <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <AlertCircle className="h-5 w-5 text-yellow-600" />
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-yellow-800">Warning</h3>
                                <div className="mt-2 text-sm text-yellow-700">
                                    <p>
                                        You are about to assign admin privileges to {user?.name}. Admins have full access to manage users and system settings.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                                }`}
                        >
                            {isSubmitting ? 'Assigning...' : 'Assign Admin Role'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};