import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";

interface CutoffRow {
  id: string;
  branch: string;
  year: number;
  general_rank: number | null;
  obc_rank: number | null;
  sc_rank: number | null;
  st_rank: number | null;
}

const SAMPLE_DATA: CutoffRow[] = [
  { id: "1", branch: "Computer Science & Engineering", year: 2025, general_rank: 2850, obc_rank: 5200, sc_rank: 12500, st_rank: 18000 },
  { id: "2", branch: "Electronics & Communication", year: 2025, general_rank: 5100, obc_rank: 9800, sc_rank: 18000, st_rank: 25000 },
  { id: "3", branch: "Electrical & Electronics", year: 2025, general_rank: 8200, obc_rank: 14500, sc_rank: 22000, st_rank: 30000 },
  { id: "4", branch: "Mechanical Engineering", year: 2025, general_rank: 12000, obc_rank: 20000, sc_rank: 28000, st_rank: 35000 },
  { id: "5", branch: "Civil Engineering", year: 2025, general_rank: 15000, obc_rank: 25000, sc_rank: 32000, st_rank: 40000 },
];

export default function CutoffSection() {
  const [data, setData] = useState<CutoffRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("cutoff_ranks")
      .select("*")
      .order("branch")
      .then(({ data: rows }) => {
        setData(rows && rows.length > 0 ? rows : SAMPLE_DATA);
        setLoading(false);
      });
  }, []);

  const years = [...new Set(data.map((d) => d.year))].sort((a, b) => b - a);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  useEffect(() => {
    if (years.length > 0 && selectedYear === null) {
      setSelectedYear(years[0]);
    }
  }, [years, selectedYear]);

  const filtered = data.filter((d) => d.year === selectedYear);

  return (
    <section id="cutoffs" className="py-16 sm:py-24 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-gradient-sunset">
            TKMCE Cut-Off Predictor
          </h2>
          <p className="mt-3 text-muted-foreground">
            Previous year KEAM cut-off ranks for TKMCE branches — plan your target!
          </p>
        </div>

        {loading ? (
          <div className="h-48 rounded-2xl bg-muted animate-pulse" />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {years.length > 1 && (
              <div className="flex justify-center gap-2 mb-6">
                {years.map((y) => (
                  <button
                    key={y}
                    onClick={() => setSelectedYear(y)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                      selectedYear === y
                        ? "bg-gradient-sunset text-primary-foreground shadow-md"
                        : "bg-card border border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {y}
                  </button>
                ))}
              </div>
            )}

            <div className="overflow-x-auto bg-card border border-border rounded-2xl shadow-sm">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="text-left px-5 py-4 font-bold text-foreground">Branch</th>
                    <th className="text-center px-5 py-4 font-bold text-foreground">General</th>
                    <th className="text-center px-5 py-4 font-bold text-foreground">OBC</th>
                    <th className="text-center px-5 py-4 font-bold text-foreground">SC</th>
                    <th className="text-center px-5 py-4 font-bold text-foreground">ST</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((row) => (
                    <tr key={row.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                      <td className="px-5 py-3.5 font-semibold text-foreground flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-sunset-orange shrink-0" />
                        {row.branch}
                      </td>
                      <td className="text-center px-5 py-3.5 text-muted-foreground font-medium">
                        {row.general_rank?.toLocaleString() ?? "—"}
                      </td>
                      <td className="text-center px-5 py-3.5 text-muted-foreground font-medium">
                        {row.obc_rank?.toLocaleString() ?? "—"}
                      </td>
                      <td className="text-center px-5 py-3.5 text-muted-foreground font-medium">
                        {row.sc_rank?.toLocaleString() ?? "—"}
                      </td>
                      <td className="text-center px-5 py-3.5 text-muted-foreground font-medium">
                        {row.st_rank?.toLocaleString() ?? "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-center text-xs text-muted-foreground mt-4">
              * Ranks are approximate and based on previous year data. Actual cut-offs may vary.
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
