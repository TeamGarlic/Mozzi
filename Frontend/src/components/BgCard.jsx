import PropTypes from "prop-types";
import {useDispatch} from "react-redux";
import {changeBgAction} from "@/modules/bgAction.js";
import {checkHost} from "@/utils/DecoratorUtil.js";

function BgCard({ bgName, bgSrc, user }) {
  const dispatch = useDispatch();

  function setBg(event){
    const newBg = new Image();
    newBg.src = event.target.src;
    dispatch(changeBgAction({img: newBg}));
  }
  setBg = checkHost(setBg, user.isHost)


  return (
    <div className="shadow border select-none cursor-pointer bg-white dark:bg-gray-800 rounded-md flex flex-1 items-center p-4 my-2 w-full h-[9/16]">
      <img onClick={setBg} src={bgSrc} alt={bgName}></img>
      {bgName}
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
  })
};

