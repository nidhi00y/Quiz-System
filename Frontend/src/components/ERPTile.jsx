function ERPTile({ icon, title, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        cursor: "pointer",
        height: "140px",
        backgroundColor: "#f5f5f5",
        border: "1px solid #ccc",
        borderRadius: "10px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "10px",
        textAlign: "center"
      }}
    >
      <div style={{ fontSize: "28px", marginBottom: "8px" }}>
        {icon}
      </div>

      <div
        style={{
          fontSize: "14px",
          fontWeight: "600",
          lineHeight: "1.2",
          wordWrap: "break-word",
          maxWidth: "100%"
        }}
      >
        {title}
      </div>
    </div>
  );
}

export default ERPTile;
