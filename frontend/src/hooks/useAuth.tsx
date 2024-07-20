import { useEffect, useState } from "react";

import type { User } from "../model/User";
import { authenticate } from "../pages/api-calls/auth/authenticate";
export type AuthData = {
  user: User | null;
  loading: boolean;
};

const useAuth = (): User | null => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const getUser = async () => {
      try {
        const result = await authenticate();
        setUser(result);
      } catch (error) {
        console.error("Error fetching user:", error);
        setUser(null);
      }
    };

    void getUser();
  }, []);

  return user;
};

export default useAuth;
