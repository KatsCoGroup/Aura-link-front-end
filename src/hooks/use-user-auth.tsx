// hooks/use-user-auth.ts
import { useState, useEffect } from "react";
import { useWallet } from "@/hooks/use-wallet";
import { userAPI, type User } from "@/services/api";

export const useUserAuth = () => {
  const { account } = useWallet();
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [isCheckingUser, setIsCheckingUser] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false); // Flag to trigger registration

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
        const response = await userAPI.getProfile(account);
        setUserProfile(response.user);
        setIsNewUser(false);
      } catch (error: any) {
        // If user not found (404), mark as new user
        if (error.message.includes('404') || error.message.includes('not found')) {
          setUserProfile(null);
          setIsNewUser(true);
        } else {
          console.error("Failed to fetch user profile", error);
        }
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
    skills?: string[];
  }) => {
    if (!account) return;

    try {
      const response = await userAPI.createOrUpdateProfile({
        address: account,
        ...data,
      });

      setUserProfile(response.user);
      setIsNewUser(false); // No longer a new user
      return response.user;
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
    setUserProfile,
    updateSkills: async (skills: string[]) => {
      if (!account) return;
      const response = await userAPI.updateSkills({ address: account, skills });
      setUserProfile(response.user);
      return response.user;
    },
    requestSkillVerification: async (skill: string) => {
      if (!account) return;
      const response = await userAPI.requestSkillVerification({ address: account, skill });
      setUserProfile(response.user);
      return response.user;
    },
    createProject: async (payload: { title: string; stack?: string; skills?: string[] }) => {
      if (!account) return;
      const response = await userAPI.createProject({ address: account, ...payload });
      setUserProfile(response.user);
      return response.user;
    },
  };
};
