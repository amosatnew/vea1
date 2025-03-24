import { useParams, useNavigate, Link } from "react-router-dom";
import { venues, events, artists } from "@/data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft, MapPin, Users, CheckCircle, Calendar, Clock,
  Info, Star, MessageCircle, Share2, Bookmark, Heart,
  CalendarDays, Music, Globe, Facebook, Twitter, Instagram
} from "lucide-react";
import CardComponent from "@/components/ui/CardComponent";
import { useCallback, useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { format } from "date-fns";

const VenueDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // State variables
  const [activeTab, setActiveTab] = useState("about");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const venue = venues.find(v => v.id === id);

  // Check if user is logged in
  useEffect(() => {
    const loggedIn = localStorage.getItem("userLoggedIn") === "true";
    setIsLoggedIn(loggedIn);

    // Check if venue is saved
    if (loggedIn) {
      const savedItems = JSON.parse(localStorage.getItem("savedItems") || "[]");
      setIsSaved(savedItems.some((item: any) => item.id === id && item.type === "venue"));
    }
  }, [id]);

  // Smart back function that preserves scroll position
  const handleGoBack = useCallback(() => {
    // Check if we came from the home page
    if (document.referrer.includes(window.location.host)) {
      navigate(-1); // Go back in history
    } else {
      navigate("/venues"); // Default to venues page
    }
  }, [navigate]);

  // Handle save venue
  const handleSaveVenue = () => {
    if (!isLoggedIn) {
      toast.error("Please sign in to save venues");
      return;
    }

    const savedItems = JSON.parse(localStorage.getItem("savedItems") || "[]");

    if (isSaved) {
      // Remove from saved items
      const updatedItems = savedItems.filter((item: any) => !(item.id === id && item.type === "venue"));
      localStorage.setItem("savedItems", JSON.stringify(updatedItems));
      setIsSaved(false);
      toast.success(`Removed ${venue?.name} from saved venues`);
    } else {
      // Add to saved items
      const newItem = { id, type: "venue", savedAt: new Date().toISOString() };
      const updatedItems = [...savedItems, newItem];
      localStorage.setItem("savedItems", JSON.stringify(updatedItems));
      setIsSaved(true);
      toast.success(`Saved ${venue?.name} to your profile`);
    }
  };

  if (!venue) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Venue not found</h2>
          <Button onClick={() => navigate("/")}>Go back to events</Button>
        </div>
      </div>
    );
  }

  // Get related events
  const venueEvents = events.filter(e => venue.eventIds.includes(e.id));

  // Get performing artists
  const performingArtists = artists.filter(artist =>
    venueEvents.some(event => event.artistIds.includes(artist.id))
  );

  return (
    <div className="container mx-auto py-8 px-4 animate-in fade-in duration-150">
      {/* Navigation area with Save button */}
      <div className="flex justify-between items-center mb-6">
        <Button
          variant="ghost"
          className="flex items-center gap-2 hover:bg-primary/10 transition-colors duration-150"
          onClick={handleGoBack}
        >
          <ArrowLeft size={18} />
          Back
        </Button>

        <div className="flex gap-3">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            onClick={() => {
              navigator.share({
                title: venue.name,
                text: `Check out ${venue.name} in ${venue.location}!`,
                url: window.location.href
              }).catch(() => {
                navigator.clipboard.writeText(window.location.href);
                toast.success("Link copied to clipboard!");
              });
            }}
          >
            <Share2 size={16} />
            Share
          </Button>

          <Button
            variant="outline"
            size="sm"
            className={`flex items-center gap-2 ${isSaved ? 'text-primary border-primary' : ''}`}
            onClick={handleSaveVenue}
          >
            <Bookmark size={16} className={isSaved ? 'fill-primary' : ''} />
            {isSaved ? 'Saved' : 'Save'}
          </Button>
        </div>
      </div>

      {/* Venue Header */}
      <div className="relative rounded-xl overflow-hidden mb-8">
        <div className="h-96 w-full">
          <img
            src={venue.image}
            alt={venue.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent flex flex-col justify-end p-6">
          <div>
            <div className="flex flex-wrap gap-2 mb-2">
              {venue.tags.map(tag => (
                <Badge key={tag} variant="secondary">{tag}</Badge>
              ))}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">{venue.name}</h1>
            <div className="flex items-center gap-2 mt-2">
              <MapPin size={16} className="text-primary" />
              <span className="text-muted-foreground">{venue.location}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content - left 2/3 */}
        <div className="lg:col-span-2">
          {/* Tabs */}
          <Tabs defaultValue="about" value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <TabsList className="w-full grid grid-cols-4">
              <TabsTrigger value="about" className="text-base">About</TabsTrigger>
              <TabsTrigger value="events" className="text-base">Events</TabsTrigger>
              <TabsTrigger value="artists" className="text-base">Artists</TabsTrigger>
              <TabsTrigger value="gallery" className="text-base">Gallery</TabsTrigger>
            </TabsList>

            {/* About Tab */}
            <TabsContent value="about" className="animate-in fade-in-50 duration-300 space-y-8 mt-6">
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold">About This Venue</h2>
                <p className="text-muted-foreground">{venue.description}</p>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl flex items-center gap-2">
                        <Users className="text-primary" />
                        <span>Capacity</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">{venue.capacity.toLocaleString()}</p>
                      <p className="text-muted-foreground">Maximum attendees</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl flex items-center gap-2">
                        <Calendar className="text-primary" />
                        <span>Operating Hours</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between">
                        <span>Monday - Thursday</span>
                        <span>5:00 PM - 12:00 AM</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Friday - Saturday</span>
                        <span>5:00 PM - 2:00 AM</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Sunday</span>
                        <span>Closed</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-semibold">Amenities</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {venue.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle size={18} className="text-primary" />
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-semibold">Contact Information</h2>
                <Card>
                  <CardContent className="pt-6 space-y-4">
                    <div className="flex items-center gap-3">
                      <MapPin size={20} className="text-primary" />
                      <div>
                        <p className="font-medium">Address</p>
                        <p className="text-muted-foreground">{venue.address}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Globe size={20} className="text-primary" />
                      <div>
                        <p className="font-medium">Website</p>
                        <a href="#" className="text-primary hover:underline">www.{venue.name.toLowerCase().replace(/\s+/g, '')}.com</a>
                      </div>
                    </div>

                    <div className="flex gap-4 mt-4">
                      <Button variant="outline" size="icon" className="rounded-full hover:bg-primary/10 hover:text-primary">
                        <Facebook size={18} />
                      </Button>
                      <Button variant="outline" size="icon" className="rounded-full hover:bg-primary/10 hover:text-primary">
                        <Twitter size={18} />
                      </Button>
                      <Button variant="outline" size="icon" className="rounded-full hover:bg-primary/10 hover:text-primary">
                        <Instagram size={18} />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Events Tab */}
            <TabsContent value="events" className="animate-in fade-in-50 duration-300 space-y-6 mt-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">Upcoming Events</h2>
                <Button size="sm" variant="outline" className="flex items-center gap-2">
                  <Calendar size={16} />
                  <span>View Calendar</span>
                </Button>
              </div>

              {venueEvents.length === 0 ? (
                <Card className="bg-muted/30">
                  <CardContent className="py-8 text-center">
                    <p className="text-muted-foreground">No upcoming events scheduled at this venue.</p>
                    <Button className="mt-4" onClick={() => navigate("/events")}>Browse All Events</Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 gap-6 animate-in fade-in-50 duration-300">
                  {venueEvents.map(event => (
                    <Card key={event.id} className="overflow-hidden">
                      <div className="flex flex-col md:flex-row">
                        <div className="md:w-1/3 h-48 md:h-auto">
                          <img
                            src={event.image}
                            alt={event.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 p-6">
                          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                            <div>
                              <Badge className="mb-2">{event.category}</Badge>
                              <h3 className="text-xl font-bold mb-2">{event.name}</h3>
                              <p className="text-muted-foreground line-clamp-2 mb-3">{event.description}</p>

                              <div className="flex flex-wrap gap-4 mt-2">
                                <div className="flex items-center gap-2 text-sm">
                                  <Calendar size={14} className="text-primary" />
                                  <span>{format(new Date(event.date), "EEE, MMM d, yyyy")}</span>
                                </div>

                                <div className="flex items-center gap-2 text-sm">
                                  <Clock size={14} className="text-primary" />
                                  <span>{format(new Date(event.date), "h:mm a")}</span>
                                </div>
                              </div>
                            </div>

                            <div className="shrink-0">
                              <div className="text-2xl font-bold mb-3">${event.price}</div>
                              <Button onClick={() => navigate(`/event/${event.id}`)}>View Details</Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Artists Tab */}
            <TabsContent value="artists" className="animate-in fade-in-50 duration-300 space-y-6 mt-6">
              <h2 className="text-2xl font-semibold">Featured Artists</h2>

              {performingArtists.length === 0 ? (
                <Card className="bg-muted/30">
                  <CardContent className="py-8 text-center">
                    <p className="text-muted-foreground">No featured artists at this venue yet.</p>
                    <Button className="mt-4" onClick={() => navigate("/artists")}>Browse All Artists</Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {performingArtists.map(artist => (
                    <Card key={artist.id}>
                      <div className="flex p-4 items-center gap-4">
                        <div className="w-20 h-20 rounded-full overflow-hidden">
                          <img
                            src={artist.image}
                            alt={artist.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold mb-1">{artist.name}</h3>
                          <p className="text-sm text-muted-foreground mb-2">{artist.genre}</p>
                          <div className="flex gap-1">
                            {artist.tags.slice(0, 3).map(tag => (
                              <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                            ))}
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="shrink-0"
                          onClick={() => navigate(`/artist/${artist.id}`)}
                        >
                          View
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Gallery Tab */}
            <TabsContent value="gallery" className="animate-in fade-in-50 duration-300 space-y-6 mt-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">Venue Gallery</h2>
                <Button size="sm" variant="outline">View All Photos</Button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[venue.image,
                  "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1000",
                  "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=1000",
                  "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=1000",
                  "https://images.unsplash.com/photo-1574861854164-896b8b05d0a9?q=80&w=1000",
                  "https://images.unsplash.com/photo-1598387846148-47e82a5e751a?q=80&w=1000"
                ].map((img, idx) => (
                  <div
                    key={idx}
                    className="aspect-square rounded-md overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                  >
                    <img
                      src={img}
                      alt={`${venue.name} gallery image ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar - right 1/3 */}
        <div className="space-y-6">
          {/* Book tickets card */}
          <Card className="bg-card/60 backdrop-blur-sm border-primary/10">
            <CardHeader>
              <CardTitle>Book Your Experience</CardTitle>
              <CardDescription>Secure tickets for upcoming events</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Select an event:</h3>
                <select
                  className="w-full p-2 rounded-md bg-muted border border-border"
                  onChange={(e) => e.target.value}
                >
                  <option value="">-- Select an event --</option>
                  {venueEvents.map(event => (
                    <option key={event.id} value={event.id}>
                      {event.name} - {format(new Date(event.date), "MMM d, yyyy")}
                    </option>
                  ))}
                </select>
              </div>
            </CardContent>

            <CardFooter>
              <Button className="w-full">Check Availability</Button>
            </CardFooter>
          </Card>

          {/* Map card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="text-primary" />
                <span>Location</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/30 h-48 rounded-md flex justify-center items-center border border-border overflow-hidden relative">
                <p className="text-muted-foreground text-sm absolute z-10">Map view would be displayed here</p>
                <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-150"></div>
              </div>

              <div className="mt-4">
                <p className="font-medium">{venue.name}</p>
                <p className="text-muted-foreground">{venue.address}</p>
              </div>

              <Button className="w-full mt-4">Get Directions</Button>
            </CardContent>
          </Card>

          {/* Similar venues */}
          <Card>
            <CardHeader>
              <CardTitle>Similar Venues</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {venues
                  .filter(v => v.id !== venue.id && v.location === venue.location)
                  .slice(0, 3)
                  .map(similarVenue => (
                    <div key={similarVenue.id} className="flex items-center gap-3">
                      <div className="h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
                        <img
                          src={similarVenue.image}
                          alt={similarVenue.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{similarVenue.name}</h3>
                        <p className="text-xs text-muted-foreground">{similarVenue.tags[0]}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-auto"
                        onClick={() => navigate(`/venue/${similarVenue.id}`)}
                      >
                        View
                      </Button>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VenueDetail;
