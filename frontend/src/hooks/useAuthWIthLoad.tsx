import { useState, useEffect } from "react";
import { User } from "../model/User";
import { authenticate } from "../pages/api-calls/auth/authenticate";
import { AuthData } from "./useAuth";

export const useAuthWithLoad = (): AuthData => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      try {
        const result = await authenticate();
        setUser(result);
      } catch (error) {
        console.error("Error fetching user:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    void getUser();
  }, []);

  return { user, loading };
};

export default useAuthWithLoad;
