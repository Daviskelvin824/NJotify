import React, { useContext, useEffect, useState } from "react";
import TopBar from "../../components/home/TopBar";
import "../../styles/home/PlaylistPage.scss";
import { useNavigate, useParams } from "react-router-dom";
import { PlaylistDetail } from "../../model/PlaylistDetail";
import { getplaylistdetail } from "../api-calls/home/getplaylistdetail";
import { getplaylistbyid } from "../api-calls/home/getplaylistbyid";
import { Playlist } from "../../model/Playlist";
import { SingleTrack } from "../../model/SingleTrack";
import { gettrackbytrackid } from "../api-calls/home/gettrackbytrackid";
import { Album } from "../../model/Album";
import { getalbumbyid } from "../api-calls/home/getalbumbyid";
import { User } from "../../model/User";
import useAuthWithLoad from "../../hooks/useAuthWIthLoad";
import { getartist } from "../api-calls/auth/getartist";
import {
  faCirclePause,
  faCirclePlay,
  faClock,
  faEllipsis,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { PlayerContext } from "../../context/PlayerContext";
import ManageFooter from "../../components/ui/ManageFooter";
import { deleteplaylist } from "../api-calls/home/deleteplaylist";
import { deleteplaylisttrack } from "../api-calls/home/deleteplaylistrack";

const PlaylistPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [playlistDetail, setplaylistDetail] = useState<PlaylistDetail[]>([]);
  const [playlistCreator, setplaylistCreator] = useState<User>();
  const [playlistDuration, setplaylistDuration] = useState<number>();
  const [currPlaylist, setcurrPlaylist] = useState<Playlist>();
  const [tracks, setTracks] = useState<SingleTrack[]>([]);
  const [trackAlbum, settrackAlbum] = useState<Album[]>([]);
  const [trackArtist, settrackArtist] = useState<User[]>([]);
  const [trackDuration, settrackDuration] = useState<number[]>([]);
  const { user, loading } = useAuthWithLoad();
  const [isQueueReady, setIsQueueReady] = useState(false);
  const { playStatus, play, pause, setQueue } = useContext(PlayerContext);
  const [showDeleteMenu, setShowDeleteMenu] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user) navigate("/login");
  }, [loading, user, navigate]);

  const fetchPlaylistDetail = async () => {
    const response = await getplaylistdetail(Number(id));
    setplaylistDetail(response);
  };

  const fetchPlaylistCreator = async () => {
    if (currPlaylist?.creatorid) {
      const response = await getartist(currPlaylist?.creatorid);
      setplaylistCreator(response);
    }
  };

  const fetchCurrPlaylist = async () => {
    const response = await getplaylistbyid(Number(id));
    setcurrPlaylist(response);
  };

  const fetchPlaylistTrack = async (trackIds: number[]) => {
    const fetchedTracks = await Promise.all(
      trackIds.map(async (trackId) => {
        const trackDetail = await gettrackbytrackid(trackId);
        return trackDetail;
      })
    );
    setTracks(fetchedTracks);
    const albumIds = fetchedTracks.map((detail) => detail.albumid);
    void fetchPlaylistAlbum(albumIds);
  };

  const fetchPlaylistAlbum = async (albumIds: number[]) => {
    const fetchedAlbums = await Promise.all(
      albumIds.map(async (albumId) => {
        const albumDetail = await getalbumbyid(albumId);
        return albumDetail;
      })
    );
    settrackAlbum(fetchedAlbums);
    const artistId = fetchedAlbums
      .map((detail) => detail.artistid)
      .filter((id): id is number => id !== undefined);
    void fetchPlaylistArtist(artistId);
  };

  const fetchPlaylistArtist = async (artistIds: number[]) => {
    const fetchedArtist = await Promise.all(
      artistIds.map(async (artistId) => {
        const artist = await getartist(artistId);
        return artist;
      })
    );
    settrackArtist(fetchedArtist);
  };

  useEffect(() => {
    void fetchPlaylistDetail();
    void fetchCurrPlaylist();
  }, [id]);

  useEffect(() => {
    void fetchPlaylistCreator();
    if (playlistDetail.length > 0) {
      const trackIds = playlistDetail.map((detail) => detail.trackid);
      void fetchPlaylistTrack(trackIds);
    }
  }, [playlistDetail]);

  useEffect(() => {
    const fetchTrackDurations = async () => {
      const durations: number[] = [];

      for (const track of tracks) {
        try {
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
          console.error("Error fetching duration for", track, error);
        }
      }
      settrackDuration(durations);
      const totalDuration = durations.reduce(
        (acc, duration) => acc + duration,
        0
      );
      setplaylistDuration(totalDuration);
    };

    if (tracks.length > 0) {
      void fetchTrackDurations();
    }
  }, [tracks]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const formattedSeconds =
      remainingSeconds < 10 ? `0${remainingSeconds}` : `${remainingSeconds}`;
    return `${formattedMinutes}:${formattedSeconds}`;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handlePlay = () => {
    const trackContexts = tracks.map((track, idx) => ({
      track,
      album: trackAlbum[idx],
      artist: trackArtist[idx],
    }));
    console.log(trackContexts);
    setQueue(trackContexts);
    setIsQueueReady(true);
  };

  useEffect(() => {
    if (isQueueReady) {
      play();
      setIsQueueReady(false);
    }
  }, [isQueueReady, play]);

  const toggleDeleteMenu = () => {
    setShowDeleteMenu(!showDeleteMenu);
  };

  const handleDeletePlaylist = async () => {
    await deleteplaylist(currPlaylist?.playlistid ?? 0);
    navigate("/home");
  };

  const handleDeleteTrack = async (trackid: number) => {
    await deleteplaylisttrack(currPlaylist?.playlistid ?? 0, trackid);
    void fetchPlaylistDetail();
  };

  return (
    <div className="playlists-container">
      <TopBar />

      <div className="header-container">
        <img
          src={`http://localhost:8888/files/${currPlaylist?.playlistimg ?? ""}`}
          alt=""
        />
        <div className="text-container">
          <p>Playlist</p>
          <h1>{currPlaylist?.playlisttitle}</h1>
          <p style={{ fontSize: "0.8em", fontWeight: "lighter" }}>
            {currPlaylist?.playlistdesc}
          </p>
          <div className="txt-container">
            {playlistCreator?.profilepageimage ? (
              <img
                src={`http://localhost:8888/files/${playlistCreator.profilepageimage ?? ""}`}
                alt=""
                className="img-con"
              />
            ) : (
              <h1 className="img-con">{playlistCreator?.username.charAt(0)}</h1>
            )}
            <h5>{playlistCreator?.username} .</h5>
            <h5>{tracks.length} songs .</h5>
            <h5>Total Duration: {formatTime(playlistDuration || 0)}</h5>
          </div>
        </div>
      </div>

      <div className="head2-container">
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
        {currPlaylist?.creatorid === user?.userid && (
          <div className="ellipsis" onClick={toggleDeleteMenu}>
            <FontAwesomeIcon icon={faEllipsis} />
          </div>
        )}
        {showDeleteMenu && (
          <div className="delete-menu" onClick={handleDeletePlaylist}>
            <FontAwesomeIcon icon={faTrashAlt} />
            <h5 style={{ cursor: "pointer" }}>Delete Playlist</h5>
          </div>
        )}
      </div>

      <div className="body-container">
        <p>
          <b style={{ marginRight: "2vh" }}>#</b>Title
        </p>
        <p>Album</p>
        <p>Date Added</p>
        <FontAwesomeIcon icon={faClock} />
      </div>
      <hr
        style={{ marginLeft: "1.5vw", marginRight: "3vw", borderColor: "grey" }}
      />
      {tracks.length > 0 && playlistDetail.length > 0 ? (
        tracks.map((item, idx) => (
          <div key={idx} className="track-containers">
            <div
              className="txts"
              onClick={() =>
                navigate(
                  `/trackpage/${item.trackid}/${trackAlbum[idx].albumid}`
                )
              }
            >
              <b style={{ marginRight: "2vh" }}>{idx + 1}</b>
              {trackAlbum[idx] && (
                <img
                  src={`http://localhost:8888/files/${trackAlbum[idx].imagepath ?? ""}`}
                  alt=""
                  className="img-con"
                />
              )}
              <div className="txt2">
                <h5 style={{ fontWeight: "bold", color: "white" }}>
                  {item.tracktitles.length > 15
                    ? `${item.tracktitles.slice(0, 20)}...`
                    : item.tracktitles}
                </h5>
                <p style={{ fontWeight: "lighter" }}>
                  {trackArtist[idx]?.username}
                </p>
              </div>

              <p
                style={{
                  width: "22.4vw",
                  fontSize: "0.9em",
                }}
              >
                {trackAlbum[idx]?.albumname
                  ? trackAlbum[idx].albumname.length > 15
                    ? `${trackAlbum[idx].albumname.slice(0, 20)}...`
                    : trackAlbum[idx].albumname
                  : "Unknown Album"}
              </p>
              <p
                style={{
                  width: "21.5vw",
                  fontSize: "0.9em",
                }}
              >
                {playlistDetail[idx]?.dateadded
                  ? formatDate(new Date(playlistDetail[idx].dateadded))
                  : ""}
              </p>
              <h5
                style={{
                  fontWeight: "lighter",
                  fontSize: "0.9em",
                  width: "2.5vw",
                }}
              >
                {formatTime(Math.round(trackDuration[idx]))}
              </h5>
            </div>

            {currPlaylist?.creatorid === user?.userid && (
              <div
                className="delete-container"
                onClick={() => handleDeleteTrack(item.trackid ?? 0)}
              >
                <FontAwesomeIcon icon={faTrashAlt} />
              </div>
            )}
          </div>
        ))
      ) : (
        <>
          <h2
            style={{
              color: "grey",
              fontWeight: "lighter",
              marginLeft: "1.5vw",
            }}
          >
            No Tracks yet
          </h2>
        </>
      )}
      <br />
      <br />
      <ManageFooter />
    </div>
  );
};

export default PlaylistPage;
