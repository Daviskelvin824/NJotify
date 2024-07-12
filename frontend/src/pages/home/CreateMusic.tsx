/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import "../../styles/home/CreateMusic.scss";

import {
  faCamera,
  faMinus,
  faMusic,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import TopBar from "../../components/home/TopBar";
import useAuth from "../../hooks/useAuth";
import type { User } from "../../model/User";
import { createalbum } from "../api-calls/home/createalbum";
import { createtrack } from "../api-calls/home/createtrack";

const CreateMusic = () => {
  const [trackCount, setTrackCount] = useState(4); // Initial number of tracks
  const [albumImage, setAlbumImage] = useState<File | null>(null);
  const [albumImageUrl, setAlbumImageUrl] = useState<string>("");
  const [trackNames, setTrackNames] = useState<string[]>([]);
  const [trackPaths, setTrackPaths] = useState<File[]>([]);
  const [albumTitle, setalbumTitle] = useState("");
  const [albumType, setAlbumType] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();
  const user: User | null = useAuth();
  const incrementTrackCount = () => {
    setTrackCount((prevCount) => prevCount + 1);
  };

  const decrementTrackCount = () => {
    if (trackCount > 1) {
      setTrackCount((prevCount) => prevCount - 1);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAlbumImage(file);
      const imageUrl = URL.createObjectURL(file);
      setAlbumImageUrl(imageUrl);
    }
  };

  const handleTrackUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const fileName = file.name.replace(/\.[^/.]+$/, "");

      // Update trackNames and trackPaths based on index
      setTrackNames((prevNames) => {
        const updatedNames = [...prevNames];
        updatedNames[index] = fileName;
        return updatedNames;
      });

      setTrackPaths((prevPaths) => {
        const updatedPaths = [...prevPaths];
        updatedPaths[index] = file;
        return updatedPaths;
      });
    }
  };

  useEffect(() => {
    console.log(user);
    if (user?.email === "") {
      navigate("/login");
    }
  }, [navigate, user]);

  const trackCounts = Object.keys(trackNames).length;

  useEffect(() => {
    if (trackCounts <= 3 && albumType !== "Single") {
      setAlbumType("Single");
    } else if (trackCounts >= 4 && trackCounts <= 6 && albumType !== "Ep") {
      setAlbumType("Ep");
    } else if (trackCounts > 6 && albumType !== "Album") {
      setAlbumType("Album");
    }
  }, [albumType, trackCounts]);

  const handlePost = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const handlePostMusic = async () => {
      if (albumTitle == "") {
        setErrorMessage("Album Title cannot be Empty!");
        return;
      } else if (albumImage == null) {
        setErrorMessage("Album Image cannot be empty!");
        return;
      } else if (trackCounts < 1) {
        setErrorMessage("Must upload atleast 1 song!");
        return;
      } else {
        const albumResponse = await createalbum(
          albumTitle,
          albumImage,
          albumType,
        );
        if (albumResponse == -1)
          setErrorMessage("Create Album fail due to Server Error");
        const trackResponse = await createtrack(
          albumResponse,
          trackNames,
          trackPaths,
        );
        if (trackResponse == -1)
          setErrorMessage("Create Album fail due to Server Error");
        else {
          setErrorMessage("");
          window.location.reload();
        }
      }
    };

    void handlePostMusic();
  };

  return (
    <div className="first-container">
      <TopBar />
      <div className="second-container">
        <h1>Create New Music</h1>
        <div className="form-container">
          <div className="form-group">
            <label
              htmlFor="images"
              className="drop-container"
              id="dropcontainer"
            >
              {albumImage ? (
                <img src={albumImageUrl} alt="Album" className="album-image" />
              ) : (
                <>
                  <FontAwesomeIcon icon={faCamera} className="icon-camera" />
                  <span className="drop-title">
                    Upload Collection <br />
                    Main Image
                  </span>
                </>
              )}
              <input
                type="file"
                id="images"
                accept="image/*"
                required
                className="upload-file"
                onChange={handleImageUpload}
              />
            </label>
          </div>
          <div className="form-group-right">
            <div className="form-group">
              <label htmlFor="albumTitle">Album Title:</label>
              <div className="title-container">
                <input
                  type="text"
                  value={albumTitle}
                  onChange={(e) => {
                    setalbumTitle(e.target.value);
                  }}
                  id="albumTitle"
                  name="albumTitle"
                  placeholder="Title"
                />
                <select
                  name="albumType"
                  className="albumType"
                  value={albumType}
                  onChange={(e) => {
                    setAlbumType(e.target.value);
                  }}
                >
                  {trackCounts <= 3 && <option value="Single">Single</option>}
                  {trackCounts >= 4 && trackCounts <= 6 && (
                    <option value="Ep">Ep</option>
                  )}
                  {trackCounts > 6 && <option value="Album">Album</option>}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Tracks:</label>
            </div>
            <div className="tracks-container">
              {[...Array(trackCount)].map((_, index) => (
                <div key={index} className="track">
                  <label
                    htmlFor={`track${index + 1}`}
                  >{`#${index + 1}.`}</label>
                  <input
                    className="input-track"
                    type="text"
                    id={`track${index + 1}`}
                    name={`track${index + 1}`}
                    value={trackNames[index] || ""}
                    readOnly
                  />
                  <label
                    htmlFor={`music${index}`}
                    className="music-container"
                    id="dropcontainer"
                  >
                    <span className="music-head">Upload MP3</span>
                    <FontAwesomeIcon icon={faMusic} className="music-icon" />
                    <input
                      type="file"
                      id={`music${index}`}
                      accept="audio/mpeg"
                      required
                      className="music-input"
                      onChange={(e) => {
                        handleTrackUpload(e, index);
                      }}
                    />
                  </label>
                </div>
              ))}
            </div>
            <div className="tracks-btn-container">
              {errorMessage && (
                <div className="error-message">{errorMessage}</div>
              )}
              <button
                className="tracks-btn"
                onClick={decrementTrackCount}
                disabled={trackCount <= 4}
              >
                <FontAwesomeIcon icon={faMinus} />
              </button>
              <button className="tracks-btn" onClick={incrementTrackCount}>
                <FontAwesomeIcon icon={faPlus} />
              </button>
            </div>
            <div className="postmusicbtn-container">
              <a href="">Cancel</a>
              <button onClick={handlePost}>Post Music</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateMusic;
