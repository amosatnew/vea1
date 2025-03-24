import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Layout from "@/components/Layout";
import TabsLayout from "@/components/TabsLayout";
import EventDetail from "@/components/DetailPages/EventDetail";
import ArtistDetail from "@/components/DetailPages/ArtistDetail";
import VenueDetail from "@/components/DetailPages/VenueDetail";
import SignInPage from "@/components/Auth/SignInPage";
import JoinPage from "@/components/Auth/JoinPage";
import ProfilePage from "@/components/User/ProfilePage";
import { useEffect, useState } from "react";

// Scroll restoration component
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // If there's a hash, scroll to that element
    if (hash) {
      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }

    // Store the current scroll position in session storage before navigating
    sessionStorage.setItem('scrollPosition', window.scrollY.toString());

    // When navigating to detail pages, don't reset scroll position
    if (pathname.includes('/event/') || pathname.includes('/artist/') || pathname.includes('/venue/')) {
      const savedPosition = sessionStorage.getItem('scrollPosition');
      if (savedPosition) {
        window.scrollTo(0, parseInt(savedPosition));
      }
    } else {
      // For other pages, scroll to top with smooth behavior
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [pathname, hash]);

  return null;
};

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isLoggedIn = localStorage.getItem("userLoggedIn") === "true";

  if (!isLoggedIn) {
    return <Navigate to="/signin" replace />;
  }

  return <>{children}</>;
};

function App() {
  // Force dark mode on page load
  useEffect(() => {
    document.documentElement.classList.add('dark');

    // Adding a global CSS class for smoother animations
    document.documentElement.classList.add('faster-transitions');

    // Add CSS variables for faster transitions
    const style = document.createElement('style');
    style.innerHTML = `
      .faster-transitions * {
        transition-duration: 150ms !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Auth routes without Layout */}
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/join" element={<JoinPage />} />

        {/* Main routes with Layout */}
        <Route path="/" element={<Layout><TabsLayout /></Layout>} />
        <Route path="/events" element={<Layout><TabsLayout initialTab="events" /></Layout>} />
        <Route path="/artists" element={<Layout><TabsLayout initialTab="artists" /></Layout>} />
        <Route path="/venues" element={<Layout><TabsLayout initialTab="venues" /></Layout>} />
        <Route path="/event/:id" element={<Layout><EventDetail /></Layout>} />
        <Route path="/artist/:id" element={<Layout><ArtistDetail /></Layout>} />
        <Route path="/venue/:id" element={<Layout><VenueDetail /></Layout>} />

        {/* Protected routes */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Layout>
                <ProfilePage />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Fallback route - redirects to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
