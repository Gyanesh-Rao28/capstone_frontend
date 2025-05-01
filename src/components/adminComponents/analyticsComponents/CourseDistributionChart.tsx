import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

const CourseDistributionChart = () => {
    // Fake data for project distribution by course type
    const data = [
        { course: 'IDP', count: 45, fill: '#3B82F6' },
        { course: 'UROP', count: 30, fill: '#10B981' },
        { course: 'Capstone', count: 25, fill: '#F59E0B' },
    ];

    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis dataKey="course" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value} projects`, 'Count']} />
                <Legend />
                <Bar dataKey="count" name="Projects" radius={[4, 4, 0, 0]}>
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
};

export default CourseDistributionChart;