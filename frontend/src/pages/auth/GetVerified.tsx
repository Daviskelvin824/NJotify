import "../../styles/auth/GetVerified.scss";

import { faArrowLeft, faCamera } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import useAuth from "../../hooks/useAuth";
import type { User } from "../../model/User";
import { getverified } from "../api-calls/auth/getverified";
const GetVerified = () => {
  const navigate = useNavigate();
  const user: User | null = useAuth();
  const [userRole, setUserRole] = useState<boolean>(false);
  const [userBanner, setUserBanner] = useState<string>("");
  const [AboutMe, setAboutMe] = useState("");
  const [bannerImage, setBannerImage] = useState<string | null>(null);
  const [bannerImagePath, setBannerImagePath] = useState<File | null>(null);
  const [refreshData, setRefreshData] = useState(false);
  const handleBackBtn = () => {
    navigate("/manage-account");
  };

  useEffect(() => {
    if (user?.email === "") {
      navigate("/login");
    }
    console.log(user);
    if (user?.isartist) {
      setUserRole(user.isartist);
    }
    if (user?.bannerimage) {
      setUserBanner(user.bannerimage);
    }
  }, [navigate, user, refreshData]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setBannerImage(URL.createObjectURL(file));
      setBannerImagePath(file);
    }
  };

  const submit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const handleSubmitForm = async () => {
      if (user?.email && bannerImagePath) {
        await getverified(user.email, bannerImagePath, AboutMe);
        setRefreshData(!refreshData);
      }
    };
    void handleSubmitForm();
  };

  return (
    <div className="edit-container">
      <div className="second-container">
        <div className="rounded-icon" onClick={handleBackBtn}>
          <FontAwesomeIcon icon={faArrowLeft} />
        </div>
        <h1>Get Verified</h1>
        <div className="third-container">
          <label htmlFor="images" className="drop-container" id="dropcontainer">
            {bannerImage ? (
              <img src={bannerImage} alt="Album" className="album-image" />
            ) : (
              <>
                <FontAwesomeIcon icon={faCamera} className="icon-camera" />
                <span className="drop-title">Upload Banner Image</span>
              </>
            )}
            <input
              type="file"
              id="images"
              accept="image/*"
              required
              className="upload-file"
              onChange={handleImageUpload}
            />
          </label>
          <div className="input-container">
            <label htmlFor="">Current Role</label>
            <h5>{userRole ? "Artist" : "Listener"}</h5>
            <h5>About You</h5>
            <textarea
              rows={4}
              cols={50}
              value={AboutMe}
              onChange={(e) => {
                setAboutMe(e.target.value);
              }}
              // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
              readOnly={userBanner !== null && userBanner !== ""}
            ></textarea>
            <div className="btn-container">
              <a href="/manage-account">Cancel</a>
              <button
                onClick={submit}
                // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                disabled={userBanner !== null && userBanner !== ""}
              >
                Get Verified
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetVerified;
