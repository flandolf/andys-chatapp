function Spinner() {
  return <div className="spinner" style={{
    width: "50px",
    height: "50px",
    border: "3px solid #f3f3f3",
    borderTop: "3px solid #3498db",
    borderRadius: "50%",
    animation: "spin 2s linear infinite",
  }} />;
}

export default Spinner;