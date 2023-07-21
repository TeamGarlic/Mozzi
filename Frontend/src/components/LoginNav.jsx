import PropTypes from "prop-types";

function LoginNav({ link }) {
  function goHome() {
    location.href = "/";
  }
  function goLink() {
    location.href = `/${link}`;
  }
  return (
    <div className="fixed w-screen top-0 p-4 px-8 h-fit">
      <button className="float-left text-3xl" onClick={goHome}>
        🎞️
      </button>
      <button className="float-right" onClick={goLink}>
        {link}
      </button>
    </div>
  );
}

export default LoginNav;

LoginNav.propTypes = {
  link: PropTypes.string.isRequired,
};
