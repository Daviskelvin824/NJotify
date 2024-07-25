import "../../styles/auth/ManageAccount.scss";

import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import useAuthWithLoad from "../../hooks/useAuthWIthLoad";
import { logout } from "../api-calls/auth/logout";

const ManageAccount = () => {
  const { user, loading } = useAuthWithLoad();
  const navigate = useNavigate();
  useEffect(() => {
    if (loading) return;
    if (!user) navigate("/login");
  }, [loading, user, navigate]);

  const handleEditProfile = () => {
    navigate("/edit-profile");
  };

  const handleGetVerified = () => {
    navigate("/get-verified");
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

  return (
    <div className="manage-container">
      <div className="second-container">
        <div className="account-container">
          <h3>Account</h3>
          <div className="btn-container">
            <h4>Order History</h4>
            <FontAwesomeIcon icon={faChevronRight} className="icon" />
          </div>
          <div className="btn-container" onClick={handleEditProfile}>
            <h4>Edit Profile</h4>
            <FontAwesomeIcon icon={faChevronRight} className="icon" />
          </div>
          <div className="btn-container" onClick={handleGetVerified}>
            <h4>Get Verified</h4>
            <FontAwesomeIcon icon={faChevronRight} className="icon" />
          </div>
        </div>
        <br />
        <div className="security-container">
          <h3>Privacy and Security</h3>
          <div className="btn-container">
            <h4>Change Password</h4>
            <FontAwesomeIcon icon={faChevronRight} className="icon" />
          </div>
          <div
            className="btn-container"
            onClick={() => navigate("/notification")}
          >
            <h4>Notification Settings</h4>
            <FontAwesomeIcon icon={faChevronRight} className="icon" />
          </div>
          <div className="btn-container" onClick={logouts}>
            <h4>Sign Out</h4>
            <FontAwesomeIcon icon={faChevronRight} className="icon" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageAccount;
