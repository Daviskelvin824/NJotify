import "../../styles/home/TrackPage.scss";

import {
  faCirclePause,
  faCirclePlay,
  faCirclePlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import TopBar from "../../components/home/TopBar";
import ManageFooter from "../../components/ui/ManageFooter";
import { PlayerContext } from "../../context/PlayerContext";
import useAuth from "../../hooks/useAuth";
import type { Album } from "../../model/Album";
import type { PopularTrack } from "../../model/PopularTrack";
import type { User } from "../../model/User";
import { getartist } from "../api-calls/auth/getartist";
import { getalbumbyid } from "../api-calls/home/getalbumbyid";
import { getpopulartrackbyartist } from "../api-calls/home/getpopulartrackbyartist";
import { gettrackbytrackid } from "../api-calls/home/gettrackbytrackid";
import { gettracksbbyalbum } from "../api-calls/home/gettracksbyalbum";
const TrackPage = () => {
  const { index, id } = useParams();
  const user: User | null = useAuth();
  const navigate = useNavigate();
  const [currAlbum, setcurrAlbum] = useState<Album>();
  const [track, settrack] = useState("");
  const [artist, setartist] = useState<User>();
  const [trackalbumname, settrackalbumname] = useState([]);
  const [trackalbumtrackid, settrackalbumtrackid] = useState([]);
  const [trackalbumfile, settrackalbumfile] = useState<string[]>([]);
  const [trackTitle, settrackTitle] = useState("");
  const [trackDuration, settrackDuration] = useState("");
  const [populartrackDuration, setpopulartrackDuration] = useState([]);
  const [trackalbumduration, settrackalbumduration] = useState([]);
  const [popularTrack, setpopularTrack] = useState<PopularTrack[]>([]);
  const [localPlayStatus, setLocalPlayStatus] = useState(false);
  const {
    playStatus,
    playWithId,
    pause,
    setalbumname,
    setartistname,
    setalbumimage,
  } = useContext(PlayerContext);

  const getCurrAlbum = async () => {
    const response = await getalbumbyid(Number(id));
    console.log(response);
    setcurrAlbum(response);
  };

  const getTrackByTrackIds = async () => {
    const response = await gettrackbytrackid(Number(index));
    console.log(response);
    const titles = response.tracktitles.replace(/"/g, "");
    settrack(response.filepaths);
    settrackTitle(titles);
  };

  const getArtist = async () => {
    if (currAlbum?.artistid) {
      const response = await getartist(currAlbum.artistid);
      console.log(response);
      setartist(response);
    }
  };

  const getPopularTrackByArtist = async () => {
    if (currAlbum?.artistid) {
      const response = await getpopulartrackbyartist(currAlbum.artistid);
      console.log(response);
      setpopularTrack(response);
      console.log(popularTrack);
    }
  };

  const getTrackFromAlbum = async () => {
    if (currAlbum?.albumid) {
      const response = await gettracksbbyalbum(currAlbum.albumid);
      console.log("Track = ", response);
      const titles = response.tracktitles.map((title: string) =>
        title.replace(/"/g, ""),
      );
      settrackalbumname(titles);
      settrackalbumtrackid(response.trackid);
      settrackalbumfile(response.filepaths);
      console.log("track album file =", trackalbumfile);
    }
  };

  useEffect(() => {
    if (id) {
      void getCurrAlbum();
    }
  }, [id, index]);

  useEffect(() => {
    if (user?.email === "") {
      navigate("/login");
    }
  }, [user]);

  useEffect(() => {
    if (currAlbum?.artistid) {
      void getArtist();
      void getPopularTrackByArtist();
    }

    if (currAlbum?.albumid) {
      void getTrackByTrackIds();
      void getTrackFromAlbum();
    }
  }, [currAlbum]);

  useEffect(() => {
    if (track) {
      const cleanedPath = track.replace(/"/g, "");
      const audio = new Audio(`http://localhost:8888/files/${cleanedPath}`);
      audio.addEventListener("loadedmetadata", () => {
        settrackDuration(audio.duration);
      });
      setLocalPlayStatus(false);
    }
  }, [track]);

  useEffect(() => {
    const fetchTrackDurations = async () => {
      const durations = [];

      for (const track of popularTrack) {
        try {
          // Remove the surrounding double quotes from the filepath
          const cleanedPath = track.filepaths.replace(/"/g, "");
          const audio = new Audio(`http://localhost:8888/files/${cleanedPath}`);
          await new Promise<void>((resolve, reject) => {
            audio.onloadedmetadata = () => {
              resolve();
            };
            audio.onerror = reject;
          });
          durations.push(Math.round(audio.duration));
        } catch (error) {
          console.error("Error fetching duration for", track.filepaths, error);
          durations.push(null); // Handle error case or set default value
        }
      }

      setpopulartrackDuration(durations);
    };

    // Call fetchTrackDurations when popularTrack changes
    if (popularTrack.length > 0) {
      void fetchTrackDurations();
    }
  }, [popularTrack]);

  useEffect(() => {
    const fetchTrackDurations = async () => {
      const durations = [];

      for (const track of trackalbumfile) {
        try {
          const cleanedPath = track.replace(/"/g, "");
          const audio = new Audio(`http://localhost:8888/files/${cleanedPath}`);
          await new Promise<void>((resolve, reject) => {
            audio.onloadedmetadata = () => {
              resolve();
            };
            audio.onerror = reject;
          });
          durations.push(Math.round(audio.duration));
        } catch (error) {
          durations.push(null);
        }
      }
      settrackalbumduration(durations);
    };

    // Call fetchTrackDurations when popularTrack changes
    if (trackalbumfile.length > 0) {
      void fetchTrackDurations();
    }
  }, [trackalbumfile]);

  useEffect(() => {
    setLocalPlayStatus(playStatus);
  }, [playStatus]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const formattedSeconds =
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      remainingSeconds < 10 ? `0${remainingSeconds}` : `${remainingSeconds}`;
    return `${formattedMinutes}:${formattedSeconds}`;
  };

  const handlePlayClick = () => {
    if (track) {
      playWithId(track);
      setLocalPlayStatus(true);
      if (currAlbum?.albumname) {
        setalbumname(currAlbum.albumname);
        setalbumimage(currAlbum.imagepath);
      }
      if (artist?.username) {
        setartistname(artist.username);
      }
    }
  };

  const handlePauseClick = () => {
    pause();
    setLocalPlayStatus(false); // Update local play status
  };

  const handleTrackClick = (index: number) => {
    const trackId = trackalbumtrackid[index];

    if (currAlbum?.albumid) {
      navigate(`/trackpage/${trackId}/${currAlbum.albumid}`);
    }
  };

  return (
    <div className="track-container">
      <TopBar />
      <div className="header-container">
        <img
          src={`http://localhost:8888/files/${currAlbum?.imagepath ?? ""}`}
          alt=""
        />
        <div className="text-container">
          <p>Song</p>
          <h1>{trackTitle}</h1>
          <div className="txt-container">
            {artist?.profilepageimage ? (
              <img
                src={`http://localhost:8888/files/${artist.profilepageimage ?? ""}`}
                alt=""
                className="img-con"
              />
            ) : (
              <h1 className="img-con">{artist?.username.charAt(0)}</h1>
            )}
            <p>{currAlbum && new Date(currAlbum.createdat).getFullYear()} . </p>
            <p>{formatTime(Math.round(Number(trackDuration)))}</p>
          </div>
        </div>
      </div>

      <div className="head2-container">
        {localPlayStatus ? (
          <div className="icon-play" onClick={handlePauseClick}>
            <FontAwesomeIcon icon={faCirclePause} className="icon-play" />
          </div>
        ) : (
          <div className="icon-play" onClick={handlePlayClick}>
            <FontAwesomeIcon icon={faCirclePlay} className="icon-play" />
          </div>
        )}
        <h5
          style={{
            fontWeight: "lighter",
            alignItems: "center",
            display: "flex",
            gap: "0.3rem",
          }}
        >
          <FontAwesomeIcon icon={faCirclePlus} className="icon-add" /> Add to
          playlist
        </h5>
      </div>

      <h5
        style={{
          fontWeight: "lighter",
          paddingLeft: "1.2vw",
          paddingTop: "5vh",
        }}
      >
        Popular Tracks by
      </h5>
      <h3 style={{ paddingLeft: "1.2vw", paddingTop: "1vh" }}>
        {artist?.username}
      </h3>

      <div className="populartrack-container">
        {popularTrack.slice(0, 5).map((track, index) => (
          <div
            key={index}
            className="track-item"
            onClick={() => {
              if (track.trackid && track.albumid) {
                navigate(
                  `/trackpage/${track.trackid.toString()}/${track.albumid.toString()}`,
                );
              }
            }}
          >
            <div className="txt">
              <div
                style={{ display: "flex", alignItems: "center", gap: "20px" }}
              >
                <h5 style={{ fontWeight: "lighter" }}>{index + 1}</h5>
                <img
                  src={`http://localhost:8888/files/${track.imagepath || ""}`}
                  alt=""
                />
                <div className="title">
                  <h5 style={{ fontWeight: "normal" }}>
                    {track.tracktitles.length > 25
                      ? track.tracktitles.substring(0, 25) + "..."
                      : track.tracktitles}
                  </h5>
                </div>
              </div>
              <div className="txt2">
                <h5 style={{ fontWeight: "lighter" }}>{track.listenercount}</h5>
                <h5 style={{ fontWeight: "lighter" }}>
                  {formatTime(Math.round(populartrackDuration[index]))}
                </h5>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div
        className="btmalbum-container"
        onClick={() => {
          if (currAlbum?.albumid) {
            navigate(`/albumpage/${currAlbum.albumid.toString()}`);
          }
        }}
      >
        <img
          src={`http://localhost:8888/files/${currAlbum?.imagepath ?? ""}`}
          alt=""
        />
        <div className="txt">
          <h6 style={{ fontWeight: "lighter" }}>
            From the {currAlbum?.albumtype}
          </h6>
          <h5>{currAlbum?.albumname}</h5>
        </div>
      </div>
      <br />

      {trackalbumname.map((item, index) => (
        <div
          key={index}
          className="trackalbum-container"
          onClick={() => {
            handleTrackClick(index);
          }}
        >
          <div className="head">
            <h5>{index + 1}</h5>
            <div className="txt">
              <h5>{item}</h5>
              <h6>{artist?.username}</h6>
            </div>
          </div>
          <h5 style={{ fontWeight: "lighter" }}>
            {formatTime(Math.round(trackalbumduration[index]))}
          </h5>
        </div>
      ))}

      <br />
      <br />
      <br />
      <ManageFooter />
    </div>
  );
};

export default TrackPage;
