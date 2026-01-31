import React from 'react';
import PropTypes from 'prop-types';

/**
 * Badge component for labels, status indicators, and tags
 * 
 * @param {Object} props
 * @param {'primary'|'secondary'|'success'|'warning'|'danger'|'info'|'gray'} variant - Badge color variant
 * @param {'sm'|'md'|'lg'} size - Badge size
 * @param {boolean} dot - Show dot indicator
 * @param {React.ReactNode} children - Badge content
 * @param {string} className - Additional CSS classes
 */
const Badge = ({
    variant = 'primary',
    size = 'md',
    dot = false,
    children,
    className = '',
    ...props
}) => {
    const baseStyles = `
        inline-flex items-center gap-1.5 font-medium rounded-full
        transition-colors duration-150
    `;

    const variants = {
        primary: 'bg-primary-100 text-primary-800',
        secondary: 'bg-secondary-100 text-secondary-800',
        success: 'bg-green-100 text-green-800',
        warning: 'bg-amber-100 text-amber-800',
        danger: 'bg-red-100 text-red-800',
        info: 'bg-blue-100 text-blue-800',
        gray: 'bg-gray-100 text-gray-800'
    };

    const sizes = {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-1 text-sm',
        lg: 'px-3 py-1.5 text-base'
    };

    const dotColors = {
        primary: 'bg-primary-600',
        secondary: 'bg-secondary-600',
        success: 'bg-green-600',
        warning: 'bg-amber-600',
        danger: 'bg-red-600',
        info: 'bg-blue-600',
        gray: 'bg-gray-600'
    };

    return (
        <span
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        >
            {dot && (
                <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`} />
            )}
            {children}
        </span>
    );
};

Badge.propTypes = {
    variant: PropTypes.oneOf(['primary', 'secondary', 'success', 'warning', 'danger', 'info', 'gray']),
    size: PropTypes.oneOf(['sm', 'md', 'lg']),
    dot: PropTypes.bool,
    children: PropTypes.node.isRequired,
    className: PropTypes.string
};

export default Badge;
