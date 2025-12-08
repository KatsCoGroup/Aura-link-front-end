import { Circle, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/hooks/use-wallet";

const navItems = ["Home", "About Us", "Ecosystem", "Lore", "Community"];

export const Header = () => {
  const {account, provider} = useWallet()

  // console.log("Header account:", provider.getBalance(account));
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-border">
      {/* Logo */}
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="w-8 h-8 rounded-full border-2 border-foreground -ml-2 first:ml-0 bg-background"
          />
        ))}
      </div>

      {/* Navigation */}
      <nav className="hidden md:flex items-center gap-8">
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

      {/* Profile Button */}
      <Button variant="outline" className="gap-2 rounded-full px-4">
        <span className="text-sm">Profile</span>
        <div className="w-6 h-6 rounded-full border border-foreground flex items-center justify-center">
          <User className="w-3 h-3" />
        </div>
      </Button>
    </header>
  );
};
