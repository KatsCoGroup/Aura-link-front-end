import { Upload, Star, Share2, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const ProfileSection = () => {
  return (
    <section className="px-6 py-8 border-b border-border ">
      
      {/* Avatar Upload */}
      <div className="flex justify-center mb-8">
        <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center border-2 border-dashed border-border hover:border-primary transition-colors cursor-pointer">
          <Upload className="w-6 h-6 text-background" />
        </div>
      </div>

      {/* Profile Info */}
      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold mb-4">
          NAME <span className="text-muted-foreground">//</span>
        </h1>

        <div className="flex flex-wrap items-center gap-4 mb-4 text-black">
          <Badge variant="outline" className="gap-1.5 py-1.5 px-3 rounded-md">
            <Star className="w-4 h-4 text-background" />
            <span className="text-background">RATINGS</span>
          </Badge>

          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">ADDRESS</span>
            <span className="font-mono text-sm">4567890......456789</span>
          </div>

          <Upload className="w-5 h-5 text-muted ml-auto cursor-pointer hover:text-foreground transition-colors" />
        </div>

        <div className="flex items-center gap-4">
          <Badge variant="secondary" className="rounded-md">
            @MEDIA HANDLE
          </Badge>
          <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <Share2 className="w-4 h-4" />
          </button>
          <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <FileText className="w-4 h-4" />
            <span>BIO</span>
          </button>
        </div>
      </div>
    </section>
  );
};
