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
  console.log("items = ", items);
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
          <div className="top-part">
            <div className="top-result-container">
              <h2>Top Results</h2>
              <div></div>
            </div>
          </div>

          <div className="middle-part">
            <h2 style={{ marginBottom: "1.5vw" }}>Artists</h2>
            {artists && artists.length > 0 ? (
              <div className="artist-container">
                {artistToShow.map((artist) => (
                  <div
                    key={artist.userid}
                    className="artist-item"
                    onClick={() => navigate(`/profilepage/${artist.username}`)}
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
                    onClick={() => navigate(`/albumpage/${album.albumid}`)}
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
