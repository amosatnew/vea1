import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Music, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [activeLink, setActiveLink] = useState("home");

  // Update active link based on current path
  useEffect(() => {
    const path = location.pathname;
    const searchParams = new URLSearchParams(location.search);
    const tab = searchParams.get('tab');

    if (path === '/') {
      if (tab === 'artists') {
        setActiveLink('artists');
      } else if (tab === 'venues') {
        setActiveLink('venues');
      } else if (tab === 'events' || !tab) {
        setActiveLink('events');
      } else {
        setActiveLink('home');
      }
    } else if (path.includes('/event/')) {
      setActiveLink('events');
    } else if (path.includes('/artist/')) {
      setActiveLink('artists');
    } else if (path.includes('/venue/')) {
      setActiveLink('venues');
    } else if (path === '/events') {
      setActiveLink('events');
    } else if (path === '/artists') {
      setActiveLink('artists');
    } else if (path === '/venues') {
      setActiveLink('venues');
    } else {
      setActiveLink('home');
    }
  }, [location]);

  // Check login status when component mounts or when localStorage changes
  useEffect(() => {
    const checkLoginStatus = () => {
      const loggedIn = localStorage.getItem("userLoggedIn") === "true";
      setIsLoggedIn(loggedIn);

      if (loggedIn) {
        setUserName(localStorage.getItem("userName") || "User");
        setUserEmail(localStorage.getItem("userEmail") || "");
      } else {
        setUserName("");
        setUserEmail("");
      }
    };

    // Check on initial load
    checkLoginStatus();

    // Set up event listener for storage changes
    window.addEventListener("storage", checkLoginStatus);

    // Custom event for internal state changes
    window.addEventListener("loginStateChange", checkLoginStatus);

    return () => {
      window.removeEventListener("storage", checkLoginStatus);
      window.removeEventListener("loginStateChange", checkLoginStatus);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userLoggedIn");
    setIsLoggedIn(false);
    setUserName("");
    setUserEmail("");

    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event("loginStateChange"));

    // Navigate to home
    navigate("/");
  };

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50 backdrop-blur-md bg-opacity-80">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-primary p-2 rounded-md">
              <Music size={24} className="text-background" />
            </div>
            <span className="text-xl font-bold">DarkEvents</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/events"
              className={`transition-all duration-150 ${activeLink === 'events'
                ? 'text-primary font-medium'
                : 'text-muted-foreground hover:text-primary'}`}
            >
              Events
            </Link>
            <Link
              to="/artists"
              className={`transition-all duration-150 ${activeLink === 'artists'
                ? 'text-primary font-medium'
                : 'text-muted-foreground hover:text-primary'}`}
            >
              Artists
            </Link>
            <Link
              to="/venues"
              className={`transition-all duration-150 ${activeLink === 'venues'
                ? 'text-primary font-medium'
                : 'text-muted-foreground hover:text-primary'}`}
            >
              Venues
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 hover:bg-primary/10 transition-all duration-150"
                  onClick={() => navigate("/profile")}
                >
                  <Avatar className="h-8 w-8 border border-primary/20">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userEmail}`} />
                    <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:inline">Profile</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="border-primary/20 hover:bg-primary/10 hover:text-primary transition-all duration-150"
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <>
                <Button
                  variant="ghost"
                  onClick={() => navigate("/signin")}
                  className="hover:bg-primary/10 hover:text-primary transition-all duration-150"
                >
                  Sign In
                </Button>
                <Button
                  onClick={() => navigate("/join")}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-150"
                >
                  Join Now
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
