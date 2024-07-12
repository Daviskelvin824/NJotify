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
import { useNavigate } from "react-router-dom";

import useAuth from "../../hooks/useAuth";
import type { User } from "../../model/User";

const LeftBar = () => {
  const [isArtist, setIsArtist] = useState<boolean | undefined>(false);
  const navigate = useNavigate();
  const user: User | null = useAuth();
  useEffect(() => {
    if (user?.email === "") {
      navigate("/login");
    }
    console.log(user);
    setIsArtist(user?.isartist);
  }, [navigate, user]);

  return (
    <div className={"main-container"}>
      <div className="head-container">
        <button
          className={"home-btn"}
          onClick={() => {
            navigate("/home");
          }}
        >
          <FontAwesomeIcon icon={faHome} /> <h3>Home</h3>
        </button>
        <button className={"home-btn"}>
          <FontAwesomeIcon icon={faSearch} /> <h3>Search</h3>
        </button>
        {isArtist && (
          <button
            className={"home-btn"}
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
            <FontAwesomeIcon icon={faPlus} className="icon" />
            <FontAwesomeIcon icon={faArrowRight} className="icon" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeftBar;
