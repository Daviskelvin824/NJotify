import React, { useEffect, useRef, useState } from "react";
import useAuthWithLoad from "../../hooks/useAuthWIthLoad";
import { useNavigate, useParams } from "react-router-dom";
import TopBar from "../../components/home/TopBar";
import "../../styles/home/ProfilePage.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { Playlist } from "../../model/Playlist";
import { getuserplaylist } from "../api-calls/home/getUserPlaylist";
import { addprofileimage } from "../api-calls/auth/addprofileimage";
import { getuserbyusername } from "../api-calls/auth/getuserbyemail";
import { User } from "../../model/User";
import { FFM } from "../../model/FFM";
import { getFFM } from "../api-calls/auth/getFFM";
import { followperson } from "../api-calls/auth/followperson";
import { validateuserfollowing } from "../api-calls/auth/validateuserfollowing";
import { unfollowperson } from "../api-calls/auth/unfollowperson";
type Props = {};

const ProfilePage = (props: Props) => {
  const { user, loading } = useAuthWithLoad();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [profileImg, setProfileImg] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File>();
  const [playlist, setPlaylist] = useState<Playlist[]>([]);
  const { username } = useParams();
  const [currUser, setcurrUser] = useState<User>();
  const [FFM, setFFM] = useState<FFM>();
  const [userFollowingId, setuserFollowingId] = useState<boolean>(false);

  const handleIconClick = () => {
    if (user?.username === currUser?.username) {
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    }
  };

  const fetchUser = async () => {
    if (username) {
      const response = await getuserbyusername(username);
      setcurrUser(response);
    }
  };

  const addProfilePage = async (profileimg: File) => {
    if (currUser?.email) {
      await addprofileimage(currUser.email, profileimg);
      window.location.reload();
    }
  };
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImg(reader.result as string);
        setSelectedFile(file);
        void addProfilePage(file);
      };
      reader.readAsDataURL(file);

      console.log("Selected file:", file);
    }
  };

  const fetchUserPlaylist = async () => {
    if (currUser?.userid) {
      const response = await getuserplaylist(currUser?.userid);
      setPlaylist(response);
    }
  };

  const fetchFFM = async () => {
    if (currUser?.userid) {
      const response = await getFFM(currUser.userid);
      setFFM(response);
      console.log(FFM);
    }
  };

  useEffect(() => {
    if (loading) return;
    if (!user) navigate("/login");
    void fetchUser();
  }, [loading, user, navigate]);

  useEffect(() => {
    if (currUser?.isartist && user?.isartist) {
      if (currUser.username !== user.username) {
        navigate(`/verifiedartist/${currUser.username}`);
      }
    }
    if (currUser?.isartist && !user?.isartist) {
      navigate(`/verifiedartist/${currUser.username}`);
    }

    if (currUser?.userid) {
      void fetchUserPlaylist();
      void fetchFFM();
      void fetchUserFollowing();
    }
  }, [currUser, userFollowingId]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const fetchUserFollowing = async () => {
    if (currUser?.userid && user?.userid) {
      const response = await validateuserfollowing(
        currUser.userid,
        user.userid
      );
      setuserFollowingId(response);
      console.log(response);
    }
  };

  const handleFollowBtn = async () => {
    if (currUser?.userid && user?.userid) {
      await followperson(currUser.userid, user.userid);
      setuserFollowingId(true);
    }
  };

  const handleUnFollowBtn = async () => {
    if (currUser?.userid && user?.userid) {
      await unfollowperson(currUser.userid, user.userid);
      setuserFollowingId(false);
    }
  };

  return (
    <div className="profile-container">
      <div className="topbar">
        <TopBar />
      </div>
      <div className="head-container">
        <div className="profile-icon" onClick={handleIconClick}>
          {currUser?.profilepageimage ? (
            <img
              src={"http://localhost:8888/files/" + currUser.profilepageimage}
              alt="Profile Preview"
              className="profile-img-preview"
            />
          ) : (
            <FontAwesomeIcon icon={faUser} className="icon" />
          )}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
        </div>
        <div className="text-container">
          <h5 style={{ fontWeight: "normal" }}>Profile</h5>
          <h1 style={{ fontSize: "3rem" }}>{currUser?.username}</h1>
          <p style={{ fontWeight: "lighter", fontSize: "small" }}>
            {playlist && playlist.length > 0 ? playlist.length : "0"} Public
            Playlists .{" "}
            {FFM && FFM.followeruser.length > 0 ? FFM.followeruser.length : "0"}{" "}
            Followers .{" "}
            {FFM && FFM.followinguser.length > 0
              ? FFM.followinguser.length
              : "0"}{" "}
            Following
          </p>
        </div>
      </div>
      {user?.email !== currUser?.email ? (
        userFollowingId ? (
          <div className="follow-container" onClick={handleUnFollowBtn}>
            <h5>UnFollow</h5>
          </div>
        ) : (
          <div className="follow-container" onClick={handleFollowBtn}>
            <h5>Follow</h5>
          </div>
        )
      ) : (
        <></>
      )}
      <div className="show-more">
        <h3>Public Playlist</h3>
        <h5
          onClick={() =>
            navigate(`/showmore/playlist?userId=${currUser?.userid}`)
          }
        >
          Show More
        </h5>
      </div>
      <div className="albums-grid">
        {playlist && playlist.length > 0 ? (
          playlist.map((playlist, index) => (
            <div
              className="album-item"
              key={index}
              onClick={() => {
                if (playlist.playlistid) {
                  navigate(`/playlistpage/${playlist.playlistid.toString()}`);
                }
              }}
            >
              <img
                src={"http://localhost:8888/files/" + playlist.playlistimg}
                alt=""
              />
              <div className="album-info">
                <h4>{playlist.playlisttitle}</h4>
                <h5>Made by {currUser?.username}</h5>
              </div>
            </div>
          ))
        ) : (
          <>
            {" "}
            <h5 style={{ color: "grey", fontWeight: "lighter" }}>Empty</h5>
          </>
        )}
      </div>

      <div className="show-more">
        <h3>Following</h3>
        <h5
          onClick={() =>
            navigate(`/showmore/following?userId=${currUser?.userid}`)
          }
        >
          Show More
        </h5>
      </div>
      <div className="profile-grid">
        {FFM && FFM.followinguser.length > 0 ? (
          FFM.followinguser.map((item, idx) => (
            <div
              key={idx}
              className="profile-item"
              onClick={() =>
                (window.location.href = `/profilepage/${item.username}`)
              }
            >
              <img
                src={
                  "http://localhost:8888/files/" + item.profilepageimage ?? ""
                }
                alt=""
              />
              <div className="txt">
                <h4>{item.username}</h4>
                <h5>Profile</h5>
              </div>
            </div>
          ))
        ) : (
          <>
            {" "}
            <h5 style={{ color: "grey", fontWeight: "lighter" }}>Empty</h5>
          </>
        )}
      </div>

      <div className="show-more">
        <h3>Follower</h3>
        <h5
          onClick={() =>
            navigate(`/showmore/follower?userId=${currUser?.userid}`)
          }
        >
          Show More
        </h5>
      </div>
      <div className="profile-grid">
        {FFM && FFM.followeruser.length > 0 ? (
          FFM.followeruser.map((item, idx) => (
            <div
              key={idx}
              className="profile-item"
              onClick={() =>
                (window.location.href = `/profilepage/${item.username}`)
              }
            >
              <img
                src={
                  "http://localhost:8888/files/" + item.profilepageimage ?? ""
                }
                alt=""
              />
              <div className="txt">
                <h4>{item.username}</h4>
                <h5>Profile</h5>
              </div>
            </div>
          ))
        ) : (
          <>
            {" "}
            <h5 style={{ color: "grey", fontWeight: "lighter" }}>Empty</h5>
          </>
        )}
      </div>
      <div className="show-more">
        <h3>Mutual Following</h3>
      </div>
      <div className="profile-grid">
        {FFM && FFM.mutualfollowinguser.length > 0 ? (
          FFM.mutualfollowinguser.map((item, idx) => (
            <div
              key={idx}
              className="profile-item"
              onClick={() =>
                (window.location.href = `/profilepage/${item.username}`)
              }
            >
              <img
                src={
                  "http://localhost:8888/files/" + item.profilepageimage ?? ""
                }
                alt=""
              />
              <div className="txt">
                <h4>{item.username}</h4>
                <h5>Profile</h5>
              </div>
            </div>
          ))
        ) : (
          <>
            {" "}
            <h5 style={{ color: "grey", fontWeight: "lighter" }}>Empty</h5>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
