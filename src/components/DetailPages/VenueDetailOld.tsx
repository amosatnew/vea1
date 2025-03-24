import { useParams, useNavigate, Link } from "react-router-dom";
import { venues, events, artists } from "@/data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft, MapPin, Users, CheckCircle, Calendar, Clock,
  Info, Star, MessageCircle, Share2, Bookmark, Heart,
  CalendarDays, Music, DollarSign, Camera, Ticket, Phone,
  Mail, Globe, Facebook, Twitter, Instagram, Youtube, Wifi,
  ParkingCircle, Coffee, UtensilsCrossed, Accessibility
} from "lucide-react";
import CardComponent from "@/components/ui/CardComponent";
import { useCallback, useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { format } from "date-fns";

// Mock gallery images
const galleryImages = [
  'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1605723517503-3cadb5818a0c?q=80&w=1000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=1000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=1000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1598387846148-47e82a5e751a?q=80&w=1000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1626939078762-a7e26f852b22?q=80&w=1000&auto=format&fit=crop',
];

// Mock reviews
interface Review {
  id: string;
  name: string;
  date: string;
  rating: number;
  comment: string;
  avatar?: string;
}

const mockReviews: Review[] = [
  {
    id: "rev1",
    name: "Alex Johnson",
    date: "2025-02-15",
    rating: 5,
    comment: "Amazing venue with great acoustics! The staff was very friendly and the drink selection was impressive. Would definitely come back for another show.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex"
  },
  {
    id: "rev2",
    name: "Samantha Lee",
    date: "2025-02-01",
    rating: 4,
    comment: "Good venue with a nice atmosphere. Sound quality was excellent but it got a bit crowded near the bar area. Otherwise a great experience!",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Samantha"
  },
  {
    id: "rev3",
    name: "Marcus Wilson",
    date: "2025-01-22",
    rating: 5,
    comment: "Perfect location and amazing views from the VIP section. The event was well organized and everything ran smoothly. Can't wait for the next one!",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus"
  }
];

// Mock FAQs
interface FAQ {
  question: string;
  answer: string;
}

const mockFAQs: FAQ[] = [
  {
    question: "What are the opening hours?",
    answer: "Our venue is typically open from 5:00 PM to 2:00 AM on event days. Hours may vary based on specific events, so please check the event details for accurate timing."
  },
  {
    question: "Is there parking available?",
    answer: "Yes, we have a dedicated parking lot with 300 spaces. Parking costs $15 per vehicle. We also offer valet parking for $25. There's additional street parking available nearby."
  },
  {
    question: "Are there food options available?",
    answer: "Yes, we have multiple food vendors inside the venue offering a variety of options including vegetarian, vegan, and gluten-free choices. Outside food is not permitted."
  },
  {
    question: "What items are prohibited?",
    answer: "Prohibited items include weapons, outside food and beverages, illegal substances, professional cameras, and recording equipment. Bags larger than 12\"x12\" are also not allowed."
  },
  {
    question: "Is the venue accessible for people with disabilities?",
    answer: "Yes, our venue is fully accessible with ramps, elevators, and designated seating areas. Please contact us in advance if you need any specific accommodations."
  }
];

const VenueDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // State variables
  const [activeTab, setActiveTab] = useState("about");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [ticketCount, setTicketCount] = useState(1);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [reviewName, setReviewName] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [showGallery, setShowGallery] = useState(false);
  const [reviews, setReviews] = useState<Review[]>(mockReviews);
  const [showFaqAnswer, setShowFaqAnswer] = useState<string | null>(null);

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

  // Get related events
  const venueEvents = events.filter(e => venue?.eventIds.includes(e.id) || []);

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

  // Submit a review
  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoggedIn) {
      toast.error("Please sign in to leave a review");
      return;
    }

    if (!reviewName.trim() || !reviewText.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    const newReview: Review = {
      id: `rev${reviews.length + 1}`,
      name: reviewName,
      date: new Date().toISOString().split('T')[0],
      rating: reviewRating,
      comment: reviewText,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${reviewName}`
    };

    setReviews([newReview, ...reviews]);
    setReviewName("");
    setReviewText("");
    setReviewRating(5);

    toast.success("Thank you for your review!");
  };

  // Submit contact form
  const handleContact = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !message.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    // In a real app, this would be an API call
    toast.success("Your message has been sent! We'll get back to you soon.");
    setEmail("");
    setMessage("");
  };

  // Book tickets
  const handleBookTickets = () => {
    if (!selectedEvent) {
      toast.error("Please select an event");
      return;
    }

    // In a real app, this would be an API call or redirect
    toast.success(`${ticketCount} ticket(s) booked for ${events.find(e => e.id === selectedEvent)?.name}!`);
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

  // Format venue hours (mock)
  const getVenueHours = () => {
    return [
      { day: "Monday - Thursday", hours: "5:00 PM - 12:00 AM" },
      { day: "Friday", hours: "5:00 PM - 2:00 AM" },
      { day: "Saturday", hours: "4:00 PM - 2:00 AM" },
      { day: "Sunday", hours: "4:00 PM - 11:00 PM" }
    ];
  };

  // Get performing artists
  const getPerformingArtists = () => {
    const artistIds = new Set<string>();
    venueEvents.forEach(event => {
      event.artistIds.forEach(artId => artistIds.add(artId));
    });

    return Array.from(artistIds).map(artId =>
      artists.find(artist => artist.id === artId)
    ).filter(Boolean);
  };
