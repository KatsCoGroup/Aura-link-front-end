// hooks/use-user-auth.ts
import { useState, useEffect, useCallback } from "react";
import { useWallet } from "@/hooks/use-wallet";
import { BASE_URL } from "@/lib/constants";

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
        const response = await fetch(`${BASE_URL}/api/users/${account}`);

        if (response.ok) {
          console.log(response)
          const {user} = await response.json();
          setUserProfile(user);
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
      const response = await fetch(`${BASE_URL}/api/users/profile`, {
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
