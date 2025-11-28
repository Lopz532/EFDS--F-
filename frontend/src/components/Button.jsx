import React from "react";

export default function Button({ children, type = "button", disabled, style, onClick }) {
    return (
        <button
            type={type}
            disabled={disabled}
            onClick={onClick}
            style={{
                padding: "8px 14px",
                borderRadius: 6,
                border: "none",
                cursor: disabled ? "not-allowed" : "pointer",
                background: "#2563eb",
                color: "#fff",
                ...style,
            }}
        >
            {children}
        </button>
    );
}
