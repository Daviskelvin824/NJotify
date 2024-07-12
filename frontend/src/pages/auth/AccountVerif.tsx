import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { verifyAccount } from "../api-calls/auth/verifyAccount";

const AccountVerif = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");
  const navigate = useNavigate();
  useEffect(() => {
    const verifAccount = async () => {
      const response = await verifyAccount(token);
      console.log(response);
      navigate("/login");
    };

    verifAccount();
  }, []);

  return <div>sadasd</div>;
};

export default AccountVerif;
