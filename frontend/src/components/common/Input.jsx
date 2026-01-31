import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

/**
 * Input component with label, icons, and error states
 * 
 * @param {Object} props
 * @param {string} label - Input label text
 * @param {string} error - Error message to display
 * @param {string} helperText - Helper text below input
 * @param {React.ReactNode} leftIcon - Icon on the left side
 * @param {React.ReactNode} rightIcon - Icon on the right side
 * @param {string} className - Additional CSS classes
 */
const Input = forwardRef(({
    label,
    error,
    helperText,
    leftIcon,
    rightIcon,
    className = '',
    ...props
}, ref) => {
    const hasError = !!error;

    const inputStyles = `
        w-full px-4 py-2 border rounded-lg
        transition-all duration-150
        focus:outline-none focus:ring-2 focus:ring-offset-1
        disabled:bg-gray-100 disabled:cursor-not-allowed
        ${leftIcon ? 'pl-10' : ''}
        ${rightIcon ? 'pr-10' : ''}
        ${hasError
            ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
            : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
        }
    `;

    return (
        <div className={`w-full ${className}`}>
            {label && (
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    {label}
                    {props.required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}

            <div className="relative">
                {leftIcon && (
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        {leftIcon}
                    </div>
                )}

                <input
                    ref={ref}
                    className={inputStyles}
                    {...props}
                />

                {rightIcon && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        {rightIcon}
                    </div>
                )}
            </div>

            {error && (
                <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                    <span>⚠️</span>
                    {error}
                </p>
            )}

            {helperText && !error && (
                <p className="mt-1.5 text-sm text-gray-500">
                    {helperText}
                </p>
            )}
        </div>
    );
});

Input.displayName = 'Input';

Input.propTypes = {
    label: PropTypes.string,
    error: PropTypes.string,
    helperText: PropTypes.string,
    leftIcon: PropTypes.node,
    rightIcon: PropTypes.node,
    className: PropTypes.string,
    required: PropTypes.bool
};

export default Input;
