import { useParams, useNavigate, Link } from "react-router-dom";
import { events, artists, venues } from "@/data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ArrowLeft, MapPin, Calendar, Clock, CreditCard, Users } from "lucide-react";
import { useCallback } from "react";

const EventDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const event = events.find(e => e.id === id);

  // Smart back function that preserves scroll position
  const handleGoBack = useCallback(() => {
    const savedPosition = sessionStorage.getItem('scrollPosition');

    // Check if we came from the home page
    if (document.referrer.includes(window.location.host)) {
      navigate(-1); // Go back in history
    } else {
      navigate("/events"); // Default to events page
    }
  }, [navigate]);

  if (!event) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Event not found</h2>
          <Button onClick={() => navigate("/")}>Go back to events</Button>
        </div>
      </div>
    );
  }

  // Get related data
  const venue = venues.find(v => v.id === event.venueId);
  const eventArtists = artists.filter(a => event.artistIds.includes(a.id));

  // Date and time
  const eventDate = new Date(event.date);
  const formattedDate = format(eventDate, "EEEE, MMMM do, yyyy");
  const formattedTime = format(eventDate, "h:mm a");

  return (
    <div className="container mx-auto py-8 px-4 animate-in fade-in duration-150">
      <Button
        variant="ghost"
        className="mb-6 flex items-center gap-2 hover:bg-primary/10 transition-colors duration-150"
        onClick={handleGoBack}
      >
        <ArrowLeft size={18} />
        Back
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content - left 2/3 */}
        <div className="lg:col-span-2 space-y-8">
          {/* Hero section */}
          <div className="relative rounded-xl overflow-hidden">
            <div className="h-96 w-full">
              <img
                src={event.image}
                alt={event.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent flex flex-col justify-end p-6">
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-primary">{event.category}</Badge>
                  {event.tags.map(tag => (
                    <Badge key={tag} variant="secondary">{tag}</Badge>
                  ))}
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white">{event.name}</h1>
              </div>
            </div>
          </div>

          {/* Event description */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">About This Event</h2>
            <p className="text-muted-foreground">{event.description}</p>
          </div>

          {/* Artists section */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Featured Artists</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {eventArtists.map(artist => (
                <Link
                  key={artist.id}
                  to={`/artist/${artist.id}`}
                  className="flex items-center gap-4 p-4 rounded-lg bg-card hover:bg-card/80 transition-colors duration-150"
                >
                  <div className="h-16 w-16 rounded-full overflow-hidden">
                    <img
                      src={artist.image}
                      alt={artist.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium">{artist.name}</h3>
                    <p className="text-sm text-muted-foreground">{artist.genre}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar - right 1/3 */}
        <div className="space-y-6">
          {/* Event details card */}
          <div className="bg-card rounded-xl p-6 space-y-4">
            <h2 className="text-xl font-semibold">Event Details</h2>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Calendar size={20} className="text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p>{formattedDate}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock size={20} className="text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Time</p>
                  <p>{formattedTime}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <CreditCard size={20} className="text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Price</p>
                  <p>${event.price}</p>
                </div>
              </div>
            </div>

            <Button className="w-full bg-primary hover:bg-primary/90 transition-all duration-150">Get Tickets</Button>
          </div>

          {/* Venue information */}
          {venue && (
            <div className="bg-card rounded-xl p-6 space-y-4">
              <h2 className="text-xl font-semibold">Venue</h2>

              <Link
                to={`/venue/${venue.id}`}
                className="block rounded-lg overflow-hidden transition-transform duration-150 hover:scale-[1.02]"
              >
                <img
                  src={venue.image}
                  alt={venue.name}
                  className="w-full h-40 object-cover"
                />
              </Link>

              <div>
                <h3 className="font-medium">{venue.name}</h3>
                <div className="flex items-center gap-1 mt-1 text-muted-foreground">
                  <MapPin size={16} />
                  <p className="text-sm">{venue.location}</p>
                </div>
                <div className="flex items-center gap-1 mt-1 text-muted-foreground">
                  <Users size={16} />
                  <p className="text-sm">Capacity: {venue.capacity}</p>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full hover:bg-primary/10 border-primary/20 transition-all duration-150"
                onClick={() => navigate(`/venue/${venue.id}`)}
              >
                View Venue
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
