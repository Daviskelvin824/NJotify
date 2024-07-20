import "../../styles/components/TopBar.scss";

import {
  faArrowLeft,
  faArrowRight,
  faBell,
  faUserCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import useAuth from "../../hooks/useAuth";
import type { User } from "../../model/User";
import { logout } from "../../pages/api-calls/auth/logout";

const TopBar = () => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const user: User | null = useAuth();
  const handleProfileClick = () => {
    setShowDropdown(!showDropdown);
  };

  const handleManageAccount = () => {
    window.open("/manage-account", "_blank");
  };

  const handleProfileClicked = () => {
    window.open(`/profilepage/${user?.email}`, "_blank");
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const handlelogout = async () => {
      const response = await logout();
      console.log(response);
      if (response === "Successfully logged out") {
        navigate("/login");
      }
    };
    void handlelogout();
  };

  useEffect(() => {
    if (user?.email === "") {
      navigate("/login");
    }
  }, [navigate, user]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleForward = () => {
    navigate(1);
  };
  return (
    <div className="top-container">
      <div className="topsecond-container">
        <div className="icon-container">
          <div className="rounded-icon" onClick={handleBack}>
            <FontAwesomeIcon icon={faArrowLeft} />
          </div>
          <div className="rounded-icon" onClick={handleForward}>
            <FontAwesomeIcon icon={faArrowRight} />
          </div>
        </div>
        <div className="icon-container">
          <div className="rounded-icon profile-icon">
            <FontAwesomeIcon icon={faBell} />
          </div>
          <div
            className="rounded-icon profile-icon"
            onClick={handleProfileClick}
          >
            {user?.profilepageimage ? (
              <img
                src={"http://localhost:8888/files/" + user.profilepageimage}
                alt="Profile Preview"
                className="img-review"
              />
            ) : (
              <FontAwesomeIcon icon={faUserCircle} className="icon" />
            )}
          </div>
          {showDropdown && (
            <div className="dropdown-menu">
              <div className="dropdown-item" onClick={handleProfileClicked}>
                Profile
              </div>
              <div className="dropdown-item" onClick={handleManageAccount}>
                Manage Account
              </div>
              <div className="dropdown-item" onClick={submit}>
                Logout
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopBar;
