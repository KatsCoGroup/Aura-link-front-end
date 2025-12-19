import { useRef, useState } from "react";
import { Upload, Star, Share2, FileText, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useUserAuth } from "@/hooks/use-user-auth";
import { useWallet } from "@/hooks/use-wallet";

export const ProfileSection = () => {
  const { userProfile } = useUserAuth();
  const { account } = useWallet();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  console.log(userProfile)
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const formatAddress = (addr?: string) => {
    if (!addr) return "...................";
    return `${addr.slice(0, 7)}...${addr.slice(-6)}`;
  };

  return (
    <section className="px-6 py-8 border-b border-border ">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
      />

      {/* Top Bar: Rankings (Left) and Profile (Right) */}
      <div className="flex items-center justify-between mb-12">
        {/* Left: Rankings */}
        <div className="flex flex-col items-start gap-1">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-10 h-10 rounded-full border border-black bg-white -ml-3 first:ml-0"
              />
            ))}
          </div>
          <span className="text-xs font-bold tracking-wider ml-1">RANKING</span>
        </div>

        {/* Right: Profile */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium">Profile</span>
          <div className="w-10 h-10 rounded-full bg-muted border border-black flex items-center justify-center overflow-hidden">
            {/* Show Preview if available, otherwise User Profile Image, otherwise Placeholder */}
            {previewUrl ? (
              <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
            ) : userProfile?.profileImage ? (
              <img src={userProfile.profileImage} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User className="w-5 h-5 text-muted-foreground" />
            )}
          </div>
        </div>
      </div>

      {/* Avatar Upload */}
      <div className="flex justify-center mb-8">
        <div
          onClick={handleUploadClick}
          className="w-20 h-20 rounded-full bg-muted flex items-center justify-center border-2 border-dashed border-border hover:border-primary transition-colors cursor-pointer overflow-hidden relative"
        >
          {previewUrl ? (
            <img src={previewUrl} alt="Preview" className="w-full h-full object-cover opacity-50" />
          ) : null}
          <Upload className="w-6 h-6 text-foreground absolute" />
        </div>
      </div>

      {/* Profile Info */}
      <div className="w-full">
        <h1 className="text-3xl font-bold mb-4 uppercase">
          {userProfile?.displayName || "User"}
        
        </h1>

        <div className="flex flex-wrap items-center gap-4 mb-4 text-black">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full border border-black flex items-center justify-center text-xs font-bold bg-white">
              */*
            </div>
            <span className="font-bold text-sm">RATINGS</span>
          </div>

          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">ADDRESS</span>
            <span className="font-mono text-sm">{formatAddress(account || "")}</span>
          </div>

          <Upload
            onClick={handleUploadClick}
            className="w-5 h-5 text-muted ml-auto mr-[30px] cursor-pointer hover:text-foreground transition-colors"
          />
        </div>

        <div className="flex items-center gap-4">
          <div className="px-3 py-1 bg-white text-black border border-gray-300 rounded-sm text-xs font-semibold">
            @{userProfile?.displayName || "username"}
          </div>
          <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <Share2 className="w-4 h-4" />
          </button>
          <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <span>BIO</span>
            <span>{userProfile?.bio}</span>
          </button>
        </div>
      </div>
    </section>
  );
};
