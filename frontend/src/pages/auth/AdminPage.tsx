/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import "../../styles/auth/AdminPage.scss";

import { faCheck, faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import useAuth from "../../hooks/useAuth";
import type { User } from "../../model/User";
import { getusertoverify } from "../api-calls/auth/getusertoverify";
import { handleacceptartists } from "../api-calls/auth/handleacceptartist";
import { handlerejectartists } from "../api-calls/auth/handlerejectartist";
const AdminPage = () => {
  const navigate = useNavigate();
  const user: User | null = useAuth();
  const [userArray, setUserArray] = useState([]);
  const [followingCount, setFollowingCount] = useState([]);
  const [followerCount, setFollowerCount] = useState([]);
  const [refreshData, setRefreshData] = useState(false);

  const getUserToVerify = async () => {
    const response = await getusertoverify();
    console.log(response);
    setUserArray(response.userarray);
    setFollowingCount(response.followingcount);
    setFollowerCount(response.followercount);
  };

  useEffect(() => {
    if (user?.email === "") {
      navigate("/login");
    }
    void getUserToVerify();
  }, [user, refreshData]);

  //@ts-ignore
  if (user.Email !== "TPAWEB241") {
    navigate("/home");
  }

  const handleAcceptArtist = async (user) => {
    const response = await handleacceptartists(
      user.Email,
      user.BannerImage,
      user.AboutMe,
    );
    console.log(response);
    setRefreshData(!refreshData);
  };

  const handleRejectArtist = async (user) => {
    const response = await handlerejectartists(
      user.Email,
      user.BannerImage,
      user.AboutMe,
    );
    console.log(response);
    setRefreshData(!refreshData);
  };

  return (
    <div className="admin-container">
      <div className="second-container">
        <h1>Admin Page</h1>
        <h5 style={{ paddingBottom: "1vw" }}>Verify Artist</h5>
        {userArray.map((user, index) => (
          <div className="third-container" key={index}>
            <div className="head-container">
              {user.ProfilePageImage ? (
                <img src={user.ProfilePageImage} alt="" />
              ) : (
                <h1>{user.Username.charAt(0)}</h1>
              )}
              <div className="txt-container">
                <h4>{user.Username}</h4>
                <h5 style={{ fontWeight: "lighter" }}>
                  {followerCount[index]} Follower .{" "}
                  <span>{followingCount[index]} Following</span>
                </h5>
              </div>
            </div>

            <div className="btn-container">
              <div
                className="rounded-icon"
                style={{ color: "red" }}
                onClick={() => handleRejectArtist(user)}
              >
                <FontAwesomeIcon icon={faClose} />
              </div>
              <div
                className="rounded-icon"
                style={{ color: "green" }}
                onClick={() => handleAcceptArtist(user)}
              >
                <FontAwesomeIcon icon={faCheck} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPage;
