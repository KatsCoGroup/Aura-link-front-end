// hooks/use-user-auth.ts
import { useState, useEffect, useCallback } from "react";
import { useWallet } from "@/hooks/use-wallet";

interface UserProfile {
  address: string;
  displayName: string;
  bio: string;
  profileImage: string;
}

export const useUserAuth = () => {
  const { account } = useWallet();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isCheckingUser, setIsCheckingUser] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false); // Flag to trigger registration
  const apiEnv = (import.meta as unknown as { env?: Record<string, string> })
    .env;
  const apiBase = apiEnv?.VITE_API_BASE || "http://localhost:3000";

  // Check DB when wallet connects
  useEffect(() => {
    const checkUserParams = async () => {
      if (!account) {
        setUserProfile(null);
        setIsNewUser(false);
        return;
      }

      setIsCheckingUser(true);
      try {
        const response = await fetch(`${apiBase}/api/users/${account}`);

        if (response.ok) {
          const userData = await response.json();
          setUserProfile(userData);
          setIsNewUser(false);
        } else if (response.status === 404) {
          // User connects wallet but isn't in MongoDB yet
          setUserProfile(null);
          setIsNewUser(true);
        }
      } catch (error) {
        console.error("Failed to fetch user profile", error);
      } finally {
        setIsCheckingUser(false);
      }
    };

    checkUserParams();
  }, [account]);

  // Function to register the user
  const registerUser = async (data: {
    displayName: string;
    bio: string;
    profileImage: string;
  }) => {
    if (!account) return;

    try {
      const response = await fetch(`${apiBase}/api/users/profile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address: account, // derived from wallet
          ...data,
        }),
      });

      if (!response.ok) throw new Error("Registration failed");

      const newUser = await response.json();
      setUserProfile(newUser);
      setIsNewUser(false); // No longer a new user
      return newUser;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  return {
    userProfile,
    isNewUser,
    isCheckingUser,
    registerUser,
  };
};
