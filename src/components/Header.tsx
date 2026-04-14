import { Link } from "@tanstack/react-router";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md shadow-lg border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/images/pragathi-logo.jpeg"
              alt="Pragathi College Union"
              className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg object-contain shadow-md"
            />
            <div className="hidden sm:block">
              <h1 className="text-lg font-extrabold tracking-tight text-foreground leading-tight">
                TKMCE
              </h1>
              <p className="text-xs font-medium text-muted-foreground -mt-0.5">
                College of Engineering
              </p>
            </div>
          </Link>

          <div className="text-center">
            <h2 className="text-lg sm:text-2xl font-extrabold tracking-tight text-gradient-sunset">
              Pragathi 2026
            </h2>
            <p className="text-[10px] sm:text-xs font-medium text-muted-foreground tracking-widest uppercase">
              College Union
            </p>
          </div>

          <nav className="flex items-center gap-2 sm:gap-4">
            <Link
              to="/"
              className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
              activeProps={{ className: "text-sm font-semibold text-foreground" }}
            >
              Home
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
