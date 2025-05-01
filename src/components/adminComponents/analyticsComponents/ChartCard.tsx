import { ReactNode } from 'react';

interface ChartCardProps {
    title: string;
    subtitle?: string;
    children: ReactNode;
    className?: string;
}

const ChartCard = ({ title, subtitle, children, className = '' }: ChartCardProps) => {
    return (
        <div className={`bg-white rounded-lg shadow-sm p-4 ${className}`}>
            <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
                {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
            </div>
            <div>
                {children}
            </div>
        </div>
    );
};

export default ChartCard;