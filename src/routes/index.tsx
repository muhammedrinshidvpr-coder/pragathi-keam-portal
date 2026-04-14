import { createFileRoute } from "@tanstack/react-router";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import EventsSection from "@/components/EventsSection";
import AcademicSection from "@/components/AcademicSection";
import ContactsSection from "@/components/ContactsSection";
import Footer from "@/components/Footer";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Pragathi 2026 — TKM College Union" },
      { name: "description", content: "Official portal for Pragathi College Union 2026 at TKM College of Engineering. Events, academics, and more." },
      { property: "og:title", content: "Pragathi 2026 — TKM College Union" },
      { property: "og:description", content: "Become a part of the history of TKM. Pragathi College Union 2026." },
    ],
  }),
});

function Index() {
  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <EventsSection />
      <AcademicSection />
      <ContactsSection />
      <Footer />
    </div>
  );
}
