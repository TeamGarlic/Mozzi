import PropTypes from "prop-types";

function UserCard({ userName }) {
  return (
    <div className="w-48 h-28 border-2 rounded-md mb-4 mx-auto">{userName}</div>
  );
}

export default UserCard;

UserCard.defaultProps = {
  userName: "anony",
};

UserCard.propTypes = {
  userName: PropTypes.string,
};
