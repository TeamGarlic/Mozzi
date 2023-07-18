import PropTypes from "prop-types";

function Layout({ children }) {
  return <div className="w-full h-screen box-border">{children}</div>;
}

export default Layout;

Layout.propTypes = {
  children: PropTypes.element.isRequired,
};
