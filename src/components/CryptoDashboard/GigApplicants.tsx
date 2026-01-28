import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { gigAPI, type Gig } from "@/services/api";
import { useWallet } from "@/hooks/use-wallet";
import { GradientLoadingAnimation } from "../ui/Loading";

interface Applicant {
  workerId: string;
  coverLetter: string;
  estimatedTime?: number;
  appliedAt?: string | Date;
}

interface JobApplicantsDialogProps {
  trigger?: React.ReactNode;
  gigId: string;
  onChoose?: (applicant: Applicant) => void;
}

const JobApplicantsDialog = ({ 
  trigger, 
  gigId,
  onChoose 
}: JobApplicantsDialogProps) => {
  const [open, setOpen] = useState(false);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { account } = useWallet();

  useEffect(() => {
    if (open) {
      fetchApplicants();
    }
  }, [open, gigId]);

  const fetchApplicants = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await gigAPI.getGig(gigId);
      setApplicants(response.gig.applications || []);
    } catch (err: any) {
      console.error("Failed to fetch applicants:", err);
      setError(err.message || "Failed to load applicants");
    } finally {
      setLoading(false);
    }
  };

  const handleChoose = async (applicant: Applicant) => {
    if (!account) {
      alert("Please connect your wallet");
      return;
    }

    try {
      await gigAPI.assignWorker(gigId, {
        employer: account,
        workerId: applicant.workerId,
      });
      
      console.log("Worker assigned:", applicant);
      onChoose?.(applicant);
      setOpen(false);
    } catch (err: any) {
      console.error("Failed to assign worker:", err);
      alert(err.message || "Failed to assign worker");
    }
  };

  const formatAddress = (addr: string) => {
    if (!addr) return "";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline">View Applicants</Button>
        )}
      </DialogTrigger>
      <DialogContent className="w-[90vw] max-w-[90vw] md:w-[80vw] md:max-w-[80vw] h-[85vh] max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground">
            Job Applicants ({applicants.length})
          </DialogTitle>
        </DialogHeader>
        
        {loading && (
          <div className="flex-1 flex items-center justify-center">
            <GradientLoadingAnimation />
          </div>
        )}

        {!loading && error && (
          <div className="flex-1 flex items-center justify-center text-red-500">
            {error}
          </div>
        )}

        {!loading && !error && applicants.length === 0 && (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            No applicants yet
          </div>
        )}

        {!loading && !error && applicants.length > 0 && (
          <ScrollArea className="flex-1 pr-4 mt-4">
            <div className="space-y-6">
              {applicants.map((applicant, index) => (
                <div
                  key={applicant.workerId + index}
                  className="p-6 rounded-xl bg-card border border-border"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                      <span className="text-2xl">👤</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-foreground">
                        {formatAddress(applicant.workerId)}
                      </h3>
                      {applicant.estimatedTime && (
                        <p className="text-sm text-muted-foreground">
                          Estimated time: {applicant.estimatedTime} days
                        </p>
                      )}
                      {applicant.appliedAt && (
                        <p className="text-xs text-muted-foreground">
                          Applied: {new Date(applicant.appliedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">
                      Cover Letter
                    </h4>
                    <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                      {applicant.coverLetter}
                    </p>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button
                      onClick={() => handleChoose(applicant)}
                      className="px-8"
                    >
                      Assign Worker
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default JobApplicantsDialog;