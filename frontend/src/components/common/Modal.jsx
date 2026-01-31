import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { X } from 'lucide-react';

/**
 * Enhanced Modal component with animations, accessibility features, and standardized styling
 * 
 * @param {Object} props
 * @param {boolean} isOpen - Control modal visibility
 * @param {function} onClose - Handler to close modal
 * @param {string} title - Modal title
 * @param {React.ReactNode} children - Modal content
 * @param {React.ReactNode} footer - Optional footer content
 * @param {'sm'|'md'|'lg'|'xl'|'full'} size - Modal size width
 */
const Modal = ({
    isOpen,
    onClose,
    title,
    children,
    footer,
    size = 'md'
}) => {
    const modalRef = useRef(null);

    // Handle ESC key to close
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEsc);
            // Lock body scroll
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEsc);
            // Unlock body scroll
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const sizes = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        full: 'max-w-4xl'
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop with blur effect */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Modal Content */}
            <div
                ref={modalRef}
                className={`
                    relative w-full ${sizes[size]} 
                    bg-white rounded-xl shadow-2xl 
                    flex flex-col max-h-[90vh]
                    animate-scale-in transform transition-all
                `}
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h2
                        id="modal-title"
                        className="text-xl font-semibold text-gray-900"
                    >
                        {title}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        aria-label="Cerrar modal"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="px-6 py-6 overflow-y-auto custom-scrollbar">
                    {children}
                </div>

                {/* Footer (Optional) */}
                {footer && (
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 rounded-b-xl flex justify-end gap-3">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
};

Modal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    footer: PropTypes.node,
    size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl', 'full'])
};

export default Modal;
