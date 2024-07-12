import "./index.css";

import { GoogleOAuthProvider } from "@react-oauth/google";
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import PlayerContextProvider from "./context/PlayerContext";
import { router } from "./utils/route";

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="749857715630-k3r648nbnckvs3u73tpomc50t8iv8rbu.apps.googleusercontent.com">
      <PlayerContextProvider>
        <RouterProvider router={router} />
      </PlayerContextProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>,
);
