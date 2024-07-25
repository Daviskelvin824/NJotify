import React, { useEffect, useState } from "react";
import TopBar from "../../components/home/TopBar";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import InfiniteScrolling from "../../components/ui/InfiniteScrolling";
import "../../styles/home/ShowmorePage.scss";
import useAuthWithLoad from "../../hooks/useAuthWIthLoad";

const ShowMorePage = () => {
  const { user, loading } = useAuthWithLoad();
  const navigate = useNavigate();
  const { category } = useParams();
  const queryParams = new URLSearchParams(location.search);
  const userId = queryParams.get("userId");
  let subtitle = "";
  if (category === "album") {
    subtitle = "Latest Album";
  } else if (category == "recentalbum") {
    subtitle = "Latest Recent Album";
  } else if (category == "playlist") {
    subtitle = "Latest Playlist";
  } else if (category == "following") {
    subtitle = "All Following";
  } else if (category == "follower") {
    subtitle = "All Follower";
  } else if (category == "track") {
    subtitle = "Latest Track";
  }

  if (
    !category ||
    (category !== "track" &&
      category !== "album" &&
      category !== "recentalbum" &&
      category !== "playlist" &&
      category !== "following" &&
      category !== "follower")
  ) {
    return <p>Invalid Category</p>;
  }

  useEffect(() => {
    if (loading) {
      return;
    }
    if (!user) {
      navigate("/login");
    }
  }, [navigate, user, loading]);

  const capitalizeCategory = (category: string) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  return (
    <div className="showmore-container">
      <TopBar />
      <div className="body-container">
        <h1 className="title">{capitalizeCategory(category)}</h1>
        <h2 className="subtitle">{subtitle}</h2>
        {category === "album" ? (
          <InfiniteScrolling category={category} />
        ) : (
          <InfiniteScrolling category={category} userid={Number(userId)} />
        )}
      </div>
    </div>
  );
};

export default ShowMorePage;
