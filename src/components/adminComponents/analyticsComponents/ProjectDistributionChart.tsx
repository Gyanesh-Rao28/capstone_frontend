import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface ProjectData {
    name: string;
    value: number;
    color: string;
}

const ProjectDistributionChart = () => {
    // Fake data for project distribution by domain
    const data: ProjectData[] = [
        { name: 'AIML', value: 42, color: '#8B5CF6' },
        { name: 'Cloud', value: 28, color: '#3B82F6' },
        { name: 'Cyber', value: 19, color: '#10B981' },
        { name: 'IOT', value: 11, color: '#F59E0B' },
    ];

    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
        const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

        return (
            <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central">
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    return (
        <ResponsiveContainer width="100%" height={300}>
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} projects`, 'Count']} />
                <Legend layout="horizontal" verticalAlign="bottom" align="center" />
            </PieChart>
        </ResponsiveContainer>
    );
};

export default ProjectDistributionChart;