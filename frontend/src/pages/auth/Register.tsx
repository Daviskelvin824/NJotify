import "../../styles/auth/Register.scss";

import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import type { User } from "../../model/User";
// import { googleapi } from "../api-calls/auth/googleapi";
import { signup } from "../api-calls/auth/signup";
import useAuthWithLoad from "../../hooks/useAuthWIthLoad";

const Register = () => {
  interface Country {
    name: string;
    code: string;
  }

  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setconfirmPassword] = useState("");
  const [month, setMonth] = useState("");
  const [date, setDate] = useState("");
  const [year, setYear] = useState("");
  const [gender, setGender] = useState("");
  const [country, setCountry] = useState("");
  const [countries, setCountries] = useState<Country[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const { user, loading } = useAuthWithLoad();
  useEffect(() => {
    if (loading) return;
    if (user) navigate("/home");
  }, [loading, user, navigate]);
  interface ApiCountry {
    name: {
      common: string;
    };
    cca2: string;
  }

  interface Country {
    name: string;
    code: string;
  }
  useEffect(() => {
    // Fetch country data from an API
    axios
      .get<ApiCountry[]>("https://restcountries.com/v3.1/all")
      .then((response) => {
        const countryList = response.data.map((country) => ({
          name: country.name.common,
          code: country.cca2,
        }));
        setCountries(countryList);
      })
      .catch((error: unknown) => {
        if (axios.isAxiosError(error)) {
          console.error("Error fetching countries:", error.message);
        } else {
          console.error("Unexpected error:", error);
        }
      });
  }, []);

  const getSignInWithGoogleButton = () => {
    return (
      <div className={"sign_in_with_google_and_apple_button"}>
        <FontAwesomeIcon icon={faGoogle} />
        Continue with Google
      </div>
    );
  };

  const onGoogleBtnClicked = useGoogleLogin({
    // onSuccess: async (tokenResponse) => {
    //   console.log(tokenResponse);
    //   try {
    //     const response = await googleapi(tokenResponse.code);
    //     console.log(response);
    //   } catch (error) {
    //     console.error("Error exchanging code for token:", error);
    //   }
    // },
    // flow: "auth-code",
  });

  function constantTimeCompare(val1: string, val2: string): boolean {
    if (val1.length !== val2.length) {
      return false;
    }
    let result = 0;
    for (let i = 0; i < val1.length; i++) {
      result |= val1.charCodeAt(i) ^ val2.charCodeAt(i);
    }
    return result === 0;
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const onFormSubmitted = async () => {
      if (
        email == "" ||
        username == "" ||
        password == "" ||
        gender == "" ||
        date == "" ||
        month == "" ||
        year == "" ||
        country == ""
      ) {
        setErrorMessage("Field cannot be Empty !");
        return;
      }
      if (!constantTimeCompare(password, confirmpassword)) {
        setErrorMessage("Confirm Password must be the same as Password!");
        return;
      }
      const dobDate = new Date(`${year}-${month}-${date}`);
      const user: User = {
        email: email,
        username: username,
        password: password,
        gender: gender,
        dob: dobDate,
        country: country,
        isverified: false,
        isartist: false,
      };
      const response = await signup(user);
      if (response === -1) {
        setErrorMessage("Sign Up Failed, Due to Server Error");
        return;
      } else if (response === -2) {
        setErrorMessage("Password Must be Alphanumeric and has symbol");
        return;
      } else if (response === -3) {
        setErrorMessage("Invalid email format");
        return;
      } else if (response === -4) {
        setErrorMessage("Email is already registered");
        return;
      } else if (response === -5) {
        setErrorMessage("DOB must be in the past!");
        return;
      } else {
        navigate("/login");
      }
    };
    void onFormSubmitted();
  };

  return (
    <div className={"register-container"}>
      <div className={"second-container"}>
        <h1>Sign up to start listening</h1>
        <button
          className={"google-container"}
          onClick={() => {
            onGoogleBtnClicked();
          }}
        >
          {getSignInWithGoogleButton()}
        </button>
        <form action="" className={"third-container"} onSubmit={submit}>
          <input
            type="text"
            className={"input-field"}
            placeholder="Username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
          <input
            type="text"
            className={"input-field"}
            placeholder="Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <input
            type={"password"}
            className="input-field"
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <input
            type="password"
            className={"input-field"}
            placeholder="Confirm Password"
            value={confirmpassword}
            onChange={(e) => {
              setconfirmPassword(e.target.value);
            }}
          />

          <div className="dob-inputs">
            <select
              className="dob-input"
              value={month}
              onChange={(e) => {
                setMonth(e.target.value);
              }}
            >
              <option value="" hidden={true}></option>
              <option value="1">January</option>
              <option value="2">February</option>
              <option value="3">March</option>
              <option value="4">April</option>
              <option value="5">May</option>
              <option value="6">June</option>
              <option value="7">July</option>
              <option value="8">August</option>
              <option value="9">September</option>
              <option value="10">October</option>
              <option value="11">November</option>
              <option value="12">December</option>
            </select>

            <input
              type="text"
              className="dob-input"
              placeholder="DD"
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
              }}
            />

            <input
              type="text"
              className="dob-input"
              placeholder="YYYY"
              value={year}
              onChange={(e) => {
                setYear(e.target.value);
              }}
            />
          </div>

          <select
            className="gender-field"
            value={gender}
            onChange={(e) => {
              setGender(e.target.value);
            }}
          >
            <option value="" hidden={true}>
              Select Gender
            </option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>

          <select
            className="country-field"
            value={country}
            onChange={(e) => {
              setCountry(e.target.value);
            }}
          >
            <option value="" hidden={true}>
              Select Country
            </option>
            {countries.map((country: Country) => (
              <option key={country.code} value={country.name}>
                {country.name}
              </option>
            ))}
          </select>

          {errorMessage && <div className="error-message">{errorMessage}</div>}
          <button className={"btn-signup"}>Sign Up</button>
        </form>

        <div className={"bottom-container"}>
          <h4>
            Already have an account? <a href="/login">Log in to NJotify</a>{" "}
          </h4>
        </div>
      </div>
    </div>
  );
};

export default Register;
