import "../../styles/home/Home.scss";

import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import TopBar from "../../components/home/TopBar";
import useAuthWithLoad from "../../hooks/useAuthWIthLoad";

const Home = () => {
  const { user, loading } = useAuthWithLoad();
  console.log(user);
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) {
      return;
    }
    if (!user) {
      navigate("/login");
    }
    if (user?.email === "TPAWEB241") {
      navigate("/admin");
    }
  }, [navigate, user, loading]);

  if (loading) {
    return <></>;
  }

  return (
    <div className="home-container">
      <TopBar />

      <div>
        <img
          src="http://localhost:8888/files/S__2514947.jpg"
          alt=""
          style={{ width: 100 }}
        />

        <AudioRecorder />
      </div>
    </div>
  );
};

const AudioRecorder: React.FC = () => {
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [transcription, setTranscription] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const startRecording = () => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.ondataavailable = (event) => {
          setAudioBlob(event.data);
        };
        mediaRecorder.start();
        setTimeout(() => {
          mediaRecorder.stop();
        }, 5000); // Record for 5 seconds
      })
      .catch((error) => {
        console.error("Error accessing microphone:", error);
      });
  };

  const uploadAudio = () => {
    if (audioBlob) {
      const formData = new FormData();
      formData.append("file", audioBlob, "audio.flac");
      fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Transcription:", data);
          setTranscription(data.transcription); // Assuming 'data.transcription' contains the transcription result
        })
        .catch((error) => {
          console.error("Error uploading audio:", error);
        });
    }
  };

  const playAudio = () => {
    if (audioBlob && audioRef.current) {
      const audioURL = URL.createObjectURL(audioBlob);
      audioRef.current.src = audioURL;
      audioRef.current.play();
    }
  };

  return (
    <div>
      <button onClick={startRecording}>Start Recording</button>
      <button onClick={uploadAudio} disabled={!audioBlob}>
        Upload Audio
      </button>
      <button onClick={playAudio} disabled={!audioBlob}>
        Play Audio
      </button>
      <audio ref={audioRef} controls style={{ display: "none" }} />
      {transcription && (
        <div>
          <h3>Transcription Result:</h3>
          <p>{transcription}</p>
        </div>
      )}
    </div>
  );
};

export default Home;
