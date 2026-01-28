

import { User, Wallet, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/hooks/use-wallet";
import { useUserAuth } from "@/hooks/use-user-auth";
import { CreateProfileDialog } from "@/components/Auth/CreateProfileDialogue";
import logo from "@/assets/logo.png";

interface NavItem {
  name: string;
  link: string;
}

const navItems: NavItem[] = [
  { name: "Home", link: "/" },
  { name: "About Us", link: "/about" },
  { name: "Ecosystem", link: "/ecosystem" },
  { name: "Lore", link: "/lore" },
  { name: "Community", link: "/community" },
];



export const Header = () => {
  const { account, connectWallet, isConnected, disconnectWallet } = useWallet();
  const { userProfile, isNewUser, registerUser } = useUserAuth();

  return (
    <>
      <header className="flex items-center justify-between px-10 py-6 border-b-0">
        {/* Logo Section */}
        <div className="flex items-center">
          <img src={logo} alt="Logo" className="h-8 w-auto" />
        </div>

      {/* Navigation */}
      <nav className="hidden md:flex items-center gap-8">
        {navItems.map((item, idx) => (
          <a
            key={idx}
            href={item.link}
            className={`text-sm font-medium text-muted-foreground hover:text-foreground transition-colors `}
      
          >
            {item.name}
          </a>
        ))}
      </nav>

        {/* --- DYNAMIC ACTION AREA --- */}
        <div className="flex items-center gap-4">
          {/* Not connected: show connect CTA */}
          {!isConnected && (
            <Button variant="default" className="rounded-full" onClick={connectWallet}>
              Connect Wallet
            </Button>
          )}

          {/* Connected but new user: nudge to finish registration */}
          {isConnected && isNewUser && (
            <Button variant="secondary" className="animate-pulse rounded-full">
              Complete Registration
            </Button>
          )}

          {/* Connected with profile */}
          {isConnected && userProfile && (
            <Button variant="outline" className="gap-2 rounded-full px-4">
              <span className="text-sm  text-foreground">
                {userProfile?.displayName || "User"}
              </span>

              {userProfile?.profileImage ? (
                <img
                  src={userProfile?.profileImage}
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

          {/* Disconnect */}
          {isConnected && (
            <Button
              variant="ghost"
              size="icon"
              onClick={disconnectWallet}
              title="Disconnect Wallet"
              className="hover:bg-destructive/10 hover:text-destructive transition-colors"
            >
              <LogOut className="w-4 h-4" />
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
