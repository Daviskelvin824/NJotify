import "../../styles/home/Home.scss";

import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import TopBar from "../../components/home/TopBar";
import useAuthWithLoad from "../../hooks/useAuthWIthLoad";
import { SingleTrack } from "../../model/SingleTrack";
import { getrecenttrack } from "../api-calls/home/getrecenttrack";
import { getalbumbyalbumid } from "../api-calls/home/getAlbumByAlbumId";
import { Album } from "../../model/Album";
import { faCirclePause, faCirclePlay } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { PlayerContext } from "../../context/PlayerContext";
import { User } from "../../model/User";
import { getartist } from "../api-calls/auth/getartist";
import InfiniteScrolling from "../../components/ui/InfiniteScrolling";

const Home = () => {
  const { user, loading } = useAuthWithLoad();
  const [recentTrack, setrecentTrack] = useState<SingleTrack[]>([]);
  const [recentTrackAlbum, setrecentTrackAlbum] = useState<Album[]>([]);
  const [recentTrackArtist, setrecentTrackArtist] = useState<User[]>([]);
  const [recommendedAlbum, setrecommendedAlbum] = useState<Album[]>([]);
  const [uniqueAlbum, setuniqueAlbum] = useState<Album[]>([]);
  const { playStatus, play, pause, setQueue, showQueueBar, showSongDetailbar } =
    useContext(PlayerContext);
  const [isQueueReady, setIsQueueReady] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) {
      return;
    }
    if (!user) {
      navigate("/login");
    }
    if (user?.email === "TPAWEB241") {
      navigate("/admin");
    }
  }, [navigate, user, loading]);

  const fetchRecentTrack = async () => {
    if (user?.userid) {
      const response = await getrecenttrack(user.userid);
      console.log("recent tracks = ", response);
      setrecentTrack(response.slice(0, 8));
      const albumIds = response.map((detail) => detail.albumid);
      console.log("albumids", albumIds);
      await fetchRecentTrackAlbum(albumIds);
    }
  };

  const fetchRecentTrackAlbum = async (albumIds: number[]) => {
    const fetchAlbums = await Promise.all(
      albumIds.map(async (albumId) => {
        const album = await getalbumbyalbumid(albumId);
        return album;
      })
    );
    console.log("recent album = ", fetchAlbums);
    setrecentTrackAlbum(fetchAlbums);
    const artistId = fetchAlbums
      .map((detail) => detail.artistid)
      .filter((id): id is number => id !== undefined);
    void fetchRecentTrackArtist(artistId);
    const uniqueAlbumsMap = new Map<number, Album>();
    fetchAlbums.forEach((album) => {
      if (album.albumid) {
        if (!uniqueAlbumsMap.has(album.albumid)) {
          uniqueAlbumsMap.set(album.albumid, album);
        }
      }
    });
    const uniqueAlbums = Array.from(uniqueAlbumsMap.values());
    setuniqueAlbum(uniqueAlbums);
  };

  const fetchRecentTrackArtist = async (artistIds: number[]) => {
    const fetchArtist = await Promise.all(
      artistIds.map(async (artistId) => {
        const artist = await getartist(artistId);
        return artist;
      })
    );
    setrecentTrackArtist(fetchArtist);
  };

  useEffect(() => {
    if (user) {
      void fetchRecentTrack();
    }
  }, [user]);

  const groupedTracks = [];
  for (let i = 0; i < recentTrack.length; i += 4) {
    groupedTracks.push(recentTrack.slice(i, i + 4));
  }

  const handlePlayClick = (
    track: SingleTrack,
    artist: User,
    currAlbum: Album
  ) => {
    console.log("PLAYINGGG");
    if (track && artist && currAlbum) {
      const trackContext = {
        track: track,
        album: currAlbum,
        artist,
      };
      console.log("track context = ", trackContext);

      setQueue([trackContext]);
      setIsQueueReady(true);
    }
  };

  useEffect(() => {
    if (isQueueReady) {
      play();
      setIsQueueReady(false);
    }
  }, [isQueueReady, play]);

  const handlePauseClick = () => {
    pause();
  };

  const numberOfAlbumsToShow = showQueueBar || showSongDetailbar ? 3 : 4;
  const displayedAlbums = uniqueAlbum.slice(0, numberOfAlbumsToShow);

  return (
    <div className="home-container">
      <TopBar />
      <div className="recenttrack-container">
        {recentTrack &&
        recentTrackAlbum &&
        recentTrackAlbum.length > 0 &&
        recentTrack.length > 0 ? (
          groupedTracks.map((group, groupIndex) => (
            <div key={groupIndex} className="row">
              {group.map((item, idx) => {
                const albumIndex = groupIndex * 4 + idx;
                return (
                  <div key={idx} className="item-container">
                    <div
                      className="item"
                      onClick={() =>
                        navigate(`/trackpage/${item.trackid}/${item.albumid}`)
                      }
                    >
                      <div className="left">
                        {recentTrackAlbum[albumIndex] && (
                          <img
                            src={
                              `http://localhost:8888/files/${recentTrackAlbum[albumIndex].imagepath}` ??
                              ""
                            }
                            alt=""
                          />
                        )}
                        <h5>
                          {item.tracktitles.length > 20
                            ? `${item.tracktitles.slice(0, 20)}...`
                            : item.tracktitles}
                        </h5>
                      </div>
                      {playStatus ? (
                        <div
                          className="icon-play"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePauseClick();
                          }}
                          style={{ cursor: "pointer" }}
                        >
                          <FontAwesomeIcon
                            icon={faCirclePause}
                            className="icon-play"
                          />
                        </div>
                      ) : (
                        <div
                          className="icon-play"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePlayClick(
                              item,
                              recentTrackArtist[albumIndex],
                              recentTrackAlbum[albumIndex]
                            );
                          }}
                          style={{ cursor: "pointer" }}
                        >
                          <FontAwesomeIcon
                            icon={faCirclePlay}
                            className="icon-play"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ))
        ) : (
          <>
            <h5 style={{ color: "grey", fontWeight: "lighter" }}>Empty</h5>
          </>
        )}
      </div>

      <div className="recenttxt">
        <h2>Recently Played</h2>
        <h5 onClick={() => navigate(`/showmore/recentalbum`)}>Show all</h5>
      </div>
      <div
        className={`recentplay-container ${
          showQueueBar || showSongDetailbar ? "with-right-bar" : ""
        }`}
      >
        {displayedAlbums &&
        displayedAlbums.length > 0 &&
        uniqueAlbum &&
        uniqueAlbum.length > 0 &&
        recentTrackArtist &&
        recentTrackArtist.length > 0 ? (
          displayedAlbums.map((album, idx) => {
            const artist = recentTrackArtist.find(
              (artist) => artist.userid === album.artistid
            );
            return (
              <div
                key={idx}
                className="recentalbum-container"
                onClick={() => navigate(`/albumpage/${album.albumid}`)}
              >
                <img
                  src={`http://localhost:8888/files/${album.imagepath}` ?? ""}
                  alt=""
                />
                <h4>{album.albumname.slice(0, 25)}</h4>
                {artist && <p>{artist.username}</p>}
              </div>
            );
          })
        ) : (
          <>
            {" "}
            <h5 style={{ color: "grey", fontWeight: "lighter" }}>Empty</h5>
          </>
        )}
      </div>

      <div className="recenttxt">
        <h2>Recommended For You</h2>
        <h5 onClick={() => navigate(`/showmore/album`)}>Show all</h5>
      </div>
      <div className="recommended-container">
        <InfiniteScrolling category={"album"} />
      </div>
    </div>
  );
};

export default Home;
