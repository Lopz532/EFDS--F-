import React from "react";

export default function Badge({
    children,
    variant = "default",
    size = "md",
    className = "",
    ...props
}) {
    const baseStyles = "inline-flex items-center justify-center font-medium rounded-full";

    const variants = {
        default: "bg-gray-100 text-gray-800",
        primary: "bg-indigo-100 text-indigo-800",
        success: "bg-green-100 text-green-800",
        danger: "bg-red-100 text-red-800",
        warning: "bg-amber-100 text-amber-800",
        info: "bg-cyan-100 text-cyan-800",
        student: "bg-blue-100 text-blue-800",
        teacher: "bg-purple-100 text-purple-800",
    };

    const sizes = {
        sm: "px-2 py-0.5 text-xs",
        md: "px-2.5 py-1 text-sm",
        lg: "px-3 py-1.5 text-base",
    };

    return (
        <span
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        >
            {children}
        </span>
    );
}
