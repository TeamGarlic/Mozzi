import PropTypes from "prop-types";

function Layout({ children }) {
  return (
    <div className="max-w-screen min-h-screen box-border bg-backimg bg-cover bg-center bg-no-repeat overflow-auto">
      {children}
    </div>
  );
}

export default Layout;

Layout.propTypes = {
  children: PropTypes.element.isRequired,
};
