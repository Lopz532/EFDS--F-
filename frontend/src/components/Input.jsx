import React from "react";

export default function Input({
    label,
    type = "text",
    placeholder,
    value,
    onChange,
    error,
    disabled = false,
    required = false,
    className = "",
    ...props
}) {
    return (
        <div className={`mb-4 ${className}`}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
                required={required}
                className={`w-full px-4 py-2 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed ${error
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                {...props}
            />
            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        </div>
    );
}
