import "../styles/erp.css";

function ERPNavbar({ hideActions = false }) {
  return (
    <nav className="erp-navbar">
      <div className="container erp-navbar-container">
        {/* LEFT */}
        <div className="erp-navbar-left">
          <span className="erp-navbar-brand">| QUIZ PORTAL - NITJ |</span>
          <a href="/" className="erp-navbar-link">
            Home
          </a>
        </div>

        {/* RIGHT */}
        {!hideActions && (
          <div className="erp-navbar-right">
            <span>
              <span className="erp-navbar-highlight">Welcome</span>
            </span>
            <a href="/" className="erp-navbar-link">
              Logout
            </a>
          </div>
        )}
      </div>
    </nav>
  );
}

export default ERPNavbar;
