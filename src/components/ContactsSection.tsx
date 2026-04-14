import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { motion } from "framer-motion";
import { Phone, MessageCircle, Mail, User } from "lucide-react";

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

  return (
    <section id="contacts" className="py-16 sm:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-gradient-sunset">
            Union Directory
          </h2>
          <p className="mt-3 text-muted-foreground">
            Reach out to union members and volunteers
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
            Contact directory coming soon! 📞
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {contacts.map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="rounded-2xl bg-card border border-border p-5 shadow-sm hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 rounded-full bg-gradient-sunset flex items-center justify-center">
                    <User className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">{c.name}</h3>
                    <p className="text-xs text-muted-foreground font-medium">{c.role}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  {c.phone_number && (
                    <>
                      <a
                        href={`tel:${c.phone_number}`}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm font-semibold hover:bg-accent transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5" /> Call
                      </a>
                      <a
                        href={`https://wa.me/91${c.phone_number.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-gradient-sunset text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
                      >
                        <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                      </a>
                    </>
                  )}
                  {c.email && (
                    <a
                      href={`mailto:${c.email}`}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm font-semibold hover:bg-accent transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5" /> Email
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
