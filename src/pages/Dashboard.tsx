import { useState, useEffect } from 'react';
import { useAuth } from "../hooks/useAuth";
import { 
  User, Shield, Mail, Key, KeyRound, IdCard, 
  ChevronLeft, ChevronRight, Search, Bell, 
  Layout, Calendar, FileText, PieChart, 
  Users, FolderOpen, Edit, Settings, LogOut,
  Plus, CheckCircle, MessageCircle, AlertCircle
} from 'lucide-react';

import { UserRole } from "../types/enum";

const Dashboard = () => {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
    if (isProfileOpen) setIsProfileOpen(false);
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
    if (isNotificationsOpen) setIsNotificationsOpen(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user?.name) return "U";
    return user.name
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Determine background color based on role
  const getRoleColor = () => {
    switch(user?.role) {
      case UserRole.admin:
        return "bg-purple-600";
      case UserRole.faculty:
        return "bg-blue-600";
      case UserRole.student:
        return "bg-green-600";
      default:
        return "bg-gray-600";
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`bg-white shadow-lg transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'} flex flex-col fixed h-full z-10`}>
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center">
            <div className="bg-blue-600 text-white p-2 rounded-lg">
              <Layout size={20} />
            </div>
            {isSidebarOpen && <h1 className="ml-3 font-bold text-lg">Portal</h1>}
          </div>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4">
          <ul>
            <li className="mb-2">
              <a className="flex items-center px-4 py-3 text-blue-600 bg-blue-50 border-r-4 border-blue-600 cursor-pointer">
                <Layout size={20} />
                {isSidebarOpen && <span className="ml-3">Dashboard</span>}
              </a>
            </li>
            
            {/* Conditional navigation items based on user role */}
            {user?.role === UserRole.admin && (
              <li className="mb-2">
                <a className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-100 cursor-pointer">
                  <Users size={20} />
                  {isSidebarOpen && <span className="ml-3">Manage Users</span>}
                </a>
              </li>
            )}
            
            {user?.role === UserRole.faculty && (
              <li className="mb-2">
                <a className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-100 cursor-pointer">
                  <FolderOpen size={20} />
                  {isSidebarOpen && <span className="ml-3">My Courses</span>}
                </a>
              </li>
            )}
            
            {user?.role === UserRole.student && (
              <li className="mb-2">
                <a className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-100 cursor-pointer">
                  <FileText size={20} />
                  {isSidebarOpen && <span className="ml-3">My Classes</span>}
                </a>
              </li>
            )}
            
            <li className="mb-2">
              <a className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-100 cursor-pointer">
                <Calendar size={20} />
                {isSidebarOpen && <span className="ml-3">Calendar</span>}
              </a>
            </li>
            
            <li className="mb-2">
              <a className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-100 cursor-pointer">
                <PieChart size={20} />
                {isSidebarOpen && <span className="ml-3">Reports</span>}
              </a>
            </li>
          </ul>
        </nav>
        
        {isSidebarOpen && (
          <div className="p-4 border-t">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Quick Access</h3>
            <div className="flex flex-col gap-2">
              <button className="text-sm text-blue-600 hover:text-blue-800 text-left">Edit Profile</button>
              <button className="text-sm text-blue-600 hover:text-blue-800 text-left">Settings</button>
              <button className="text-sm text-blue-600 hover:text-blue-800 text-left">Help Center</button>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col ${isSidebarOpen ? 'ml-64' : 'ml-20'} transition-all duration-300`}>
        {/* Header */}
        <header className="bg-white shadow-sm z-10">
          <div className="flex justify-between items-center px-6 py-4">
            <div className="flex items-center">
              <button 
                onClick={toggleSidebar} 
                className="text-gray-500 hover:text-gray-700 mr-4 cursor-pointer"
              >
                {isSidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
              </button>
              <h1 className="text-xl font-semibold text-gray-800">Dashboard Overview</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              </div>
              
              <div className="relative">
                <button 
                  onClick={toggleNotifications}
                  className="relative p-2 text-gray-500 hover:text-gray-700 cursor-pointer"
                >
                  <Bell size={20} />
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">2</span>
                </button>
                
                {isNotificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-2 z-20 border">
                    <h3 className="px-4 py-2 text-sm font-semibold text-gray-700 border-b">Notifications</h3>
                    <div className="max-h-96 overflow-y-auto">
                      <div className="px-4 py-3 hover:bg-gray-50 border-b cursor-pointer">
                        <div className="flex items-start">
                          <div className="bg-blue-100 p-2 rounded-full">
                            <MessageCircle size={16} className="text-blue-500" />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">Profile update successful</p>
                            <p className="text-xs text-gray-500">2 hours ago</p>
                          </div>
                        </div>
                      </div>
                      <div className="px-4 py-3 hover:bg-gray-50 cursor-pointer">
                        <div className="flex items-start">
                          <div className="bg-red-100 p-2 rounded-full">
                            <AlertCircle size={16} className="text-red-500" />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">Action required: Verify your email</p>
                            <p className="text-xs text-gray-500">Yesterday</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="px-4 py-2 border-t text-center">
                      <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">View all notifications</button>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="relative">
                <button 
                  onClick={toggleProfile}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <div className={`w-10 h-10 rounded-full ${getRoleColor()} flex items-center justify-center text-white font-bold`}>
                    {getUserInitials()}
                  </div>
                  {isSidebarOpen && (
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-700">{user?.name}</span>
                      <ChevronRight className="ml-1 text-gray-500" size={16} />
                    </div>
                  )}
                </button>
                
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-20 border">
                    <a className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
                      <User size={16} className="mr-2" />
                      Your Profile
                    </a>
                    <a className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
                      <Settings size={16} className="mr-2" />
                      Settings
                    </a>
                    <div className="border-t my-1"></div>
                    <a className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
                      <LogOut size={16} className="mr-2" />
                      Sign out
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>
        
        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {/* Profile Status Card */}
            <div className="bg-white rounded-lg shadow-sm p-6 flex items-center">
              <div className="bg-blue-100 p-3 rounded-full">
                <User className="text-blue-600" size={20} />
              </div>
              <div className="ml-4">
                <h3 className="text-gray-500 text-sm font-medium">Profile Status</h3>
                <div className="flex items-center">
                  <p className="text-2xl font-bold text-gray-800">Active</p>
                  <span className="ml-2 text-xs font-medium text-green-600 bg-green-100 px-2 py-0.5 rounded-full">Verified</span>
                </div>
              </div>
            </div>
            
            {/* Role Card */}
            <div className="bg-white rounded-lg shadow-sm p-6 flex items-center">
              <div className="bg-purple-100 p-3 rounded-full">
                <Shield className="text-purple-600" size={20} />
              </div>
              <div className="ml-4">
                <h3 className="text-gray-500 text-sm font-medium">User Role</h3>
                <div className="flex items-center">
                  <p className="text-2xl font-bold text-gray-800 capitalize">{user?.role || "User"}</p>
                </div>
              </div>
            </div>
            
            {/* User-specific stats based on role */}
            {user?.role === UserRole.student && (
              <div className="bg-white rounded-lg shadow-sm p-6 flex items-center">
                <div className="bg-green-100 p-3 rounded-full">
                  <FileText className="text-green-600" size={20} />
                </div>
                <div className="ml-4">
                  <h3 className="text-gray-500 text-sm font-medium">Enrolled Classes</h3>
                  <div className="flex items-center">
                    <p className="text-2xl font-bold text-gray-800">0</p>
                  </div>
                </div>
              </div>
            )}
            
            {user?.role === UserRole.faculty && (
              <div className="bg-white rounded-lg shadow-sm p-6 flex items-center">
                <div className="bg-green-100 p-3 rounded-full">
                  <FolderOpen className="text-green-600" size={20} />
                </div>
                <div className="ml-4">
                  <h3 className="text-gray-500 text-sm font-medium">Active Courses</h3>
                  <div className="flex items-center">
                    <p className="text-2xl font-bold text-gray-800">0</p>
                  </div>
                </div>
              </div>
            )}
            
            {user?.role === UserRole.admin && (
              <div className="bg-white rounded-lg shadow-sm p-6 flex items-center">
                <div className="bg-green-100 p-3 rounded-full">
                  <Users className="text-green-600" size={20} />
                </div>
                <div className="ml-4">
                  <h3 className="text-gray-500 text-sm font-medium">System Users</h3>
                  <div className="flex items-center">
                    <p className="text-2xl font-bold text-gray-800">1</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Last Login Card */}
            <div className="bg-white rounded-lg shadow-sm p-6 flex items-center">
              <div className="bg-orange-100 p-3 rounded-full">
                <Calendar className="text-orange-600" size={20} />
              </div>
              <div className="ml-4">
                <h3 className="text-gray-500 text-sm font-medium">Last Login</h3>
                <div className="flex items-center">
                  <p className="text-lg font-bold text-gray-800">{new Date().toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Profile Card - Enhanced version of your existing card */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
            <div className="px-6 py-8">
              <div className="flex items-center space-x-6">
                <div className={`h-24 w-24 rounded-full ${getRoleColor()} flex items-center justify-center text-white text-3xl font-bold border-4 border-gray-100 shadow-sm`}>
                  {getUserInitials()}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{user?.name}</h2>
                  <p className="text-sm text-gray-500 mt-1">Welcome back to your dashboard</p>
                </div>
              </div>
            </div>

            {/* User Info Grid */}
            <div className="border-t border-gray-200 px-6 py-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Email Card */}
                <div className="bg-gray-50 rounded-lg p-4 flex items-start space-x-4">
                  <div className="bg-blue-100 rounded-lg p-3">
                    <Mail className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Email</h3>
                    <p className="mt-1 text-sm text-gray-900">{user?.email}</p>
                  </div>
                </div>

                {/* Role Card */}
                <div className="bg-gray-50 rounded-lg p-4 flex items-start space-x-4">
                  <div className="bg-green-100 rounded-lg p-3">
                    <Shield className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Role</h3>
                    <p className="mt-1 text-sm text-gray-900 capitalize">{user?.role}</p>
                  </div>
                </div>

                {/* ID Card */}
                <div className="bg-gray-50 rounded-lg p-4 flex items-start space-x-4">
                  <div className="bg-purple-100 rounded-lg p-3">
                    <Key className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">User ID</h3>
                    <p className="mt-1 text-sm text-gray-900 truncate" title={user?.id}>
                      {user?.id}
                    </p>
                  </div>
                </div>

                {/* Admin ID Card */}
                { user?.role === UserRole.admin && <div className="bg-gray-50 rounded-lg p-4 flex items-start space-x-4">
                  <div className="bg-amber-100 rounded-lg p-3">
                    <KeyRound className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Admin ID</h3>
                    <p className="mt-1 text-sm text-gray-900 truncate" title={user?.admin?.id}>
                      {user?.admin?.id}
                    </p>
                  </div>
                </div>}

                {/* faculty ID Card */}
                {user?.role === UserRole.faculty && 
                <div className="bg-gray-50 rounded-lg p-4 flex items-start space-x-4">
                  <div className="bg-amber-100 rounded-lg p-3">
                    <KeyRound className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Faculty ID</h3>
                    <p className="mt-1 text-sm text-gray-900 truncate" title={user?.faculty?.id}>
                      {user?.faculty?.id}
                    </p>
                  </div>
                </div>
                }

                {/* student ID Card */}
                {user?.role === UserRole.student && <div className="bg-gray-50 rounded-lg p-4 flex items-start space-x-4">
                  <div className="bg-amber-100 rounded-lg p-3">
                    <KeyRound className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Student ID</h3>
                    <p className="mt-1 text-sm text-gray-900 truncate" title={user?.student?.id}>
                      {user?.student?.id}
                    </p>
                  </div>
                </div>}

                {user?.role === UserRole.student && <div className="bg-gray-50 rounded-lg p-4 flex items-start space-x-4">
                  <div className="bg-indigo-100 rounded-lg p-3">
                    <IdCard className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Student ID</h3>
                    <p className="mt-1 text-sm text-gray-900 truncate" title={user?.student?.studentId}>
                      {user?.student?.studentId}
                    </p>
                  </div>
                </div>}
              </div>
            </div>
          </div>

          {/* Quick Actions Section - Enhanced version */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-3">
                <button className="flex flex-col items-center justify-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer">
                  <Edit className="text-blue-600 mb-2" size={20} />
                  <span className="text-sm font-medium text-gray-700">Edit Profile</span>
                </button>
                
                <button className="flex flex-col items-center justify-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors cursor-pointer">
                  <Settings className="text-green-600 mb-2" size={20} />
                  <span className="text-sm font-medium text-gray-700">Settings</span>
                </button>
                
                {user?.role === UserRole.admin && (
                  <button className="flex flex-col items-center justify-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors cursor-pointer">
                    <Shield className="text-purple-600 mb-2" size={20} />
                    <span className="text-sm font-medium text-gray-700">Admin Panel</span>
                  </button>
                )}
                
                {user?.role === UserRole.faculty && (
                  <button className="flex flex-col items-center justify-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors cursor-pointer">
                    <Plus className="text-purple-600 mb-2" size={20} />
                    <span className="text-sm font-medium text-gray-700">New Course</span>
                  </button>
                )}
                
                {user?.role === UserRole.student && (
                  <button className="flex flex-col items-center justify-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors cursor-pointer">
                    <FileText className="text-purple-600 mb-2" size={20} />
                    <span className="text-sm font-medium text-gray-700">My Courses</span>
                  </button>
                )}
              </div>
            </div>
            
            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-sm p-6 lg:col-span-2">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Recent Activity</h2>
                <button className="text-sm text-blue-600 hover:text-blue-800">View All</button>
              </div>
              <div className="space-y-4 max-h-64 overflow-y-auto">
                <div className="flex items-start">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <LogOut className="text-blue-600" size={16} />
                  </div>
                  <div className="ml-3">
                    <div className="flex items-center">
                      <span className="font-medium text-gray-900">System</span>
                      <span className="mx-1 text-gray-500">recorded</span>
                      <span className="font-medium text-gray-900">Login</span>
                    </div>
                    <p className="text-sm text-gray-500">You logged in to the system</p>
                    <p className="text-xs text-gray-400 mt-1">Today at {new Date().toLocaleTimeString()}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-green-100 p-2 rounded-full">
                    <CheckCircle className="text-green-600" size={16} />
                  </div>
                  <div className="ml-3">
                    <div className="flex items-center">
                      <span className="font-medium text-gray-900">System</span>
                      <span className="mx-1 text-gray-500">verified</span>
                      <span className="font-medium text-gray-900">Profile</span>
                    </div>
                    <p className="text-sm text-gray-500">Your profile details were verified</p>
                    <p className="text-xs text-gray-400 mt-1">Today at {new Date().toLocaleTimeString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;