/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { createContext, useEffect, useRef, useState } from "react";

interface PlayerContextType {
  audioRef: React.RefObject<HTMLAudioElement>;
  seekBar: React.RefObject<HTMLHRElement>;
  seekVolumeBar: React.RefObject<HTMLHRElement>;
  seekBg: React.RefObject<HTMLDivElement>;
  seekVolume: React.RefObject<HTMLDivElement>;
  track: string;
  setTrack: React.Dispatch<React.SetStateAction<string>>;
  playStatus: boolean;
  setPlayStatus: React.Dispatch<React.SetStateAction<boolean>>;
  volume: number;
  time: {
    currentTime: {
      second: string;
      minute: string;
    };
    totalTime: {
      second: string;
      minute: string;
    };
  };
  setTime: React.Dispatch<
    React.SetStateAction<{
      currentTime: {
        second: string;
        minute: string;
      };
      totalTime: {
        second: string;
        minute: string;
      };
    }>
  >;
  play: () => void;
  pause: () => void;
  seekSong: (e: React.MouseEvent<HTMLHRElement>) => void;
  increaseVol: (e: { nativeEvent: { offsetX: number } }) => void;
  playWithId: (track: string) => void;
  albumname: string;
  setalbumname: React.Dispatch<React.SetStateAction<string>>;
  artistname: string;
  setartistname: React.Dispatch<React.SetStateAction<string>>;
  albumimage: string;
  setalbumimage: React.Dispatch<React.SetStateAction<string>>;
}

interface PlayerContextProviderProps {
  children: ReactNode;
}

export const PlayerContext = createContext<PlayerContextType>({
  audioRef: { current: null },
  seekBar: { current: null },
  seekVolumeBar: { current: null },
  seekBg: { current: null },
  seekVolume: { current: null },
  track: "",
  setTrack: () => {
    null;
  },
  playStatus: false,
  setPlayStatus: () => {
    null;
  },
  volume: 1,
  time: {
    currentTime: { second: "00", minute: "00" },
    totalTime: { second: "00", minute: "00" },
  },
  setTime: () => {
    null;
  },
  play: () => {
    null;
  },
  pause: () => {
    null;
  },
  seekSong: () => {
    null;
  },
  increaseVol: () => {
    null;
  },
  playWithId: () => {
    null;
  },
  albumname: "",
  setalbumname: () => {
    null;
  },
  artistname: "",
  setartistname: () => {
    null;
  },
  albumimage: "",
  setalbumimage: () => {
    null;
  },
});

const PlayerContextProvider = (props: PlayerContextProviderProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const seekBar = useRef<HTMLHRElement>(null);
  const seekVolumeBar = useRef<HTMLHRElement>(null);
  const seekBg = useRef<HTMLDivElement>(null);
  const seekVolume = useRef<HTMLDivElement>(null);
  const [track, setTrack] = useState("");
  const [playStatus, setPlayStatus] = useState(false);
  const [volume, setVolume] = useState(1);
  const [albumname, setalbumname] = useState("");
  const [artistname, setartistname] = useState("");
  const [albumimage, setalbumimage] = useState("");
  const padTime = (time: number) => {
    return time.toString().padStart(2, "0");
  };
  const [time, setTime] = useState({
    currentTime: {
      second: padTime(0),
      minute: padTime(0),
    },
    totalTime: {
      second: padTime(0),
      minute: padTime(0),
    },
  });

  const play = () => {
    if (audioRef.current) {
      void audioRef.current.play();
      setPlayStatus(true);
    }
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setPlayStatus(false);
    }
  };

  const playWithId = async (track: string) => {
    const cleanedPath = track.replace(/"/g, "");
    // eslint-disable-next-line @typescript-eslint/await-thenable, @typescript-eslint/no-confusing-void-expression
    await setTrack(cleanedPath);
    await audioRef.current?.play();
    setPlayStatus(true);
  };

  const seekSong = (e: React.MouseEvent<HTMLHRElement>) => {
    audioRef.current.currentTime =
      (e.nativeEvent.offsetX / seekBg.current.offsetWidth) *
      audioRef.current?.duration;
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.ontimeupdate = () => {
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        seekBar.current.style.width = `${(audioRef.current?.currentTime / audioRef.current?.duration) * 100}%`;

        setTime((prevTime) => ({
          ...prevTime,
          currentTime: {
            second: padTime(Math.floor(audioRef.current.currentTime % 60)),
            minute: padTime(Math.floor(audioRef.current.currentTime / 60)),
          },
        }));
      };

      audioRef.current.onloadedmetadata = () => {
        setTime((prevTime) => ({
          ...prevTime,
          totalTime: {
            second: padTime(Math.floor(audioRef.current.duration % 60)),
            minute: padTime(Math.floor(audioRef.current.duration / 60)),
          },
        }));
      };
    }
  }, [audioRef]);

  const increaseVol = (e: { nativeEvent: { offsetX: number } }) => {
    if (audioRef.current && seekVolume.current) {
      const newVolume = e.nativeEvent.offsetX / seekVolume.current.offsetWidth;
      audioRef.current.volume = newVolume;
      setVolume(newVolume);
      if (seekVolumeBar.current) {
        seekVolumeBar.current.style.width = `${(newVolume * 100).toString()}%`;
      }
      console.log("New Volume:", newVolume);
    }
  };

  useEffect(() => {
    if (seekVolumeBar.current) {
      seekVolumeBar.current.style.width = `${(volume * 100).toString()}%`;
    }
  }, [volume]);

  const contextValue: PlayerContextType = {
    audioRef,
    seekBar,
    seekBg,
    seekVolume,
    seekVolumeBar,
    track,
    setTrack,
    playStatus,
    setPlayStatus,
    time,
    setTime,
    volume,
    play,
    pause,
    seekSong,
    increaseVol,
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    playWithId,
    albumimage,
    setalbumimage,
    albumname,
    setalbumname,
    artistname,
    setartistname,
  };

  return (
    <PlayerContext.Provider value={contextValue}>
      {props.children}
    </PlayerContext.Provider>
  );
};

export default PlayerContextProvider;
