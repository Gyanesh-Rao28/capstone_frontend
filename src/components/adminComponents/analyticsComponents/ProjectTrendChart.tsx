import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ProjectTrendChart = () => {
    // Fake data for monthly project creations
    const data = [
        { month: 'Jan', projects: 10 },
        { month: 'Feb', projects: 15 },
        { month: 'Mar', projects: 13 },
        { month: 'Apr', projects: 20 },
        { month: 'May', projects: 25 },
        { month: 'Jun', projects: 18 },
        { month: 'Jul', projects: 30 },
        { month: 'Aug', projects: 28 },
        { month: 'Sep', projects: 35 },
        { month: 'Oct', projects: 32 },
        { month: 'Nov', projects: 40 },
        { month: 'Dec', projects: 45 },
    ];

    return (
        <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                    type="monotone"
                    dataKey="projects"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                />
            </LineChart>
        </ResponsiveContainer>
    );
};

export default ProjectTrendChart;