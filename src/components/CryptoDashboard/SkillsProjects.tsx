import { Button } from "@/components/ui/button";

const skills = Array(8).fill(null);
const projects = Array(4).fill(null);

export const SkillsProjects = () => {
  return (
    <section className="px-6 py-8 bg-card">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Skills */}
        <div>
          <h2 className="text-sm font-semibold mb-4 tracking-wide">SKILLS</h2>
          <div className="flex flex-wrap gap-3">
            {skills.map((_, i) => (
              <div
                key={i}
                className="w-12 h-12 rounded-full bg-muted hover:bg-muted/80 transition-colors cursor-pointer"
              />
            ))}
            <Button
              size="sm"
              variant="secondary"
              className="rounded-full px-4 h-12"
            >
              See More
            </Button>
          </div>
        </div>

        {/* Projects */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold tracking-wide">PROJECTS</h2>
            <a
              href="#"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              VIEW COMMUNITY
            </a>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {projects.map((_, i) => (
              <div
                key={i}
                className="aspect-square rounded-lg bg-muted hover:bg-muted/80 transition-colors cursor-pointer"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
