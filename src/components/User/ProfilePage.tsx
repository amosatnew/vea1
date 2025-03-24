import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { events, artists, venues, getCategories, getGenres, getLocations } from "@/data";
import CardComponent from "@/components/ui/CardComponent";
import { Bell, Music, Bookmark, MapPin, Calendar, Edit, LogOut, User, Heart, Settings } from "lucide-react";

// Simulated user data for the demo
interface SavedItem {
  id: string;
  type: 'event' | 'artist' | 'venue';
  savedAt: string;
}

interface Preference {
  id: string;
  type: 'genre' | 'category' | 'location';
  value: string;
}

const ProfilePage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("saved");

  // User data states
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
  const [preferences, setPreferences] = useState<Preference[]>([]);

  // Form states for editing profile
  const [formData, setFormData] = useState({
    fullName: "",
    bio: "",
    location: "",
    receiveNotifications: true
  });

  useEffect(() => {
    // Check if user is logged in
    const loggedIn = localStorage.getItem("userLoggedIn") === "true";
    setIsLoggedIn(loggedIn);

    if (loggedIn) {
      // Load user data from localStorage (in a real app, this would come from an API)
      const email = localStorage.getItem("userEmail") || "";
      const name = localStorage.getItem("userName") || "User";

      setUserEmail(email);
      setUserName(name);

      setFormData({
        fullName: name,
        bio: localStorage.getItem("userBio") || "Music enthusiast and event lover",
        location: localStorage.getItem("userLocation") || "New York",
        receiveNotifications: localStorage.getItem("userNotifications") !== "false"
      });

      // Load saved items from localStorage or create demo data
      let saved = JSON.parse(localStorage.getItem("savedItems") || "null");
      if (!saved) {
        // Create demo saved items
        saved = [
          { id: "evt1", type: "event", savedAt: new Date().toISOString() },
          { id: "evt3", type: "event", savedAt: new Date().toISOString() },
          { id: "art2", type: "artist", savedAt: new Date().toISOString() },
          { id: "ven1", type: "venue", savedAt: new Date().toISOString() }
        ];
        localStorage.setItem("savedItems", JSON.stringify(saved));
      }
      setSavedItems(saved);

      // Load preferences from localStorage or create demo data
      let prefs = JSON.parse(localStorage.getItem("preferences") || "null");
      if (!prefs) {
        // Create demo preferences
        prefs = [
          { id: "pref1", type: "genre", value: "Electronic" },
          { id: "pref2", type: "genre", value: "Indie Rock" },
          { id: "pref3", type: "category", value: "Concert" },
          { id: "pref4", type: "location", value: "New York" }
        ];
        localStorage.setItem("preferences", JSON.stringify(prefs));
      }
      setPreferences(prefs);
    } else {
      // Redirect to login if not logged in
      navigate("/signin");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("userLoggedIn");
    setIsLoggedIn(false);
    navigate("/signin");
  };

  const handleSaveChanges = () => {
    // Save user data to localStorage (in a real app, this would be an API call)
    localStorage.setItem("userName", formData.fullName);
    localStorage.setItem("userBio", formData.bio);
    localStorage.setItem("userLocation", formData.location);
    localStorage.setItem("userNotifications", formData.receiveNotifications.toString());

    // Update state
    setUserName(formData.fullName);
    setIsEditing(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCheckboxChange = (checked: boolean, name: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const toggleSaveItem = (id: string, type: 'event' | 'artist' | 'venue') => {
    const isAlreadySaved = savedItems.some(item => item.id === id && item.type === type);

    let updatedItems;
    if (isAlreadySaved) {
      // Remove the item
      updatedItems = savedItems.filter(item => !(item.id === id && item.type === type));
    } else {
      // Add the item
      updatedItems = [...savedItems, { id, type, savedAt: new Date().toISOString() }];
    }

    setSavedItems(updatedItems);
    localStorage.setItem("savedItems", JSON.stringify(updatedItems));
  };

  const togglePreference = (value: string, type: 'genre' | 'category' | 'location') => {
    const prefId = `${type}-${value}`;
    const isAlreadySelected = preferences.some(pref => pref.type === type && pref.value === value);

    let updatedPreferences;
    if (isAlreadySelected) {
      // Remove the preference
      updatedPreferences = preferences.filter(pref => !(pref.type === type && pref.value === value));
    } else {
      // Add the preference
      updatedPreferences = [...preferences, { id: prefId, type, value }];
    }

    setPreferences(updatedPreferences);
    localStorage.setItem("preferences", JSON.stringify(updatedPreferences));
  };

  // Filter saved items by type
  const savedEvents = savedItems
    .filter(item => item.type === "event")
    .map(item => events.find(event => event.id === item.id))
    .filter(Boolean);

  const savedArtists = savedItems
    .filter(item => item.type === "artist")
    .map(item => artists.find(artist => artist.id === item.id))
    .filter(Boolean);

  const savedVenues = savedItems
    .filter(item => item.type === "venue")
    .map(item => venues.find(venue => venue.id === item.id))
    .filter(Boolean);

  // Get all available options for preferences
  const allGenres = getGenres();
  const allCategories = getCategories();
  const allLocations = getLocations();

  // Check if a preference is selected
  const isPreferenceSelected = (value: string, type: 'genre' | 'category' | 'location') => {
    return preferences.some(pref => pref.type === type && pref.value === value);
  };

  if (!isLoggedIn) {
    return null; // Don't render anything if not logged in (will redirect)
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-card/60 backdrop-blur-sm border-primary/10">
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              <Avatar className="h-20 w-20 border-2 border-primary">
                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userEmail}`} />
                <AvatarFallback className="text-lg">{userName.charAt(0)}</AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <CardTitle className="text-xl">{userName}</CardTitle>
                <CardDescription className="text-sm truncate">{userEmail}</CardDescription>
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              {!isEditing && (
                <div className="space-y-4">
                  <div className="text-sm text-muted-foreground">{formData.bio}</div>

                  <div className="flex items-center gap-2 text-sm">
                    <MapPin size={16} className="text-primary" />
                    <span>{formData.location}</span>
                  </div>
                </div>
              )}
            </CardContent>

            <CardFooter className="flex gap-2 border-t border-border pt-4">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? "Cancel" : "Edit Profile"}
                {!isEditing && <Edit size={14} className="ml-2" />}
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                onClick={handleLogout}
              >
                <LogOut size={14} className="mr-2" />
                Logout
              </Button>
            </CardFooter>
          </Card>

          {/* Navigation menu */}
          <Card className="bg-card/60 backdrop-blur-sm border-primary/10">
            <CardContent className="p-4">
              <nav className="space-y-1">
                <Button
                  variant={activeTab === "saved" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("saved")}
                >
                  <Bookmark size={16} className="mr-2" />
                  Saved Items
                </Button>

                <Button
                  variant={activeTab === "preferences" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("preferences")}
                >
                  <Heart size={16} className="mr-2" />
                  Preferences
                </Button>

                <Button
                  variant={activeTab === "settings" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("settings")}
                >
                  <Settings size={16} className="mr-2" />
                  Account Settings
                </Button>
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Main content */}
        <div className="lg:col-span-3">
          {/* Edit profile form */}
          {isEditing && (
            <Card className="bg-card/60 backdrop-blur-sm border-primary/10 mb-6">
              <CardHeader>
                <CardTitle>Edit Profile</CardTitle>
                <CardDescription>Update your personal information</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="bg-muted/60"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Input
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    className="bg-muted/60"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="bg-muted/60"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="receiveNotifications"
                    checked={formData.receiveNotifications}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange(checked as boolean, "receiveNotifications")
                    }
                  />
                  <label
                    htmlFor="receiveNotifications"
                    className="text-sm font-medium leading-none"
                  >
                    Receive email notifications about events
                  </label>
                </div>
              </CardContent>

              <CardFooter className="border-t border-border pt-4 flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleSaveChanges}>
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          )}

          {/* Content based on active tab */}
          {activeTab === "saved" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">Saved Items</h2>

              <Tabs defaultValue="events" className="w-full">
                <TabsList className="grid grid-cols-3 mb-6 w-full">
                  <TabsTrigger value="events" className="text-base py-2">
                    Events ({savedEvents.length})
                  </TabsTrigger>
                  <TabsTrigger value="artists" className="text-base py-2">
                    Artists ({savedArtists.length})
                  </TabsTrigger>
                  <TabsTrigger value="venues" className="text-base py-2">
                    Venues ({savedVenues.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="events">
                  {savedEvents.length === 0 ? (
                    <Card>
                      <CardContent className="py-8 text-center">
                        <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <h3 className="text-lg font-medium mb-2">No saved events</h3>
                        <p className="text-muted-foreground mb-4">You haven't saved any events yet.</p>
                        <Button onClick={() => navigate("/")}>Browse Events</Button>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {savedEvents.map(event => event && (
                        <div key={event.id} className="relative">
                          <CardComponent
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
                          <Button
                            size="icon"
                            variant="outline"
                            className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm hover:bg-background z-10"
                            onClick={() => toggleSaveItem(event.id, "event")}
                          >
                            <Bookmark size={16} className="fill-primary text-primary" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="artists">
                  {savedArtists.length === 0 ? (
                    <Card>
                      <CardContent className="py-8 text-center">
                        <Music className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <h3 className="text-lg font-medium mb-2">No saved artists</h3>
                        <p className="text-muted-foreground mb-4">You haven't saved any artists yet.</p>
                        <Button onClick={() => navigate("/")}>Browse Artists</Button>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {savedArtists.map(artist => artist && (
                        <div key={artist.id} className="relative">
                          <CardComponent
                            id={artist.id}
                            type="artist"
                            title={artist.name}
                            subtitle={artist.genre}
                            description={artist.description}
                            image={artist.image}
                            tags={artist.tags}
                          />
                          <Button
                            size="icon"
                            variant="outline"
                            className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm hover:bg-background z-10"
                            onClick={() => toggleSaveItem(artist.id, "artist")}
                          >
                            <Bookmark size={16} className="fill-primary text-primary" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="venues">
                  {savedVenues.length === 0 ? (
                    <Card>
                      <CardContent className="py-8 text-center">
                        <MapPin className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <h3 className="text-lg font-medium mb-2">No saved venues</h3>
                        <p className="text-muted-foreground mb-4">You haven't saved any venues yet.</p>
                        <Button onClick={() => navigate("/")}>Browse Venues</Button>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {savedVenues.map(venue => venue && (
                        <div key={venue.id} className="relative">
                          <CardComponent
                            id={venue.id}
                            type="venue"
                            title={venue.name}
                            subtitle={`Capacity: ${venue.capacity}`}
                            description={venue.description}
                            image={venue.image}
                            tags={venue.tags}
                            location={venue.location}
                          />
                          <Button
                            size="icon"
                            variant="outline"
                            className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm hover:bg-background z-10"
                            onClick={() => toggleSaveItem(venue.id, "venue")}
                          >
                            <Bookmark size={16} className="fill-primary text-primary" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          )}

          {activeTab === "preferences" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">Your Preferences</h2>
              <p className="text-muted-foreground">
                Select your preferences to get personalized recommendations
              </p>

              <Card className="bg-card/60 backdrop-blur-sm border-primary/10">
                <CardHeader>
                  <CardTitle>Favorite Genres</CardTitle>
                  <CardDescription>Choose music genres you enjoy</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {allGenres.map(genre => (
                      <Badge
                        key={genre}
                        variant={isPreferenceSelected(genre, 'genre') ? 'default' : 'outline'}
                        className="cursor-pointer"
                        onClick={() => togglePreference(genre, 'genre')}
                      >
                        {genre}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/60 backdrop-blur-sm border-primary/10">
                <CardHeader>
                  <CardTitle>Event Types</CardTitle>
                  <CardDescription>Select the types of events you're interested in</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {allCategories.map(category => (
                      <Badge
                        key={category}
                        variant={isPreferenceSelected(category, 'category') ? 'default' : 'outline'}
                        className="cursor-pointer"
                        onClick={() => togglePreference(category, 'category')}
                      >
                        {category}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/60 backdrop-blur-sm border-primary/10">
                <CardHeader>
                  <CardTitle>Preferred Locations</CardTitle>
                  <CardDescription>Choose locations for events you'd like to attend</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {allLocations.map(location => (
                      <Badge
                        key={location}
                        variant={isPreferenceSelected(location, 'location') ? 'default' : 'outline'}
                        className="cursor-pointer"
                        onClick={() => togglePreference(location, 'location')}
                      >
                        {location}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">Account Settings</h2>

              <Card className="bg-card/60 backdrop-blur-sm border-primary/10">
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                  <CardDescription>Manage how you receive notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label className="text-sm font-medium">Email Notifications</label>
                      <p className="text-xs text-muted-foreground">Receive updates via email</p>
                    </div>
                    <Checkbox
                      checked={formData.receiveNotifications}
                      onCheckedChange={(checked) => {
                        handleCheckboxChange(checked as boolean, "receiveNotifications");
                        handleSaveChanges();
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label className="text-sm font-medium">Event Reminders</label>
                      <p className="text-xs text-muted-foreground">Get reminded about upcoming events</p>
                    </div>
                    <Checkbox defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label className="text-sm font-medium">Artist Updates</label>
                      <p className="text-xs text-muted-foreground">Get notified about new events from saved artists</p>
                    </div>
                    <Checkbox defaultChecked />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/60 backdrop-blur-sm border-primary/10">
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                  <CardDescription>Update your account details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="profile-email">Email Address</Label>
                    <Input
                      id="profile-email"
                      value={userEmail}
                      disabled
                      className="bg-muted/60"
                    />
                    <p className="text-xs text-muted-foreground">
                      To change your email, please contact support
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="profile-password">Password</Label>
                    <div className="flex gap-2">
                      <Input
                        id="profile-password"
                        type="password"
                        value="********"
                        disabled
                        className="bg-muted/60"
                      />
                      <Button variant="outline">Change</Button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t border-border pt-4 flex flex-col items-start gap-2">
                  <p className="text-sm text-muted-foreground">
                    Account created: {new Date().toLocaleDateString()}
                  </p>
                  <Button
                    variant="outline"
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                  >
                    Delete Account
                  </Button>
                </CardFooter>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
