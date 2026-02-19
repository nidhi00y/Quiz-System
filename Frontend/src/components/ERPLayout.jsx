import ERPHeader from "./ERPHeader";
import ERPNavbar from "./ERPNavbar";

function ERPLayout({ children, hideNavbarActions = false }) {
  return (
    <>
      <ERPHeader />
      <ERPNavbar hideActions={hideNavbarActions} />

      <div className="container erp-page-container">
        {children}
      </div>
    </>
  );
}

export default ERPLayout;
