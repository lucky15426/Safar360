import React from "react";
import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaLinkedin,
} from "react-icons/fa";

// At the top of Footer.jsx

import qrCode from "./qr-code.png";

const SocialIcons = () => (
  <div className="flex space-x-4 mt-4">
    <a href="https://facebook.com" aria-label="Facebook">
      <FaFacebook className="w-7 h-7 text-white hover:text-blue-400 transition-colors" />
    </a>
    <a href="https://instagram.com" aria-label="Instagram">
      <FaInstagram className="w-7 h-7 text-white hover:text-orange-400 transition-colors" />
    </a>
    <a href="https://twitter.com" aria-label="Twitter">
      <FaTwitter className="w-7 h-7 text-white hover:text-blue-300 transition-colors" />
    </a>
    <a href="https://youtube.com" aria-label="YouTube">
      <FaYoutube className="w-7 h-7 text-white hover:text-red-500 transition-colors" />
    </a>
    <a href="https://linkedin.com" aria-label="LinkedIn">
      <FaLinkedin className="w-7 h-7 text-white hover:text-blue-400 transition-colors" />
    </a>
  </div>
);

const Newsletter = () => (
  <div>
    <h2 className="text-xl font-bold mb-3 text-white">Newsletter</h2>
    <p className="text-white/90 mb-4 text-sm leading-relaxed">
      Sign up for exciting travel tips, packing hacks, and get great travel ideas delivered to your inbox.
    </p>

    <div className="space-y-2">
      <input
        type="email"
        placeholder="Enter your email"
        className="w-full px-4 py-2 rounded-lg bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 transition-colors"
      />
      <button className="w-full bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-lg font-bold transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)]">
        Subscribe
      </button>
    </div>
    <p className="text-xs text-white/70 mt-2">No spam. Unsubscribe anytime.</p>
  </div>
);

const Footer = ({ onPageChange }) => {
  return (
    <footer className="relative text-white z-0 w-full overflow-hidden">
      {/* Background with Beautiful Dark Gradient Merging Effect */}
      <div className="absolute inset-0 -z-10 w-full h-full bg-gradient-to-b from-[#1a202c] via-[#101827] to-[#0b0f1a]">

        {/* World Heritage Map Background Image */}
        <div
          className="absolute inset-0 opacity-20 mix-blend-screen pointer-events-none"
          style={{
            backgroundImage: `url('https://res.cloudinary.com/dgl970vof/image/upload/v1710114050/world-map-dotted_ms9h3c.png')`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            maskImage: 'linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)'
          }}
        ></div>

        {/* Glowing Ambient Orbs for a premium look */}
        <div className="absolute top-0 left-1/4 w-[40rem] h-[20rem] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none transform -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-1/4 w-[40rem] h-[30rem] bg-sky-600/10 rounded-full blur-[120px] pointer-events-none transform translate-y-1/4"></div>

        {/* Subtle grid pattern overlay fading down */}
        <div className="absolute inset-0 opacity-40 mix-blend-overlay" style={{
          backgroundImage: `radial-gradient(rgba(56, 189, 248, 0.4) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
          maskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)'
        }}></div>
      </div>

      <div className="container mx-auto px-4 py-16 pt-24 bg-transparent border-t border-white/5 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

          {/* Brand Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-3xl">🌍</span>
              <h1 className="text-3xl font-extrabold bg-gradient-to-r from-cyan-400 to-sky-400 bg-clip-text text-transparent font-cinzel tracking-wider">
                Safar360
              </h1>
            </div>
            <p className="text-white/70 mb-6 text-sm leading-relaxed font-light">
              Plan your perfect trips with our comprehensive pre-trip checklists and travel planning tools.
            </p>
            <h3 className="font-bold text-lg text-white mb-3">Follow us</h3>
            <SocialIcons />
          </div>

          {/* Quick Links */}
          <div>
            <h2 className="text-xl font-bold mb-5 text-white">Quick Links</h2>
            <ul className="space-y-3 text-sm">
              <li>
                <button
                  onClick={() => onPageChange("360tour")}
                  className="text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  VR Tours
                </button>
              </li>
              <li>
                <button
                  onClick={() => onPageChange("gems")}
                  className="text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  Hidden Gems
                </button>
              </li>
              <li>
                <button
                  onClick={() => onPageChange("itinerary")}
                  className="text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  Itinerary Planner
                </button>
              </li>
              <li>
                <button
                  onClick={() => onPageChange("tracker")}
                  className="text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  Flight Tracker
                </button>
              </li>
              <li>
                <button
                  onClick={() => onPageChange("vault")}
                  className="text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  Document Vault
                </button>
              </li>
              <li>
                <button
                  onClick={() => onPageChange("chat")}
                  className="text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  SafarX Agent
                </button>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <Newsletter />
          </div>

          {/* QR Code Section */}
          <div className="flex flex-col items-center justify-center">
            <h2 className="text-xl font-bold mb-4 text-white">Scan to Chat</h2>
            <div className="bg-white p-3 rounded-xl shadow-lg">
              <img
                src={qrCode}
                alt="Scan QR Code"
                className="w-32 h-32"
              />
            </div>
            <p className="text-xs text-white/70 mt-2">Ask Safar - SafarX Agent</p>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-white/10 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
            <div className="text-sm text-gray-400">
              <a href="#" className="hover:text-cyan-400 transition-colors">Terms of Use</a>
              <span className="mx-3">|</span>
              <a href="#" className="hover:text-cyan-400 transition-colors">Privacy Policy</a>
              <span className="mx-3">|</span>
              <a href="#" className="hover:text-cyan-400 transition-colors">Contact Us</a>
            </div>
          </div>
          <div className="text-center text-sm text-gray-500 mt-4">
            © 2026 Safar360. Made with <span className="text-red-500">❤️</span> by <span className="font-semibold text-cyan-500">Netaji Ninjas</span>.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
