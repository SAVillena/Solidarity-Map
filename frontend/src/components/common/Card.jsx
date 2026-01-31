import React from 'react';
import PropTypes from 'prop-types';

/**
 * Card component for consistent container styling
 * 
 * @param {Object} props
 * @param {'default'|'elevated'|'outlined'} variant - Card style variant
 * @param {boolean} hover - Enable hover effect
 * @param {boolean} clickable - Make card clickable (cursor pointer)
 * @param {React.ReactNode} children - Card content
 * @param {string} className - Additional CSS classes
 * @param {function} onClick - Click handler
 */
const Card = ({
    variant = 'default',
    hover = false,
    clickable = false,
    children,
    className = '',
    onClick,
    ...props
}) => {
    const baseStyles = `
        bg-white rounded-lg transition-all duration-150
    `;

    const variants = {
        default: 'shadow-sm',
        elevated: 'shadow-md',
        outlined: 'border-2 border-gray-200'
    };

    const hoverStyles = hover || clickable ? 'hover:shadow-lg hover:-translate-y-0.5' : '';
    const clickableStyles = clickable ? 'cursor-pointer' : '';

    return (
        <div
            onClick={onClick}
            className={`${baseStyles} ${variants[variant]} ${hoverStyles} ${clickableStyles} ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};

Card.propTypes = {
    variant: PropTypes.oneOf(['default', 'elevated', 'outlined']),
    hover: PropTypes.bool,
    clickable: PropTypes.bool,
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    onClick: PropTypes.func
};

/**
 * CardHeader sub-component
 */
export const CardHeader = ({ children, className = '' }) => (
    <div className={`px-6 py-4 border-b border-gray-200 ${className}`}>
        {children}
    </div>
);

CardHeader.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string
};

/**
 * CardBody sub-component
 */
export const CardBody = ({ children, className = '' }) => (
    <div className={`px-6 py-4 ${className}`}>
        {children}
    </div>
);

CardBody.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string
};

/**
 * CardFooter sub-component
 */
export const CardFooter = ({ children, className = '' }) => (
    <div className={`px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg ${className}`}>
        {children}
    </div>
);

CardFooter.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string
};

export default Card;
