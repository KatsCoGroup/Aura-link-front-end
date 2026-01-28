import { useRef, useState, useEffect } from "react";
import { Upload, Star, Share2, FileText, User, Briefcase, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useUserAuth } from "@/hooks/use-user-auth";
import { useWallet } from "@/hooks/use-wallet";
import { Button } from "@/components/ui/button";
import { userAPI, gigAPI, type Gig } from "@/services/api";
import { createGigWithWallet } from "@/lib/escrowClient";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface ProfileSectionProps {
  onGigCreated?: (gig: Gig) => void;
}

export const ProfileSection = ({ onGigCreated }: ProfileSectionProps) => {
  const { userProfile, registerUser } = useUserAuth();
  const { account, signer } = useWallet();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [imgMode, setImgMode] = useState<"url" | "upload">("url");
  const [isUploading, setIsUploading] = useState(false);
  const [stats, setStats] = useState({ gigs: 0, applications: 0, rating: 0, ratingCount: 0 });
  const [myGigs, setMyGigs] = useState<Gig[]>([]);
  const [gigDialogOpen, setGigDialogOpen] = useState(false);
  const [gigForm, setGigForm] = useState({
    title: "",
    description: "",
    imageUrl: "",
    paymentAmount: "",
    requiredBadge: "",
    deadline: 7,
  });
  const [gigLoading, setGigLoading] = useState(false);
  const [gigError, setGigError] = useState<string | null>(null);
  const [editGigId, setEditGigId] = useState<string | null>(null);
  const [usernameInput, setUsernameInput] = useState(userProfile?.username || "");
  const [displayNameInput, setDisplayNameInput] = useState(userProfile?.displayName || "");
  const [bioInput, setBioInput] = useState(userProfile?.bio || "");

  console.log("User Profile:", userProfile);
  console.log("Account:", account);

  // Fetch user stats
  useEffect(() => {
    if (account) {
      const fetchStats = async () => {
        try {
          // Fetch posted gigs
          const postedRes = await userAPI.getPostedGigs(account);
          const appliedRes = await userAPI.getAppliedGigs(account);
          setStats({
            gigs: postedRes.count || 0,
            applications: appliedRes.count || 0,
            rating: userProfile?.rating || 0,
            ratingCount: userProfile?.ratingCount || 0,
          });
          setMyGigs(postedRes.postedGigs || []);
        } catch (error) {
          console.error("Error fetching stats:", error);
        }
      };
      fetchStats();
    }
  }, [account, userProfile]);

  useEffect(() => {
    setUsernameInput(userProfile?.username || "");
    setDisplayNameInput(userProfile?.displayName || "");
    setBioInput(userProfile?.bio || "");
    setStats((prev) => ({
      ...prev,
      rating: userProfile?.rating || 0,
      ratingCount: userProfile?.ratingCount || 0,
    }));
  }, [userProfile]);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  useEffect(() => {
    if (userProfile?.profileImage && !previewUrl) {
      setPreviewUrl(userProfile.profileImage);
    }
  }, [userProfile, previewUrl]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setImageDataUrl(result);
        setPreviewUrl(result);
        setGigForm((prev) => ({ ...prev, imageUrl: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    if (!account) return;
    
    setIsUploading(true);
    try {
      // If there's a new image, we'd need to upload it first
      // For now, we'll just update the profile with existing image or preview URL
      const imageUrl = imageDataUrl || previewUrl || userProfile?.profileImage || "";

      await registerUser({
        displayName: displayNameInput || userProfile?.displayName || "User",
        bio: bioInput || "",
        profileImage: imageUrl,
        username: usernameInput || userProfile?.username,
      });
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleGigSubmit = async () => {
    if (!account) {
      setGigError("Connect wallet before posting a gig.");
      return;
    }

    setGigLoading(true);
    setGigError(null);
    try {
      const payload = {
        employer: account,
        title: gigForm.title.trim(),
        description: gigForm.description.trim(),
        imageUrl: gigForm.imageUrl.trim() || undefined,
        paymentAmount: gigForm.paymentAmount,
        requiredBadge: gigForm.requiredBadge.trim() || undefined,
        deadline: gigForm.deadline,
      };

      let updatedGig: Gig | undefined;

      if (editGigId) {
        const res = await gigAPI.updateGig(editGigId, payload);
        updatedGig = res.gig;
        setMyGigs((prev) => prev.map((g) => (g._id === editGigId ? res.gig : g)));
      } else {
        // Client-side on-chain create, then persist to backend
        const chain = await createGigWithWallet(payload.paymentAmount, undefined, signer || undefined);
        const res = await gigAPI.createGig({ ...payload, blockchainGigId: chain.gigId, txHash: chain.txHash });
        updatedGig = res.gig;
        setMyGigs((prev) => [res.gig, ...prev]);
        if (onGigCreated && res?.gig) {
          onGigCreated(res.gig);
        }
        setStats((prev) => ({ ...prev, gigs: (prev.gigs || 0) + 1 }));
      }

      setGigDialogOpen(false);
      setEditGigId(null);
      setGigForm({ title: "", description: "", imageUrl: "", paymentAmount: "", requiredBadge: "", deadline: 7 });
    } catch (err: any) {
      const msg = err?.message || "Failed to post gig.";
      setGigError(msg);
    } finally {
      setGigLoading(false);
    }
  };

  const startEditGig = (gig: Gig) => {
    setEditGigId(gig._id || null);
    setGigForm({
      title: gig.title || "",
      description: gig.description || "",
      imageUrl: gig.imageUrl || "",
      paymentAmount: gig.paymentAmount?.toString() || "",
      requiredBadge: gig.requiredBadge || "",
      deadline: gig.deadline || 7,
    });
    setPreviewUrl(gig.imageUrl || null);
    setImageDataUrl(null);
    setImgMode(gig.imageUrl ? "url" : "upload");
    setGigDialogOpen(true);
  };

  const formatAddress = (addr?: string) => {
    if (!addr) return "...................";
    return `${addr.slice(0, 7)}...${addr.slice(-6)}`;
  };

  return (
    <section className="px-6 py-8 border-b border-border bg-background">
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
                className="w-10 h-10 rounded-full border border-border bg-card -ml-3 first:ml-0 flex items-center justify-center text-xs font-bold"
              >
                {i + 1}
              </div>
            ))}
          </div>
          <span className="text-xs font-bold tracking-wider ml-1 uppercase">Ranking</span>
        </div>

        {/* Right: Profile */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium uppercase">Profile</span>
          <div className="w-12 h-12 rounded-full bg-muted border border-border flex items-center justify-center overflow-hidden">
            {previewUrl ? (
              <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <User className="w-6 h-6 text-muted-foreground" />
            )}
          </div>
        </div>
      </div>

      {/* Avatar Upload */}
      <div className="flex justify-center mb-8">
        <div
          onClick={handleUploadClick}
          className="w-24 h-24 rounded-full bg-muted flex items-center justify-center border-2 border-dashed border-border hover:border-primary transition-colors cursor-pointer overflow-hidden relative group"
        >
          {previewUrl ? (
            <img src={previewUrl} alt="Preview" className="w-full h-full object-cover opacity-70 group-hover:opacity-50" />
          ) : userProfile?.profileImage ? (
            <img src={userProfile.profileImage} alt="Profile" className="w-full h-full object-cover opacity-70 group-hover:opacity-50" />
          ) : null}
          <Upload className="w-8 h-8 text-foreground absolute group-hover:scale-110 transition-transform" />
        </div>
      </div>

      {/* Profile Info */}
      <div className="w-full">
        <h1 className="text-4xl font-bold mb-2 uppercase tracking-tight">
          {displayNameInput || userProfile?.displayName || "New User"}
        </h1>
        
        <p className="text-sm text-muted-foreground mb-4 font-mono">
          @{usernameInput || userProfile?.username || formatAddress(account)}
        </p>

        {/* Bio */}
        <p className="text-sm text-foreground mb-6 max-w-2xl">
          {bioInput || "No bio yet. Update your profile to share about yourself!"}
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="border border-border rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-primary">{stats.gigs}</div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider mt-2">Gigs Posted</div>
          </div>
          <div className="border border-border rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-primary">{stats.applications}</div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider mt-2">Applications</div>
          </div>
          <div className="border border-border rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-primary flex items-center justify-center">
              {stats.rating ? stats.rating.toFixed(2) : "—"}
              <Star className="w-4 h-4 ml-1 fill-primary" />
            </div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider mt-2">
              Rating{stats.ratingCount ? ` (${stats.ratingCount})` : ""}
            </div>
          </div>
        </div>

        {/* Editable fields */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 max-w-3xl">
          <div className="space-y-2">
            <Label htmlFor="display-name">Display name</Label>
            <Input
              id="display-name"
              value={displayNameInput}
              onChange={(e) => setDisplayNameInput(e.target.value)}
              placeholder="Your display name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value.toLowerCase())}
              placeholder="username"
            />
            <p className="text-[11px] text-muted-foreground">3-30 chars; a-z, 0-9, ., _, -</p>
          </div>
          <div className="space-y-2 md:col-span-3">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={bioInput}
              onChange={(e) => setBioInput(e.target.value)}
              placeholder="Tell the community about you"
              className="min-h-[90px]"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 flex-wrap">
          <Button
            variant="default"
            size="sm"
            onClick={handleSaveProfile}
            disabled={isUploading}
            className="gap-2"
          >
            <Upload className="w-4 h-4" />
            {isUploading ? "Saving..." : "Save Profile"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <Share2 className="w-4 h-4" />
            Share Profile
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => {
              setEditGigId(null);
              setGigForm({ title: "", description: "", imageUrl: "", paymentAmount: "", requiredBadge: "", deadline: 7 });
              setGigDialogOpen(true);
            }}
          >
            <Briefcase className="w-4 h-4" />
            Post Gig
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            Messages
          </Button>
        </div>
      </div>

      <Dialog open={gigDialogOpen} onOpenChange={setGigDialogOpen}>
        <DialogContent className="sm:max-w-[620px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editGigId ? "Edit Gig" : "Post a Gig"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-2">
            <div className="space-y-2">
              <Label htmlFor="gig-title">Title</Label>
              <Input
                id="gig-title"
                value={gigForm.title}
                onChange={(e) => setGigForm({ ...gigForm, title: e.target.value })}
                placeholder="Build a landing page"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gig-desc">Description</Label>
              <Textarea
                id="gig-desc"
                value={gigForm.description}
                onChange={(e) => setGigForm({ ...gigForm, description: e.target.value })}
                placeholder="Describe the work and deliverables"
              />
            </div>

            <div className="space-y-2">
              <Label>Gig Image (optional)</Label>
              <Tabs value={imgMode} onValueChange={(v) => setImgMode(v as "url" | "upload")}>
                <TabsList className="grid grid-cols-2 w-full">
                  <TabsTrigger value="url">From URL</TabsTrigger>
                  <TabsTrigger value="upload">Upload</TabsTrigger>
                </TabsList>
                <TabsContent value="url" className="space-y-2 pt-2">
                  <Input
                    id="gig-img-url"
                    value={gigForm.imageUrl}
                    onChange={(e) => {
                      setGigForm({ ...gigForm, imageUrl: e.target.value });
                      setPreviewUrl(e.target.value || null);
                    }}
                    placeholder="https://.../gig-banner.png"
                  />
                </TabsContent>
                <TabsContent value="upload" className="space-y-2 pt-2">
                  <Input type="file" accept="image/*" onChange={handleFileChange} />
                  <div className="text-xs text-muted-foreground">Images are stored as data URLs in this demo.</div>
                </TabsContent>
              </Tabs>
              {previewUrl && (
                <div className="mt-2">
                  <img src={previewUrl} alt="Gig preview" className="w-full h-40 object-cover rounded border" />
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="gig-amount">Payment (USDC)</Label>
                <Input
                  id="gig-amount"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={gigForm.paymentAmount}
                  onChange={(e) => setGigForm({ ...gigForm, paymentAmount: e.target.value })}
                  placeholder="100"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gig-deadline">Deadline (days)</Label>
                <Input
                  id="gig-deadline"
                  type="number"
                  min="1"
                  value={gigForm.deadline}
                  onChange={(e) => setGigForm({ ...gigForm, deadline: Number(e.target.value) })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="gig-badge">Required Badge (optional)</Label>
              <Input
                id="gig-badge"
                value={gigForm.requiredBadge}
                onChange={(e) => setGigForm({ ...gigForm, requiredBadge: e.target.value })}
                placeholder="e.g. Solidity"
              />
            </div>

            {gigError && <div className="text-sm text-red-500">{gigError}</div>}
          </div>

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setGigDialogOpen(false)} disabled={gigLoading}>
              Cancel
            </Button>
            <Button onClick={handleGigSubmit} disabled={gigLoading}>
              {gigLoading ? "Saving..." : editGigId ? "Save Changes" : "Post Gig"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* My Gigs list with edit actions */}
      {myGigs.length > 0 && (
        <div className="mt-8 space-y-3">
          <h3 className="text-lg font-semibold">Your Gigs</h3>
          <div className="grid gap-3">
            {myGigs.map((gig) => (
              <div key={gig._id} className="border border-border rounded-lg p-3 flex gap-3 items-start">
                {gig.imageUrl ? (
                  <img src={gig.imageUrl} alt={gig.title} className="w-16 h-16 rounded object-cover" />
                ) : (
                  <div className="w-16 h-16 rounded bg-muted flex items-center justify-center text-xs text-muted-foreground">
                    No Image
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-foreground line-clamp-1">{gig.title}</h4>
                    <span className="text-xs px-2 py-1 rounded bg-muted text-foreground">{gig.status}</span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">{gig.description}</p>
                  <div className="text-xs text-muted-foreground mt-1">{gig.paymentAmount} USDC · Deadline {gig.deadline}d</div>
                </div>
                <Button variant="outline" size="sm" onClick={() => startEditGig(gig)}>
                  Edit
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
