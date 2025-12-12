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

interface JobApplicationDialogProps {
  trigger?: React.ReactNode;
  id: number
}

const JobApplicationDialog = ({ trigger, id }: JobApplicationDialogProps) => {
  const [open, setOpen] = useState(false);
  // removed duplicate formData; using formDataExtended below

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentRequired, setPaymentRequired] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState<Record<string, unknown> | null>(null);
  const [txHashInput, setTxHashInput] = useState("");

  // get connected wallet address to use as workerId
  const { account } = useWallet();

  // add estimatedTime to form
  const [formDataExtended, setFormDataExtended] = useState({
    name: "",
    message: "",
    estimatedTime: 1,
  });
  const BASE_URL = "https://aura-link-back-end-ixrn.onrender.com"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!account) {
      setError("Please connect your wallet before applying.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        workerId: account,
        coverLetter: formDataExtended.message,
        estimatedTime: Number(formDataExtended.estimatedTime) || 1,
      };

      const res = await fetch(`/api/gigs/${id}/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.status === 402) {
        // Payment required. Backend should return payment details to pass to x402 or show to user.
        const json = await res.json().catch(() => ({}));
        setPaymentInfo(json || {});
        setPaymentRequired(true);
        setLoading(false);
        return;
      }

      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: 'Unknown error' }));
        setError(err.message || 'Failed to apply for gig.');
        setLoading(false);
        return;
      }

  // Success
  setLoading(false);
  setFormDataExtended({ name: "", message: "", estimatedTime: 1 });
      setOpen(false);
      console.log('Application submitted successfully');
    } catch (err) {
      console.error('Apply error', err);
      setError('Failed to submit application.');
      setLoading(false);
    }
  };

  const submitWithTxHash = async (txHash: string) => {
    if (!account) {
      setError('Please connect wallet.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const payload = {
        workerId: account,
        coverLetter: formDataExtended.message,
        estimatedTime: Number(formDataExtended.estimatedTime) || 1,
        paymentTxHash: txHash,
      };

      const res = await fetch(`/api/gigs/${id}/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setError(err.message || 'Payment verification or application failed.');
        setLoading(false);
        return;
      }

      // success
  setPaymentRequired(false);
  setPaymentInfo(null);
  setTxHashInput('');
  setLoading(false);
  setOpen(false);
  setFormDataExtended({ name: "", message: "", estimatedTime: 1 });
      console.log('Application submitted after payment');
    } catch (err) {
      console.error('submitWithTxHash error', err);
      setError('Failed to verify payment.');
      setLoading(false);
    }
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
        
        {!paymentRequired && (
          <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-foreground">
              Name
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your full name"
              value={formDataExtended.name}
              onChange={(e) => setFormDataExtended({ ...formDataExtended, name: e.target.value })}
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
              value={formDataExtended.message}
              onChange={(e) => setFormDataExtended({ ...formDataExtended, message: e.target.value })}
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
              value={formDataExtended.estimatedTime}
              onChange={(e) => setFormDataExtended({ ...formDataExtended, estimatedTime: Number(e.target.value) })}
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
        )}

        {paymentRequired && (
          <div className="space-y-4 mt-4">
            <div className="text-sm text-foreground">
              Payment required to apply. Follow the instructions below to complete payment and then submit the transaction hash.
            </div>
            <div className="bg-muted p-3 rounded">
              <pre className="text-xs text-muted-foreground">{JSON.stringify(paymentInfo, null, 2)}</pre>
            </div>

            <div className="flex gap-2">
              <Button
                variant="default"
                onClick={async () => {
                  setError(null);
                  // Attempt to use a global x402 provider if available (Ultravioleta)
                  const win = window as unknown as { x402?: { pay?: (info?: unknown) => Promise<unknown> } };
                  if (win?.x402 && typeof win.x402.pay === 'function') {
                    setLoading(true);
                    try {
                      const tx:any = await win.x402.pay(paymentInfo);
                      const txHash = tx?.txHash || tx?.hash || tx?.transactionHash;
                      if (txHash) {
                        await submitWithTxHash(txHash);
                      } else {
                        setError('Payment completed but no transaction hash was returned. Please paste the tx hash below.');
                        setLoading(false);
                      }
                    } catch (err) {
                      console.error('x402 pay error', err);
                      setError('Payment failed or was cancelled.');
                      setLoading(false);
                    }
                  } else {
                    setError('No x402 provider available in this browser. Please complete the payment externally and paste the tx hash below.');
                  }
                }}
              >
                Pay (x402)
              </Button>

              <Input
                placeholder="Paste payment tx hash here"
                value={txHashInput}
                onChange={(e) => setTxHashInput(e.target.value)}
                className="flex-1"
              />

              <Button
                variant="default"
                onClick={() => submitWithTxHash(txHashInput)}
                disabled={!txHashInput}
              >
                Submit txHash
              </Button>
            </div>

            {error && <div className="text-sm text-red-500">{error}</div>}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default JobApplicationDialog;