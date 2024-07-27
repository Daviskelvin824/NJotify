import React, { useContext, useEffect, useState } from "react";
import { SearchHistory } from "../../model/SearchHistory";
import useAuth from "../../hooks/useAuth";
import { User } from "../../model/User";
import { useNavigate } from "react-router-dom";
import { getsearchhistory } from "../../pages/api-calls/home/getsearchhistory";
import { Album } from "../../model/Album";
import { Playlist } from "../../model/Playlist";
import { SingleTrack } from "../../model/SingleTrack";
import { getalbumbyalbumid } from "../../pages/api-calls/home/getAlbumByAlbumId";
import { getartist } from "../../pages/api-calls/auth/getartist";
import { getplaylistbyid } from "../../pages/api-calls/home/getplaylistbyid";
import { gettrackbytrackid } from "../../pages/api-calls/home/gettrackbytrackid";
import "../../styles/components/RecentSearch.scss";
import { PlayerContext } from "../../context/PlayerContext";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
type Props = {
  called: boolean;
};
type SearchType = User | Album | SingleTrack | Playlist;
const RecentSearch = (props: Props) => {
  const [recentSearch, setrecentSearch] = useState<SearchHistory[]>([]);
  const { showQueueBar, showSongDetailbar } = useContext(PlayerContext);
  const [detailedSearchResults, setDetailedSearchResults] = useState<
    {
      result: SearchType;
      imagepath?: string;
      artistName?: string;
    }[]
  >([]);
  const user: User | null = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (user?.email === "") {
      navigate("/login");
    }
  }, [navigate, user]);

  useEffect(() => {
    const fetchSearchHistory = async () => {
      if (user) {
        try {
          const response = await getsearchhistory(user.userid ?? 0);
          setrecentSearch(response.slice(-5).reverse());
        } catch (error) {
          console.error("Error fetching search history:", error);
        }
      }
    };

    void fetchSearchHistory();
  }, [props]);

  useEffect(() => {
    const fetchDetails = async () => {
      const detailsPromises = recentSearch.map(async (search) => {
        let result: SearchType | null = null;
        let imagepath: string | undefined;
        let artistName: string | undefined;
        switch (search.resulttype) {
          case "Album":
            result = (await getalbumbyalbumid(search.resultid)) as Album;
            imagepath = result?.imagepath;
            const artistAlbum = await getartist(result.artistid ?? 0);
            artistName = artistAlbum?.username;
            break;
          case "Artist":
            result = (await getartist(search.resultid)) as User;
            imagepath = result?.bannerimage ?? "";
            break;
          case "Playlist":
            result = (await getplaylistbyid(search.resultid)) as Playlist;
            imagepath = result?.playlistimg;
            const creator = await getartist(result.creatorid ?? 0);
            artistName = creator?.username;
            break;
          case "Song":
            result = (await gettrackbytrackid(search.resultid)) as SingleTrack;
            if (result) {
              const album = await getalbumbyalbumid(result.albumid);
              imagepath = album?.imagepath;
              const artist = await getartist(album.artistid ?? 0);
              artistName = artist?.username;
            }
            break;
          default:
            return null;
        }
        return result ? { result, imagepath, artistName } : null;
      });
      const details = await Promise.all(detailsPromises);
      const filteredDetails = details.filter(
        (
          detail
          //@ts-ignore
        ): detail is {
          result: SearchType;
          imagepath?: string;
          artistName?: string;
        } => detail !== null
      );
      //@ts-ignore
      setDetailedSearchResults(filteredDetails);
    };

    if (recentSearch.length > 0) {
      fetchDetails();
    }
  }, [recentSearch]);

  const resultsToShow =
    showQueueBar || showSongDetailbar
      ? detailedSearchResults.slice(0, 3)
      : detailedSearchResults.slice(0, 5);

  console.log("result to show = ", resultsToShow);

  const handleTrackClick = (trackId: number, albumId: number) => {
    navigate(`/trackpage/${trackId}/${albumId}`);
  };

  const handleAlbumClick = (albumId: number) => {
    console.log(albumId);
    navigate(`/albumpage/${albumId}`);
  };

  const handlePlaylistClick = (playlsitId: number) => {
    navigate(`/playlistpage/${playlsitId}`);
  };

  const handleArtistClick = (artistName: string) => {
    navigate(`/profilepage/${artistName}`);
  };

  return (
    <div className="recentsearch-container">
      {resultsToShow.length > 0 ? (
        resultsToShow.map((detail, index) => {
          const searchItem = detail.result;
          const imagePath = detail.imagepath;
          const artistName = detail.artistName;
          if ("tracktitles" in searchItem) {
            return (
              <div
                key={recentSearch[index].searchhistoryid}
                className="recent-item"
                onClick={() =>
                  handleTrackClick(searchItem.trackid ?? 0, searchItem.albumid)
                }
              >
                <img
                  src={`http://localhost:8888/files/${imagePath}`}
                  alt={searchItem.tracktitles}
                />
                <div>{searchItem.tracktitles.slice(0, 20)}</div>
                <p>Song by {artistName}</p>
              </div>
            );
          } else if ("albumname" in searchItem) {
            return (
              <div
                key={recentSearch[index].searchhistoryid}
                className="recent-item"
                onClick={() => handleAlbumClick(searchItem.albumid ?? 0)}
              >
                <img
                  src={`http://localhost:8888/files/${imagePath}`}
                  alt={searchItem.albumname}
                />
                <div>{searchItem.albumname.slice(0, 20)}</div>
                <p>Album by {artistName}</p>
              </div>
            );
          } else if ("playlisttitle" in searchItem) {
            return (
              <div
                key={recentSearch[index].searchhistoryid}
                className="recent-item"
                onClick={() => handlePlaylistClick(searchItem.playlistid)}
              >
                <img
                  src={`http://localhost:8888/files/${imagePath}`}
                  alt={searchItem.playlisttitle.slice(0, 20)}
                />
                <div>{searchItem.playlisttitle}</div>
                <p>Playlist by {artistName}</p>
              </div>
            );
          } else if ("username" in searchItem) {
            return (
              <div
                key={recentSearch[index].searchhistoryid}
                className="recent-item"
                onClick={() => handleArtistClick(searchItem.username)}
              >
                <img
                  src={`http://localhost:8888/files/${imagePath}`}
                  alt={searchItem.username}
                  style={{ borderRadius: "50%" }}
                />
                <div>{searchItem.username.slice(0, 20)}</div>
                <p>Artist</p>
              </div>
            );
          }
          return null;
        })
      ) : (
        <h5 style={{ color: "grey", fontWeight: "lighter" }}>Empty</h5>
      )}
    </div>
  );
};

export default RecentSearch;
