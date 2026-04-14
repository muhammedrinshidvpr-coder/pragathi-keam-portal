import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { Globe, ExternalLink } from "lucide-react";

export default function Footer() {
  const [links, setLinks] = useState<Tables<"social_links">[]>([]);

  useEffect(() => {
    supabase
      .from("social_links")
      .select("*")
      .then(({ data }) => setLinks(data ?? []));
  }, []);

  return (
    <footer className="bg-foreground text-background py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center gap-6">
          <div>
            <h3 className="text-xl font-extrabold text-gradient-sunset">
              Pragathi 2026
            </h3>
            <p className="text-sm text-background/60 mt-1">
              TKM College of Engineering — College Union
            </p>
          </div>

          {links.length > 0 && (
            <div className="flex gap-4">
              {links.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-background/10 hover:bg-background/20 text-sm transition-colors"
                  aria-label={link.platform_name}
                >
                  <Globe className="w-3.5 h-3.5" />
                  {link.platform_name}
                </a>
              ))}
            </div>
          )}

          <p className="text-xs text-background/40">
            © {new Date().getFullYear()} Pragathi College Union. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
