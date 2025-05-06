import { useState, FormEvent, useEffect } from 'react';
import { X, Briefcase, GraduationCap, ShieldCheck, AlertCircle, Check } from 'lucide-react';
import { User, UserRole } from '../../types/user';
import { assignFacultyRole, assignStudentRole, assignAdminRole } from '../../services/adminApi';

interface RoleAssignmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    user: User | null;
}

const RoleAssignmentModal = ({ isOpen, onClose, onSuccess, user }: RoleAssignmentModalProps) => {
    const [selectedRole, setSelectedRole] = useState<UserRole | ''>('');
    const [department, setDepartment] = useState('');
    const [designation, setDesignation] = useState('');
    const [rollNumber, setrollNumber] = useState('');
    const [batch, setBatch] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Reset form when modal opens with a different user
    useEffect(() => {
        if (isOpen && user) {
            setSelectedRole('');
            setDepartment('');
            setDesignation('');
            setrollNumber('');
            setBatch('');
            setError(null);
        }
    }, [isOpen, user]);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!user || !selectedRole) return;

        try {
            setIsSubmitting(true);
            setError(null);

            switch (selectedRole) {
                case UserRole.faculty:
                    await assignFacultyRole(user.id, department, designation);
                    break;
                case UserRole.student:
                    await assignStudentRole(user.id, rollNumber, batch);
                    break;
                case UserRole.admin:
                    await assignAdminRole(user.id);
                    break;
            }

            onSuccess();
            onClose();
        } catch (err: any) {
            setError(err.response?.data?.message || `Failed to assign ${selectedRole} role. Please try again.`);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen || !user) return null;

    // Helper to check if the form is valid based on selected role
    const isFormValid = () => {
        switch (selectedRole) {
            case UserRole.faculty:
                return department.trim() !== '' && designation.trim() !== '';
            case UserRole.student:
                return rollNumber.trim() !== '' && batch.trim() !== '';
            case UserRole.admin:
                return true;
            default:
                return false;
        }
    };


    // Get role button colors
    const getRoleButtonClass = (role: UserRole) => {
        if (selectedRole === role) {
            switch (role) {
                case UserRole.admin:
                    return 'bg-red-600 text-white';
                case UserRole.faculty:
                    return 'bg-blue-600 text-white';
                case UserRole.student:
                    return 'bg-green-600 text-white';
            }
        }
        return 'bg-gray-100 text-gray-700 hover:bg-gray-200';
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                <div className="flex justify-between items-center border-b border-gray-200 p-4">
                    <h3 className="text-lg font-medium text-gray-900">
                        Assign Role to {user.name}
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

                    {/* Role Selection */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Select Role
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                            <button
                                type="button"
                                className={`flex items-center justify-center py-2 px-3 rounded-md ${getRoleButtonClass(UserRole.faculty)}`}
                                onClick={() => setSelectedRole(UserRole.faculty)}
                            >
                                <Briefcase className="h-4 w-4 mr-1" />
                                Faculty
                            </button>
                            <button
                                type="button"
                                className={`flex items-center justify-center py-2 px-3 rounded-md ${getRoleButtonClass(UserRole.student)}`}
                                onClick={() => setSelectedRole(UserRole.student)}
                            >
                                <GraduationCap className="h-4 w-4 mr-1" />
                                Student
                            </button>
                            <button
                                type="button"
                                className={`flex items-center justify-center py-2 px-3 rounded-md ${getRoleButtonClass(UserRole.admin)}`}
                                onClick={() => setSelectedRole(UserRole.admin)}
                            >
                                <ShieldCheck className="h-4 w-4 mr-1" />
                                Admin
                            </button>
                        </div>
                    </div>

                    {/* Dynamic fields based on selected role */}
                    {selectedRole === UserRole.faculty && (
                        <div className="space-y-4">
                            <div>
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

                            <div>
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
                        </div>
                    )}

                    {selectedRole === UserRole.student && (
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="rollNumber" className="block text-sm font-medium text-gray-700 mb-1">
                                    Roll Number
                                </label>
                                <input
                                    type="text"
                                    id="rollNumber"
                                    value={rollNumber}
                                    onChange={(e) => setrollNumber(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g., APxxxxxxxxxx"
                                    required
                                />
                            </div>

                            <div>
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
                        </div>
                    )}

                    {selectedRole === UserRole.admin && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <AlertCircle className="h-5 w-5 text-yellow-600" />
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-yellow-800">Warning</h3>
                                    <div className="mt-2 text-sm text-yellow-700">
                                        <p>
                                            You are about to assign admin privileges to <strong>{user.name}</strong>. Admins have full access to manage users and system settings.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

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
                            disabled={isSubmitting || !selectedRole || !isFormValid()}
                            className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center
                ${(isSubmitting || !selectedRole || !isFormValid()) ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {isSubmitting ? (
                                <>
                                    <span className="animate-spin h-4 w-4 mr-2 border-b-2 border-white rounded-full"></span>
                                    Assigning...
                                </>
                            ) : (
                                <>
                                    <Check className="h-4 w-4 mr-2" />
                                    Assign Role
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RoleAssignmentModal;