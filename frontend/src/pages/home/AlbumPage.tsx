import "../../styles/home/AlbumPage.scss";

import { faCirclePause, faCirclePlay } from "@fortawesome/free-solid-svg-icons";
import { faClock } from "@fortawesome/free-solid-svg-icons/faClock";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import TopBar from "../../components/home/TopBar";
import ManageFooter from "../../components/ui/ManageFooter";
import { PlayerContext } from "../../context/PlayerContext";
import useAuthWithLoad from "../../hooks/useAuthWIthLoad";
import type { Album } from "../../model/Album";
import type { User } from "../../model/User";
import { getartist } from "../api-calls/auth/getartist";
import { getalbumbyartist } from "../api-calls/home/getalbumbyartist";
import { getalbumbyid } from "../api-calls/home/getalbumbyid";
import { gettracksbbyalbum } from "../api-calls/home/gettracksbyalbum";
import { SingleTrack } from "../../model/SingleTrack";
const AlbumPage = () => {
  const { id } = useParams();
  const [currAlbum, setcurrAlbum] = useState<Album>();
  const [albums, setalbums] = useState<Album[]>([]);
  const [artist, setartist] = useState<User>();
  const [tracks, settracks] = useState<string[]>([]);
  const [trackTitle, settrackTitle] = useState<string[]>([]);
  const [trackIds, settrackIds] = useState<number[]>([]);
  const [trackDurations, setTrackDurations] = useState<number[]>([]);
  const [isQueueReady, setIsQueueReady] = useState(false);
  const navigate = useNavigate();
  const { playStatus, play, pause, setQueue } = useContext(PlayerContext);
  const { user, loading } = useAuthWithLoad();
  useEffect(() => {
    if (loading) return;
    if (!user) navigate("/login");
  }, [loading, user, navigate]);

  const getCurrAlbum = async () => {
    const response = await getalbumbyid(Number(id));
    console.log(response);
    setcurrAlbum(response);
  };

  const getArtist = async () => {
    if (currAlbum?.artistid) {
      const response = await getartist(currAlbum.artistid);
      console.log(response);
      setartist(response);
    }
  };

  const getAlbum = async () => {
    if (currAlbum?.artistid) {
      const response = await getalbumbyartist(currAlbum.artistid);
      console.log(response);
      setalbums(response);
      console.log(response);
    }
  };

  const getTracks = async () => {
    if (currAlbum?.albumid) {
      const response = await gettracksbbyalbum(currAlbum.albumid);
      console.log("Track = ", response);
      const titles = response.tracktitles.map((title: string) =>
        title.replace(/"/g, "")
      );
      settracks(response.filepaths);
      settrackTitle(titles);
      if (Array.isArray(response.trackid)) {
        settrackIds(
          response.trackid.filter(
            (id: number | undefined): id is number => id !== undefined
          )
        );
      } else {
        console.error(
          "Expected response.trackid to be an array, but got:",
          response.trackid
        );
      }
    }
  };

  const getTotalAlbumDuration = () => {
    let totalSeconds = 0;
    trackDurations.forEach((duration) => {
      if (typeof duration === "number") {
        totalSeconds += Number(duration);
      }
    });
    return formatTime(totalSeconds);
  };

  useEffect(() => {
    if (id) {
      void getCurrAlbum();
    }
  }, [id]);

  useEffect(() => {
    if (currAlbum?.artistid) {
      void getArtist();
      void getAlbum();
    }
    if (currAlbum?.albumid) {
      void getTracks();
    }
  }, [currAlbum]);

  useEffect(() => {
    const fetchTrackDurations = async () => {
      const durations: number[] = [];

      for (const filepath of tracks) {
        try {
          const cleanedPath = filepath.replace(/"/g, "");
          const audio = new Audio(`http://localhost:8888/files/${cleanedPath}`);
          await new Promise<void>((resolve, reject) => {
            audio.onloadedmetadata = () => {
              resolve();
            };
            audio.onerror = reject;
          });
          durations.push(Math.round(audio.duration));
        } catch (error) {
          console.error("Error fetching duration for", filepath, error);
        }
      }

      setTrackDurations(durations);
    };
    if (tracks.length > 0) {
      void fetchTrackDurations();
    }
  }, [tracks]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const formattedSeconds =
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      remainingSeconds < 10 ? `0${remainingSeconds}` : `${remainingSeconds}`;
    return `${formattedMinutes}:${formattedSeconds}`;
  };

  const handleTrackClick = (index: number) => {
    const trackId = trackIds[index];

    if (currAlbum?.albumid) {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      navigate(`/trackpage/${trackId}/${currAlbum.albumid}`);
    }
  };

  const handlePlay = () => {
    if (!artist || !currAlbum) {
      return;
    }

    const t = trackIds.map<SingleTrack>((id, idx) => ({
      albumid: currAlbum.albumid ?? 0,
      filepaths: tracks[idx],
      tracktitles: trackTitle[idx],
      trackid: id,
    }));

    const trackContexts = t.map((track) => ({
      track,
      album: currAlbum,
      artist,
    }));

    setQueue(trackContexts);
    setIsQueueReady(true);
  };

  useEffect(() => {
    if (isQueueReady) {
      play();
      setIsQueueReady(false);
    }
  }, [isQueueReady, play]);

  return (
    <div className="album-container">
      <TopBar />
      <div className="header-container">
        <img
          src={`http://localhost:8888/files/${currAlbum?.imagepath ?? ""}`}
          alt=""
        />
        <div className="text-container">
          <p>{currAlbum?.albumtype}</p>
          <h1>{currAlbum?.albumname}</h1>
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
            <p>
              {artist?.username} .{" "}
              {currAlbum && new Date(currAlbum.createdat).getFullYear()} .{" "}
              {tracks.length} songs .
            </p>

            <p>Total Duration : {getTotalAlbumDuration()}</p>
          </div>
        </div>
      </div>

      {playStatus ? (
        <div
          className="icon-play"
          onClick={pause}
          style={{ cursor: "pointer" }}
        >
          <FontAwesomeIcon icon={faCirclePause} className="icon-play" />
        </div>
      ) : (
        <div
          className="icon-play"
          onClick={handlePlay}
          style={{ cursor: "pointer" }}
        >
          <FontAwesomeIcon icon={faCirclePlay} className="icon-play" />
        </div>
      )}
      <div className="table-container">
        <p>
          <b className="mr-4">#</b>Title
        </p>
        <FontAwesomeIcon icon={faClock} />
      </div>
      <hr />
      {trackTitle.map((item, index) => (
        <div
          key={index}
          className="table-container2"
          onClick={() => {
            handleTrackClick(index);
          }}
        >
          <div className="txt">
            <h5 className="mr-4">{index + 1}</h5>
            <img
              src={`http://localhost:8888/files/${currAlbum?.imagepath ?? ""}`}
              alt=""
            />
            <div className="txt2">
              <h5 style={{ fontWeight: "bold", color: "white" }}>{item}</h5>
              <p style={{ fontWeight: "lighter" }}>{artist?.username}</p>
            </div>

            <h5 style={{ fontWeight: "lighter" }}>
              {formatTime(Math.round(trackDurations[index]))}
            </h5>
          </div>
        </div>
      ))}
      <h2 style={{ paddingLeft: "1.5vw", paddingTop: "4vh" }}>
        More By {artist?.username}
      </h2>

      <div className="albums-grid">
        {albums.length === 0 ||
        !albums.some((album) => album.albumid !== currAlbum?.albumid) ? (
          <h5
            style={{
              color: "grey",
              fontWeight: "lighter",
              marginLeft: "0.5vw",
            }}
          >
            No More Album by Artist
          </h5>
        ) : (
          albums
            .filter((album) => album.albumid !== currAlbum?.albumid)
            .map((album, index) => (
              <div
                className="album-item"
                key={index}
                onClick={() => {
                  if (album.albumid) {
                    navigate(`/albumpage/${album.albumid.toString()}`);
                  }
                }}
              >
                <img
                  src={"http://localhost:8888/files/" + album.imagepath}
                  alt={album.albumname}
                />
                <div className="album-info">
                  <h4>{album.albumname}</h4>
                  <h5>{new Date(album.createdat).getFullYear()}</h5>
                </div>
              </div>
            ))
        )}
      </div>
      <br />
      <br />
      <br />
      <br />
      <ManageFooter />
    </div>
  );
};

export default AlbumPage;
