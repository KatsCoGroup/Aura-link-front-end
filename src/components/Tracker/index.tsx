import { TrackerColumn } from "./TrackerColumn";
import { SocialSidebar } from "./SocialSidebar";

const trackerData = {
  start: Array(7).fill({ username: "@username" }),
  statues: Array(7).fill({ username: "@username", status: "In progress" }),
  feedback: Array(7).fill({ username: "@username" }),
  done: Array(7).fill({ username: "@username" }),
};

export const Tracker = () => {
  return (
    <section className="bg-background relative pt-8 pb-24 md:py-8 px-4 md:px-16 min-h-[500px]">
      {/* Social Sidebar */}
      <SocialSidebar />

      {/* Tracker Board */}
      <div className="flex flex-col md:flex-row gap-8 md:gap-4 ml-0 md:ml-16">
        <TrackerColumn
          title="Start"
          items={trackerData.start}
          showConnector={true}
        />
        <TrackerColumn
          title="Statues"
          items={trackerData.statues}
          showConnector={true}
        />
        <TrackerColumn
          title="Feedback"
          items={trackerData.feedback}
          showConnector={true}
        />
        <TrackerColumn
          title="Done"
          items={trackerData.done}
          showConnector={false}
        />
      </div>
    </section>
  );
};

export default Tracker;
