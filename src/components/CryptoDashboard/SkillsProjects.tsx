import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { useWallet } from "@/hooks/use-wallet";
import { useUserAuth } from "@/hooks/use-user-auth";
import { SKILL_SUGGESTIONS } from "@/lib/skill-suggestions";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

const defaultSkills: string[] = [];

export const SkillsProjects = () => {
  const { account } = useWallet();
  const { userProfile, updateSkills, setUserProfile } = useUserAuth();
  const [skillList, setSkillList] = useState<string[]>(defaultSkills);
  const [newSkill, setNewSkill] = useState("");
  const [saving, setSaving] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(0);
  const { toast } = useToast();
  const [verifyLoading, setVerifyLoading] = useState<string | null>(null);
  const [projectTitle, setProjectTitle] = useState("");
  const [projectStack, setProjectStack] = useState("");
  const [projectSkills, setProjectSkills] = useState("");
  const [projectSaving, setProjectSaving] = useState(false);

  const { requestSkillVerification, createProject } = useUserAuth();

  const profileAddress = userProfile?.address?.toLowerCase();
  const isOwner = useMemo(() => {
    if (!profileAddress) return true;
    return (account || "").toLowerCase() === profileAddress;
  }, [account, profileAddress]);

  useEffect(() => {
    if (userProfile?.skills && userProfile.skills.length) {
      setSkillList(userProfile.skills);
    } else if (userProfile) {
      setSkillList([]);
    }
  }, [userProfile]);

  const skillStatuses = useMemo(() => {
    const map: Record<string, string> = {};
    (userProfile?.skillRequests || []).forEach((req) => {
      if (req.name) map[req.name.toLowerCase()] = req.status;
    });
    return map;
  }, [userProfile]);

  const persistSkills = async (skills: string[]) => {
    if (!isOwner) return;
    setSaving(true);
    try {
      const updated = await updateSkills(skills);
      if (updated) setUserProfile(updated);
    } catch (err) {
      console.error("Failed to update skills", err);
      toast({
        title: "Skill save failed",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleAddSkill = async () => {
    const next = newSkill.trim();
    if (!next) return;
    if (skillList.includes(next)) {
      setNewSkill("");
      return;
    }
    const nextList = [...skillList, next];
    setSkillList(nextList);
    setNewSkill("");
    await persistSkills(nextList);
  };

  const handleAddFromSuggestion = async (value: string) => {
    setShowSuggestions(false);
    setNewSkill(value);
    await handleAddSkillWithValue(value);
  };
  const filteredSuggestions = useMemo(() => {
    const term = newSkill.trim().toLowerCase();
    const base = term
      ? SKILL_SUGGESTIONS.filter((s) => s.toLowerCase().includes(term))
      : SKILL_SUGGESTIONS;
    return base.slice(0, 20);
  }, [newSkill]);


  const handleAddSkillWithValue = async (value: string) => {
    const next = value.trim();
    if (!next) return;
    if (skillList.includes(next)) {
      setNewSkill("");
      return;
    }
    const nextList = [...skillList, next];
    setSkillList(nextList);
    setNewSkill("");
    await persistSkills(nextList);
  };

  const handleRemoveSkill = async (skill: string) => {
    const nextList = skillList.filter((s) => s !== skill);
    setSkillList(nextList);
    await persistSkills(nextList);
  };

  const handleRequestVerification = async (skill: string) => {
    if (!isOwner) return;
    setVerifyLoading(skill);
    try {
      await requestSkillVerification(skill);
      toast({ title: "Verification requested", description: `${skill} set to pending.` });
    } catch (err) {
      toast({ title: "Request failed", description: "Could not request verification", variant: "destructive" });
    } finally {
      setVerifyLoading(null);
    }
  };

  const handleCreateProject = async () => {
    if (!isOwner) return;
    if (!projectTitle.trim()) {
      toast({ title: "Title required", variant: "destructive" });
      return;
    }
    setProjectSaving(true);
    try {
      const skills = projectSkills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      await createProject({ title: projectTitle.trim(), stack: projectStack.trim(), skills });
      setProjectTitle("");
      setProjectStack("");
      setProjectSkills("");
      toast({ title: "Project submitted", description: "Pending review" });
    } catch (err) {
      toast({ title: "Project save failed", description: "Please try again", variant: "destructive" });
    } finally {
      setProjectSaving(false);
    }
  };

  return (
    <section className="px-6 py-8 bg-card">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Skills */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold tracking-wide">SKILLS</h2>
            {!isOwner && (
              <span className="text-xs text-muted-foreground">View only</span>
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            {skillList.map((skill) => (
              <div
                key={skill}
                className="flex items-center gap-2 px-3 py-2 rounded-full bg-muted text-xs font-medium"
              >
                <span>{skill}</span>
                <Badge variant="outline" className="text-[10px]">
                  {skillStatuses[skill.toLowerCase()] || "unverified"}
                </Badge>
                {isOwner && (
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="text-muted-foreground hover:text-foreground"
                    aria-label={`Remove ${skill}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
                {isOwner && (!skillStatuses[skill.toLowerCase()] || skillStatuses[skill.toLowerCase()] !== "approved") && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-[11px]"
                    onClick={() => handleRequestVerification(skill)}
                    disabled={verifyLoading === skill}
                  >
                    {verifyLoading === skill ? "Requesting..." : "Verify"}
                  </Button>
                )}
              </div>
            ))}
          </div>

          {isOwner && (
            <div className="flex flex-col sm:flex-row gap-2 max-w-md relative">
              <Input
                placeholder="Add a skill"
                value={newSkill}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    if (showSuggestions && filteredSuggestions[highlightIndex]) {
                      handleAddFromSuggestion(filteredSuggestions[highlightIndex]);
                    } else {
                      handleAddSkill();
                    }
                  }
                  if (e.key === "ArrowDown") {
                    e.preventDefault();
                    setShowSuggestions(true);
                    setHighlightIndex((prev) => (prev + 1) % (filteredSuggestions.length || 1));
                  }
                  if (e.key === "ArrowUp") {
                    e.preventDefault();
                    setShowSuggestions(true);
                    setHighlightIndex((prev) => (prev - 1 + (filteredSuggestions.length || 1)) % (filteredSuggestions.length || 1));
                  }
                }}
              />
              <Button onClick={handleAddSkill} variant="secondary" disabled={saving}>
                {saving ? "Saving..." : "Add"}
              </Button>

              {showSuggestions && (
                <div className="absolute top-full mt-2 w-full max-h-60 overflow-y-auto rounded-md border border-border bg-popover shadow-md z-10">
                  {filteredSuggestions.map((s, idx) => (
                    <button
                      key={s}
                      type="button"
                      className={`w-full text-left px-3 py-2 text-xs hover:bg-muted/60 ${idx === highlightIndex ? "bg-muted/60" : ""}`}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleAddFromSuggestion(s);
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
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
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {userProfile?.projects?.length ? (
              userProfile.projects.map((p, i) => (
                <div
                  key={p._id || p.title}
                  className="aspect-square rounded-lg bg-muted hover:bg-muted/80 transition-colors cursor-pointer p-3 text-left flex flex-col justify-between"
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  <div className="text-sm font-semibold text-foreground line-clamp-2">{p.title}</div>
                  <div className="text-[11px] text-muted-foreground mt-2 leading-tight line-clamp-3">{p.stack}</div>
                  {p.skills?.length ? (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {p.skills.map((s) => (
                        <Badge key={s} variant="outline" className="text-[10px]">
                          {s}
                        </Badge>
                      ))}
                    </div>
                  ) : null}
                  {p.status && (
                    <div className="mt-2">
                      <Badge
                        variant={p.status === "approved" ? "secondary" : p.status === "rejected" ? "destructive" : "outline"}
                        className="text-[10px]"
                      >
                        {p.status}
                      </Badge>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="col-span-2 md:col-span-4 rounded-lg border border-dashed border-border bg-muted/40 text-muted-foreground text-sm flex items-center justify-center py-10">
                {isOwner ? "No projects yet. Add your first project to showcase your work." : "No projects submitted yet."}
              </div>
            )}
          </div>

          {isOwner && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-2 items-end">
              <Input
                placeholder="Project title"
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
              />
              <Input
                placeholder="Stack (e.g., React, Solidity)"
                value={projectStack}
                onChange={(e) => setProjectStack(e.target.value)}
              />
              <Input
                placeholder="Skills (comma separated)"
                value={projectSkills}
                onChange={(e) => setProjectSkills(e.target.value)}
              />
              <Button onClick={handleCreateProject} disabled={projectSaving}>
                {projectSaving ? "Saving..." : "Add Project"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
