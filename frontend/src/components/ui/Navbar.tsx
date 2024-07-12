import "../../styles/components/Navbar.scss";

import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useNavigate } from "react-router-dom";

import logo from "../../assets/njotify_logo.png";
import useAuth from "../../hooks/useAuth";
import { logout } from "../../pages/api-calls/auth/logout";
const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuth();

  const email = user?.email;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const handlelogout = async () => {
      const response = await logout();
      console.log(response);
      if (response === "Successfully logged out") {
        navigate("/login");
      }
    };
    void handlelogout();
  };

  return (
    <div className={"navbar-container"}>
      {email === "TPAWEB241" ? (
        <div className="extra-content">
          <p>Admin |</p>
          <p onClick={submit} style={{ cursor: "pointer" }}>
            Logout{" "}
            <span>
              <FontAwesomeIcon icon={faArrowRight} />
            </span>
          </p>
        </div>
      ) : (
        <>
          <img className="logo" src={logo} alt="NJotify Logo" />
          <h1>NJotify</h1>
        </>
      )}
    </div>
  );
};

export default Navbar;
