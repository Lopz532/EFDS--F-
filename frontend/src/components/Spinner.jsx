import React from "react";

export default function Spinner({ size = "md", className = "" }) {
    const sizes = {
        sm: "h-4 w-4 border-2",
        md: "h-8 w-8 border-3",
        lg: "h-12 w-12 border-4",
    };

    return (
        <div className={`inline-block ${sizes[size]} ${className}`}>
            <div className="animate-spin rounded-full border-solid border-indigo-600 border-t-transparent">
            </div>
        </div>
    );
}

export function LoadingSpinner({ message = "Cargando..." }) {
    return (
        <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-solid border-indigo-600 border-t-transparent"></div>
            <p className="mt-4 text-gray-600">{message}</p>
        </div>
    );
}
