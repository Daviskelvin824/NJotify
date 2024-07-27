import React, { useContext, useEffect, useRef, useState } from "react";
import TopBar from "../../components/home/TopBar";
import useAuthWithLoad from "../../hooks/useAuthWIthLoad";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/home/SearchPage.scss";
import browseimg from "../../assets/browseallimg.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { Album } from "../../model/Album";
import { Playlist } from "../../model/Playlist";
import { SingleTrack } from "../../model/SingleTrack";
import { User } from "../../model/User";
import { sendquery } from "../api-calls/home/sendquery";
import { PlayerContext } from "../../context/PlayerContext";
import { getartist } from "../api-calls/auth/getartist";
import { getalbumbyalbumid } from "../api-calls/home/getAlbumByAlbumId";
import { getmostplayedtrackbyartist } from "../api-calls/home/getmostplayedtrackartist";
import { getpopulartrackbyalbum } from "../api-calls/home/getpopulartrackbyalbum";
import { getpopulartrackbyplaylist } from "../api-calls/home/getmostpopulartrackbyplaylist";
import { addtosearchhistory } from "../api-calls/home/addtosearchhistory";
import RecentSearch from "../../components/home/RecentSearch";

type SearchType = User | Album | SingleTrack | Playlist;

const SearchPage = () => {
  const { user, loading } = useAuthWithLoad();
  const [items, setItems] = useState<SearchType[]>([]);
  const navigate = useNavigate();
  const [inputValue, setinputValue] = useState("");
  const { showQueueBar, showSongDetailbar } = useContext(PlayerContext);
  useEffect(() => {
    if (loading) {
      return;
    }
    if (!user) {
      navigate("/login");
    }
  }, [navigate, user, loading]);

  const debounce = (func: (e: React.ChangeEvent<HTMLInputElement>) => void) => {
    let timer: ReturnType<typeof setTimeout>;

    return (e: React.ChangeEvent<HTMLInputElement>) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func(e);
      }, 500);
    };
  };

  const sendQuery = async (query: string) => {
    try {
      const response = await sendquery(query);
      setItems(response);
      console.log("Search result:", response);
    } catch (error) {
      console.log(error);
    }
  };

  const handleInputChange = debounce(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setinputValue(value);
      sendQuery(value);
    }
  );
  const artists = items.filter(
    (item): item is User => "profilepageimage" in item
  );
  const artistToShow =
    showQueueBar || showSongDetailbar
      ? artists.slice(0, 3)
      : artists.slice(0, 5);
  const albums = items.filter((item): item is Album => "albumtype" in item);
  const albumToShow =
    showQueueBar || showSongDetailbar ? albums.slice(0, 3) : albums.slice(0, 5);

  const addToSearchHistory = async (resultId: number, resultType: string) => {
    try {
      await addtosearchhistory(user?.userid ?? 0, resultId, resultType);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="search-container">
      <div className="topbar-container">
        <TopBar />
        <div className="searchbar">
          <FontAwesomeIcon icon={faSearch} className="search-icon" />
          <input
            type="text"
            // value={inputValue}
            onChange={handleInputChange}
            placeholder="What do you want to play?"
          />
        </div>
      </div>
      {/* <AudioRecorder /> */}
      {inputValue.length > 0 ? (
        <div className="search-result-container">
          <TopResult data={items[0]} allData={items} />

          <div className="middle-part">
            <h2 style={{ marginBottom: "1.5vw" }}>Artists</h2>
            {artists && artists.length > 0 ? (
              <div className="artist-container">
                {artistToShow.map((artist) => (
                  <div
                    key={artist.userid}
                    className="artist-item"
                    onClick={() => {
                      navigate(`/profilepage/${artist.username}`);
                      addToSearchHistory(artist.userid ?? 0, "Artist");
                    }}
                  >
                    {artist.bannerimage ? (
                      <img
                        src={`http://localhost:8888/files/${artist.bannerimage}`}
                        alt={""}
                      />
                    ) : (
                      <>
                        <h1 className="img-con">{artist.username.charAt(0)}</h1>
                      </>
                    )}
                    <div>
                      <h4>{artist.username.slice(0, 15)}</h4>
                      <p>Artist</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                <h5 style={{ color: "grey", fontWeight: "lighter" }}>Empty</h5>
              </>
            )}
          </div>

          <div className="collection-part">
            <h2 style={{ marginBottom: "1.5vw" }}>Collections</h2>
            {albums && albums.length > 0 ? (
              <div className="collection-container">
                {albumToShow.map((album) => (
                  <div
                    key={album.albumid}
                    className="collection-item"
                    onClick={() => {
                      navigate(`/albumpage/${album.albumid}`);
                      addToSearchHistory(album.albumid ?? 0, "Album");
                    }}
                  >
                    {album.imagepath ? (
                      <img
                        src={`http://localhost:8888/files/${album.imagepath}`}
                        alt={""}
                      />
                    ) : (
                      <></>
                    )}
                    <div>
                      <h4>{album.albumname.slice(0, 15)}</h4>
                      <p>
                        {new Date(album.createdat).getFullYear()}
                        {" . "}
                        {album.albumtype}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                <h5 style={{ color: "grey", fontWeight: "lighter" }}>Empty</h5>
              </>
            )}
          </div>
        </div>
      ) : (
        <div>
          <div className="recent-search">
            <h2>Recent Searches</h2>
            <RecentSearch called={true} />
          </div>
          <div className="browse-all">
            <h2>Browse All</h2>
            <Link to={"/showmore/track"}>
              <img src={browseimg} alt="" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

interface TopResultData {
  link: string;
  imagepath: string;
  id: number;
  title: string;
  secondtitle: string;
  thirdtitle: string;
}

const newItemDisplayData = () => {
  return {
    imagepath: "",
    link: "",
    id: 0,
    title: "",
    secondtitle: "",
    thirdtitle: "",
  };
};

const TopResult = ({
  data,
  allData,
}: {
  data?: SearchType;
  allData?: SearchType[];
}) => {
  const [item, setItem] = useState<TopResultData>(newItemDisplayData());
  const [track, setTrack] = useState<SingleTrack[]>([]);
  const [trackAlbum, settrackAlbum] = useState<Album[]>([]);
  const [trackArtist, settrackArtist] = useState<User[]>([]);
  const [trackalbumduration, settrackalbumduration] = useState([]);
  const { user, loading } = useAuthWithLoad();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      if (!data) {
        return;
      }
      const newItem = newItemDisplayData();

      try {
        if ("albumtype" in data) {
          newItem.link = "/albumpage/" + data.albumid?.toString();
          newItem.id = data.albumid ?? 0;
          newItem.imagepath = data.imagepath;
          newItem.title = data.albumname;
          const artist = await getartist(data.artistid ?? 0);
          newItem.secondtitle = "Album";
          newItem.thirdtitle = artist.username;
          const popularTrack = await getpopulartrackbyalbum(data.albumid ?? 0);
          setTrack(popularTrack.slice(0, 5));
          const trackAlbums = await Promise.all(
            popularTrack.slice(0, 5).map(async (track) => {
              const album = await getalbumbyalbumid(track.albumid ?? 0);
              return album;
            })
          );
          const trackArtists = await Promise.all(
            trackAlbums.map(async (album) => {
              const artist = await getartist(album.artistid ?? 0);
              return artist;
            })
          );
          settrackAlbum(trackAlbums);
          settrackArtist(trackArtists);
        } else if ("creatorid" in data) {
          newItem.link = "/playlistpage/" + data.playlistid.toString();
          newItem.id = data.playlistid;
          newItem.imagepath = data.playlistimg;
          newItem.title = data.playlisttitle;
          const creator = await getartist(data.creatorid ?? 0);
          newItem.secondtitle = "Playlist";
          newItem.thirdtitle = creator.username;
          const popularTrack = await getpopulartrackbyplaylist(
            data.playlistid ?? 0
          );
          setTrack(popularTrack.slice(0, 5));
          const trackAlbums = await Promise.all(
            popularTrack.slice(0, 5).map(async (track) => {
              const album = await getalbumbyalbumid(track.albumid ?? 0);
              return album;
            })
          );
          const trackArtists = await Promise.all(
            trackAlbums.map(async (album) => {
              const artist = await getartist(album.artistid ?? 0);
              return artist;
            })
          );
          settrackAlbum(trackAlbums);
          settrackArtist(trackArtists);
        } else if ("profilepageimage" in data) {
          newItem.link = "/profilepage/" + data.username.toString();
          newItem.id = data.userid ?? 0;
          newItem.imagepath = data.bannerimage ?? "";
          newItem.title = data.username;
          newItem.secondtitle = "Artist";
          const popularTrack = await getmostplayedtrackbyartist(
            data.userid ?? 0
          );
          setTrack(popularTrack.slice(0, 5));
          const trackAlbums = await Promise.all(
            popularTrack.slice(0, 5).map(async (track) => {
              const album = await getalbumbyalbumid(track.albumid ?? 0);
              return album;
            })
          );
          const trackArtists = await Promise.all(
            trackAlbums.map(async (album) => {
              const artist = await getartist(album.artistid ?? 0);
              return artist;
            })
          );
          settrackAlbum(trackAlbums);
          settrackArtist(trackArtists);
        } else if ("tracktitles" in data) {
          newItem.link = "/trackpage/" + data.trackid + "/" + data.albumid;
          newItem.id = data.albumid;
          const album = await getalbumbyalbumid(data.albumid ?? 0);
          newItem.imagepath = album.imagepath;
          newItem.title =
            data.tracktitles.length > 20
              ? `${data.tracktitles.slice(0, 20)}...`
              : data.tracktitles;

          const artist = await getartist(album.artistid ?? 0);
          newItem.secondtitle = "Song";
          newItem.thirdtitle = artist.username;
          if (allData) {
            const allTracks = allData.filter(
              (item): item is SingleTrack => "tracktitles" in item
            );
            const trackAlbums = await Promise.all(
              allTracks.slice(0, 5).map(async (track) => {
                const album = await getalbumbyalbumid(track.albumid ?? 0);
                return album;
              })
            );
            const trackArtists = await Promise.all(
              trackAlbums.map(async (album) => {
                const artist = await getartist(album.artistid ?? 0);
                return artist;
              })
            );
            setTrack(allTracks.slice(0, 5));
            settrackAlbum(trackAlbums);
            settrackArtist(trackArtists);
          }
        }
      } catch {
        newItem.title = "Error";
        newItem.secondtitle = "Unable to fetch data";
      } finally {
        // setLoadings(false);
        setItem(newItem);
      }
    })();
  }, [data]);

  useEffect(() => {
    const fetchTrackDurations = async () => {
      const durations = [];

      for (const item of track) {
        try {
          const cleanedPath = item.filepaths.replace(/"/g, "");
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
      //@ts-ignore
      settrackalbumduration(durations);
    };
    if (track.length > 0) {
      void fetchTrackDurations();
    }
  }, [track]);

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

  const addToSearchHistory = async (resultId: number, resultType: string) => {
    console.log(resultId, resultType);
    try {
      await addtosearchhistory(user?.userid ?? 0, resultId, resultType);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="top-part">
      <div className="first">
        <h2 style={{ marginBottom: "1vw" }}>Top Results</h2>
        <div className="top-result-container">
          <Link
            to={item.link}
            className="item-container"
            onClick={() => addToSearchHistory(item.id, item.secondtitle)}
          >
            <img
              src={`http://localhost:8888/files/${item.imagepath}` ?? ""}
              alt={item.title}
              style={{
                borderRadius: item.secondtitle === "Artist" ? "50%" : "5px",
              }}
            />
            <h2>{item.title}</h2>
            <p>
              {item.secondtitle}
              {" . "} <span className="thirdtitle">{item.thirdtitle}</span>{" "}
            </p>
          </Link>
        </div>
      </div>

      <div className="second">
        <h2 style={{ marginBottom: "1vw" }}>Songs</h2>
        <div className="songs-container">
          {track && track.length > 0 ? (
            track.map((item, idx) => (
              <div
                key={idx}
                className="song-item"
                onClick={() => {
                  addToSearchHistory(item.trackid ?? 0, "Song");
                  navigate(`/trackpage/${item.trackid}/${item.albumid}`);
                }}
              >
                {trackAlbum && trackAlbum.length > 0 ? (
                  <img
                    src={`http://localhost:8888/files/${trackAlbum[idx]?.imagepath}`}
                    alt=""
                  />
                ) : (
                  <>No image</>
                )}
                <div className="txt">
                  <div>
                    <h5>
                      {item.tracktitles.length > 20
                        ? item.tracktitles.slice(0, 20) + "..."
                        : item.tracktitles}
                    </h5>
                    {trackArtist && trackArtist.length > 0 ? (
                      <p>{trackArtist[idx]?.username}</p>
                    ) : (
                      <>Artist Not Found</>
                    )}
                  </div>
                  <p>
                    {formatTime(Math.round(Number(trackalbumduration[idx])))}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <>
              <h5
                style={{ color: "grey", fontWeight: "lighter", padding: "2vw" }}
              >
                Empty
              </h5>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const AudioRecorder: React.FC = () => {
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [transcription, setTranscription] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const startRecording = () => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.ondataavailable = (event) => {
          setAudioBlob(event.data);
        };
        mediaRecorder.start();
        setTimeout(() => {
          mediaRecorder.stop();
        }, 5000); // Record for 5 seconds
      })
      .catch((error) => {
        console.error("Error accessing microphone:", error);
      });
  };

  const uploadAudio = () => {
    if (audioBlob) {
      const formData = new FormData();
      formData.append("file", audioBlob, "audio.flac");
      fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Transcription:", data);
          setTranscription(data.transcription); // Assuming 'data.transcription' contains the transcription result
        })
        .catch((error) => {
          console.error("Error uploading audio:", error);
        });
    }
  };

  const playAudio = () => {
    if (audioBlob && audioRef.current) {
      const audioURL = URL.createObjectURL(audioBlob);
      audioRef.current.src = audioURL;
      audioRef.current.play();
    }
  };

  return (
    <div>
      <button onClick={startRecording}>Start Recording</button>
      <button onClick={uploadAudio} disabled={!audioBlob}>
        Upload Audio
      </button>
      <button onClick={playAudio} disabled={!audioBlob}>
        Play Audio
      </button>
      <audio ref={audioRef} controls style={{ display: "none" }} />
      {transcription && (
        <div>
          <h3>Transcription Result:</h3>
          <p>{transcription}</p>
        </div>
      )}
    </div>
  );
};
export default SearchPage;
