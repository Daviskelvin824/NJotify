import "../../styles/auth/FindAccount.scss";

import React, { useState } from "react";

import { findaccount } from "../api-calls/auth/findaccount";

const FindAccount = () => {
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmitBtnClicked = async (e: any) => {
    e.preventDefault();
    if (email == "") {
      setErrorMessage("Field cannot be Empty !");
      return;
    }

    const response = await findaccount(email);
    if (response === -1) setErrorMessage("Sign Up Failed, Due to Server Error");
    else if (response === -2) setErrorMessage("Invalid email format");
    else if (response === -3) setErrorMessage("Account Not Found");
    else if (response === -4)
      setErrorMessage("Activate your Account in Gmail!");
    else {
      setErrorMessage("");
      console.log(response);
    }
  };

  return (
    <div className={"find-container"}>
      <div className={"second-container"}>
        <form className={"third-container"} onSubmit={onSubmitBtnClicked}>
          <h1>Find Your Account</h1>
          <input
            type="text"
            className={"input-field"}
            placeholder="Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          {errorMessage && <div className="error-message">{errorMessage}</div>}
          <button className={"btn-signup"}>Search</button>
          <a href="/login">Cancel</a>
        </form>
      </div>
    </div>
  );
};

export default FindAccount;
