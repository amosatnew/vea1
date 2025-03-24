import { useParams, useNavigate, Link } from "react-router-dom";
import { artists, events } from "@/data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Music, Instagram, Twitter, Globe } from "lucide-react";
import CardComponent from "@/components/ui/CardComponent";
import { useCallback } from "react";

const ArtistDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const artist = artists.find(a => a.id === id);

  // Smart back function that preserves scroll position
  const handleGoBack = useCallback(() => {
    // Check if we came from the home page
    if (document.referrer.includes(window.location.host)) {
      navigate(-1); // Go back in history
    } else {
      navigate("/artists"); // Default to artists page
    }
  }, [navigate]);

  if (!artist) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Artist not found</h2>
          <Button onClick={() => navigate("/")}>Go back to events</Button>
        </div>
      </div>
    );
  }

  // Get related events
  const artistEvents = events.filter(e => artist.eventIds.includes(e.id));

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
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="w-full md:w-1/3 aspect-square rounded-xl overflow-hidden">
              <img
                src={artist.image}
                alt={artist.name}
                className="w-full h-full object-cover transition-transform duration-150 hover:scale-[1.02]"
              />
            </div>

            <div className="flex-1 space-y-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">{artist.name}</h1>
                <div className="flex items-center gap-2 mt-2">
                  <Music size={16} className="text-primary" />
                  <span className="text-muted-foreground">{artist.genre}</span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {artist.tags.map(tag => (
                  <Badge key={tag} variant="secondary">{tag}</Badge>
                ))}
              </div>

              {/* Social links */}
              <div className="flex gap-3">
                {artist.socialLinks.instagram && (
                  <Button variant="outline" size="icon" asChild className="transition-transform duration-150 hover:scale-105 border-primary/20">
                    <a href={`https://instagram.com/${artist.socialLinks.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer">
                      <Instagram size={18} />
                    </a>
                  </Button>
                )}

                {artist.socialLinks.twitter && (
                  <Button variant="outline" size="icon" asChild className="transition-transform duration-150 hover:scale-105 border-primary/20">
                    <a href={`https://twitter.com/${artist.socialLinks.twitter.replace('@', '')}`} target="_blank" rel="noopener noreferrer">
                      <Twitter size={18} />
                    </a>
                  </Button>
                )}

                {artist.socialLinks.website && (
                  <Button variant="outline" size="icon" asChild className="transition-transform duration-150 hover:scale-105 border-primary/20">
                    <a href={`https://${artist.socialLinks.website}`} target="_blank" rel="noopener noreferrer">
                      <Globe size={18} />
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Artist bio */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">About</h2>
            <p className="text-muted-foreground">{artist.description}</p>
          </div>

          {/* Upcoming events */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Upcoming Events</h2>

            {artistEvents.length === 0 ? (
              <p className="text-muted-foreground">No upcoming events.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in-50 duration-300">
                {artistEvents.map(event => (
                  <CardComponent
                    key={event.id}
                    id={event.id}
                    type="event"
                    title={event.name}
                    subtitle={event.venue}
                    description={event.description}
                    image={event.image}
                    tags={event.tags}
                    price={event.price}
                    date={event.date}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar - right 1/3 */}
        <div className="space-y-6">
          {/* Popular events */}
          <div className="bg-card rounded-xl p-6 space-y-4">
            <h2 className="text-xl font-semibold">Popular Events</h2>

            <ul className="space-y-3">
              {artist.popularEvents.map((eventName, index) => {
                // Find the event that matches this name
                const event = events.find(e => e.name === eventName);

                return (
                  <li key={index} className="flex items-center gap-3">
                    {event ? (
                      <Link to={`/event/${event.id}`} className="flex items-center gap-3 hover:text-primary transition-colors duration-150">
                        <div className="h-12 w-12 rounded-md overflow-hidden flex-shrink-0">
                          <img
                            src={event.image}
                            alt={eventName}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <span>{eventName}</span>
                      </Link>
                    ) : (
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-md bg-muted flex-shrink-0" />
                        <span>{eventName}</span>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Similar artists recommendation - placeholder */}
          <div className="bg-card rounded-xl p-6 space-y-4">
            <h2 className="text-xl font-semibold">You Might Also Like</h2>

            <ul className="space-y-3">
              {artists
                .filter(a => a.id !== artist.id && a.genre === artist.genre)
                .slice(0, 3)
                .map(similarArtist => (
                  <li key={similarArtist.id}>
                    <Link
                      to={`/artist/${similarArtist.id}`}
                      className="flex items-center gap-3 hover:text-primary transition-colors duration-150"
                    >
                      <div className="h-12 w-12 rounded-full overflow-hidden flex-shrink-0">
                        <img
                          src={similarArtist.image}
                          alt={similarArtist.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <span className="font-medium">{similarArtist.name}</span>
                        <p className="text-xs text-muted-foreground">{similarArtist.genre}</p>
                      </div>
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtistDetail;
