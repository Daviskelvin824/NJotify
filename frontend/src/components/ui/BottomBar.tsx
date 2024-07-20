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
  const {
    seekBar,
    playStatus,
    play,
    pause,
    next,
    time,
    seekSong,
    seekBg,
    seekVolume,
    increaseVol,
    seekVolumeBar,
    queue,
    setShowQueueBar,
    showQueueBar,
    setShowSongDetailbar,
    showSongDetailbar,
  } = useContext(PlayerContext);

  const handleSongDetail = () => {
    setShowSongDetailbar(!showSongDetailbar);
    setShowQueueBar(false);
  };

  const handleQueueBar = () => {
    setShowQueueBar(!showQueueBar);
    setShowSongDetailbar(false);
  };

  return (
    <div className="bottoms-container">
      <div className="left-container">
        {queue.length > 0 ? (
          <img
            src={"http://localhost:8888/files/" + queue[0].album.imagepath}
            alt=""
          />
        ) : (
          <img src={logo} alt="" />
        )}

        <div>
          {queue.length > 0 ? (
            <p>{queue[0].track.tracktitles.slice(0, 20)}</p>
          ) : (
            <p>Track Name</p>
          )}
          {queue.length > 0 ? (
            <h5>{queue[0].artist.username}</h5>
          ) : (
            <h5>Artist Name</h5>
          )}
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

          <div onClick={next}>
            <FontAwesomeIcon icon={faForwardStep} className="icon" />
          </div>
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
        <div onClick={handleSongDetail}>
          <FontAwesomeIcon
            icon={faSquareCaretRight}
            style={{ cursor: "pointer" }}
          />
        </div>
        <div onClick={handleQueueBar}>
          <FontAwesomeIcon icon={faBars} style={{ cursor: "pointer" }} />
        </div>
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
