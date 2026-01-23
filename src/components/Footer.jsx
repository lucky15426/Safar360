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
        className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-amber-400"
      />
      <button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-4 py-2 rounded-lg font-semibold transition-all">
        Subscribe
      </button>
    </div>
    <p className="text-xs text-white/70 mt-2">No spam. Unsubscribe anytime.</p>
  </div>
);

const Footer = () => {
  return (
    <footer className="relative text-white mt-20 z-0">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 -z-10 w-full h-full">
        <img
          src="https://res.cloudinary.com/bharatverse/image/upload/v1769012377/travel-concept-with-paper-boats-frame_nbcqye.jpg"
          alt="Footer background"
          className="object-cover w-full h-full brightness-75"
          draggable="false"
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/30"></div>

      </div>

      <div className="container mx-auto px-4 py-16 bg-transparent">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

          {/* Brand Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-3xl">🎒</span>
              <h1 className="text-3xl font-extrabold bg-gradient-to-r from-amber-300 to-orange-300 bg-clip-text text-transparent">
                Safar360
              </h1>
            </div>
            <p className="text-white/85 mb-6 text-sm leading-relaxed">
              Plan your perfect trips with our comprehensive pre-trip checklists and travel planning tools.
            </p>
            <h3 className="font-bold text-lg text-amber-300 mb-3">Follow us</h3>
            <SocialIcons />
          </div>

          {/* Quick Links */}
          <div>
            <h2 className="text-xl font-bold mb-5 text-amber-300">Quick Links</h2>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="#" className="text-white/85 hover:text-amber-300 transition-colors">
                  Heritage Sites
                </a>
              </li>
              <li>
                <a href="#" className="text-white/85 hover:text-amber-300 transition-colors">
                  Festivals
                </a>
              </li>
              <li>
                <a href="#" className="text-white/85 hover:text-amber-300 transition-colors">
                  Travel Planning
                </a>
              </li>
              <li>
                <a href="#" className="text-white/85 hover:text-amber-300 transition-colors">
                  Hidden Gems
                </a>
              </li>
              <li>
                <a href="#" className="text-white/85 hover:text-amber-300 transition-colors">
                  Packing Tips
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <Newsletter />
          </div>

          {/* QR Code Section */}
          <div className="flex flex-col items-center justify-center">
            <h2 className="text-xl font-bold mb-4 text-amber-300">Scan to Chat</h2>
            <div className="bg-white p-3 rounded-xl shadow-lg">
              <img
                src={qrCode}
                alt="Scan QR Code"
                className="w-32 h-32"
              />
            </div>
            <p className="text-xs text-white/70 mt-2">Ask Safar - Chat Support</p>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-white/30 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
            <div className="text-sm text-white/80">
              <a href="#" className="hover:text-amber-300 transition-colors">Terms of Use</a>
              <span className="mx-3">|</span>
              <a href="#" className="hover:text-amber-300 transition-colors">Privacy Policy</a>
              <span className="mx-3">|</span>
              <a href="#" className="hover:text-amber-300 transition-colors">Contact Us</a>
            </div>
          </div>
          <div className="text-center text-sm text-white/80 mt-4">
            © 2026 Safar360. Made with <span className="text-red-400">❤️</span> by <span className="font-semibold text-amber-300">Netaji Ninjas</span>.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
