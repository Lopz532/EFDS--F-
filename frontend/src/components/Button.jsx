import React from "react";

export default function Button({
    children,
    variant = "primary",
    size = "md",
    fullWidth = false,
    disabled = false,
    type = "button",
    onClick,
    className = "",
    ...props
}) {
    const baseStyles = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        primary: "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500 shadow-sm hover:shadow-md",
        secondary: "bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500 shadow-sm hover:shadow-md",
        success: "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 shadow-sm hover:shadow-md",
        danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm hover:shadow-md",
        warning: "bg-amber-500 text-white hover:bg-amber-600 focus:ring-amber-500 shadow-sm hover:shadow-md",
        outline: "bg-white text-gray-700 border-2 border-gray-300 hover:bg-gray-50 focus:ring-indigo-500",
        ghost: "bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500",
    };

    const sizes = {
        sm: "px-3 py-1.5 text-sm",
        md: "px-4 py-2 text-base",
        lg: "px-6 py-3 text-lg",
    };

    const widthClass = fullWidth ? "w-full" : "";

    return (
        <button
            type={type}
            disabled={disabled}
            onClick={onClick}
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}
