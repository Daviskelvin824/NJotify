import { useEffect, useState } from "react";

import type { User } from "../model/User";
import { authenticate } from "../pages/api-calls/auth/authenticate";

const useAuth = (): User | null => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const getUser = async () => {
      try {
        const result = await authenticate();
        setUser(result); // Assuming authenticate returns User | null
      } catch (error) {
        console.error("Error fetching user:", error);
        setUser(null); // Handle errors, setUser to null
      }
    };

    void getUser();
  }, []);

  return user;
};

export default useAuth;
