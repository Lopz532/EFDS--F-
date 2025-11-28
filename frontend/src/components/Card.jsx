const Card = ({ children }) => {
    return <div style={{ padding: "1rem", border: "1px solid #ddd", borderRadius: "6px" }}>
        {children || "Contenido de la tarjeta"}
    </div>;
};

export default Card;
