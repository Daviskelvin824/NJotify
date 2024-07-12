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

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <Navigate to="/home" /> }, // Redirect root to /register
      { path: "/register", element: <Register /> },
      { path: "/login", element: <Login /> },
      { path: "/find-account", element: <FindAccount /> },
      { path: "/forgot-password", element: <ForgotPassword /> },
      { path: "/activateaccount", element: <AccountVerif /> },
      { path: "/create-music", element: <CreateMusic /> },
      { path: "/manage-account", element: <ManageAccount /> },
      { path: "/home", element: <Home /> },
      { path: "/edit-profile", element: <EditProfile /> },
      { path: "/get-verified", element: <GetVerified /> },
      { path: "/admin", element: <AdminPage /> },
      { path: "/yourpost", element: <YourPost /> },
      { path: "/albumpage/:id", element: <AlbumPage /> },
      { path: "/trackpage/:index/:id", element: <TrackPage /> },
    ],
  },
]);