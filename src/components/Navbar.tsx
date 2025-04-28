import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ChevronDown, Home, LayoutDashboard, Users, BarChart2, FolderGit2, FileSpreadsheet, LucideIcon } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

// Define types for navigation items
interface BaseNavItem {
    text: string;
    icon: LucideIcon;
}

interface NavLink extends BaseNavItem {
    to: string;
}

interface NavDropdown extends BaseNavItem {
    dropdown: Array<{ to: string; text: string; }>;
}

type NavItem = NavLink | NavDropdown;

// Type guard to check if NavItem is NavDropdown
const isNavDropdown = (item: NavItem): item is NavDropdown => {
    return 'dropdown' in item;
};

interface NavigationConfig {
    common: NavItem[];
    admin: NavItem[];
    faculty: NavItem[];
    student: NavItem[];
}

const Navbar: React.FC = () => {
    // State for mobile menu and dropdowns
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

    // Get auth context
    const { isAuthenticated, logout, user } = useAuth();

    // Navigation configuration
    const navigationConfig: NavigationConfig = {
        common: [
            { to: "/", text: "Home", icon: Home }
        ],
        admin: [
            {
                text: "Manage Users",
                icon: Users,
                dropdown: [
                    { to: "/manage/students", text: "Students" },
                    { to: "/manage/faculty", text: "Faculty" },
                    { to: "/manage/admin", text: "Admins" },
                    { to: "/manage/user", text: "Users" }
                ]
            },
            { to: "/analytics", text: "Analytics", icon: BarChart2 }
        ],
        faculty: [
            // {
            //     text: "Manage Projects",
            //     icon: FolderGit2,
            //     dropdown: [
            //         { to: "/projects/idp", text: "IDP" },
            //         { to: "/projects/capstone", text: "Capstone" },
            //         { to: "/projects/urop", text: "UROP" }
            //     ]
            // },
            { to: "/faculty/applications", text: "Applications", icon: FileSpreadsheet }
            ,
            { to: "/faculty/project/create", text: "Manage Projects", icon: FolderGit2 }
        ],
        student: [
            { to: "/projects", text: "Projects", icon: FolderGit2 },
            { to: "/applications", text: "Application", icon: FileSpreadsheet }
        ]
    };

    // Get navigation links based on user role
    const getNavLinks = (): NavItem[] => {
        const links = [...navigationConfig.common];

        if (isAuthenticated) {
            links.push({ to: "/dashboard", text: "Dashboard", icon: LayoutDashboard });
        }

        if (user?.role && user.role in navigationConfig) {
            const roleLinks = navigationConfig[user.role as keyof typeof navigationConfig];
            links.push(...roleLinks);
        }
        return links;
    };

    // Toggle dropdown menu
    const handleDropdownClick = (dropdownName: string) => {
        setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName);
    };

    // Handle logout with type safety
    const handleLogout = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        logout();
        setIsMobileMenuOpen(false);
    };

    return (
        <nav className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link to="/" className="text-xl font-bold text-gray-900">
                            Project Management Portal
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-4">
                        {getNavLinks().map((item, index) => (
                            isNavDropdown(item) ? (
                                <div key={index} className="relative">
                                    <button
                                        onClick={() => handleDropdownClick(item.text)}
                                        className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900 space-x-1"
                                    >
                                        <item.icon className="h-5 w-5" />
                                        <span>{item.text}</span>
                                        <ChevronDown className="h-4 w-4" />
                                    </button>
                                    {activeDropdown === item.text && (
                                        <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 border border-gray-200">
                                            {item.dropdown.map((dropdownItem, dropdownIndex) => (
                                                <Link
                                                    key={dropdownIndex}
                                                    to={dropdownItem.to}
                                                    className="block px-4 py-2 text-gray-600 hover:bg-gray-50"
                                                    onClick={() => setActiveDropdown(null)}
                                                >
                                                    {dropdownItem.text}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <Link
                                    key={index}
                                    to={item.to}
                                    className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900 space-x-1"
                                >
                                    <item.icon className="h-5 w-5" />
                                    <span>{item.text}</span>
                                </Link>
                            )
                        ))}

                        {/* Auth Button */}
                        {!isAuthenticated ? (
                            <Link
                                to="/login"
                                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                            >
                                Login
                            </Link>
                        ) : (
                            <button
                                onClick={handleLogout}
                                className="bg-red-400 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200"
                            >
                                Logout
                            </button>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="text-gray-600 hover:text-gray-900"
                        >
                            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isMobileMenuOpen && (
                    <div className="md:hidden py-3">
                        {getNavLinks().map((item, index) => (
                            isNavDropdown(item) ? (
                                <div key={index}>
                                    <button
                                        onClick={() => handleDropdownClick(item.text)}
                                        className="w-full flex items-center px-3 py-2 text-gray-600 hover:bg-gray-50 space-x-2"
                                    >
                                        <item.icon className="h-5 w-5" />
                                        <span>{item.text}</span>
                                        <ChevronDown className="h-4 w-4 ml-auto" />
                                    </button>
                                    {activeDropdown === item.text && (
                                        <div className="bg-gray-50 pl-10">
                                            {item.dropdown.map((dropdownItem, dropdownIndex) => (
                                                <Link
                                                    key={dropdownIndex}
                                                    to={dropdownItem.to}
                                                    className="block px-3 py-2 text-gray-600 hover:bg-gray-100"
                                                    onClick={() => {
                                                        setActiveDropdown(null);
                                                        setIsMobileMenuOpen(false);
                                                    }}
                                                >
                                                    {dropdownItem.text}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <Link
                                    key={index}
                                    to={item.to}
                                    className="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-50 space-x-2"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <item.icon className="h-5 w-5" />
                                    <span>{item.text}</span>
                                </Link>
                            )
                        ))}

                        {/* Mobile Auth Button */}
                        {!isAuthenticated ? (
                            <Link
                                to="/login"
                                className="block px-3 py-2 text-blue-600 hover:bg-gray-50"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Login
                            </Link>
                        ) : (
                            <button
                                onClick={handleLogout}
                                className="w-full text-left px-3 py-2 text-gray-600 hover:bg-gray-50"
                            >
                                Logout
                            </button>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;