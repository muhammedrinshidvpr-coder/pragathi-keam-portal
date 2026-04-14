import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { motion } from "framer-motion";
import { FileText, BookOpen, ClipboardList } from "lucide-react";

const typeIcons: Record<string, typeof FileText> = {
  PYQ: ClipboardList,
  "Mock Test": BookOpen,
  Notes: FileText,
};

export default function AcademicSection() {
  const [resources, setResources] = useState<Tables<"academic_resources">[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSubject, setActiveSubject] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from("academic_resources")
      .select("*")
      .order("subject")
      .then(({ data }) => {
        setResources(data ?? []);
        setLoading(false);
        if (data && data.length > 0) setActiveSubject(data[0].subject);
      });
  }, []);

  const subjects = [...new Set(resources.map((r) => r.subject))];
  const filtered = resources.filter((r) => r.subject === activeSubject);

  return (
    <section id="academics" className="py-16 sm:py-24 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-gradient-sunset">
            Academic Hub
          </h2>
          <p className="mt-3 text-muted-foreground">
            PYQs, mock tests, and notes — all in one place
          </p>
        </div>

        {loading ? (
          <div className="h-40 rounded-2xl bg-muted animate-pulse" />
        ) : resources.length === 0 ? (
          <p className="text-center text-muted-foreground py-16 text-lg">
            Resources coming soon! 📚
          </p>
        ) : (
          <>
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {subjects.map((s) => (
                <button
                  key={s}
                  onClick={() => setActiveSubject(s)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                    activeSubject === s
                      ? "bg-gradient-sunset text-primary-foreground shadow-md"
                      : "bg-card border border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((r, i) => {
                const Icon = typeIcons[r.resource_type] || FileText;
                return (
                  <motion.a
                    key={r.id}
                    href={r.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border hover:shadow-lg hover:border-sunset-orange/30 transition-all group"
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-sunset flex items-center justify-center">
                      <Icon className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-foreground truncate">
                        {r.title || r.resource_type}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {r.resource_type} • {r.subject}
                      </p>
                    </div>
                  </motion.a>
                );
              })}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
