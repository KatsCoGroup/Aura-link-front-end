import { Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { name: "Home", active: false },
  { name: "About Us", active: true },
  { name: "Ecosystem", active: false },
  { name: "Lore", active: false },
  { name: "Community", active: false },
];

export const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6 bg-background/80 backdrop-blur-sm">
      {/* Logo */}
      <div className="text-2xl font-black tracking-tight">
        C<span className="text-primary">!</span>
      </div>

      {/* Navigation */}
      <nav className="hidden md:flex items-center gap-8">
        {navItems.map((item) => (
          <a
            key={item.name}
            href="#"
            className={`text-sm transition-colors ${
              item.active
                ? "font-semibold text-foreground"
                : "font-medium text-muted-foreground hover:text-foreground"
            }`}
          >
            {item.name}
          </a>
        ))}
      </nav>

      {/* Connect Button */}
      <Button className="gap-2 rounded-full px-6 bg-foreground text-background hover:bg-foreground/90">
        <Wallet className="w-4 h-4" />
        <span className="text-sm font-medium">Connect</span>
      </Button>
    </header>
  );
};
