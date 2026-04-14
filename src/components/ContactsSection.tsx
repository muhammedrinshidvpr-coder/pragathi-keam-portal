import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { motion } from "framer-motion";
import { Phone, MessageCircle, Mail, User, Crown } from "lucide-react";

const LEADER_KEYWORDS = ["chairman", "vice", "leader", "president", "secretary", "general"];

function isLeader(role: string) {
  const lower = role.toLowerCase();
  return LEADER_KEYWORDS.some((k) => lower.includes(k));
}

export default function ContactsSection() {
  const [contacts, setContacts] = useState<Tables<"contacts">[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("contacts")
      .select("*")
      .order("name")
      .then(({ data }) => {
        setContacts(data ?? []);
        setLoading(false);
      });
  }, []);

  const leaders = contacts.filter((c) => isLeader(c.role));
  const volunteers = contacts.filter((c) => !isLeader(c.role));

  const ContactCard = ({ c, large }: { c: Tables<"contacts">; large?: boolean }) => (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`rounded-2xl bg-card border border-border shadow-sm hover:shadow-lg transition-shadow ${large ? "p-6" : "p-4"}`}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className={`rounded-full bg-gradient-sunset flex items-center justify-center ${large ? "w-14 h-14" : "w-11 h-11"}`}>
          {large ? <Crown className="w-6 h-6 text-primary-foreground" /> : <User className="w-5 h-5 text-primary-foreground" />}
        </div>
        <div>
          <h3 className={`font-bold text-foreground ${large ? "text-lg" : "text-base"}`}>{c.name}</h3>
          <p className="text-xs text-muted-foreground font-medium">{c.role}</p>
        </div>
      </div>

      <div className="flex gap-2">
        {c.phone_number && (
          <>
            <a
              href={`tel:${c.phone_number}`}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-secondary text-secondary-foreground text-sm font-semibold hover:bg-accent transition-colors"
            >
              <Phone className="w-3.5 h-3.5" /> Call
            </a>
            <a
              href={`https://wa.me/91${c.phone_number.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-gradient-sunset text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
            </a>
          </>
        )}
        {c.email && (
          <a
            href={`mailto:${c.email}`}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-secondary text-secondary-foreground text-sm font-semibold hover:bg-accent transition-colors"
          >
            <Mail className="w-3.5 h-3.5" /> Email
          </a>
        )}
      </div>
    </motion.div>
  );

  return (
    <section id="contacts" className="py-16 sm:py-24 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-gradient-sunset">
            Direct Mentorship & Help Desk
          </h2>
          <p className="mt-3 text-muted-foreground">
            Reach out to union leaders and volunteers for guidance
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-40 rounded-2xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : contacts.length === 0 ? (
          <p className="text-center text-muted-foreground py-16 text-lg">
            Help desk directory coming soon! 📞
          </p>
        ) : (
          <>
            {leaders.length > 0 && (
              <div className="mb-10">
                <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                  <Crown className="w-5 h-5 text-sunset-orange" /> Union Leaders
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {leaders.map((c) => (
                    <ContactCard key={c.id} c={c} large />
                  ))}
                </div>
              </div>
            )}

            {volunteers.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-foreground mb-4">Help Desk Volunteers</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {volunteers.map((c) => (
                    <ContactCard key={c.id} c={c} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
