import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Applicant {
  id: string;
  name: string;
  profilePicture: string;
  coverLetter: string;
}

interface JobApplicantsDialogProps {
  trigger?: React.ReactNode;
  id: number;
  applicants?: Applicant[];
  onChoose?: (applicant: Applicant) => void;
}

const defaultApplicants: Applicant[] = [
  {
    id: "1",
    name: "Alex Johnson",
    profilePicture: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    coverLetter: "I am extremely passionate about this opportunity and believe my skills align perfectly with what you're looking for. With over 5 years of experience in the field, I have successfully delivered multiple projects that exceeded client expectations. I am a team player who thrives in collaborative environments and I'm always eager to learn new technologies and methodologies. I would love the chance to contribute to your team and help drive success for your projects.",
  },
  {
    id: "2",
    name: "Sarah Chen",
    profilePicture: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    coverLetter: "As a dedicated professional with a strong background in this domain, I am excited to apply for this position. My experience includes working with cross-functional teams to deliver high-quality solutions on time and within budget. I pride myself on my attention to detail and my ability to communicate complex ideas clearly. I am confident that my expertise would be a valuable addition to your team.",
  },
  {
    id: "3",
    name: "Marcus Williams",
    profilePicture: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus",
    coverLetter: "I am writing to express my strong interest in this role. Throughout my career, I have demonstrated a commitment to excellence and a passion for innovation. I have led teams, mentored junior colleagues, and consistently delivered results that drive business growth. I am particularly drawn to your company's mission and values, and I believe I can make a meaningful contribution to your ongoing success.",
  },
];

const JobApplicantsDialog = ({ 
  trigger, 
  id,
  applicants = defaultApplicants,
  onChoose 
}: JobApplicantsDialogProps) => {
  const [open, setOpen] = useState(false);

  const handleChoose = (applicant: Applicant) => {
    console.log("Chosen applicant:", applicant);
    onChoose?.(applicant);
    setOpen(false);
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
            Job Applicants
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="flex-1 pr-4 mt-4">
          <div className="space-y-6">
            {applicants.map((applicant) => (
              <div
                key={applicant.id}
                className="p-6 rounded-xl bg-card border border-border"
              >
                <div className="flex items-start gap-4 mb-4">
                  <img
                    src={applicant.profilePicture}
                    alt={`${applicant.name}'s profile`}
                    className="w-16 h-16 rounded-full bg-muted object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-foreground">
                      {applicant.name}
                    </h3>
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
                    Choose
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default JobApplicantsDialog;