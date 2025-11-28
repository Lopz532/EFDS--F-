import React from "react";

export default function Card({
    children,
    title,
    subtitle,
    actions,
    className = "",
    hoverable = false,
    ...props
}) {
    const hoverClass = hoverable ? "hover:shadow-lg hover:-translate-y-1 cursor-pointer" : "";

    return (
        <div
            className={`bg-white rounded-xl shadow-md transition-all duration-300 ${hoverClass} ${className}`}
            {...props}
        >
            {(title || actions) && (
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                    <div>
                        {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
                        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
                    </div>
                    {actions && <div className="flex items-center gap-2">{actions}</div>}
                </div>
            )}
            <div className="px-6 py-4">{children}</div>
        </div>
    );
}
