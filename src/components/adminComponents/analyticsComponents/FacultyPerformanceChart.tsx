import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const FacultyPerformanceChart = () => {
    // Fake data for faculty performance
    const data = [
        { name: 'Dr. Sambit Kumar Mishra', projects: 8, applications: 24 },
        { name: 'Dr. Anuj Deshpande', projects: 5, applications: 30 },
        { name: 'Dr. Ajay Bhardwaj', projects: 7, applications: 18 },
        { name: 'Dr Amit Kumar Mandal', projects: 4, applications: 22 },
        { name: 'Dr. Prasanthi Boyapati', projects: 6, applications: 15 },
    ];

    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart
                data={data}
                layout="vertical"
                margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
            >
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" width={100} />
                <Tooltip />
                <Legend />
                <Bar dataKey="projects" name="Projects" fill="#3B82F6" radius={[0, 4, 4, 0]} />
                <Bar dataKey="applications" name="Applications" fill="#10B981" radius={[0, 4, 4, 0]} />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default FacultyPerformanceChart;