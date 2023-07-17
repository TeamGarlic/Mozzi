import PropTypes from "prop-types";

function BgCard({ bgName }) {
  return (
    <div className="shadow border select-none cursor-pointer bg-white dark:bg-gray-800 rounded-md flex flex-1 items-center p-4 my-2 w-full h-[9/16]">
      {bgName}
    </div>
  );
}

export default BgCard;

BgCard.propTypes = {
  bgName: PropTypes.string.isRequired,
};
