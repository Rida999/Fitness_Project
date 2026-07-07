import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Dumbbell } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AppUser, getCurrentProfile, isAdminEmail, supabase } from "@/lib/supabase";

const adminNavigation = [
  { name: "Dashboard", href: "/admin" },
  { name: "Programs", href: "/admin/programs" },
  { name: "Trainers", href: "/admin/trainers" },
  { name: "Slots", href: "/admin/slots" },
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
    <header className="relative w-full bg-background/95 backdrop-blur-sm z-50 border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative h-16 flex items-center">
        {/* Logo - Left */}
        <div className="flex items-center space-x-2 h-full">
          <Dumbbell className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold text-foreground">FitTrainer Pro</span>
        </div>

        {/* Nav Links - Centered Absolutely */}
        <nav className="absolute left-1/2 top-0 h-full flex items-center -translate-x-1/2 space-x-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`text-foreground hover:text-primary transition-colors font-medium ${
                isActive(item.href) ? "text-primary" : ""
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Auth Buttons / Avatar - Right */}
        <div className="absolute right-0 top-0 h-full flex items-center space-x-4">
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
                className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white font-bold focus:outline-none focus:ring-2 ring-2 ring-blue-300"
                onClick={() => setShowDropdown((v) => !v)}
                aria-label="Account"
              >
                {initials}
              </button>
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 rounded shadow-lg bg-white ring-1 ring-black/10 z-50">
                  <div className="px-4 py-2 border-b">
                    <div className="text-sm font-semibold text-gray-700">
                      {user.first_name} {user.last_name}
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      {user.email}
                    </div>
                  </div>
                  <button
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                    onClick={handleSignOut}
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
