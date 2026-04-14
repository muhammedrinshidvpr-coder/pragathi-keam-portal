import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { motion } from "framer-motion";
import { FileText, BookOpen, ClipboardList, FlaskConical, Calculator, Atom } from "lucide-react";

const subjectIcons: Record<string, typeof Atom> = {
  Physics: Atom,
  Chemistry: FlaskConical,
  Mathematics: Calculator,
};

const typeIcons: Record<string, typeof FileText> = {
  PYQ: ClipboardList,
  "Mock Test": BookOpen,
  Notes: FileText,
  "Formula Sheet": FileText,
  "High-Yield Topics": BookOpen,
};

const KEAM_SUBJECTS = ["Physics", "Chemistry", "Mathematics"];
const RESOURCE_CATEGORIES = ["PYQ", "High-Yield Topics", "Formula Sheet", "Mock Test"];

export default function AcademicSection() {
  const [resources, setResources] = useState<Tables<"academic_resources">[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSubject, setActiveSubject] = useState("Physics");

  useEffect(() => {
    supabase
      .from("academic_resources")
      .select("*")
      .order("subject")
      .then(({ data }) => {
        setResources(data ?? []);
        setLoading(false);
      });
  }, []);

  const filtered = resources.filter((r) => r.subject === activeSubject);
  const groupedByType = RESOURCE_CATEGORIES.map((type) => ({
    type,
    items: filtered.filter((r) => r.resource_type === type),
  }));

  return (
    <section id="resources" className="py-16 sm:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-gradient-sunset">
            KEAM Prep Resources
          </h2>
          <p className="mt-3 text-muted-foreground">
            Subject-wise PYQs, formula sheets, notes & mock tests — everything you need
          </p>
        </div>

        {loading ? (
          <div className="h-40 rounded-2xl bg-muted animate-pulse" />
        ) : (
          <>
            <div className="flex justify-center gap-3 mb-10">
              {KEAM_SUBJECTS.map((s) => {
                const Icon = subjectIcons[s] || Atom;
                return (
                  <button
                    key={s}
                    onClick={() => setActiveSubject(s)}
                    className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all ${
                      activeSubject === s
                        ? "bg-gradient-sunset text-primary-foreground shadow-lg scale-105"
                        : "bg-card border border-border text-muted-foreground hover:text-foreground hover:shadow-md"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {s}
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {groupedByType.map(({ type, items }) => {
                const Icon = typeIcons[type] || FileText;
                return (
                  <motion.div
                    key={type}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="rounded-2xl bg-card border border-border p-6 hover:shadow-lg hover:border-sunset-orange/30 transition-all"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-sunset flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <h3 className="font-bold text-foreground text-base mb-1">{type}</h3>
                    <p className="text-xs text-muted-foreground mb-4">
                      {items.length} {items.length === 1 ? "resource" : "resources"} available
                    </p>
                    {items.length > 0 ? (
                      <div className="space-y-2">
                        {items.map((r) => (
                          <a
                            key={r.id}
                            href={r.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-sm font-medium text-foreground hover:text-sunset-orange transition-colors truncate"
                          >
                            → {r.title || r.resource_type}
                          </a>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground italic">Coming soon</p>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
