import React, { useState } from "react";
import "../../styles/components/PlaylistPopup.scss";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { createplaylist } from "../../pages/api-calls/home/createplaylist";
import useAuth from "../../hooks/useAuth";
import { User } from "../../model/User";

interface PlaylistPopupProps {
  onClose: () => void;
  onAdd: (playlistName: string) => void;
}

const PlaylistPopup: React.FC<PlaylistPopupProps> = ({ onClose, onAdd }) => {
  const [playlistName, setPlaylistName] = useState("");
  const [playlistDesc, setPlaylistDesc] = useState("");
  const [playlistImage, setPlaylistImage] = useState<File | null>(null);
  const [playlistImgURL, setPlaylistImgURL] = useState<string>("");
  const [errormessage, seterrormessage] = useState("");
  const user: User | null = useAuth();

  const addPlaylist = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const handleAdd = async () => {
      onAdd(playlistName);

      if (
        playlistName === "" ||
        playlistDesc === "" ||
        playlistImage === null
      ) {
        seterrormessage("All Field must be Filled !");
        return;
      }

      if (user?.userid) {
        const response = await createplaylist(
          user?.userid,
          playlistName,
          playlistImage,
          playlistDesc
        );
        if (response === -1)
          seterrormessage("Create Failed due to Server Error");
        else {
          setPlaylistName("");
          setPlaylistImage(null);
          setPlaylistImgURL("");
          setPlaylistDesc("");
          onClose();
        }
      }
    };
    void handleAdd();
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPlaylistImage(file);
      const imageUrl = URL.createObjectURL(file);
      setPlaylistImgURL(imageUrl);
    }
  };

  return (
    <div className="playlist-popup-overlay">
      <div className="playlist-popup">
        <h1>Add New Playlist</h1>
        <div className="form-group">
          <label htmlFor="images" className="drop-container" id="dropcontainer">
            {playlistImage ? (
              <img src={playlistImgURL} alt="Album" className="album-image" />
            ) : (
              <>
                <FontAwesomeIcon icon={faCamera} className="icon-camera" />
                <span className="drop-title">Playlist Image</span>
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
            <input
              type="text"
              value={playlistName}
              onChange={(e) => setPlaylistName(e.target.value)}
              placeholder="Playlist Title"
            />
            <textarea
              rows={4}
              cols={50}
              placeholder="Playlist Description"
              value={playlistDesc}
              onChange={(e) => {
                setPlaylistDesc(e.target.value);
              }}
            ></textarea>
          </div>
        </div>

        <div className="popup-buttons">
          {errormessage && <div className="error-message">{errormessage}</div>}
          <a onClick={onClose}>Cancel</a>
          <button onClick={addPlaylist}>Add</button>
        </div>
      </div>
    </div>
  );
};

export default PlaylistPopup;
