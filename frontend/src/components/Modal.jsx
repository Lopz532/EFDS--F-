import React from "react";

export default function Modal({ open, title, children, onClose }) {
    if (!open) return null;
    return (
        <div style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999
        }}>
            <div style={{
                width: "min(720px, 95%)",
                background: "#fff",
                borderRadius: 8,
                padding: 20,
                boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
            }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <h3 style={{ margin: 0 }}>{title}</h3>
                    <button onClick={onClose} style={{ border: "none", background: "transparent", cursor: "pointer", fontSize: 18 }}>✕</button>
                </div>
                <div>{children}</div>
            </div>
        </div>
    );
}
