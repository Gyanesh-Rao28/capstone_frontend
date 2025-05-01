import { ReactNode } from 'react';

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: ReactNode;
    iconBgColor: string;
    iconColor: string;
    change?: {
        value: number;
        isPositive: boolean;
    };
}

const StatsCard = ({ title, value, icon, iconBgColor, iconColor, change }: StatsCardProps) => {
    return (
        <div className="bg-white rounded-lg shadow-sm p-4 flex flex-col">
            <div className="flex items-center mb-4">
                <div className={`p-3 rounded-lg ${iconBgColor}`}>
                    <div className={iconColor}>{icon}</div>
                </div>
                <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-500">{title}</h3>
                    <p className="text-xl font-semibold text-gray-900">{value}</p>
                </div>
            </div>
            {change && (
                <div className="mt-auto">
                    <div className={`flex items-center text-sm ${change.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                        <span className="font-medium">
                            {change.isPositive ? '+' : ''}{change.value}%
                        </span>
                        <span className="ml-1 text-gray-500">vs. last month</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StatsCard;