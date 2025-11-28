import React, { useEffect } from "react";
import Button from "./Button";

export default function Modal({
    isOpen,
    onClose,
    title,
    children,
    footer,
    size = "md",
    ...props
}) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const sizes = {
        sm: "max-w-md",
        md: "max-w-lg",
        lg: "max-w-2xl",
        xl: "max-w-4xl",
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 animate-fadeIn"
            onClick={onClose}
            {...props}
        >
            <div
                className={`bg-white rounded-xl shadow-2xl ${sizes[size]} w-full m-4 max-h-[90vh] overflow-hidden flex flex-col`}
                onClick={(e) => e.stopPropagation()}
            >
                {title && (
                    <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                        <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>
                )}
                <div className="px-6 py-4 overflow-y-auto flex-1">{children}</div>
                {footer && (
                    <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-2">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
}
