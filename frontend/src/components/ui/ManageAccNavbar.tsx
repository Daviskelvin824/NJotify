import "../../styles/components/ManageNavbar.scss";

import { faUserCircle } from "@fortawesome/free-solid-svg-icons/faUserCircle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import logo from "../../assets/njotify_logo.png";
import useAuth from "../../hooks/useAuth";
import type { User } from "../../model/User";
import { logout } from "../../pages/api-calls/auth/logout";
const ManageAccNavbar: React.FC = () => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const user: User | null = useAuth();
  useEffect(() => {
    if (user?.email === "") {
      navigate("/login");
    }
  });
  const handleProfileClick = () => {
    setShowDropdown(!showDropdown);
  };
  const handleManageAccount = () => {
    window.open("/manage-account", "_blank");
  };

  const logouts = (e: React.MouseEvent<HTMLDivElement>) => {
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

  const handleLogo = () => {
    navigate("/home");
  };
  return (
    <div className={"managenavbar-container"}>
      <div className="second-container">
        <div className={"head-container"}>
          <div className="logo-container">
            <img className={"logo"} src={logo} alt="" onClick={handleLogo} />
            <h1 onClick={handleLogo}>NJotify</h1>
          </div>
          <div className="outhead-container" onClick={handleProfileClick}>
            <div className="rounded-icon profile-icon">
              <FontAwesomeIcon icon={faUserCircle} />
            </div>
            <h3>Profile</h3>
          </div>
          {showDropdown && (
            <div className="dropdown-menu">
              <div className="dropdown-item" onClick={handleManageAccount}>
                Manage Account
              </div>
              <div className="dropdown-item" onClick={logouts}>
                Logout
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageAccNavbar;
