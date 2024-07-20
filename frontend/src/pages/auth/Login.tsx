import "../../styles/auth/Login.scss";

import { faGoogle } from "@fortawesome/free-brands-svg-icons/faGoogle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useGoogleLogin } from "@react-oauth/google";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// import { googleapi } from "../api-calls/auth/googleapi";
import { signin } from "../api-calls/auth/signin";
import useAuthWithLoad from "../../hooks/useAuthWIthLoad";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const { user, loading } = useAuthWithLoad();
  useEffect(() => {
    if (loading) return;
    if (user) navigate("/home");
  }, [loading, user, navigate]);
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

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const onSignInBtnClicked = async () => {
      if (email == "" || password == "") {
        setErrorMessage("Field cannot be Empty !");
        return;
      }
      const response = await signin(email, password);
      if (response === -1)
        setErrorMessage("Sign Up Failed, Due to Server Error");
      else if (response === -2) setErrorMessage("Email is incorrect");
      else if (response === -3) setErrorMessage("Password is incorrect");
      else if (response === -4)
        setErrorMessage("Activate your Account in Gmail!");
      else {
        setErrorMessage("");
        console.log("redirect home");
        navigate("/home");
      }
    };
    void onSignInBtnClicked();
  };
  return (
    <div className={"login-container"}>
      <div className={"second-container"}>
        <div className={"header-container"}>
          <h1>Login to NJotify</h1>
          <button
            className={"google-container"}
            onClick={() => {
              onGoogleBtnClicked();
            }}
          >
            {getSignInWithGoogleButton()}
          </button>
        </div>
        <form className={"third-container"} onSubmit={submit}>
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
          {errorMessage && <div className="error-message">{errorMessage}</div>}
          <button className={"btn-signup"}>Log in</button>

          <a href="/find-account">Forgot your password?</a>
        </form>
        <div className={"bottom-container"}>
          <h4>
            Don&apos;t have an account?{" "}
            <a href="/register">Sign up for NJotify</a>{" "}
          </h4>
        </div>
      </div>
    </div>
  );
};

export default Login;
