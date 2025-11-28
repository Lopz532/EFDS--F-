import React from "react";

export default function Input(props) {
    return (
        <input
            {...props}
            style={{
                width: "100%",
                padding: "8px 10px",
                borderRadius: 6,
                border: "1px solid #ccc",
                boxSizing: "border-box",
                marginTop: 6,
            }}
        />
    );
}
