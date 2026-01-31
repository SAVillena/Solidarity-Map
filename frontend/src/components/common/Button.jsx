import React from 'react';
import PropTypes from 'prop-types';

/**
 * Button component with multiple variants and sizes
 * 
 * @param {Object} props
 * @param {'primary'|'secondary'|'danger'|'ghost'|'outline'} variant - Button style variant
 * @param {'sm'|'md'|'lg'} size - Button size
 * @param {boolean} loading - Show loading state
 * @param {boolean} disabled - Disable button
 * @param {React.ReactNode} icon - Icon component
 * @param {'left'|'right'} iconPosition - Icon position relative to children
 * @param {React.ReactNode} children - Button content
 * @param {string} className - Additional CSS classes
 * @param {function} onClick - Click handler
 */
const Button = ({
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    icon,
    iconPosition = 'left',
    children,
    className = '',
    onClick,
    ...props
}) => {
    const baseStyles = `
        inline-flex items-center justify-center gap-2 font-medium rounded-lg
        transition-all duration-150 focus:outline-none focus-visible:ring-2 
        focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed
    `;

    const variants = {
        primary: `
            bg-primary-600 text-white hover:bg-primary-700 
            focus-visible:ring-primary-500 shadow-sm hover:shadow-md
        `,
        secondary: `
            bg-secondary-600 text-white hover:bg-secondary-700 
            focus-visible:ring-secondary-500 shadow-sm hover:shadow-md
        `,
        danger: `
            bg-red-600 text-white hover:bg-red-700 
            focus-visible:ring-red-500 shadow-sm hover:shadow-md
        `,
        ghost: `
            bg-transparent text-gray-700 hover:bg-gray-100 
            focus-visible:ring-gray-400
        `,
        outline: `
            bg-transparent border-2 border-primary-600 text-primary-600 
            hover:bg-primary-50 focus-visible:ring-primary-500
        `
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg'
    };

    const isDisabled = disabled || loading;

    return (
        <button
            onClick={onClick}
            disabled={isDisabled}
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        >
            {loading && (
                <div className="spinner spinner-sm" />
            )}
            {!loading && icon && iconPosition === 'left' && icon}
            {children}
            {!loading && icon && iconPosition === 'right' && icon}
        </button>
    );
};

Button.propTypes = {
    variant: PropTypes.oneOf(['primary', 'secondary', 'danger', 'ghost', 'outline']),
    size: PropTypes.oneOf(['sm', 'md', 'lg']),
    loading: PropTypes.bool,
    disabled: PropTypes.bool,
    icon: PropTypes.node,
    iconPosition: PropTypes.oneOf(['left', 'right']),
    children: PropTypes.node,
    className: PropTypes.string,
    onClick: PropTypes.func
};

export default Button;
