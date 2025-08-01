import type { ReactNode } from 'react';

interface CardProps {
    children: ReactNode;
    className?: string;
    title?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '', title }) => {
    return (
        <div className={`bg-white shadow-md rounded-lg overflow-hidden ${className}`}>
            {title && (
                <h3 className="p-4 text-lg font-semibold text-gray-700 border-b">
                    {title}
                </h3>
            )}
            <div className="p-4">
                {children}
            </div>
        </div>
    );
};