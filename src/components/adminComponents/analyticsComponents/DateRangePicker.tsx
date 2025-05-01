import { useState } from 'react';
import { Calendar } from 'lucide-react';

interface DateRange {
    label: string;
    value: string;
}

interface DateRangePickerProps {
    onChange: (range: string) => void;
}

const DateRangePicker = ({ onChange }: DateRangePickerProps) => {
    const [selectedRange, setSelectedRange] = useState('last30days');

    const dateRanges: DateRange[] = [
        { label: 'Last 7 days', value: 'last7days' },
        { label: 'Last 30 days', value: 'last30days' },
        { label: 'This month', value: 'thisMonth' },
        { label: 'Last quarter', value: 'lastQuarter' },
        { label: 'Year to date', value: 'yearToDate' },
    ];

    const handleChange = (range: string) => {
        setSelectedRange(range);
        onChange(range);
    };

    return (
        <div className="flex items-center">
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <select
                    value={selectedRange}
                    onChange={(e) => handleChange(e.target.value)}
                    className="pl-10 pr-10 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm appearance-none"
                >
                    {dateRanges.map((range) => (
                        <option key={range.value} value={range.value}>
                            {range.label}
                        </option>
                    ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                        />
                    </svg>
                </div>
            </div>
        </div>
    );
};

export default DateRangePicker;