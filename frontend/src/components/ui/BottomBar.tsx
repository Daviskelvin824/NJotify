import "../../styles/components/BottomBar.scss";

import {
  faBackwardStep,
  faBars,
  faCirclePause,
  faCirclePlay,
  faForwardStep,
  faRepeat,
  faShuffle,
  faSquareCaretRight,
  faVolumeLow,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext } from "react";

import logo from "../../assets/cameraicon.png";
import { PlayerContext } from "../../context/PlayerContext";
const BottomBar = () => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  const {
    seekBar,
    playStatus,
    play,
    pause,
    time,
    seekSong,
    seekBg,
    seekVolume,
    increaseVol,
    seekVolumeBar,
    albumname,
    artistname,
    albumimage,
  } = useContext(PlayerContext);

  return (
    <div className="bottoms-container">
      <div className="left-container">
        {albumimage ? (
          <img src={"http://localhost:8888/files/" + albumimage} alt="" />
        ) : (
          <img src={logo} alt="" />
        )}

        <div>
          {albumname ? <p>{albumname}</p> : <p>Album Name</p>}
          {artistname ? <h5>{artistname}</h5> : <h5>Artist Name</h5>}
        </div>
      </div>

      <div className="middle-container">
        <div className="tops-container">
          <FontAwesomeIcon icon={faShuffle} className="icon" />
          <FontAwesomeIcon icon={faBackwardStep} className="icon" />
          {playStatus ? (
            <div className="icon-play" onClick={pause}>
              <FontAwesomeIcon icon={faCirclePause} className="icon-play" />
            </div>
          ) : (
            <div className="icon-play" onClick={play}>
              <FontAwesomeIcon icon={faCirclePlay} className="icon-play" />
            </div>
          )}

          <FontAwesomeIcon icon={faForwardStep} className="icon" />
          <FontAwesomeIcon icon={faRepeat} className="icon" />
        </div>
        <div className="bottom-container">
          <p>
            {time.currentTime.minute}:{time.currentTime.second}
          </p>
          <div ref={seekBg} onClick={seekSong} className="bottom2-container">
            <hr
              ref={seekBar as unknown as React.RefObject<HTMLHRElement>}
              className="bar"
            />
          </div>
          <p>
            {time.totalTime.minute}:{time.totalTime.second}
          </p>
        </div>
      </div>

      <div className="right-container">
        <FontAwesomeIcon icon={faSquareCaretRight} />
        <FontAwesomeIcon icon={faBars} />
        <FontAwesomeIcon icon={faVolumeLow} />
        <div ref={seekVolume} onClick={increaseVol} className="bar-container">
          <hr
            ref={seekVolumeBar as unknown as React.RefObject<HTMLHRElement>}
            className="bar"
          />
        </div>
      </div>
    </div>
  );
};

export default BottomBar;
