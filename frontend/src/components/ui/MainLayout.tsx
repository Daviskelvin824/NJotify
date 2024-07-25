import "../../styles/components/MainLayout.scss";

import { useContext } from "react";
import { useLocation } from "react-router-dom";
import { Outlet } from "react-router-dom";

import { PlayerContext } from "../../context/PlayerContext";
import LeftBar from "../home/LeftBar";
import BottomBar from "./BottomBar";
import Footer from "./Footer";
import ManageAccNavbar from "./ManageAccNavbar";
import ManageFooter from "./ManageFooter";
import Navbar from "./Navbar";
import QueueBar from "./QueueBar";
import SongDetailBar from "./SongDetailBar";

const MainLayout = () => {
  const location = useLocation();
  const { showQueueBar, showSongDetailbar } = useContext(PlayerContext);
  const showNavbarRoutes = [
    "/register",
    "/login",
    "/find-account",
    "/forgot-password",
    "/admin",
  ];
  const showNav = showNavbarRoutes.includes(location.pathname);

  const showFooterRoutes = [
    "/register",
    "/login",
    "/find-account",
    "/forgot-password",
  ];
  const showFoot = showFooterRoutes.includes(location.pathname);

  const hideLeftBar = [
    "/register",
    "/login",
    "/find-account",
    "/forgot-password",
    "/manage-account",
    "/edit-profile",
    "/get-verified",
    "/admin",
    "/notification",
  ];
  const showLeft = !hideLeftBar.includes(location.pathname);

  const showManageNavbar = [
    "/manage-account",
    "/edit-profile",
    "/get-verified",
    "/notification",
  ];
  const showManageNav = showManageNavbar.includes(location.pathname);

  const showManageFooter = [
    "/manage-account",
    "/edit-profile",
    "/get-verified",
    "/admin",
    "/notification",
  ];
  const showManageFoot = showManageFooter.includes(location.pathname);

  const hideBottomBar = [
    "/register",
    "/login",
    "/find-account",
    "/forgot-password",
    "/manage-account",
    "/edit-profile",
    "/get-verified",
    "/admin",
    "/notification",
  ];
  const showBottomBar = !hideBottomBar.includes(location.pathname);

  return (
    <div className={showNav ? "" : "display-container"}>
      {showNav && <Navbar />}
      {showLeft && <LeftBar />}
      <div
        className={`second-container ${showManageFooter ? "overflow-auto" : ""}`}
      >
        {showManageNav && <ManageAccNavbar />}
        <Outlet />
        {showManageFoot && <ManageFooter />}
      </div>
      {showBottomBar && <BottomBar />}

      {showQueueBar && <QueueBar />}
      {showSongDetailbar && <SongDetailBar />}
      {showFoot && <Footer />}
    </div>
  );
};

export default MainLayout;
