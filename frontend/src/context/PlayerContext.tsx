import { createContext, ReactNode, useEffect, useRef, useState } from "react";
import { SingleTrack } from "../model/SingleTrack";
import { User } from "../model/User";
import { Track } from "../model/Track";
import { Album } from "../model/Album";
import useAuth from "../hooks/useAuth";
import { addtrackhistory } from "../pages/api-calls/home/addtrackhistory";
import { addalbumhistory } from "../pages/api-calls/home/addalbumhistory";

interface PlayerContextType {
  audioRef: React.RefObject<HTMLAudioElement>;
  seekBar: React.RefObject<HTMLHRElement>;
  seekVolumeBar: React.RefObject<HTMLHRElement>;
  seekBg: React.RefObject<HTMLDivElement>;
  seekVolume: React.RefObject<HTMLDivElement>;
  queue: TrackContext[];
  setQueue: React.Dispatch<React.SetStateAction<TrackContext[]>>;
  playStatus: boolean;
  setPlayStatus: React.Dispatch<React.SetStateAction<boolean>>;
  showQueueBar: boolean;
  setShowQueueBar: React.Dispatch<React.SetStateAction<boolean>>;
  showSongDetailbar: boolean;
  setShowSongDetailbar: React.Dispatch<React.SetStateAction<boolean>>;
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
  next: () => void;
  seekSong: (e: React.MouseEvent<HTMLHRElement>) => void;
  increaseVol: (e: { nativeEvent: { offsetX: number } }) => void;
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
  queue: [],
  setQueue: () => {
    null;
  },
  playStatus: false,
  setPlayStatus: () => {
    null;
  },
  showQueueBar: false,
  setShowQueueBar: () => null,
  showSongDetailbar: false,
  setShowSongDetailbar: () => null,
  volume: 1,
  time: {
    currentTime: { second: "00", minute: "00" },
    totalTime: { second: "00", minute: "00" },
  },
  setTime: () => {
    null;
  },
  next: () => {
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
});

export type TrackContext = {
  track: SingleTrack;
  album: Album;
  artist: User;
};

const PlayerContextProvider = (props: PlayerContextProviderProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const seekBar = useRef<HTMLHRElement>(null);
  const seekVolumeBar = useRef<HTMLHRElement>(null);
  const seekBg = useRef<HTMLDivElement>(null);
  const seekVolume = useRef<HTMLDivElement>(null);
  const [queue, setQueue] = useState<TrackContext[]>([]);
  const [playStatus, setPlayStatus] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isQueueReady, setIsQueueReady] = useState(false);
  const [isTrackInHistory, setIsTrackInHistory] = useState(false);
  const [isAlbumInHistory, setIsAlbumInHistory] = useState(false);
  const [showQueueBar, setShowQueueBar] = useState(false);
  const [showSongDetailbar, setShowSongDetailbar] = useState(false);
  const user: User | null = useAuth();
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

  const addTracktoHistory = async (trackId: number) => {
    if (user?.userid) {
      await addtrackhistory(user?.userid, trackId);
      console.log("Track added to history:", trackId);
    }
  };

  const addAlbumToHistory = async (albumId: number) => {
    if (user?.userid) {
      await addalbumhistory(user?.userid, albumId);
      console.log("Album added to history:", albumId);
    }
  };

  const play = () => {
    if (audioRef.current) {
      void audioRef.current.play();
      setPlayStatus(true);
      if (!isTrackInHistory && queue[0].track.trackid) {
        addTracktoHistory(queue[0].track.trackid);
        setIsTrackInHistory(true);
      }

      if (!isAlbumInHistory && queue[0].album.albumid) {
        addAlbumToHistory(queue[0].album.albumid);
        setIsAlbumInHistory(true);
      }
    }
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setPlayStatus(false);
    }
  };

  const seekSong = (e: React.MouseEvent<HTMLHRElement>) => {
    if (audioRef.current && seekBg.current) {
      audioRef.current.currentTime =
        (e.nativeEvent.offsetX / seekBg.current.offsetWidth) *
        audioRef.current?.duration;
    }
  };

  const next = async () => {
    if (queue.length > 1) {
      await setQueue([...queue.slice(1)]);
      setIsQueueReady(true);
      setIsTrackInHistory(false);
      setIsAlbumInHistory(false);
    } else {
      setQueue([]);
      setPlayStatus(false);
      setIsTrackInHistory(false);
      setIsAlbumInHistory(false);
    }
  };

  useEffect(() => {
    if (isQueueReady) {
      play();
      setIsQueueReady(false);
    }
  }, [isQueueReady, play]);

  useEffect(() => {
    if (!audioRef.current || !seekBar.current) {
      return;
    }
    const audio = audioRef.current;
    const bar = seekBar.current;
    audio.ontimeupdate = () => {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      bar.style.width = `${(audio.currentTime / audio.duration) * 100}%`;

      if (queue.length === 0) {
        pause();
      }

      setTime((prevTime) => ({
        ...prevTime,
        currentTime: {
          second: padTime(Math.floor(audio.currentTime % 60)),
          minute: padTime(Math.floor(audio.currentTime / 60)),
        },
      }));
    };

    audio.onloadedmetadata = () => {
      setTime((prevTime) => ({
        ...prevTime,
        totalTime: {
          second: padTime(Math.floor(audio.duration % 60)),
          minute: padTime(Math.floor(audio.duration / 60)),
        },
      }));
    };
    audio.onended = () => {
      if (queue.length > 0) {
        next();
      }
    };
  }, [audioRef, next]);

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
    queue,
    setQueue,
    playStatus,
    setPlayStatus,
    time,
    setTime,
    volume,
    play,
    showQueueBar,
    setShowQueueBar,
    showSongDetailbar,
    setShowSongDetailbar,
    pause,
    seekSong,
    increaseVol,
    next,
  };
  console.log(queue);
  return (
    <PlayerContext.Provider value={contextValue}>
      {props.children}
      <audio
        ref={audioRef}
        src={"http://localhost:8888/files/" + queue[0]?.track.filepaths ?? ""}
        preload="auto"
      ></audio>
    </PlayerContext.Provider>
  );
};

export default PlayerContextProvider;
