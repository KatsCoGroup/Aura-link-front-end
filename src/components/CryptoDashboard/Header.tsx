import { User, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/hooks/use-wallet";
import { useUserAuth } from "@/hooks/use-user-auth";
import { CreateProfileDialog } from "@/components/Auth/CreateProfileDialogue";
import logo from "@/assets/logo.png";

const navItems = ["Home", "About Us", "Ecosystem", "Lore", "Community"];

export const Header = () => {
  const { account, connectWallet, isConnected } = useWallet();
  const { userProfile, isNewUser, registerUser } = useUserAuth();

  return (
    <>
      <header className="flex items-center justify-between px-10 py-6 border-b-0">
        {/* Logo Section */}
        <div className="flex items-center">
          <img src={logo} alt="Logo" className="h-8 w-auto" />
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-12">
          {navItems.map((item) => (
            <a
              key={item}
              href="#"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {item}
            </a>
          ))}
        </nav>

        {/* --- DYNAMIC ACTION AREA --- */}
        <div className="flex items-center gap-4">
          {/* State 1: Wallet Not Connected */}
          {/* State 1: Wallet Not Connected - Always Show Button */}
          <Button onClick={connectWallet} className="gap-2 bg-black text-white hover:bg-gray-800 rounded-full px-6 shadow-md">
            <Wallet className="w-4 h-4" />
            Connect
          </Button>


          {/* State 2: Connected but New User (Show button just in case modal is closed) */}
          {isConnected && isNewUser && (
            <Button variant="secondary" className="animate-pulse rounded-full">
              Complete Registration
            </Button>
          )}

          {/* State 3: Fully Logged In (Connected + Profile exists) */}
          {isConnected && userProfile && (
            <Button variant="ghost" className="rounded-full p-0 w-10 h-10 border border-gray-200">
              {userProfile.profileImage ? (
                <img
                  src={userProfile.profileImage}
                  alt="avatar"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <div className="w-full h-full rounded-full flex items-center justify-center bg-gray-100">
                  <User className="w-5 h-5 text-gray-500" />
                </div>
              )}
            </Button>
          )}
        </div>
      </header>

      {/* The Registration Modal */}
      {/* Since isOpen is tied directly to isNewUser, this will force the modal open 
          as soon as the wallet connects and the backend returns 404. */}
      {isConnected && (
        <CreateProfileDialog
          isOpen={isNewUser}
          walletAddress={account || ""}
          onRegister={registerUser}
        />
      )}
    </>
  );
};
