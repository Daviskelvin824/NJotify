import React, { useEffect, useState } from "react";
import useAuthWithLoad from "../../hooks/useAuthWIthLoad";
import { useNavigate } from "react-router-dom";
import "../../styles/auth/NotificationPage.scss";
import {
  faChevronLeft,
  faEnvelope,
  faMobileScreenButton,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { setusernotification } from "../api-calls/auth/setusernotification";

const NotificationPage = () => {
  const { user, loading } = useAuthWithLoad();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [artistEmail, setartistEmail] = useState(false);
  const [artistPush, setartistPush] = useState(false);
  const [followerEmail, setfollowerEmail] = useState(false);
  const [followerPush, setfollowerPush] = useState(false);
  useEffect(() => {
    if (loading) return;
    if (!user) navigate("/login");
    if (user?.artistnotification === "both") {
      setartistEmail(true);
      setartistPush(true);
    } else if (user?.artistnotification === "email") {
      setartistEmail(true);
      setartistPush(false);
    } else if (user?.artistnotification === "push") {
      setartistEmail(false);
      setartistPush(true);
    }

    if (user?.followernotification === "both") {
      setfollowerEmail(true);
      setfollowerPush(true);
    } else if (user?.followernotification === "email") {
      setfollowerEmail(true);
      setfollowerPush(false);
    } else if (user?.followernotification === "push") {
      setfollowerEmail(false);
      setfollowerPush(true);
    }
    console.log(user);
  }, [navigate, user, loading]);

  const handleBackBtn = () => {
    navigate("/manage-account");
  };

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const submit = async () => {
      const response = await setusernotification(
        artistEmail,
        artistPush,
        followerEmail,
        followerPush
      );
      if (response === -1) setErrorMessage("Failed due to Internal Error");
      else {
        setErrorMessage("Success");
        setIsSuccess(true);
      }
    };
    void submit();
  };

  return (
    <div className="notif-container">
      <div className="second-container">
        <div className="body-container">
          <div className="rounded-icon" onClick={handleBackBtn}>
            <FontAwesomeIcon icon={faChevronLeft} />
          </div>
          <div className="title-container">
            <h1>Notification settings</h1>
            <h5>
              Pick the notifications you want to get via push or email. These
              preferences only apply to push and email.
            </h5>
          </div>
          <div className="icon">
            <div className="email-icon">
              <FontAwesomeIcon icon={faEnvelope} />
              <h5>Email</h5>
            </div>
            <div className="push-icon">
              <FontAwesomeIcon icon={faMobileScreenButton} />
              <h5>Push</h5>
            </div>
          </div>

          <div className="content-container">
            <div className="head-content">
              <h5>Music & Artist Recommendations</h5>
              <h5>
                Update from music and new releases from artists you follow
              </h5>
            </div>
            <div className="check-content">
              <input
                type="checkbox"
                checked={artistEmail}
                onChange={(e) => setartistEmail(e.target.checked)}
              />
              <input
                type="checkbox"
                checked={artistPush}
                onChange={(e) => setartistPush(e.target.checked)}
              />
            </div>
          </div>
          <br />
          <div className="content-container">
            <div className="head-content">
              <h5>Followers</h5>
              <h5>Update from new followers</h5>
            </div>
            <div className="check-content">
              <input
                type="checkbox"
                checked={followerEmail}
                onChange={(e) => setfollowerEmail(e.target.checked)}
              />
              <input
                type="checkbox"
                checked={followerPush}
                onChange={(e) => setfollowerPush(e.target.checked)}
              />
            </div>
          </div>

          {errorMessage && (
            <div
              className="error-message"
              style={{ color: isSuccess ? "green" : "red" }}
            >
              {errorMessage}
            </div>
          )}
          <div className="btn-container">
            <a href="/manage-account">Cancel</a>
            <button onClick={handleSubmit}>Save</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationPage;
