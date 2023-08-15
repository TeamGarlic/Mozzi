import PropTypes from "prop-types";
import {checkHost} from "@/utils/DecoratorUtil.js";

function BgCard({ bgName, bgSrc, user, changeBg, setAlertModal }) {
  function setBg(event){
    changeBg(event.target.src)
  }
  setBg = checkHost(setBg, user.isHost, setAlertModal)

  return (
    <div className="flex-col shadow border select-none cursor-pointer bg-white dark:bg-gray-800 rounded-md flex flex-1 items-center p-2 my-2 w-full h-[9/16]">
      <img onClick={setBg} src={`https://api.mozzi.lol/files/object/${bgSrc}`} alt={bgName} crossOrigin="anonymous"></img>
      <div className="text">{bgName}</div>
    </div>
  );
}

export default BgCard;

BgCard.propTypes = {
  bgName: PropTypes.string.isRequired,
  bgSrc: PropTypes.string,
  user: PropTypes.shape({
    id: PropTypes.number,
    userId: PropTypes.string,
    userNickname: PropTypes.string,
    email: PropTypes.string,
    isHost: PropTypes.number,
  }),
  setAlertModal: PropTypes.func,
};

