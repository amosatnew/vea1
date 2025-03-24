import { useState, useEffect } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Event, Venue, Artist, FilterCategory, SortOption } from "@/types";
import { events, artists, venues , getAmenities, getCategories, getGenres, getLocations, getPriceRanges, getTags } from "@/data";
import SearchAndFilter from "@/components/SearchAndFilter";
import { CalendarDays, Users, Music, Bell, Bookmark, Calendar, User, MapPin } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

interface EnhancedCardProps {
  id: string;
  type: 'event' | 'artist' | 'venue';
  title: string;
  subtitle?: string;
  description: string;
  image: string;
  tags: string[];
  price?: number;
  date?: string;
  location?: string;
}

interface TabsLayoutProps {
  initialTab?: 'events' | 'artists' | 'venues';
}

const TabsLayout = ({ initialTab = 'events' }: TabsLayoutProps) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // State for the active tab
  const [activeTab, setActiveTab] = useState<string>(initialTab);

  // Use URL tab parameter if available
  useEffect(() => {
    const tabFromUrl = searchParams.get('tab');
    if (tabFromUrl && ['events', 'artists', 'venues'].includes(tabFromUrl)) {
      setActiveTab(tabFromUrl);
    } else if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [searchParams, initialTab]);

  // Update URL when tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setSearchParams({ tab: value });
  };

  // Search, sort, and filter states
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [activeSort, setActiveSort] = useState<SortOption | null>(null);
  const [activeFilters, setActiveFilters] = useState<Record<FilterCategory, string[]>>({
    category: [],
    tags: [],
    price: [],
    genre: [],
    amenities: [],
    location: []
  });

  // Auth state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [savedItems, setSavedItems] = useState<string[]>([]);
  const [notificationItems, setNotificationItems] = useState<string[]>([]);

  // Check login status and load saved items
  useEffect(() => {
    const checkLoginStatus = () => {
      const loggedIn = localStorage.getItem("userLoggedIn") === "true";
      setIsLoggedIn(loggedIn);

      if (loggedIn) {
        // Load saved items
        const savedItemsData = JSON.parse(localStorage.getItem("savedItems") || "[]");
        setSavedItems(savedItemsData.map((item: { id: string }) => item.id));

        // Load notification items
        const notificationItemsData = JSON.parse(localStorage.getItem("notificationItems") || "[]");
        setNotificationItems(notificationItemsData);
      } else {
        setSavedItems([]);
        setNotificationItems([]);
      }
    };

    checkLoginStatus();
    window.addEventListener("loginStateChange", checkLoginStatus);
    window.addEventListener("storage", checkLoginStatus);

    return () => {
      window.removeEventListener("loginStateChange", checkLoginStatus);
      window.removeEventListener("storage", checkLoginStatus);
    };
  }, []);

  // Define sort options for each tab
  const sortOptions = {
    events: [
      { value: "name" as SortOption, label: "Name" },
      { value: "date" as SortOption, label: "Date" },
      { value: "price" as SortOption, label: "Price" }
    ],
    artists: [
      { value: "name" as SortOption, label: "Name" },
      { value: "genre" as SortOption, label: "Genre" },
      { value: "popularity" as SortOption, label: "Popularity" }
    ],
    venues: [
      { value: "name" as SortOption, label: "Name" },
      { value: "location" as SortOption, label: "Location" },
      { value: "capacity" as SortOption, label: "Capacity" }
    ]
  };

  // Define filter options for each tab
  const filterOptions = {
    events: {
      category: getCategories(),
      tags: getTags("events"),
      price: getPriceRanges()
    },
    artists: {
      genre: getGenres(),
      tags: getTags("artists")
    },
    venues: {
      location: getLocations(),
      amenities: getAmenities(),
      tags: getTags("venues")
    }
  };

  // Handle search
  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  // Handle sort
  const handleSort = (option: SortOption) => {
    setActiveSort(activeSort === option ? null : option);
  };

  // Handle filter
  const handleFilter = (category: FilterCategory, value: string) => {
    setActiveFilters(prev => {
      const categoryFilters = prev[category] || [];
      const updatedFilters = categoryFilters.includes(value)
        ? categoryFilters.filter(v => v !== value)
        : [...categoryFilters, value];

      return {
        ...prev,
        [category]: updatedFilters
      };
    });
  };

  // Clear all filters
  const handleClearFilters = () => {
    setActiveFilters({
      category: [],
      tags: [],
      price: [],
      genre: [],
      amenities: [],
      location: []
    });
    setSearchTerm("");
    setActiveSort(null);
  };

  // Handle save item
  const handleSaveItem = (id: string, type: string, title: string) => {
    if (!isLoggedIn) {
      toast.error("Please sign in to save items");
      return;
    }

    // Get current saved items
    const savedItemsData = JSON.parse(localStorage.getItem("savedItems") || "[]");

    // Check if already saved
    const isSaved = savedItemsData.some((item: { id: string }) => item.id === id);

    if (isSaved) {
      // Remove from saved items
      const updatedItems = savedItemsData.filter((item: { id: string }) => item.id !== id);
      localStorage.setItem("savedItems", JSON.stringify(updatedItems));
      setSavedItems(updatedItems.map((item: { id: string }) => item.id));
      toast.success(`Removed ${title} from saved items`);
    } else {
      // Add to saved items
      const newItem = { id, type, savedAt: new Date().toISOString() };
      const updatedItems = [...savedItemsData, newItem];
      localStorage.setItem("savedItems", JSON.stringify(updatedItems));
      setSavedItems(updatedItems.map((item: { id: string }) => item.id));
      toast.success(`Saved ${title} to your profile`);
    }
  };

  // Handle notification toggle
  const handleNotificationToggle = (id: string, title: string) => {
    if (!isLoggedIn) {
      toast.error("Please sign in to set notifications");
      return;
    }

    // Get current notification items
    const currentItems = [...notificationItems];

    // Check if already being notified
    const isNotifying = currentItems.includes(id);

    if (isNotifying) {
      // Remove notification
      const updatedItems = currentItems.filter(itemId => itemId !== id);
      localStorage.setItem("notificationItems", JSON.stringify(updatedItems));
      setNotificationItems(updatedItems);
      toast.success(`Notifications turned off for ${title}`);
    } else {
      // Add notification
      const updatedItems = [...currentItems, id];
      localStorage.setItem("notificationItems", JSON.stringify(updatedItems));
      setNotificationItems(updatedItems);
      toast.success(`You'll be notified about ${title}`);
    }
  };

  // Enhanced Card Component with action buttons
  const EnhancedCard = ({
    id,
    type,
    title,
    subtitle,
    description,
    image,
    tags,
    price,
    date,
    location,
  }: EnhancedCardProps) => {
    const isSaved = savedItems.includes(id);
    const isNotifying = notificationItems.includes(id);

    // Format date if it exists
    const formattedDate = date ? new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }) : null;

    // Format time if date exists
    const formattedTime = date ? new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    }) : null;

    return (
      <div className="card-container relative group">
        <Card className="overflow-hidden transition-all duration-150 hover:shadow-lg hover:spotify-glow hover:translate-y-[-5px] h-full flex flex-col bg-card/90">
          <div className="h-48 overflow-hidden relative">
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-150 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent"></div>

            {price && (
              <Badge className="absolute top-2 left-2 bg-primary z-10">${price}</Badge>
            )}

            {isLoggedIn && (
              <>
                <Button
                  size="icon"
                  variant="ghost"
                  className={`card-action-button notification-button ${isNotifying ? 'opacity-100 bg-primary/20' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNotificationToggle(id, title);
                  }}
                >
                  <Bell
                    size={16}
                    className={isNotifying ? 'text-primary fill-primary' : 'text-white'}
                  />
                </Button>

                <Button
                  size="icon"
                  variant="ghost"
                  className={`card-action-button save-button ${isSaved ? 'opacity-100 bg-primary/20' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSaveItem(id, type, title);
                  }}
                >
                  <Bookmark
                    size={16}
                    className={isSaved ? 'text-primary fill-primary' : 'text-white'}
                  />
                </Button>
              </>
            )}
          </div>

          <CardHeader className="p-4 pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-xl font-semibold text-white">{title}</CardTitle>
            </div>
            {subtitle && (
              <CardDescription className="text-muted-foreground">{subtitle}</CardDescription>
            )}
          </CardHeader>

          <CardContent className="p-4 pt-0 pb-2 flex-grow">
            <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>

            <div className="mt-3 space-y-2">
              {formattedDate && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-primary"><Calendar size={14} /></span>
                  <span>{formattedDate} • {formattedTime}</span>
                </div>
              )}

              {location && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-primary"><MapPin size={14} /></span>
                  <span>{location}</span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-1 mt-3">
              {tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{tags.length - 3}
                </Badge>
              )}
            </div>
          </CardContent>

          <CardFooter className="p-4 pt-2">
            <Button
              onClick={() => navigate(`/${type}/${id}`)}
              variant="default"
              className="w-full bg-primary/20 hover:bg-primary text-white border border-primary/10 transition-all duration-150"
            >
              View Details
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  };

  // Filter events based on search term, sort option, and filters
  const filteredEvents = events.filter(event => {
    // Search filtering
    if (searchTerm && !event.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !event.description.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }

    // Category filtering
    if (activeFilters.category.length > 0 && !activeFilters.category.includes(event.category)) {
      return false;
    }

    // Tags filtering
    if (activeFilters.tags.length > 0 && !activeFilters.tags.some(tag => event.tags.includes(tag))) {
      return false;
    }

    // Price filtering
    if (activeFilters.price.length > 0) {
      const matchesPrice = activeFilters.price.some(range => {
        if (range === 'Under $40') return event.price < 40;
        if (range === '$40 - $60') return event.price >= 40 && event.price < 60;
        if (range === '$60 - $80') return event.price >= 60 && event.price < 80;
        if (range === '$80 - $100') return event.price >= 80 && event.price < 100;
        if (range === '$100+') return event.price >= 100;
        return false;
      });
      if (!matchesPrice) return false;
    }

    return true;
  });

  // Filter artists based on search term, sort option, and filters
  const filteredArtists = artists.filter(artist => {
    // Search filtering
    if (searchTerm && !artist.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !artist.description.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }

    // Genre filtering
    if (activeFilters.genre.length > 0 && !activeFilters.genre.includes(artist.genre)) {
      return false;
    }

    // Tags filtering
    if (activeFilters.tags.length > 0 && !activeFilters.tags.some(tag => artist.tags.includes(tag))) {
      return false;
    }

    return true;
  });

  // Filter venues based on search term, sort option, and filters
  const filteredVenues = venues.filter(venue => {
    // Search filtering
    if (searchTerm && !venue.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !venue.description.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }

    // Location filtering
    if (activeFilters.location.length > 0 && !activeFilters.location.includes(venue.location)) {
      return false;
    }

    // Amenities filtering
    if (activeFilters.amenities.length > 0 &&
        !activeFilters.amenities.some(amenity => venue.amenities.includes(amenity))) {
      return false;
    }

    // Tags filtering
    if (activeFilters.tags.length > 0 && !activeFilters.tags.some(tag => venue.tags.includes(tag))) {
      return false;
    }

    return true;
  });

  // Sort the filtered lists
  const sortedEvents = [...filteredEvents].sort((a, b) => {
    if (!activeSort) return 0;
    if (activeSort === 'name') return a.name.localeCompare(b.name);
    if (activeSort === 'date') return new Date(a.date).getTime() - new Date(b.date).getTime();
    if (activeSort === 'price') return a.price - b.price;
    return 0;
  });

  const sortedArtists = [...filteredArtists].sort((a, b) => {
    if (!activeSort) return 0;
    if (activeSort === 'name') return a.name.localeCompare(b.name);
    if (activeSort === 'genre') return a.genre.localeCompare(b.genre);
    if (activeSort === 'popularity') return b.popularEvents.length - a.popularEvents.length;
    return 0;
  });

  const sortedVenues = [...filteredVenues].sort((a, b) => {
    if (!activeSort) return 0;
    if (activeSort === 'name') return a.name.localeCompare(b.name);
    if (activeSort === 'location') return a.location.localeCompare(b.location);
    if (activeSort === 'capacity') return b.capacity - a.capacity;
    return 0;
  });

  return (
    <div className="container mx-auto py-6">
      <Tabs
        defaultValue={activeTab}
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
        {/* Floating Tabs */}
        <div className="floating-tabs">
          <div
            className={`floating-tab cursor-pointer transition-all duration-150 ${activeTab === 'events' ? 'floating-tab-active' : ''}`}
            onClick={() => handleTabChange('events')}
          >
            <div className="floating-tab-icon">
              <CalendarDays size={24} className="text-primary" />
            </div>
            <span className="font-medium">Events</span>
            <Badge variant="outline" className="mt-1 text-xs">
              {filteredEvents.length}
            </Badge>
          </div>

          <div
            className={`floating-tab cursor-pointer transition-all duration-150 ${activeTab === 'artists' ? 'floating-tab-active' : ''}`}
            onClick={() => handleTabChange('artists')}
          >
            <div className="floating-tab-icon">
              <Music size={24} className="text-primary" />
            </div>
            <span className="font-medium">Artists</span>
            <Badge variant="outline" className="mt-1 text-xs">
              {filteredArtists.length}
            </Badge>
          </div>

          <div
            className={`floating-tab cursor-pointer transition-all duration-150 ${activeTab === 'venues' ? 'floating-tab-active' : ''}`}
            onClick={() => handleTabChange('venues')}
          >
            <div className="floating-tab-icon">
              <MapPin size={24} className="text-primary" />
            </div>
            <span className="font-medium">Venues</span>
            <Badge variant="outline" className="mt-1 text-xs">
              {filteredVenues.length}
            </Badge>
          </div>
        </div>

        <TabsContent value="events" className="animate-in fade-in-0 duration-150">
          <SearchAndFilter
            onSearch={handleSearch}
            onSort={handleSort}
            onFilter={handleFilter}
            onClearFilters={handleClearFilters}
            sortOptions={sortOptions.events}
            filterOptions={filterOptions.events as Record<FilterCategory, string[]>}
            activeFilters={activeFilters}
            activeSort={activeSort}
          />

          {sortedEvents.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No events found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in-50 duration-300">
              {sortedEvents.map((event) => (
                <EnhancedCard
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
                  location={venues.find(v => v.id === event.venueId)?.location}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="artists" className="animate-in fade-in-0 duration-150">
          <SearchAndFilter
            onSearch={handleSearch}
            onSort={handleSort}
            onFilter={handleFilter}
            onClearFilters={handleClearFilters}
            sortOptions={sortOptions.artists}
            filterOptions={filterOptions.artists as Record<FilterCategory, string[]>}
            activeFilters={activeFilters}
            activeSort={activeSort}
          />

          {sortedArtists.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No artists found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in-50 duration-300">
              {sortedArtists.map((artist) => (
                <EnhancedCard
                  key={artist.id}
                  id={artist.id}
                  type="artist"
                  title={artist.name}
                  subtitle={artist.genre}
                  description={artist.description}
                  image={artist.image}
                  tags={artist.tags}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="venues" className="animate-in fade-in-0 duration-150">
          <SearchAndFilter
            onSearch={handleSearch}
            onSort={handleSort}
            onFilter={handleFilter}
            onClearFilters={handleClearFilters}
            sortOptions={sortOptions.venues}
            filterOptions={filterOptions.venues as Record<FilterCategory, string[]>}
            activeFilters={activeFilters}
            activeSort={activeSort}
          />

          {sortedVenues.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No venues found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in-50 duration-300">
              {sortedVenues.map((venue) => (
                <EnhancedCard
                  key={venue.id}
                  id={venue.id}
                  type="venue"
                  title={venue.name}
                  subtitle={`Capacity: ${venue.capacity}`}
                  description={venue.description}
                  image={venue.image}
                  tags={venue.tags}
                  location={venue.location}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TabsLayout;
