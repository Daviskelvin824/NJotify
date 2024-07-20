import "../../styles/auth/ForgotPassword.scss";

import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { resetpassword } from "../api-calls/auth/resetpassword";
import useAuthWithLoad from "../../hooks/useAuthWIthLoad";

const ForgotPassword = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");
  const [password, setPassword] = useState("");
  const [confirmpassword, setconfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const { user, loading } = useAuthWithLoad();
  useEffect(() => {
    if (loading) return;
    if (user) navigate("/home");
  }, [loading, user, navigate]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onBtnClick = async (e: any) => {
    e.preventDefault();

    if (
      !token ||
      token.trim() === "" ||
      password === "" ||
      confirmpassword === ""
    ) {
      setErrorMessage("Field cannot be Empty!");
      return;
    } else if (password != confirmpassword) {
      setErrorMessage("Confirm Password Must be the same as Password!");
      return;
    }

    const response = await resetpassword(token, password);
    if (response === -1) {
      setErrorMessage("Reset Password Failed, Due to Server Error");
    } else if (response === -2) setErrorMessage("Invalid Password Format!");
    else if (response === -3)
      setErrorMessage("New password cannot be the same as the old password");
    else if (response === -4)
      setErrorMessage("Activate your Account in Gmail!");
    else {
      setErrorMessage("");
      navigate("/login");
    }
  };

  return (
    <div className="reset-container">
      <div className="second-container">
        <form className="third-container" onSubmit={onBtnClick}>
          <h1>Reset Password</h1>
          <input
            type="password"
            className="input-field"
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <input
            type="password"
            className="input-field"
            placeholder="Confirm Password"
            value={confirmpassword}
            onChange={(e) => {
              setconfirmPassword(e.target.value);
            }}
          />
          <div className="require-container">
            <h4>Your password must contain at least:</h4>
            <h5>1 letter and 1 capital letter</h5>
            <h5>1 number and 1 special character</h5>
            <h5>8 characters at least</h5>
          </div>
          {errorMessage && <div className="error-message">{errorMessage}</div>}
          <button className="btn-signup">Reset Password</button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
