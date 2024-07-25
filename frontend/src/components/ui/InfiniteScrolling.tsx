import React, { useState, useEffect, useRef, useCallback } from "react";
import { Album } from "../../model/Album";
import axios from "axios";
import "../../styles/components/InfiniteScrolling.scss";
import { Link, useNavigate } from "react-router-dom";
import { User } from "../../model/User";
import { getshowmorealbum } from "../../pages/api-calls/home/getshowmorealbum";
import { getartist } from "../../pages/api-calls/auth/getartist";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { SingleTrack } from "../../model/SingleTrack";
import { Playlist } from "../../model/Playlist";
import { getshowmorerecentalbum } from "../../pages/api-calls/home/getshowmorerecentalbum";
import { getshowmoreplaylist } from "../../pages/api-calls/home/getshowmoreplaylist";
import { getshowmorefollowing } from "../../pages/api-calls/auth/getshowmorefollowing";
import { getshowmorefollower } from "../../pages/api-calls/auth/getshowmorefollower";
import { getshowmoretrack } from "../../pages/api-calls/home/getshowmoretrack";
import { getalbumbyalbumid } from "../../pages/api-calls/home/getAlbumByAlbumId";

type Props = {
  category:
    | "album"
    | "track"
    | "recentalbum"
    | "following"
    | "follower"
    | "playlist";
  userid?: number;
};

type ShowMoreType = User | Album | SingleTrack | Playlist;

const InfiniteScrolling = (props: Props) => {
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<ShowMoreType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(false);

    const fetchItems = async () => {
      try {
        let response: ShowMoreType[] | null;
        switch (props.category) {
          case "album":
            response = await getshowmorealbum(page);
            break;
          case "recentalbum":
            response = await getshowmorerecentalbum(page);
            break;
          case "playlist":
            response = await getshowmoreplaylist(page, props.userid ?? 0);
            break;
          case "following":
            response = await getshowmorefollowing(page, props.userid ?? 0);
            break;
          case "follower":
            response = await getshowmorefollower(page, props.userid ?? 0);
            break;
          case "track":
            response = await getshowmoretrack(page);
            break;
          default:
            response = [];
            break;
        }

        if (response === null) {
          setHasMore(false);
          setLoading(false);
          return;
        }

        const newItems = new Set([...items, ...response]);
        setItems(Array.from(newItems));
        setHasMore(response.length > 0);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setHasMore(false);
        setError(true);
        setLoading(false);
      }
    };

    void fetchItems();
  }, [page, props.category]);

  const lastAlbumElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  return (
    <div className="infinite-container">
      <SkeletonTheme baseColor="#202020" highlightColor="#444">
        {items.map((item, index) => {
          if (items.length === index + 1) {
            return (
              <div
                key={index}
                ref={lastAlbumElementRef}
                className="page-container"
              >
                <ShowMoreItem data={item} />
              </div>
            );
          } else {
            return (
              <div key={index} className="page-container">
                <ShowMoreItem data={item} />
              </div>
            );
          }
        })}

        {loading &&
          [...Array(4)].map((_, i) => (
            <div key={i} className="page-container">
              <ShowMoreItem />
            </div>
          ))}
        {error && (
          <div style={{ marginLeft: "10px", marginTop: "20px" }}>
            Error loading data
          </div>
        )}
      </SkeletonTheme>
    </div>
  );
};

interface ItemDisplayData {
  link: string;
  imagepath: string;
  title: string;
  secondtitle: string;
}

const newItemDisplayData = () => {
  return {
    imagepath: "",
    link: "",
    title: "",
    secondtitle: "",
  };
};

const ShowMoreItem = ({ data }: { data?: ShowMoreType }) => {
  const [loading, setLoading] = useState(true);
  const [item, setItem] = useState<ItemDisplayData>(newItemDisplayData());

  useEffect(() => {
    (async () => {
      if (!data) {
        return;
      }
      const newItem = newItemDisplayData();
      try {
        if ("albumtype" in data) {
          newItem.link = "/albumpage/" + data.albumid?.toString();
          newItem.imagepath = data.imagepath;
          newItem.title = data.albumname;
          const artist = await getartist(data.artistid ?? 0);
          newItem.secondtitle = artist.username;
        } else if ("creatorid" in data) {
          newItem.link = "/playlistpage/" + data.playlistid.toString();
          newItem.imagepath = data.playlistimg;
          newItem.title = data.playlisttitle;
          const creator = await getartist(data.creatorid ?? 0);
          newItem.secondtitle = creator.username;
        } else if ("profilepageimage" in data) {
          newItem.link = "/profilepage/" + data.username.toString();
          newItem.imagepath = data.profilepageimage ?? "";
          newItem.title = data.username;
          {
            data.isartist
              ? (newItem.secondtitle = "Artist")
              : (newItem.secondtitle = "Profile");
          }
        } else if ("tracktitles" in data) {
          newItem.link = "/trackpage/" + data.trackid + "/" + data.albumid;
          const album = await getalbumbyalbumid(data.albumid ?? 0);
          newItem.imagepath = album.imagepath;
          newItem.title =
            data.tracktitles.length > 17
              ? `${data.tracktitles.slice(0, 17)}...`
              : data.tracktitles;

          const artist = await getartist(album.artistid ?? 0);
          newItem.secondtitle = "By " + artist.username;
        }
      } catch {
        newItem.title = "Error";
        newItem.secondtitle = "Unable to fetch data";
      } finally {
        setLoading(false);
        setItem(newItem);
      }
    })();
  }, [data]);

  if (loading) {
    return (
      <div className="skeleton-container">
        <div className="skeleton-item">
          <div className="skeleton-img">
            <Skeleton height={200} width={200} />
          </div>
          <div className="skeleton-title">
            <Skeleton width={200} height={20} />
          </div>
          <div className="skeleton-subtitle">
            <Skeleton width={200} height={15} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <Link to={item.link} className="item-container">
      <img
        src={`http://localhost:8888/files/${item.imagepath}` ?? ""}
        alt=""
        style={{
          borderRadius:
            item.secondtitle === "Profile" || item.secondtitle === "Artist"
              ? "50%"
              : "5px",
        }}
      />
      <h4>{item.title}</h4>
      <p>{item.secondtitle}</p>
    </Link>
  );
};

export default InfiniteScrolling;
