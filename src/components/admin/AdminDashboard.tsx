import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CalendarDays, Users, BookOpen, Link2, LogOut } from "lucide-react";
import ManageEvents from "./ManageEvents";
import ManageContacts from "./ManageContacts";
import ManageResources from "./ManageResources";
import ManageSocials from "./ManageSocials";

const tabs = [
  { key: "events", label: "Events", icon: CalendarDays },
  { key: "contacts", label: "Contacts", icon: Users },
  { key: "resources", label: "Resources", icon: BookOpen },
  { key: "socials", label: "Socials", icon: Link2 },
] as const;

type TabKey = (typeof tabs)[number]["key"];

export default function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [active, setActive] = useState<TabKey>("events");

  const handleLogout = async () => {
    await supabase.auth.signOut();
    onLogout();
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-16 sm:w-56 bg-card border-r border-border flex flex-col shrink-0">
        <div className="p-4 border-b border-border hidden sm:block">
          <h2 className="text-lg font-extrabold text-gradient-sunset">Admin</h2>
          <p className="text-xs text-muted-foreground">Pragathi 2026</p>
        </div>
        <nav className="flex-1 p-2 space-y-1">
          {tabs.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActive(key)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active === key
                  ? "bg-gradient-sunset text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </nav>
        <div className="p-2 border-t border-border">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-4 sm:p-8 overflow-auto">
        {active === "events" && <ManageEvents />}
        {active === "contacts" && <ManageContacts />}
        {active === "resources" && <ManageResources />}
        {active === "socials" && <ManageSocials />}
      </main>
    </div>
  );
}
