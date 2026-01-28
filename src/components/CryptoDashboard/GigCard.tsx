import { useEffect, useState } from "react";
import { User, Zap, Star, Clock } from "lucide-react";
import JobApplicationDialog from "./GigApplication";
import JobApplicantsDialog from "./GigApplicants";
import { useWallet } from "@/hooks/use-wallet";
import { Button } from "@/components/ui/button";
import { gigAPI, PaymentInfo, PaymentRequiredError } from "@/services/api";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface GigCardProps {
  gigId: string;
  status: string;
  employer: string;
  description: string;
  title: string;
  price: number;
  imageUrl?: string;
  biddersCount?: number;
  featured?: boolean;
  featuredUntil?: string | Date;
  urgent?: boolean;
  requiredBadge?: string;
}

type PaymentAction = "feature" | "urgent";

const X402_SCRIPT_ID = "x402-sdk-script";
const X402_DEFAULT_SRC = import.meta.env.VITE_X402_SCRIPT_URL || ""; // Disable by default unless provided

export const GigCard = ({ gigId, status, description, title, price, imageUrl, biddersCount = 8, employer, featured, urgent, featuredUntil, requiredBadge }: GigCardProps) => {
  const bidders = Array.from({ length: biddersCount }, (_, i) => i);
  const {account} = useWallet()
  const [loadingAction, setLoadingAction] = useState<PaymentAction | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [paymentFlow, setPaymentFlow] = useState<{ action: PaymentAction; payment?: PaymentInfo; txHash?: string } | null>(null);
  const [x402Ready, setX402Ready] = useState(false);

  useEffect(() => {
    const ensureX402 = async () => {
      if (typeof window === "undefined") return;
      const win = window as unknown as { x402?: { pay?: (info?: unknown) => Promise<unknown> } };
      if (win?.x402?.pay) {
        setX402Ready(true);
        return;
      }

      if (!X402_DEFAULT_SRC) {
        setX402Ready(false);
        return;
      }

      const existing = document.getElementById(X402_SCRIPT_ID) as HTMLScriptElement | null;
      if (existing) {
        existing.onload = () => setX402Ready(!!(win?.x402?.pay));
        existing.onerror = () => setX402Ready(false);
        return;
      }

      const script = document.createElement("script");
      script.id = X402_SCRIPT_ID;
      script.src = X402_DEFAULT_SRC;
      script.async = true;
      script.onload = () => setX402Ready(!!(win?.x402?.pay));
      script.onerror = () => setX402Ready(false);
      document.head.appendChild(script);
    };

    ensureX402();
  }, []);

  const statusColors: Record<string, string> = {
    OPEN: "bg-[#22C55E]",
    ASSIGNED: "bg-[#3B82F6]",
    SUBMITTED: "bg-[#8B5CF6]",
    COMPLETED: "bg-[#FACC15]",
    CANCELLED: "bg-[#EF4444]",
  };

  const statusBg = statusColors[status] || "bg-green-500";

  const employerView = employer?.toLowerCase() === account?.toLowerCase();

  const startAction = async (action: PaymentAction, txHash?: string) => {
    setActionError(null);
    setLoadingAction(action);
    try {
      const apiCall = action === "feature" ? gigAPI.featureGig : gigAPI.markUrgent;
      const payload = txHash ? { paymentTxHash: txHash } : {};
      await apiCall(gigId, payload);
      setPaymentFlow(null);
    } catch (err: any) {
      if (err instanceof PaymentRequiredError) {
        setPaymentFlow({ action, payment: err.payment, txHash: txHash });
      } else {
        setActionError(err?.message || "Action failed");
      }
    } finally {
      setLoadingAction(null);
    }
  };

  const payWithX402 = async () => {
    if (!paymentFlow?.payment) return;
    const win = window as unknown as { x402?: { pay?: (info?: unknown) => Promise<unknown> } };
    if (!win?.x402?.pay) {
      setActionError("No x402 provider available. Paste the tx hash after paying.");
      return;
    }
    try {
      setLoadingAction(paymentFlow.action);
      const tx: any = await win.x402.pay(paymentFlow.payment);
      const txHash = tx?.txHash || tx?.hash || tx?.transactionHash;
      if (!txHash) {
        setActionError("Payment completed but tx hash missing. Paste it below.");
        setLoadingAction(null);
        return;
      }
      await startAction(paymentFlow.action, txHash);
    } catch (err) {
      setActionError("Payment failed or was cancelled.");
      setLoadingAction(null);
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-center gap-6 py-6 rounded-xl px-6 border border-border bg-card">
      {/* Left Section - Avatar, Status, Description, Price */}
      <div className="flex items-center gap-4 w-full md:w-1/2">
        {/* Avatar */}
        <div className="w-16 h-16 rounded-xl border border-border overflow-hidden flex-shrink-0 bg-muted">
          {imageUrl ? (
            <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gray-900 flex items-center justify-center">
              <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center">
                <User className="w-6 h-6 text-gray-400" />
              </div>
            </div>
          )}
        </div>

        {/* Status & Description */}
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`inline-block px-2 py-0.5 ${statusBg} text-black text-[11px] font-semibold rounded`}>
              {status}
            </span>
            {featured && <Badge variant="secondary" className="gap-1 text-[11px]"><Star className="w-3 h-3" /> Featured</Badge>}
            {urgent && <Badge variant="destructive" className="gap-1 text-[11px]"><Zap className="w-3 h-3" /> Urgent</Badge>}
            {requiredBadge && requiredBadge.trim() !== "" && (
              <Badge variant="outline" className="text-[11px]">Badge: {requiredBadge}</Badge>
            )}
          </div>
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{description}</p>
          {featuredUntil && (
            <p className="text-[11px] text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3" /> Featured until {new Date(featuredUntil).toLocaleString()}
            </p>
          )}
        </div>

        {/* Price */}
        <div className="text-2xl font-bold text-foreground flex-shrink-0">
          ${price}
        </div>
      </div>

      {/* Divider */}
      <div className="hidden md:block w-px h-16 bg-border" />

      {/* Right Section - Bidding */}
      <div className="flex flex-col md:flex-row items-center gap-4 w-full md:flex-1 justify-between md:justify-end">
        <div className="flex items-center gap-3 text-xl font-semibold text-foreground">
          {employerView ? <JobApplicantsDialog gigId={gigId} /> : <JobApplicationDialog gigId={gigId} />}
        </div>

        {employerView && (
          <div className="flex flex-wrap gap-3 justify-end w-full md:w-auto">
            <Button
              size="sm"
              variant="outline"
              onClick={() => startAction("feature")}
              disabled={loadingAction === "feature"}
            >
              <Star className="w-4 h-4 mr-1" /> Feature (0.50 USDC)
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => startAction("urgent")}
              disabled={loadingAction === "urgent"}
            >
              <Zap className="w-4 h-4 mr-1" /> Urgent (1.00 USDC)
            </Button>
          </div>
        )}

        {paymentFlow && employerView && (
          <div className="w-full md:w-80 border border-border rounded-lg p-3 bg-muted/50 space-y-2">
            <div className="text-sm font-medium">Payment required ({paymentFlow.action === "feature" ? "0.50 USDC" : "1.00 USDC"})</div>
            <div className="text-xs text-muted-foreground">
              {x402Ready ? "Use x402 pay or paste the tx hash after paying." : "Paste the tx hash after paying. x402 is still loading or unavailable."}
            </div>
            <div className="bg-background border border-border rounded p-2 text-[11px] text-muted-foreground whitespace-pre-wrap">
              {paymentFlow.payment ? JSON.stringify(paymentFlow.payment, null, 2) : ""}
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={payWithX402} disabled={loadingAction === paymentFlow.action || !x402Ready}>
                {x402Ready ? "Pay (x402)" : "x402 loading..."}
              </Button>
              <Input
                placeholder="tx hash"
                value={paymentFlow.txHash || ""}
                onChange={(e) => setPaymentFlow({ ...paymentFlow, txHash: e.target.value })}
              />
              <Button
                size="sm"
                variant="secondary"
                disabled={!paymentFlow.txHash}
                onClick={() => startAction(paymentFlow.action, paymentFlow.txHash)}
              >
                Submit tx
              </Button>
            </div>
            {actionError && <div className="text-[11px] text-destructive">{actionError}</div>}
          </div>
        )}
        {!paymentFlow && actionError && <div className="text-xs text-destructive">{actionError}</div>}
      </div>
    </div>
  );
};