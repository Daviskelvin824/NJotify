import { createBrowserRouter, Navigate } from "react-router-dom";

import App from "../App";
import AccountVerif from "../pages/auth/AccountVerif";
import AdminPage from "../pages/auth/AdminPage";
import EditProfile from "../pages/auth/EditProfile";
import FindAccount from "../pages/auth/FindAccount";
import ForgotPassword from "../pages/auth/ForgotPassword";
import GetVerified from "../pages/auth/GetVerified";
import Login from "../pages/auth/Login";
import ManageAccount from "../pages/auth/ManageAccount";
import Register from "../pages/auth/Register";
import AlbumPage from "../pages/home/AlbumPage";
import CreateMusic from "../pages/home/CreateMusic";
import Home from "../pages/home/Home";
import TrackPage from "../pages/home/TrackPage";
import YourPost from "../pages/home/YourPost";
import PlaylistPage from "../pages/home/PlaylistPage";
import ProfilePage from "../pages/home/ProfilePage";
import VerifiedArtistPage from "../pages/home/VerifiedArtistPage";
import SearchPage from "../pages/home/SearchPage";
import ShowMorePage from "../pages/home/ShowMorePage";
import NotificationPage from "../pages/auth/NotificationPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <Navigate to="/home" /> },
      { path: "/*", element: <Home /> },
      { path: "/register", element: <Register /> },
      { path: "/login", element: <Login /> },
      { path: "/find-account", element: <FindAccount /> },
      { path: "/forgot-password", element: <ForgotPassword /> },
      { path: "/activateaccount", element: <AccountVerif /> },
      { path: "/create-music", element: <CreateMusic /> },
      { path: "/manage-account", element: <ManageAccount /> },
      { path: "/notification", element: <NotificationPage /> },
      { path: "/home", element: <Home /> },
      { path: "/edit-profile", element: <EditProfile /> },
      { path: "/get-verified", element: <GetVerified /> },
      { path: "/admin", element: <AdminPage /> },
      { path: "/yourpost", element: <YourPost /> },
      { path: "/albumpage/:id", element: <AlbumPage /> },
      { path: "/trackpage/:index/:id", element: <TrackPage /> },
      { path: "/playlistpage/:id", element: <PlaylistPage /> },
      { path: "/profilepage/:username", element: <ProfilePage /> },
      { path: "/verifiedartist/:username", element: <VerifiedArtistPage /> },
      { path: "/searchpage", element: <SearchPage /> },
      { path: "/showmore/:category", element: <ShowMorePage /> },
    ],
  },
]);
