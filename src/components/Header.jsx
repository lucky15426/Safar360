import React, { useState, useEffect } from "react";
import { Menu, X, User, Compass, MapPin, Backpack } from "lucide-react";
import {
  useUser,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/clerk-react";
import { createOrUpdateUser } from "../services/userService";

const Header = ({ currentPage, onPageChange, searchQuery, onSearchChange }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user: clerkUser, isLoaded, isSignedIn } = useUser();

  useEffect(() => {
    if (isLoaded && isSignedIn && clerkUser) {
      createOrUpdateUser(clerkUser);
    }
  }, [isLoaded, isSignedIn, clerkUser]);

  const navLinks = [
    { id: "home", label: "Home" },
    { id: "360tour", label: "VR Previews" },
    { id: "itinerary", label: "Trip Planning", icon: "MapPin" },
    { id: "gems", label: "Hidden Gems" },
    { id: "chat", label: "Real-time Support" },
    { id: "map", label: "Local Insights" },
    { id: "checklist", label: "Pre-trip Checklist", icon: "Backpack" },
  ];

  return (
    <>
      {/* Minimal top accent line */}
      <div className="h-0.5 bg-gradient-to-r from-transparent via-gray-200 to-transparent fixed top-0 w-full z-50" />

      <header className="fixed top-0 w-full z-40 bg-white/80 backdrop-blur-xl border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between h-20 px-6 relative">
          <div className="flex-shrink-0 flex items-center min-w-0 pl-2">
            <button
              onClick={() => {
                onPageChange("home");
                setIsMenuOpen(false);
              }}
              className="flex items-center space-x-2 group focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 rounded-xl"
              aria-label="Safar360 Home"
            >
              <Compass className="w-8 h-8 text-sky-600 group-hover:text-sky-700 transition-all duration-300 group-hover:rotate-45" />
              <div className="flex flex-col items-start pt-1">
                <h1 className="text-3xl font-heritage font-bold bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 bg-clip-text text-transparent tracking-wide group-hover:from-gray-900 group-hover:via-black group-hover:to-gray-900 transition-all duration-300 drop-shadow-sm">
                  Safar360
                </h1>
                <p className="text-[10px] text-gray-600 font-bold tracking-[0.2em] -mt-1 opacity-90 uppercase">
                  Beyond Booking
                </p>
              </div>
            </button>
          </div>

          <nav className="hidden xl:flex items-center justify-center flex-1">
            <div className="flex items-center space-x-1 bg-gray-50/50 rounded-2xl p-2 backdrop-blur-sm border border-gray-200 shadow-sm">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => {
                    onPageChange(link.id);
                    setIsMenuOpen(false);
                  }}
                  className={`px-5 py-3 rounded-xl text-sm font-bold transition-all duration-300 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-1 border ${currentPage === link.id
                      ? "bg-gradient-to-r from-sky-400 via-sky-500 to-sky-400 text-white shadow-md transform scale-105 border-sky-300"
                      : "text-gray-700 hover:text-gray-900 hover:bg-gray-100 hover:shadow-sm border-transparent hover:border-gray-300 hover:scale-102"
                    }`}
                  aria-current={currentPage === link.id ? "page" : undefined}
                >
                  {link.label}
                </button>
              ))}
            </div>
          </nav>

          <div className="flex items-center space-x-3 flex-shrink-0 pl-2">
            {isSignedIn && clerkUser ? (
              <div className="flex items-center space-x-2 min-w-0">
                <button
                  onClick={() => onPageChange("account")}
                  className="flex items-center space-x-2 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-100 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 border border-transparent hover:border-gray-300 hover:shadow-sm max-w-[160px] min-w-0"
                  title="Go to Account"
                >
                  <User size={18} />
                  <span className="hidden sm:inline font-semibold text-sm truncate max-w-[90px] min-w-0">
                    {clerkUser.firstName ||
                      clerkUser.emailAddresses[0]?.emailAddress ||
                      "Account"}
                  </span>
                </button>
                <UserButton afterSignOutUrl="/" />
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                {isLoaded && (
                  <>
                    <SignInButton>
                      <button className="px-5 py-3 text-sm font-bold text-gray-700 hover:text-gray-900 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 rounded-xl hover:bg-gray-100 border border-transparent hover:border-gray-300 hover:shadow-sm">
                        Login
                      </button>
                    </SignInButton>
                    <SignUpButton>
                      <button className="px-6 py-3 bg-gradient-to-r from-sky-500 via-sky-600 to-sky-500 text-white text-sm font-bold rounded-xl shadow-md hover:shadow-lg hover:from-sky-600 hover:via-sky-700 hover:to-sky-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 transform hover:scale-105 border border-sky-400">
                        Sign Up
                      </button>
                    </SignUpButton>
                  </>
                )}
              </div>
            )}

            <button
              onClick={() => {
                setIsMenuOpen(!isMenuOpen);
              }}
              className="xl:hidden p-3 rounded-xl text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 border border-transparent hover:border-gray-300 hover:shadow-sm"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="xl:hidden bg-white/95 backdrop-blur-xl border-t border-gray-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-2 py-6">
              <div className="grid grid-cols-2 gap-2">
                {navLinks.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => {
                      onPageChange(link.id);
                      setIsMenuOpen(false);
                    }}
                    className={`px-3 py-3 rounded-xl text-sm font-bold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-1 border flex items-center justify-center gap-2 ${currentPage === link.id
                        ? "bg-gradient-to-r from-sky-400 via-sky-500 to-sky-400 text-white shadow-md border-sky-300"
                        : "text-gray-700 hover:text-gray-900 hover:bg-gray-100 border-gray-200 hover:border-gray-300 hover:shadow-sm"
                      }`}
                    aria-current={currentPage === link.id ? "page" : undefined}
                  >
                    {link.icon === "MapPin" && <MapPin size={14} />}
                    {link.icon === "Backpack" && <Backpack size={14} />}
                    {link.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;
