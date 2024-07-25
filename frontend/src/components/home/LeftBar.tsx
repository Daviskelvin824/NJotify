import "../../styles/components/LeftBar.scss";

import {
  faArrowRight,
  faBookOpen,
  faHome,
  faMusic,
  faPlus,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import useAuth from "../../hooks/useAuth";
import type { User } from "../../model/User";
import PlaylistPopup from "../ui/PlaylistPopup";
import { getuserplaylist } from "../../pages/api-calls/home/getUserPlaylist";
import { Playlist } from "../../model/Playlist";

const LeftBar = () => {
  const [isArtist, setIsArtist] = useState<boolean | undefined>(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [showPopup, setShowPopup] = useState(false);
  const [playlist, setPlaylist] = useState<Playlist[]>([]);
  const [previousLocation, setPreviousLocation] = useState<string | null>(null);

  const user: User | null = useAuth();
  useEffect(() => {
    if (user?.email === "") {
      navigate("/login");
    }
    console.log(user);
    setIsArtist(user?.isartist);
  }, [navigate, user]);

  const handleAddPlaylist = (playlistName: string) => {
    console.log("New playlist added:", playlistName);
  };

  const fetchUserPlaylist = async () => {
    if (user?.userid) {
      const response = await getuserplaylist(user?.userid);
      setPlaylist(response);
    }
  };
  useEffect(() => {
    if (location.pathname.startsWith("/home")) {
      void fetchUserPlaylist();
    }
    // Update previous location
    setPreviousLocation(location.pathname);
  }, [location, previousLocation]);

  useEffect(() => {
    void fetchUserPlaylist();
  }, [user, showPopup]);
  const isActive = (path: string) => location.pathname === path;
  return (
    <div className={"main-container"}>
      <div className="head-container">
        <button
          className={`home-btn ${isActive("/home") ? "active" : ""}`}
          onClick={() => {
            navigate("/home");
          }}
        >
          <FontAwesomeIcon icon={faHome} /> <h3>Home</h3>
        </button>
        <button
          className={`home-btn ${isActive("/searchpage") ? "active" : ""}`}
          onClick={() => navigate("/searchpage")}
        >
          <FontAwesomeIcon icon={faSearch} /> <h3>Search</h3>
        </button>
        {isArtist && (
          <button
            className={`home-btn ${isActive("/yourpost") ? "active" : ""}`}
            onClick={() => {
              navigate("/yourpost");
            }}
          >
            <FontAwesomeIcon icon={faMusic} /> <h3>Your Music</h3>
          </button>
        )}
      </div>

      <div className="body-container">
        <div className="library">
          <div className="yourlib">
            <FontAwesomeIcon icon={faBookOpen} />
            <h3>Your Library</h3>
          </div>

          <div className="rightlib">
            <FontAwesomeIcon
              icon={faPlus}
              className="icon"
              onClick={() => setShowPopup(true)}
            />
            <FontAwesomeIcon icon={faArrowRight} className="icon" />
          </div>
        </div>

        <div className="playlist-container">
          {playlist && playlist.length > 0 ? (
            playlist.map((item, index) => (
              <div
                key={index}
                className="item-container"
                onClick={() => navigate(`/playlistpage/${item.playlistid}`)}
              >
                <img
                  src={`http://localhost:8888/files/${item.playlistimg ?? ""}`}
                  alt=""
                />
                <div className="txt-container">
                  <h5 style={{ fontWeight: "500", fontSize: "0.9em" }}>
                    {item.playlisttitle}
                  </h5>
                  <p style={{ fontWeight: "lighter", fontSize: "small" }}>
                    Playlist by {user?.username}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <></>
          )}
        </div>
      </div>
      {showPopup && (
        <PlaylistPopup
          onClose={() => setShowPopup(false)}
          onAdd={handleAddPlaylist}
        />
      )}
    </div>
  );
};

export default LeftBar;
