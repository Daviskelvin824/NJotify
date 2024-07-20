import "../../styles/auth/AdminPage.scss";

import { faCheck, faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getusertoverify } from "../api-calls/auth/getusertoverify";
import { handleacceptartists } from "../api-calls/auth/handleacceptartist";
import { handlerejectartists } from "../api-calls/auth/handlerejectartist";
import useAuthWithLoad from "../../hooks/useAuthWIthLoad";
const AdminPage = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuthWithLoad();
  const [userArray, setUserArray] = useState<any[]>([]);
  const [followingCount, setFollowingCount] = useState<number[]>([]);
  const [followerCount, setFollowerCount] = useState<number[]>([]);
  const [refreshData, setRefreshData] = useState(false);

  const getUserToVerify = async () => {
    const response = await getusertoverify();
    setUserArray(response.userarray);
    setFollowingCount(response.followingcount);
    setFollowerCount(response.followercount);
  };

  useEffect(() => {
    if (loading) return;
    if (!user) navigate("/login");
    void getUserToVerify();
  }, [user, refreshData, loading]);

  if (user?.email !== "TPAWEB241") {
    navigate("/home");
  }

  const handleAcceptArtist = async (user: any) => {
    const response = await handleacceptartists(
      user.Email,
      user.BannerImage,
      user.AboutMe
    );
    console.log(response);
    setRefreshData(!refreshData);
  };

  const handleRejectArtist = async (user: any) => {
    const response = await handlerejectartists(
      user.Email,
      user.BannerImage,
      user.AboutMe
    );
    console.log(response);
    setRefreshData(!refreshData);
  };
  console.log(userArray);
  return (
    <div className="admin-container">
      <div className="second-container">
        <h1>Admin Page</h1>
        <h5 style={{ paddingBottom: "1vw" }}>Verify Artist</h5>
        {userArray &&
          userArray.map((user, index) => (
            <div className="third-container" key={index}>
              <div
                className="head-container"
                onClick={() => navigate(`/profilepage/${user.Email}`)}
              >
                {user.ProfilePageImage ? (
                  <img
                    src={`http://localhost:8888/files/${user.ProfilePageImage}`}
                    alt=""
                    className="img-con"
                  />
                ) : (
                  <h1 className="img-con">
                    {user.Username ? user.Username.charAt(0) : "?"}
                  </h1>
                )}
                <div className="txt-container">
                  <h4>{user.Username || "Unknown User"}</h4>
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
