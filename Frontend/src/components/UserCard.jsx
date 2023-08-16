import PropTypes from "prop-types";

function UserCard({ userName, onMic, isHost, isPublisher, toggleMic, setPosition, sendPosition, position }) {
  function setMic(){
    if (isPublisher){
      const _position = position;
      toggleMic();
      setPosition(_position);
      sendPosition(_position);
    }
  }
  return (
    <div className="w-full border-2 rounded-md px-1 py-2 mx-auto grid grid-cols-6">
      <div className="col-span-1">
        {
          isHost > 0 &&
          <svg className="w-6 h-6" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
               viewBox="0 0 128 128" enableBackground="new 0 0 128 128" xmlSpace="preserve">
            <path fill="#FFA000" d="M112,36c-6.629,0-12,5.375-12,12c0,1.68,0.352,3.273,0.973,4.727L84,60L69.801,34.445
                C73.48,32.391,76,28.508,76,24c0-6.625-5.371-12-12-12s-12,5.375-12,12c0,4.508,2.52,8.391,6.199,10.445L44,60l-16.973-7.273
                C27.648,51.273,28,49.68,28,48c0-6.625-5.371-12-12-12S4,41.375,4,48s5.371,12,12,12c0.93,0,1.822-0.133,2.695-0.328L28,100v8
                c0,4.422,3.582,8,8,8h56c4.418,0,8-3.578,8-8v-8l9.309-40.328C110.176,59.875,111.07,60,112,60c6.629,0,12-5.375,12-12
                S118.629,36,112,36z M64,20c2.207,0,4,1.797,4,4s-1.793,4-4,4s-4-1.797-4-4S61.793,20,64,20z M12,48c0-2.203,1.793-4,4-4
                s4,1.797,4,4s-1.793,4-4,4S12,50.203,12,48z M92,108H36v-8h56V108z M93.633,92H34.367L27.34,61.563l13.508,5.789
                C41.871,67.789,42.941,68,43.996,68c2.828,0,5.547-1.5,6.996-4.117L64,40.477l13.008,23.406C78.457,66.5,81.176,68,84.004,68
                c1.055,0,2.125-0.211,3.148-0.648l13.508-5.789L93.633,92z M112,52c-2.207,0-4-1.797-4-4s1.793-4,4-4s4,1.797,4,4S114.207,52,112,52
                z"/>
          </svg>
        }
      </div>
      <div className="col-span-5 grid grid-cols-6">
        <div className="col-span-5">
          {userName}
        </div>
        <div className="col-span-1">
          {
            onMic ? (
              <svg onClick={setMic} className="w-6 h-6" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                <path d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5z"/>
                <path d="M10 8a2 2 0 1 1-4 0V3a2 2 0 1 1 4 0v5zM8 0a3 3 0 0 0-3 3v5a3 3 0 0 0 6 0V3a3 3 0 0 0-3-3z"/>
              </svg>
            ):(
              <svg onClick={setMic} className="w-6 h-6" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 8c0 .564-.094 1.107-.266 1.613l-.814-.814A4.02 4.02 0 0 0 12 8V7a.5.5 0 0 1 1 0v1zm-5 4c.818 0 1.578-.245 2.212-.667l.718.719a4.973 4.973 0 0 1-2.43.923V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 1 0v1a4 4 0 0 0 4 4zm3-9v4.879l-1-1V3a2 2 0 0 0-3.997-.118l-.845-.845A3.001 3.001 0 0 1 11 3z"/>
                <path d="m9.486 10.607-.748-.748A2 2 0 0 1 6 8v-.878l-1-1V8a3 3 0 0 0 4.486 2.607zm-7.84-9.253 12 12 .708-.708-12-12-.708.708z"/>
              </svg>
            )
          }
        </div>
      </div>
    </div>
  );
}

export default UserCard;

UserCard.defaultProps = {
  userName: "anony",
};

UserCard.propTypes = {
  userName: PropTypes.string,
  onMic: PropTypes.bool,
  isHost: PropTypes.number,
  isPublisher: PropTypes.bool,
  toggleMic: PropTypes.func,
  setPosition: PropTypes.func,
  sendPosition: PropTypes.func,
  position: PropTypes.array,
};
