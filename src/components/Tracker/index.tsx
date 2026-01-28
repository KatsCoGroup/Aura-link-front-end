import { useEffect, useState } from "react";
import { TrackerColumn } from "./TrackerColumn";
import { SocialSidebar } from "./SocialSidebar";
import { gigAPI, type Gig } from "@/services/api";

type TrackerItem = { title: string; status?: string; meta?: string; imageUrl?: string };

export const Tracker = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [columns, setColumns] = useState({
    start: [] as TrackerItem[],
    progress: [] as TrackerItem[],
    feedback: [] as TrackerItem[],
    done: [] as TrackerItem[],
  });

  useEffect(() => {
    const fetchGigs = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await gigAPI.getGigs({ limit: 50 });
        const gigs = res.gigs || [];

        const start: TrackerItem[] = [];
        const progress: TrackerItem[] = [];
        const feedback: TrackerItem[] = [];
        const done: TrackerItem[] = [];

        gigs.forEach((gig: Gig) => {
          const item: TrackerItem = {
            title: gig.title || "Untitled gig",
            status: gig.status,
            meta: gig.paymentAmount ? `${gig.paymentAmount} USDC` : undefined,
            imageUrl: gig.imageUrl,
          };
          switch (gig.status) {
            case "OPEN":
              start.push(item);
              break;
            case "ASSIGNED":
              progress.push(item);
              break;
            case "SUBMITTED":
              feedback.push(item);
              break;
            case "COMPLETED":
              done.push(item);
              break;
            default:
              start.push(item);
          }
        });

        setColumns({ start, progress, feedback, done });
      } catch (err: any) {
        const msg = err?.message || "Failed to load gigs";
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchGigs();
  }, []);

  return (
    <section className="bg-background relative pt-8 pb-24 md:py-8 px-4 md:px-16 min-h-[500px]">
      <SocialSidebar />

      <div className="flex flex-col md:flex-row gap-8 md:gap-4 ml-0 md:ml-16">
        <TrackerColumn
          title="Start"
          items={columns.start}
          showConnector={true}
        />
        <TrackerColumn
          title="In Progress"
          items={columns.progress}
          showConnector={true}
        />
        <TrackerColumn
          title="Feedback"
          items={columns.feedback}
          showConnector={true}
        />
        <TrackerColumn
          title="Done"
          items={columns.done}
          showConnector={false}
        />
      </div>

      {loading && (
        <div className="mt-6 text-sm text-muted-foreground">Loading tracker…</div>
      )}
      {error && (
        <div className="mt-6 text-sm text-red-500">{error}</div>
      )}
    </section>
  );
};

export default Tracker;
