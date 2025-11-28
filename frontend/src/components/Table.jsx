import React from "react";

export default function Table({ columns, data, onRowClick, className = "" }) {
    return (
        <div className={`overflow-x-auto rounded-lg border border-gray-200 ${className}`}>
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        {columns.map((column, index) => (
                            <th
                                key={index}
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                {column.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {data && data.length > 0 ? (
                        data.map((row, rowIndex) => (
                            <tr
                                key={rowIndex}
                                onClick={() => onRowClick && onRowClick(row)}
                                className={`${onRowClick ? "cursor-pointer hover:bg-gray-50" : ""
                                    } transition-colors`}
                            >
                                {columns.map((column, colIndex) => (
                                    <td key={colIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {column.render ? column.render(row) : row[column.accessor]}
                                    </td>
                                ))}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td
                                colSpan={columns.length}
                                className="px-6 py-12 text-center text-sm text-gray-500"
                            >
                                No hay datos disponibles
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
