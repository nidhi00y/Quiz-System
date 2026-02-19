import "../styles/erp.css";

function ERPHeader() {
  return (
    <div className="erp-header">
      {/* Top yellow strip */}
      <div className="erp-header-top-line"></div>

      {/* Header content aligned with navbar container */}
      <div className="erp-header-inner">
        <div className="container">
          <img
            src="https://v1.nitj.ac.in/erp/Images/logo.png"
            alt="Dr B R Ambedkar National Institute of Technology Jalandhar"
            className="erp-header-image"
          />
        </div>
      </div>
    </div>
  );
}

export default ERPHeader;
