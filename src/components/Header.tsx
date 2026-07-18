import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AppUser, getCurrentProfile, isAdminEmail, supabase } from "@/lib/supabase";
import GymFactoryLogo from "@/components/GymFactoryLogo";
import { Menu, X } from "lucide-react";

const adminNavigation = [
  { name: "Dashboard", href: "/admin" },
  { name: "Programs", href: "/admin/programs" },
  { name: "Trainers", href: "/admin/trainers" },
  { name: "Slots", href: "/admin/slots" },
  { name: "Bookings", href: "/admin/bookings" },
  { name: "Users", href: "/admin/view_users" },
  { name: "All Trainers", href: "/admin/view_trainers" },
];

const userNavigation = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Home", href: "/" },
  { name: "Trainers", href: "/trainers" },
  { name: "Programs", href: "/programs" },
  { name: "Book Session", href: "/book" },
];

const guestNavigation = [
  { name: "Home", href: "/" },
  { name: "Trainers", href: "/trainers" },
  { name: "Programs", href: "/programs" },
  { name: "Book Session", href: "/book" },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState<AppUser | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const avatarRef = useRef(null);

  useEffect(() => {
    getCurrentProfile().then((profile) => {
      setUser(profile);
      if (profile) localStorage.setItem("user", JSON.stringify(profile));
    });

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        localStorage.removeItem("user");
        setUser(null);
        return;
      }

      window.setTimeout(async () => {
        const profile = await getCurrentProfile();
        setUser(profile);
        if (profile) localStorage.setItem("user", JSON.stringify(profile));
      }, 0);
    });

    return () => data.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setShowDropdown(false);
  }, [location.pathname]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: any) {
      if (avatarRef.current && !(avatarRef.current as any).contains(e.target)) {
        setShowDropdown(false);
      }
    }
    if (showDropdown) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showDropdown]);

  // Only admin@admin.com can see admin nav
  const isAdmin = isAdminEmail(user?.email);
  const navigation = isAdmin ? adminNavigation : user ? userNavigation : guestNavigation;

  const isActive = (href: string) => {
    if (href === "/") return location.pathname === "/";
    return href === location.pathname;
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("user");
    setUser(null);
    navigate("/signin");
  };

  const initials =
    user?.first_name && user?.last_name
      ? user.first_name[0].toUpperCase() + user.last_name[0].toUpperCase()
      : user?.first_name
      ? user.first_name[0].toUpperCase()
      : "A";

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container relative mx-auto flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary/20 bg-background text-foreground shadow-sm transition hover:bg-primary hover:text-white lg:hidden"
          onClick={() => setIsMenuOpen((value) => !value)}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <Link to="/" className="flex min-w-0 shrink-0 items-center">
          <GymFactoryLogo textClassName="text-base sm:text-lg" />
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-2 lg:flex">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`rounded-full px-3 py-2 text-sm font-semibold transition-colors ${
                isActive(item.href)
                  ? "bg-primary/10 text-primary"
                  : "text-foreground hover:bg-secondary hover:text-primary"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="hidden shrink-0 items-center space-x-3 lg:flex">
          {!user ? (
            <>
              <Link to="/signin">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link to="/signup">
                <Button variant="energy">Get Started</Button>
              </Link>
            </>
          ) : (
            <div className="relative" ref={avatarRef}>
              <button
                className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white font-bold focus:outline-none focus:ring-2 ring-2 ring-energy/70"
                onClick={() => setShowDropdown((v) => !v)}
                aria-label="Account"
              >
                {initials}
              </button>
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 rounded shadow-lg bg-card ring-1 ring-primary/20 z-50">
                  <div className="px-4 py-2 border-b">
                    <div className="text-sm font-semibold text-foreground">
                      {user.first_name} {user.last_name}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {user.email}
                    </div>
                  </div>
                  <button
                    className="w-full text-left px-4 py-2 text-sm hover:bg-secondary"
                    onClick={handleSignOut}
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex min-w-10 shrink-0 items-center justify-end gap-2 lg:hidden">
          {user && (
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-white ring-2 ring-energy/70">
              {initials}
            </div>
          )}
        </div>
      </div>

      {isMenuOpen && (
        <div className="border-t bg-background shadow-xl lg:hidden">
          <div className="container mx-auto space-y-4 px-4 py-4 sm:px-6">
            <nav className="grid gap-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center justify-between rounded-lg px-4 py-3 text-sm font-bold transition ${
                    isActive(item.href)
                      ? "bg-primary text-white"
                      : "bg-secondary/60 text-foreground hover:bg-primary hover:text-white"
                  }`}
                >
                  {item.name}
                  <span className="h-2 w-2 rounded-full bg-current opacity-40" />
                </Link>
              ))}
            </nav>

            {!user ? (
              <div className="grid grid-cols-2 gap-3 border-t pt-4">
                <Button asChild variant="outline" className="border-primary/30 text-primary hover:bg-primary hover:text-white">
                  <Link to="/signin">Sign In</Link>
                </Button>
                <Button asChild className="bg-primary text-white hover:bg-primary/90">
                  <Link to="/signup">Get Started</Link>
                </Button>
              </div>
            ) : (
              <div className="border-t pt-4">
                <div className="mb-3 rounded-lg bg-secondary/60 px-4 py-3">
                  <div className="text-sm font-semibold text-foreground">
                    {user.first_name} {user.last_name}
                  </div>
                  <div className="truncate text-xs text-muted-foreground">{user.email}</div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full border-primary/30 text-primary hover:bg-primary hover:text-white"
                  onClick={handleSignOut}
                >
                  Sign Out
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
