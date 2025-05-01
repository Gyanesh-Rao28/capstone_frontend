import { useState } from 'react';
import { BarChart3, BookOpen, Users, Building, User } from 'lucide-react';

// Import components
import StatsCard from '../../components/adminComponents/analyticsComponents/StatsCard';
import DateRangePicker from '../../components/adminComponents/analyticsComponents/DateRangePicker';
import ChartCard from '../../components/adminComponents/analyticsComponents/ChartCard';
import ProjectTrendChart from '../../components/adminComponents/analyticsComponents/ProjectTrendChart';
import ActiveProjectsTable from '../../components/adminComponents/analyticsComponents/ActiveProjectsTable';
import ProjectDistributionChart from '../../components/adminComponents/analyticsComponents/ProjectDistributionChart';
import CourseDistributionChart from '../../components/adminComponents/analyticsComponents/CourseDistributionChart';
import FacultyPerformanceChart from '../../components/adminComponents/analyticsComponents/FacultyPerformanceChart';

const Analytics = () => {
  const [selectedDateRange, setSelectedDateRange] = useState('last30days');

  const handleDateRangeChange = (range: string) => {
    setSelectedDateRange(range);
    // In a real app, you would fetch data based on the selected range
    console.log('Selected date range:', range);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-6 overflow-y-auto max-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <BarChart3 className="h-6 w-6 mr-2 text-blue-600" />
            Dashboard Analytics
          </h1>
          <p className="text-gray-600 mt-1">Overview of project statistics and performance metrics</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <DateRangePicker onChange={handleDateRangeChange} />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard
          title="Total Projects"
          value={100}
          icon={<BookOpen className="h-6 w-6" />}
          iconBgColor="bg-blue-100"
          iconColor="text-blue-600"
          change={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Active Applications"
          value={65}
          icon={<BarChart3 className="h-6 w-6" />}
          iconBgColor="bg-green-100"
          iconColor="text-green-600"
          change={{ value: 8, isPositive: true }}
        />
        <StatsCard
          title="Registered Students"
          value={248}
          icon={<Users className="h-6 w-6" />}
          iconBgColor="bg-purple-100"
          iconColor="text-purple-600"
          change={{ value: 24, isPositive: true }}
        />
        <StatsCard
          title="Faculty Members"
          value={32}
          icon={<User className="h-6 w-6" />}
          iconBgColor="bg-amber-100"
          iconColor="text-amber-600"
          change={{ value: 2, isPositive: true }}
        />
      </div>

      {/* Charts - First Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ChartCard
          title="Project Trend"
          subtitle="Number of projects created per month"
        >
          <ProjectTrendChart />
        </ChartCard>

        <ChartCard
          title="Project Distribution"
          subtitle="Projects by domain"
        >
          <ProjectDistributionChart />
        </ChartCard>
      </div>

      {/* Active Projects Table */}
      <div className="mb-6">
        <ChartCard
          title="Active Projects"
          subtitle="Currently active projects with upcoming deadlines"
        >
          <ActiveProjectsTable />
        </ChartCard>
      </div>

      {/* Charts - Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ChartCard
          title="Course Distribution"
          subtitle="Projects by course type"
        >
          <CourseDistributionChart />
        </ChartCard>

        <ChartCard
          title="Faculty Performance"
          subtitle="Top faculty by projects and applications"
        >
          <FacultyPerformanceChart />
        </ChartCard>
      </div>

      {/* Department Statistics */}
      <div className="mb-6">
        <ChartCard
          title="Department Statistics"
          subtitle="Project and faculty distribution by department"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <div className="bg-blue-100 p-2 rounded-md mr-3">
                  <Building className="h-5 w-5 text-blue-600" />
                </div>
                <h4 className="font-medium text-gray-800">Computer Science</h4>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <p className="text-xs text-gray-500">Projects</p>
                  <p className="text-lg font-semibold">42</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Faculty</p>
                  <p className="text-lg font-semibold">12</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Applications</p>
                  <p className="text-lg font-semibold">128</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Completion Rate</p>
                  <p className="text-lg font-semibold">87%</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <div className="bg-green-100 p-2 rounded-md mr-3">
                  <Building className="h-5 w-5 text-green-600" />
                </div>
                <h4 className="font-medium text-gray-800">Electronics</h4>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <p className="text-xs text-gray-500">Projects</p>
                  <p className="text-lg font-semibold">36</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Faculty</p>
                  <p className="text-lg font-semibold">9</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Applications</p>
                  <p className="text-lg font-semibold">95</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Completion Rate</p>
                  <p className="text-lg font-semibold">82%</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <div className="bg-purple-100 p-2 rounded-md mr-3">
                  <Building className="h-5 w-5 text-purple-600" />
                </div>
                <h4 className="font-medium text-gray-800">Mechanical</h4>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <p className="text-xs text-gray-500">Projects</p>
                  <p className="text-lg font-semibold">22</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Faculty</p>
                  <p className="text-lg font-semibold">8</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Applications</p>
                  <p className="text-lg font-semibold">64</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Completion Rate</p>
                  <p className="text-lg font-semibold">79%</p>
                </div>
              </div>
            </div>
          </div>
        </ChartCard>
      </div>

      {/* Student Engagement Metrics */}
      <div className="mb-6">
        <ChartCard
          title="Student Engagement Metrics"
          subtitle="Key performance indicators for student participation"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg flex flex-col items-center justify-center text-center">
              <div className="bg-blue-100 p-3 rounded-full mb-3">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="text-sm font-medium text-gray-500">Average Group Size</h4>
              <p className="text-2xl font-semibold text-gray-900 mt-1">3.4</p>
              <p className="text-xs text-green-600 mt-1">+0.2 from last semester</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg flex flex-col items-center justify-center text-center">
              <div className="bg-green-100 p-3 rounded-full mb-3">
                <BarChart3 className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="text-sm font-medium text-gray-500">Applications per Student</h4>
              <p className="text-2xl font-semibold text-gray-900 mt-1">2.7</p>
              <p className="text-xs text-green-600 mt-1">+0.5 from last semester</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg flex flex-col items-center justify-center text-center">
              <div className="bg-purple-100 p-3 rounded-full mb-3">
                <BookOpen className="h-6 w-6 text-purple-600" />
              </div>
              <h4 className="text-sm font-medium text-gray-500">Project Completion Rate</h4>
              <p className="text-2xl font-semibold text-gray-900 mt-1">83%</p>
              <p className="text-xs text-green-600 mt-1">+5% from last semester</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg flex flex-col items-center justify-center text-center">
              <div className="bg-amber-100 p-3 rounded-full mb-3">
                <User className="h-6 w-6 text-amber-600" />
              </div>
              <h4 className="text-sm font-medium text-gray-500">Student Satisfaction</h4>
              <p className="text-2xl font-semibold text-gray-900 mt-1">4.2/5</p>
              <p className="text-xs text-green-600 mt-1">+0.3 from last semester</p>
            </div>
          </div>
        </ChartCard>
      </div>

      {/* Recent Activity Timeline */}
      <div className="mb-6">
        <ChartCard
          title="Recent Activity"
          subtitle="Latest system events and activities"
        >
          <div className="relative">
            {/* Activity Timeline */}
            <div className="relative pl-8 border-l border-gray-200 space-y-6 py-2">
              {/* Activity Item 1 */}
              <div className="relative">
                <div className="absolute -left-10 mt-1 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center">
                  <div className="h-3 w-3 rounded-full bg-blue-600"></div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">New Project Created</p>
                  <p className="text-sm text-gray-600">Dr. Sarah Johnson created a new Capstone project "Blockchain for Supply Chain"</p>
                  <p className="text-xs text-gray-500 mt-1">Today, 10:45 AM</p>
                </div>
              </div>

              {/* Activity Item 2 */}
              <div className="relative">
                <div className="absolute -left-10 mt-1 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
                  <div className="h-3 w-3 rounded-full bg-green-600"></div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Group Application Approved</p>
                  <p className="text-sm text-gray-600">Group "TechInnovators" was approved for project "Machine Learning for Medical Imaging"</p>
                  <p className="text-xs text-gray-500 mt-1">Yesterday, 3:20 PM</p>
                </div>
              </div>

              {/* Activity Item 3 */}
              <div className="relative">
                <div className="absolute -left-10 mt-1 h-6 w-6 rounded-full bg-amber-100 flex items-center justify-center">
                  <div className="h-3 w-3 rounded-full bg-amber-600"></div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">New Faculty Member</p>
                  <p className="text-sm text-gray-600">Dr. Robert Taylor joined as faculty in Computer Science department</p>
                  <p className="text-xs text-gray-500 mt-1">Nov 28, 2025, 9:15 AM</p>
                </div>
              </div>

              {/* Activity Item 4 */}
              <div className="relative">
                <div className="absolute -left-10 mt-1 h-6 w-6 rounded-full bg-purple-100 flex items-center justify-center">
                  <div className="h-3 w-3 rounded-full bg-purple-600"></div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Project Deadline Updated</p>
                  <p className="text-sm text-gray-600">Deadline for "IoT Home Automation" project was extended by 2 weeks</p>
                  <p className="text-xs text-gray-500 mt-1">Nov 26, 2025, 2:45 PM</p>
                </div>
              </div>

              {/* Activity Item 5 */}
              <div className="relative">
                <div className="absolute -left-10 mt-1 h-6 w-6 rounded-full bg-red-100 flex items-center justify-center">
                  <div className="h-3 w-3 rounded-full bg-red-600"></div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Group Formed</p>
                  <p className="text-sm text-gray-600">New group "DataWizards" was created with 4 members for AIML projects</p>
                  <p className="text-xs text-gray-500 mt-1">Nov 25, 2025, 11:30 AM</p>
                </div>
              </div>
            </div>
          </div>
        </ChartCard>
      </div>

      {/* System Health & Status */}
      <div>
        <ChartCard
          title="System Health & Status"
          subtitle="Platform performance and usage statistics"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Usage Statistics */}
            <div className="col-span-1">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Usage Statistics</h4>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-gray-500">Active Users Today</span>
                    <span className="text-xs font-medium text-gray-700">76%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '76%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-gray-500">Server Load</span>
                    <span className="text-xs font-medium text-gray-700">42%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '42%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-gray-500">Database Usage</span>
                    <span className="text-xs font-medium text-gray-700">63%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-amber-600 h-2 rounded-full" style={{ width: '63%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-gray-500">Storage Capacity</span>
                    <span className="text-xs font-medium text-gray-700">28%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: '28%' }}></div>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-3 bg-blue-50 rounded-md border border-blue-100">
                <p className="text-xs text-blue-800">
                  System performance is optimal. Last maintenance: Nov 22, 2025
                </p>
              </div>
            </div>

            {/* Device Statistics */}
            <div className="col-span-1">
              <h4 className="text-sm font-medium text-gray-700 mb-3">User Device Statistics</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Desktop</span>
                  <div className="flex items-center">
                    <div className="w-32 h-2 bg-gray-200 rounded-full mr-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '58%' }}></div>
                    </div>
                    <span className="text-xs font-medium text-gray-700">58%</span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Mobile</span>
                  <div className="flex items-center">
                    <div className="w-32 h-2 bg-gray-200 rounded-full mr-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '32%' }}></div>
                    </div>
                    <span className="text-xs font-medium text-gray-700">32%</span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Tablet</span>
                  <div className="flex items-center">
                    <div className="w-32 h-2 bg-gray-200 rounded-full mr-2">
                      <div className="bg-amber-500 h-2 rounded-full" style={{ width: '10%' }}></div>
                    </div>
                    <span className="text-xs font-medium text-gray-700">10%</span>
                  </div>
                </div>
              </div>

              <h4 className="text-sm font-medium text-gray-700 mt-6 mb-3">Browser Distribution</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Chrome</span>
                  <div className="flex items-center">
                    <div className="w-32 h-2 bg-gray-200 rounded-full mr-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '64%' }}></div>
                    </div>
                    <span className="text-xs font-medium text-gray-700">64%</span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Firefox</span>
                  <div className="flex items-center">
                    <div className="w-32 h-2 bg-gray-200 rounded-full mr-2">
                      <div className="bg-orange-500 h-2 rounded-full" style={{ width: '18%' }}></div>
                    </div>
                    <span className="text-xs font-medium text-gray-700">18%</span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Safari</span>
                  <div className="flex items-center">
                    <div className="w-32 h-2 bg-gray-200 rounded-full mr-2">
                      <div className="bg-purple-500 h-2 rounded-full" style={{ width: '12%' }}></div>
                    </div>
                    <span className="text-xs font-medium text-gray-700">12%</span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Others</span>
                  <div className="flex items-center">
                    <div className="w-32 h-2 bg-gray-200 rounded-full mr-2">
                      <div className="bg-gray-500 h-2 rounded-full" style={{ width: '6%' }}></div>
                    </div>
                    <span className="text-xs font-medium text-gray-700">6%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Peak Usage Times */}
            <div className="col-span-1">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Peak Usage Times</h4>
              <div className="space-y-2">
                <div className="grid grid-cols-24 gap-1">
                  {Array.from({ length: 24 }).map((_, i) => {
                    // Generate fake usage data
                    const height = (() => {
                      if (i >= 9 && i <= 16) return `h-${Math.floor(Math.random() * 3) + 4}`;
                      if (i >= 19 && i <= 22) return `h-${Math.floor(Math.random() * 3) + 3}`;
                      return `h-${Math.floor(Math.random() * 2) + 1}`;
                    })();

                    return (
                      <div key={i} className="flex flex-col items-center">
                        <div className={`w-full bg-blue-500 rounded-t-sm ${height}`}></div>
                        {(i % 4 === 0) && <span className="text-xs text-gray-500 mt-1">{i}</span>}
                      </div>
                    );
                  })}
                </div>
                <p className="text-xs text-center text-gray-500">Hour of Day (24-hour format)</p>
              </div>

              <h4 className="text-sm font-medium text-gray-700 mt-6 mb-3">Weekly Activity</h4>
              <div className="grid grid-cols-7 gap-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => {
                  // Generate fake usage height
                  const getHeight = () => {
                    if (i === 0 || i === 6) return 'h-6'; // Weekend
                    if (i === 2 || i === 3) return 'h-16'; // Mid-week peak
                    return 'h-12';
                  };

                  return (
                    <div key={day} className="flex flex-col items-center">
                      <div className="flex-grow flex items-end">
                        <div className={`w-full bg-green-500 rounded-t-sm ${getHeight()}`}></div>
                      </div>
                      <span className="text-xs text-gray-500 mt-1">{day}</span>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 p-3 bg-green-50 rounded-md border border-green-100">
                <p className="text-xs text-green-800">
                  Highest activity on Tuesdays and Wednesdays, 10 AM - 2 PM
                </p>
              </div>
            </div>
          </div>
        </ChartCard>
      </div>
    </div>
  );
};

export default Analytics;