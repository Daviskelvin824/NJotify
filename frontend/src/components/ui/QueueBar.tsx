import React, { useContext } from "react";
import "../../styles/components/QueueBar.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { PlayerContext } from "../../context/PlayerContext";
const QueueBar = () => {
  const navigate = useNavigate();
  const { queue, setQueue, setShowQueueBar, setShowSongDetailbar } =
    useContext(PlayerContext);

  const handleRemoveSong = (index: number) => {
    const newQueue = [...queue];
    newQueue.splice(index, 1);
    setQueue(newQueue);
  };

  const handleClearQueue = () => {
    if (queue.length > 1) {
      setQueue([queue[0]]);
    }
  };

  return (
    <div className="queue-container">
      <div className="title-container">
        <h4>Queue</h4>
        <div onClick={() => setShowQueueBar(false)}>
          <FontAwesomeIcon
            icon={faXmark}
            style={{ color: "grey", cursor: "pointer" }}
          />
        </div>
      </div>

      <div className="now-container">
        <h5>Now Playing</h5>
        {queue && queue.length > 0 ? (
          <div
            className="now2-container"
            onClick={() =>
              navigate(
                `/trackpage/${queue[0].track.trackid}/${queue[0].album.albumid}`
              )
            }
          >
            <img
              src={`http://localhost:8888/files/${queue[0].album.imagepath ?? ""}`}
              alt=""
            />
            <div className="txt">
              <h5>{queue[0].track.tracktitles.slice(0, 25)}</h5>
              <p>{queue[0].artist.username}</p>
            </div>
          </div>
        ) : (
          <>
            <h5 style={{ color: "grey", fontWeight: "lighter" }}>Empty</h5>
          </>
        )}
      </div>

      <div className="next-container">
        <div className="head">
          <h5>Next in Queue</h5>
          <h5 className="clear" onClick={handleClearQueue}>
            Clear all
          </h5>
        </div>
        {queue && queue.length > 1 ? (
          queue.slice(1).map((item, index) => (
            <div className="next-item" key={index}>
              <div
                className="item-container"
                onClick={() =>
                  navigate(
                    `/trackpage/${item.track.trackid}/${item.album.albumid}`
                  )
                }
              >
                <img
                  src={`http://localhost:8888/files/${item.album.imagepath ?? ""}`}
                  alt=""
                />
                <div className="txt">
                  <h5>{item.track.tracktitles.slice(0, 25)}</h5>
                  <p>{item.artist.username}</p>
                </div>
              </div>
              <div onClick={() => handleRemoveSong(index + 1)}>
                <FontAwesomeIcon
                  icon={faXmark}
                  style={{
                    color: "grey",
                    fontWeight: "lighter",
                    cursor: "pointer",
                  }}
                />
              </div>
            </div>
          ))
        ) : (
          <>
            <h5 style={{ color: "grey", fontWeight: "lighter" }}>Empty</h5>
          </>
        )}
      </div>
    </div>
  );
};

export default QueueBar;
