import React from 'react';
import PropTypes from 'prop-types';

/**
 * PageHeader component for consistent page titles and actions
 * 
 * @param {Object} props
 * @param {string} title - Page title
 * @param {string} description - Page description/subtitle
 * @param {React.ReactNode} actions - Action buttons or elements
 * @param {Array<{label: string, href: string}>} breadcrumbs - Breadcrumb navigation
 * @param {string} className - Additional CSS classes
 */
const PageHeader = ({
    title,
    description,
    actions,
    breadcrumbs,
    className = ''
}) => {
    return (
        <div className={`mb-6 ${className}`}>
            {breadcrumbs && breadcrumbs.length > 0 && (
                <nav className="flex mb-3" aria-label="Breadcrumb">
                    <ol className="inline-flex items-center space-x-1 md:space-x-3">
                        {breadcrumbs.map((crumb, index) => (
                            <li key={index} className="inline-flex items-center">
                                {index > 0 && (
                                    <span className="mx-2 text-gray-400">/</span>
                                )}
                                <a
                                    href={crumb.href}
                                    className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-primary-600"
                                >
                                    {crumb.label}
                                </a>
                            </li>
                        ))}
                    </ol>
                </nav>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        {title}
                    </h1>
                    {description && (
                        <p className="mt-2 text-base text-gray-600">
                            {description}
                        </p>
                    )}
                </div>

                {actions && (
                    <div className="flex items-center gap-3">
                        {actions}
                    </div>
                )}
            </div>
        </div>
    );
};

PageHeader.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    actions: PropTypes.node,
    breadcrumbs: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string.isRequired,
            href: PropTypes.string.isRequired
        })
    ),
    className: PropTypes.string
};

export default PageHeader;
