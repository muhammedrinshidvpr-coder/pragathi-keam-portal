import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { motion } from "framer-motion";
import { Bell, ExternalLink, AlertTriangle } from "lucide-react";

export default function EventsSection() {
  const [events, setEvents] = useState<Tables<"events">[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("events")
      .select("*")
      .order("event_date", { ascending: true })
      .then(({ data }) => {
        setEvents(data ?? []);
        setLoading(false);
      });
  }, []);

  return (
    <section id="alerts" className="py-16 sm:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sunset-red opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-sunset-red" />
            </span>
            <span className="text-xs font-bold uppercase tracking-widest text-sunset-red">Live</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-gradient-sunset">
            Live KEAM Alerts
          </h2>
          <p className="mt-3 text-muted-foreground text-base">
            Stay updated with KEAM notifications, deadlines & important dates
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 rounded-2xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : events.length === 0 ? (
          <p className="text-center text-muted-foreground py-16 text-lg">
            No active KEAM alerts. Check back soon! 🔔
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event, i) => {
              const isUpcoming = event.event_date && new Date(event.event_date) > new Date();
              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group rounded-2xl overflow-hidden bg-card border border-border shadow-sm hover:shadow-xl transition-all duration-300"
                >
                  {event.image_url && (
                    <div className="h-44 overflow-hidden">
                      <img
                        src={event.image_url}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="p-5">
                    <div className="flex items-start gap-2">
                      {isUpcoming ? (
                        <AlertTriangle className="w-4 h-4 text-sunset-orange mt-1 shrink-0" />
                      ) : (
                        <Bell className="w-4 h-4 text-sunset-orange mt-1 shrink-0" />
                      )}
                      <h3 className="text-lg font-bold text-foreground">{event.title}</h3>
                    </div>
                    {event.event_date && (
                      <p className="flex items-center gap-1.5 text-sm text-sunset-orange font-medium mt-1 ml-6">
                        {new Date(event.event_date).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    )}
                    {event.description && (
                      <p className="mt-2 text-sm text-muted-foreground line-clamp-2 ml-6">
                        {event.description}
                      </p>
                    )}
                    {event.registration_link && (
                      <a
                        href={event.registration_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 ml-6 inline-flex items-center gap-1.5 text-sm font-semibold text-gradient-sunset hover:opacity-80 transition-opacity"
                      >
                        Learn More <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
