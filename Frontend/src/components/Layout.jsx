import PropTypes from "prop-types";

function Layout({ children }) {
  return (
    <div className="bg-blue-50 min-w-screen min-h-screen overflow-auto">
      {children}
    </div>
  );
}

export default Layout;

Layout.propTypes = {
  children: PropTypes.element.isRequired,
};
