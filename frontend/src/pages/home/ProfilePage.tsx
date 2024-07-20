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
import { getuserbyemail } from "../api-calls/auth/getuserbyemail";
import { User } from "../../model/User";
import { FFM } from "../../model/FFM";
import { getFFM } from "../api-calls/auth/getFFM";
type Props = {};

const ProfilePage = (props: Props) => {
  const { user, loading } = useAuthWithLoad();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [profileImg, setProfileImg] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File>();
  const [playlist, setPlaylist] = useState<Playlist[]>([]);
  const { email } = useParams();
  const [currUser, setcurrUser] = useState<User>();
  const [FFM, setFFM] = useState<FFM>();

  const handleIconClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const fetchUser = async () => {
    if (email) {
      const response = await getuserbyemail(email);
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
    if (currUser?.isartist && !user?.isartist) {
      navigate(`/verifiedartist/${currUser.email}`);
    }

    if (currUser?.userid) {
      void fetchUserPlaylist();
      void fetchFFM();
    }
  }, [currUser]);
  // verifiedartist = param-> dari username yang artist && userauth yang rolenya bukan artist
  // if (user?.isartist) navigate("/verifiedartist");

  // profile = userauth yang rolenya artist || userauth yang bukan artist

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
        <div className="follow-container">
          <h5>Follow</h5>
        </div>
      ) : (
        <></>
      )}

      <h3 style={{ marginLeft: "2vw", marginTop: "3vw" }}>Public Playlist</h3>
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
          <></>
        )}
      </div>

      <h3 style={{ marginLeft: "2vw", marginTop: "2vw" }}>Following</h3>

      <h3 style={{ marginLeft: "2vw", marginTop: "3vw" }}>Followers</h3>

      <h3 style={{ marginLeft: "2vw", marginTop: "3vw" }}>Mutual Following</h3>
    </div>
  );
};

export default ProfilePage;
