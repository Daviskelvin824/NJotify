import React, { useContext, useEffect, useState } from "react";
import "../../styles/components/Songdetailbar.scss";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { PlayerContext } from "../../context/PlayerContext";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { User } from "../../model/User";
import { validateuserfollowing } from "../../pages/api-calls/auth/validateuserfollowing";
import { followperson } from "../../pages/api-calls/auth/followperson";
import { unfollowperson } from "../../pages/api-calls/auth/unfollowperson";
const SongDetailBar = () => {
  const { queue, setQueue, setShowQueueBar, setShowSongDetailbar } =
    useContext(PlayerContext);
  const navigate = useNavigate();
  const [userFollowingId, setuserFollowingId] = useState<boolean>(false);
  const user: User | null = useAuth();
  useEffect(() => {
    if (queue[0]) {
      void fetchUserFollowing();
    }
  }, [queue, userFollowingId, user]);

  const handleOpenQueue = () => {
    setShowSongDetailbar(false);
    setShowQueueBar(true);
  };

  const fetchUserFollowing = async () => {
    if (queue[0].artist?.userid && user?.userid) {
      const response = await validateuserfollowing(
        queue[0].artist.userid,
        user.userid
      );
      setuserFollowingId(response);
      console.log(response);
    }
  };

  const handleFollowBtn = async () => {
    if (queue[0].artist?.userid && user?.userid) {
      await followperson(queue[0].artist.userid, user.userid);
      setuserFollowingId(true);
    }
  };

  const handleUnFollowBtn = async () => {
    if (queue[0].artist?.userid && user?.userid) {
      await unfollowperson(queue[0].artist.userid, user.userid);
      setuserFollowingId(false);
    }
  };

  return (
    <div className="songdetailbar-container">
      <div className="title-container">
        <h4>
          {queue && queue.length
            ? queue[0].artist.username
            : "No Song Currently"}
        </h4>
        <div onClick={() => setShowSongDetailbar(false)}>
          <FontAwesomeIcon
            icon={faXmark}
            style={{ color: "grey", cursor: "pointer" }}
          />
        </div>
      </div>

      <div
        className="currsong-container"
        onClick={() =>
          navigate(
            `/trackpage/${queue[0].track.trackid}/${queue[0].album.albumid}`
          )
        }
      >
        {queue && queue.length > 0 ? (
          <div className="item-curr">
            <img
              src={`http://localhost:8888/files/${queue[0].album.imagepath ?? ""}`}
              alt=""
            />
            <div>
              <h4>{queue[0].track.tracktitles}</h4>
              <p>{queue[0].artist.username}</p>
            </div>
          </div>
        ) : (
          <>
            {" "}
            <h5 style={{ color: "grey", fontWeight: "lighter" }}>Empty</h5>
          </>
        )}
      </div>

      <div className="about-artist">
        {queue && queue.length > 0 ? (
          <div className="item-curr">
            <img
              src={`http://localhost:8888/files/${queue[0].artist.bannerimage ?? ""}`}
              alt=""
            />
            <h5 className="abouttxt">About the artist</h5>
            <div className="txt-container">
              <div className="first">
                <h4>{queue[0].artist.username}</h4>
                {user?.email !== queue[0].artist?.email ? (
                  userFollowingId ? (
                    <div
                      className="follow-container"
                      onClick={handleUnFollowBtn}
                    >
                      <h5>UnFollow</h5>
                    </div>
                  ) : (
                    <div className="follow-container" onClick={handleFollowBtn}>
                      <h5>Follow</h5>
                    </div>
                  )
                ) : (
                  <></>
                )}
              </div>
              <p>{queue[0].artist.aboutme}</p>
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>

      <div className="nextinqueue">
        <div className="head1">
          <h5>Next in queue</h5>
          <h5 className="openqueue" onClick={handleOpenQueue}>
            Open queue
          </h5>
        </div>
        <div className="now-container">
          {queue && queue.length > 1 ? (
            <div
              className="now2-container"
              onClick={() =>
                navigate(
                  `/trackpage/${queue[1].track.trackid}/${queue[1].album.albumid}`
                )
              }
            >
              <img
                src={`http://localhost:8888/files/${queue[1].album.imagepath ?? ""}`}
                alt=""
              />
              <div className="txt">
                <h5>{queue[1].track.tracktitles.slice(0, 25)}</h5>
                <p>{queue[1].artist.username}</p>
              </div>
            </div>
          ) : (
            <>
              {" "}
              <h5 style={{ color: "grey", fontWeight: "lighter" }}>Empty</h5>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SongDetailBar;
