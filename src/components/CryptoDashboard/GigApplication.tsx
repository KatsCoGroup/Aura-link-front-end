import { useState } from "react";
import { useWallet } from "@/hooks/use-wallet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import success from "/success.png";

interface JobApplicationDialogProps {
  trigger?: React.ReactNode;
  id: number
}

const JobApplicationDialog = ({ trigger, id }: JobApplicationDialogProps) => {
  const [open, setOpen] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    message: "",
    estimatedTime: 1,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Application submitted:", formData);
    setFormData({ name: "", message: "" });
    setIsSubmitted(true);
    // setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="default">Apply for Job</Button>
        )}
      </DialogTrigger>
      <DialogContent className="w-[90vw] max-w-[90vw] md:w-[80vw] md:max-w-[80vw] h-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground">
            Job Application 
          </DialogTitle>
        </DialogHeader>
           {!isSubmitted ? (
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-foreground">
              Name
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-background border-border text-foreground placeholder:text-muted-foreground"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message" className="text-sm font-medium text-foreground">
              Message
            </Label>
            <Textarea
              id="message"
              placeholder="Tell us why you're interested in this position..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full min-h-[200px] bg-background border-border text-foreground placeholder:text-muted-foreground resize-none"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="estimatedTime" className="text-sm font-medium text-foreground">
              Estimated time (days)
            </Label>
            <Input
              id="estimatedTime"
              type="number"
              min={1}
              value={formData.estimatedTime}
              onChange={(e) => setFormData({ ...formData, estimatedTime: Number(e.target.value) })}
              className="w-full bg-background border-border text-foreground placeholder:text-muted-foreground"
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="border-border text-foreground hover:bg-muted"
            >
              Cancel
            </Button>
            <Button type="submit" variant="default">
              Submit Application
            </Button>
          </div>
        </form>
          ) : (
          <div className="flex flex-col items-center justify-center py-12 animate-fade-in">
            <img
              src={success}
              alt="Success"
              className="w-32 h-32 md:w-48 md:h-48 object-contain animate-fade-in"
            />
            <p className="mt-4 text-lg font-semibold text-foreground text-center">
              Application Submitted Successfully!
            </p>
            <p className="mt-2 text-sm text-muted-foreground text-center">
              Thank you for applying. We'll review your application shortly.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default JobApplicationDialog;