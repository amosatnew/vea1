import { Link } from "react-router-dom";
import { Music, Facebook, Twitter, Instagram, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border mt-16">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and about */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-primary p-2 rounded-md">
                <Music size={24} className="text-background" />
              </div>
              <span className="text-xl font-bold">DarkEvents</span>
            </Link>
            <p className="text-muted-foreground text-sm">
              Find and discover the best events, artists, and venues in your area. DarkEvents is your go-to platform for all things entertainment.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-muted-foreground hover:text-primary transition-colors text-sm">Home</Link></li>
              <li><Link to="/?tab=events" className="text-muted-foreground hover:text-primary transition-colors text-sm">Events</Link></li>
              <li><Link to="/?tab=artists" className="text-muted-foreground hover:text-primary transition-colors text-sm">Artists</Link></li>
              <li><Link to="/?tab=venues" className="text-muted-foreground hover:text-primary transition-colors text-sm">Venues</Link></li>
            </ul>
          </div>

          {/* Company info */}
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-muted-foreground hover:text-primary transition-colors text-sm">About Us</Link></li>
              <li><Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors text-sm">Contact</Link></li>
              <li><Link to="/careers" className="text-muted-foreground hover:text-primary transition-colors text-sm">Careers</Link></li>
              <li><Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors text-sm">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors text-sm">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Social media */}
          <div>
            <h3 className="font-semibold mb-4">Connect With Us</h3>
            <div className="flex gap-4">
              <a href="#" className="bg-muted/50 p-2 rounded-full hover:bg-primary/20 hover:text-primary transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="bg-muted/50 p-2 rounded-full hover:bg-primary/20 hover:text-primary transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="bg-muted/50 p-2 rounded-full hover:bg-primary/20 hover:text-primary transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="bg-muted/50 p-2 rounded-full hover:bg-primary/20 hover:text-primary transition-colors">
                <Youtube size={20} />
              </a>
            </div>
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Subscribe to our newsletter</h4>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="bg-muted/50 px-3 py-2 rounded-l-md border-r-0 focus:outline-none text-sm w-full border border-primary/10"
                />
                <button className="bg-primary text-primary-foreground px-3 py-2 rounded-r-md text-sm hover:bg-primary/90 transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-6 text-center text-muted-foreground text-sm">
          <p>&copy; {new Date().getFullYear()} DarkEvents. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
