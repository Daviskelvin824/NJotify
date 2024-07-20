import "../../styles/home/YourPost.scss";

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import verifyLogo from "../../assets/verified.png";
import TopBar from "../../components/home/TopBar";
import useAuthWithLoad from "../../hooks/useAuthWIthLoad";
import type { Album } from "../../model/Album";
import type { User } from "../../model/User";
import { getalbumbyartist } from "../api-calls/home/getalbumbyartist";
const YourPost = () => {
  const { user, loading } = useAuthWithLoad();
  const navigate = useNavigate();
  const [albums, setalbums] = useState<Album[]>([]);

  const getAlbum = async () => {
    if (user?.userid) {
      const response = await getalbumbyartist(user.userid);
      console.log(response);
      setalbums(response);
      console.log(response);
    }
  };

  useEffect(() => {
    if (loading) return;
    if (!user) navigate("/login");
    void getAlbum();
  }, [user, loading]);

  if (user?.isartist === false) {
    navigate("/home");
  }

  return (
    <div className="post-container">
      <TopBar />
      <div className="banner-container">
        <img
          src={`http://localhost:8888/files/${user?.bannerimage ?? ""}`}
          alt="Banner Image"
          className="banner-img"
        />
      </div>
      <div className="title-container">
        <div className="verified-container">
          <img src={verifyLogo} alt="" />
          <h5>Verified Artist</h5>
        </div>
        <h1 className="name">Hi, {user?.username}</h1>
      </div>

      <div className="body-container">
        <h4>Discography</h4>
        <div className="album-grid">
          <div
            className="album-grid-item plus-sign"
            onClick={() => {
              navigate("/create-music");
            }}
          >
            <span>+</span>
          </div>
          {albums && albums.length > 0 ? (
            albums.map((album, index) => (
              <div
                className="album-grid-item"
                key={index}
                onClick={() => {
                  if (album.albumid) {
                    navigate(`/albumpage/${album.albumid.toString()}`);
                  }
                }}
              >
                <img
                  src={"http://localhost:8888/files/" + album.imagepath}
                  alt={album.albumname}
                />
                <div className="album-info">
                  <h3>{album.albumname}</h3>
                  <p>
                    {new Date(album.createdat).getFullYear()}. {album.albumtype}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
};

export default YourPost;
