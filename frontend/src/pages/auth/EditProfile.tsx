/* eslint-disable @typescript-eslint/restrict-template-expressions */

import "../../styles/auth/EditProfile.scss";

import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import useAuth from "../../hooks/useAuth";
import type { User } from "../../model/User";
import { editprofile } from "../api-calls/auth/editprofile";
const EditProfile = () => {
  const user: User | null = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [country, setCountry] = useState("");
  const [userDob, setUserDob] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  useEffect(() => {
    if (user?.email === "") {
      navigate("/login");
    } else if (user?.email) {
      setGender(capitalize(user.gender));
      setEmail(user.email);
      setUserDob(formatDate(new Date(user.dob)));
      setCountry(user.country);
    }
  }, [navigate, user]);

  const capitalize = (str: string) => {
    return str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";
  };

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = `0${date.getMonth() + 1}`.slice(-2); // Add leading zero
    const day = `0${date.getDate()}`.slice(-2); // Add leading zero
    return `${year}-${month}-${day}`;
  };

  const submit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const handleSubmitForm = async () => {
      if (email == "" || userDob == "" || gender == "" || country == "") {
        setErrorMessage("Field cannot be Empty !");
        setIsSuccess(false);
        return;
      }
      console.log(userDob);
      const [year, month, date] = userDob.split("-");
      const dobDate = new Date(Number(year), Number(month) - 1, Number(date));

      await editprofile(email, gender, dobDate, country);
      window.location.reload();
    };
    void handleSubmitForm();
  };

  const handleBackBtn = () => {
    navigate("/manage-account");
  };

  return (
    <div className="edit-container">
      <div className="second-container">
        <div className="head-container">
          <div className="rounded-icon" onClick={handleBackBtn}>
            <FontAwesomeIcon icon={faArrowLeft} />
          </div>
          <h1>Edit Profile</h1>
          <h5>User ID: {user?.userid}</h5>
          <div className="input-container">
            <label htmlFor="">Email</label>
            <input type="text" name="" id="" value={email} readOnly />
          </div>
          <div className="input-container">
            <label htmlFor="">Gender</label>
            <select
              name=""
              id=""
              value={gender}
              onChange={(e) => {
                setGender(e.target.value);
              }}
            >
              <option value="" hidden={true}>
                {gender}
              </option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <div className="bottom-container">
            <div className="bottominput-container">
              <label htmlFor="dob">Date of Birth</label>
              <input
                type="date"
                name="dob"
                id="dob"
                value={userDob}
                onChange={(e) => {
                  setUserDob(e.target.value);
                }}
              />
            </div>
            <div className="bottominput2-container">
              <label htmlFor="dob">Country</label>
              <input
                type="text"
                value={country}
                onChange={(e) => {
                  setCountry(e.target.value);
                }}
              />
            </div>
          </div>
          {errorMessage && (
            <div
              className="error-message"
              style={{ color: isSuccess ? "green" : "red" }}
            >
              {errorMessage}
            </div>
          )}
          <div className="btn-container">
            <a href="/manage-account">Cancel</a>
            <button onClick={submit}>Save Profile</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
