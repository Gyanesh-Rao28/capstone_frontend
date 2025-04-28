import { Search, Filter, X } from 'lucide-react';
import { UserRole } from '../../types/user';

interface UserSearchFilterProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    selectedRole: string;
    setSelectedRole: (role: string) => void;
}

const UserSearchFilter = ({ searchTerm, setSearchTerm, selectedRole, setSelectedRole }: UserSearchFilterProps) => {
    const handleClearSearch = () => {
        setSearchTerm('');
    };

    const handleClearFilter = () => {
        setSelectedRole('');
    };

    return (
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                {/* Search Input */}
                <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by name or email..."
                        className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    {searchTerm && (
                        <button
                            onClick={handleClearSearch}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                            <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        </button>
                    )}
                </div>

                {/* Role Filter */}
                <div className="flex items-center space-x-2">
                    <div className="flex items-center bg-gray-100 px-3 py-2 rounded-md">
                        <Filter className="h-5 w-5 text-gray-500 mr-2" />
                        <select
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value)}
                            className="bg-transparent border-none focus:ring-0 text-gray-700 pr-7"
                        >
                            <option value="">All Roles</option>
                            {Object.values(UserRole).map((role) => (
                                <option key={role} value={role}>
                                    {role.charAt(0).toUpperCase() + role.slice(1)}
                                </option>
                            ))}
                        </select>
                        {selectedRole && (
                            <button onClick={handleClearFilter}>
                                <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserSearchFilter;