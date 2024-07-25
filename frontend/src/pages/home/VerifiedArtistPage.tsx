import React, { useContext, useEffect, useState } from "react";
import TopBar from "../../components/home/TopBar";
import useAuthWithLoad from "../../hooks/useAuthWIthLoad";
import { useNavigate, useParams } from "react-router-dom";
import "../../styles/home/VerifiedArtist.scss";
import verifyLogo from "../../assets/verified.png";
import { faCirclePause, faCirclePlay } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { PlayerContext } from "../../context/PlayerContext";
import { PopularTrack } from "../../model/PopularTrack";
import { getpopulartrackbyartist } from "../api-calls/home/getpopulartrackbyartist";
import { getalbumbyid } from "../api-calls/home/getalbumbyid";
import { getartist } from "../api-calls/auth/getartist";
import { Album } from "../../model/Album";
import { User } from "../../model/User";
import { SingleTrack } from "../../model/SingleTrack";
import { getalbumbyartist } from "../api-calls/home/getalbumbyartist";
import { getfeaturedplaylist } from "../api-calls/home/getplaylistbytrackId";
import { getplaylistbyid } from "../api-calls/home/getplaylistbyid";
import { Playlist } from "../../model/Playlist";
import ManageFooter from "../../components/ui/ManageFooter";
import { getuserbyusername } from "../api-calls/auth/getuserbyemail";
import { followperson } from "../api-calls/auth/followperson";
import { unfollowperson } from "../api-calls/auth/unfollowperson";
import { validateuserfollowing } from "../api-calls/auth/validateuserfollowing";
const VerifiedArtistPage = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuthWithLoad();
  const { playStatus, play, pause, setQueue } = useContext(PlayerContext);
  const [popularTrack, setpopularTrack] = useState<PopularTrack[]>([]);
  const [populartrackDuration, setpopulartrackDuration] = useState([]);
  const [isQueueReady, setIsQueueReady] = useState(false);
  const [trackAlbum, settrackAlbum] = useState<Album[]>([]);
  const [artistAlbum, setArtistAlbum] = useState<Album[]>([]);
  const [trackArtist, settrackArtist] = useState<User[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>("All");
  const [featurePlaylist, setfeaturePlaylist] = useState<Playlist[]>([]);
  const [currUser, setcurrUser] = useState<User>();
  const { username } = useParams();
  const [userFollowingId, setuserFollowingId] = useState<boolean>(false);

  const getPopularTrackByArtist = async () => {
    if (currUser?.userid) {
      const response = await getpopulartrackbyartist(currUser.userid);
      setpopularTrack(response);
    }
  };

  const fetchUser = async () => {
    if (username) {
      const response = await getuserbyusername(username);
      setcurrUser(response);
    }
  };

  const fetchArtistAlbum = async () => {
    if (currUser?.userid) {
      const response = await getalbumbyartist(currUser?.userid);
      setArtistAlbum(response);
    }
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

  const fetchFeaturedPlaylist = async (playlistIds: number[]) => {
    const uniquePlaylistIds = Array.from(new Set(playlistIds));
    const fetchPlaylist = await Promise.all(
      uniquePlaylistIds.map(async (playlistId) => {
        const playlistDetail = await getplaylistbyid(playlistId);
        return playlistDetail;
      })
    );
    setfeaturePlaylist(fetchPlaylist);
    console.log("Feature playlist = ", fetchPlaylist);
  };

  const fetchFeaturedPlaylistDetail = async (trackIds: number[]) => {
    const fetchPlaylist = await Promise.all(
      trackIds.map(async (trackId) => {
        const albumDetail = await getfeaturedplaylist(trackId);
        return albumDetail;
      })
    );
    const validPlaylistIds = fetchPlaylist
      .filter((detail) => detail.playlistid > 0) // Only include valid playlist IDs
      .map((detail) => detail.playlistid);
    void fetchFeaturedPlaylist(validPlaylistIds);
  };

  useEffect(() => {
    if (popularTrack.length > 0) {
      const albumIds = popularTrack.map((detail) => detail.albumid);
      void fetchPlaylistAlbum(albumIds);

      const trackIds = popularTrack.map((detail) => detail.trackid);
      void fetchFeaturedPlaylistDetail(trackIds);
    }
  }, [popularTrack]);

  useEffect(() => {
    if (loading) {
      return;
    }
    if (!user) {
      navigate("/login");
    }
    void fetchUser();
  }, [navigate, user, loading]);

  useEffect(() => {
    if (currUser?.userid) {
      void getPopularTrackByArtist();
      void fetchArtistAlbum();
      void fetchUserFollowing();
    }
  }, [currUser, userFollowingId]);

  const fetchUserFollowing = async () => {
    if (currUser?.userid && user?.userid) {
      const response = await validateuserfollowing(
        currUser.userid,
        user.userid
      );
      setuserFollowingId(response);
      console.log(response);
    }
  };

  useEffect(() => {
    const fetchTrackDurations = async () => {
      const durations = [];

      for (const track of popularTrack) {
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
          console.error("Error fetching duration for", track.filepaths, error);
          durations.push(null); // Handle error case or set default value
        }
      }
      //@ts-ignore
      setpopulartrackDuration(durations);
    };

    if (popularTrack.length > 0) {
      void fetchTrackDurations();
    }
  }, [popularTrack]);

  const handlePlay = () => {
    if (!popularTrack) {
      return;
    }

    const t = popularTrack.slice(0, 5).map<SingleTrack>((id, idx) => ({
      albumid: id.albumid ?? 0,
      filepaths: id.filepaths,
      tracktitles: id.tracktitles,
      trackid: id.trackid,
    }));

    const trackContexts = t.map((track, idx) => ({
      track,
      album: trackAlbum[idx],
      artist: trackArtist[idx],
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

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const formattedSeconds =
      remainingSeconds < 10 ? `0${remainingSeconds}` : `${remainingSeconds}`;
    return `${formattedMinutes}:${formattedSeconds}`;
  };

  const handleFilterClick = (filter: string) => {
    setSelectedFilter(filter);
  };

  const filteredAlbums = artistAlbum.filter((album) => {
    if (selectedFilter === "All") {
      return true;
    } else if (selectedFilter === "Singles") {
      return album.albumtype === "Single";
    } else if (selectedFilter === "EPs") {
      return album.albumtype === "Ep";
    } else if (selectedFilter === "Albums") {
      return album.albumtype === "Album";
    }
    return false;
  });

  const handleFollowBtn = async () => {
    if (currUser?.userid && user?.userid) {
      await followperson(currUser.userid, user.userid);
      setuserFollowingId(true);
    }
  };

  const handleUnFollowBtn = async () => {
    if (currUser?.userid && user?.userid) {
      await unfollowperson(currUser.userid, user.userid);
      setuserFollowingId(false);
    }
  };

  return (
    <div className="verified-artist">
      <TopBar />
      <div className="banner-container">
        <img
          src={`http://localhost:8888/files/${currUser?.bannerimage ?? ""}`}
          alt="Banner Image"
          className="banner-img"
        />
      </div>
      <div className="title-container">
        <div className="verified-container">
          <img src={verifyLogo} alt="" />
          <h5>Verified Artist</h5>
        </div>
        <h1 className="name">{currUser?.username}</h1>
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
        {user?.email !== currUser?.email ? (
          userFollowingId ? (
            <div className="follow-container" onClick={handleUnFollowBtn}>
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

      <h5
        style={{
          fontWeight: "bold",
          fontSize: "large",
          paddingLeft: "1.2vw",
          paddingTop: "3vh",
        }}
      >
        Popular
      </h5>

      <div className="populartrack-container">
        {popularTrack.slice(0, 5).map((track, index) => (
          <div
            key={index}
            className="track-item"
            onClick={() => {
              if (track.trackid && track.albumid) {
                navigate(
                  `/trackpage/${track.trackid.toString()}/${track.albumid.toString()}`
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

      <h5
        style={{
          fontWeight: "bold",
          fontSize: "large",
          paddingLeft: "1.2vw",
          paddingTop: "3vh",
        }}
      >
        Discography
      </h5>

      <div className="album-filter">
        {["All", "Singles", "EPs", "Albums"].map((filter) => (
          <div
            key={filter}
            className={`album ${selectedFilter === filter ? "selected" : ""}`}
            onClick={() => handleFilterClick(filter)}
          >
            <h5>{filter}</h5>
          </div>
        ))}
      </div>

      <div className="albums-grid">
        {filteredAlbums.map((album, index) => (
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
              <h5>
                {new Date(album.createdat).getFullYear()} . {album.albumtype}
              </h5>
            </div>
          </div>
        ))}
      </div>

      <h5
        style={{
          fontWeight: "bold",
          fontSize: "large",
          paddingLeft: "1.2vw",
          marginTop: "3vh",
        }}
      >
        Featuring {currUser?.username}
      </h5>
      <div className="albums-grid">
        {featurePlaylist.slice(0, 5).map((playlist, index) => (
          <div
            className="album-item"
            key={index}
            onClick={() => {
              if (playlist.playlistid) {
                navigate(`/playlistpage/${playlist.playlistid.toString()}`);
              }
            }}
          >
            <img
              src={"http://localhost:8888/files/" + playlist.playlistimg}
              alt={""}
            />
            <div className="album-info">
              <h4>{playlist.playlisttitle}</h4>
              <h5 style={{ fontWeight: "lighter", fontSize: "small" }}>
                {playlist.playlistdesc}
              </h5>
            </div>
          </div>
        ))}
      </div>
      <br />
      <ManageFooter />
    </div>
  );
};

export default VerifiedArtistPage;
