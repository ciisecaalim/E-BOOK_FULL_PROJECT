import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 mt-44">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 grid grid-cols-1 md:grid-cols-4 gap-10">
        
        {/* Logo + About */}
        <div>
          <h2 className="text-2xl font-bold text-yellow-500 mb-4">
            Book<span className="text-white">Haven</span>
          </h2>
          <p className="text-sm leading-relaxed">
            Discover thousands of books across genres and enjoy seamless shopping with fast delivery.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-yellow-500 transition">Home</Link></li>
            <li><a href="#categories" className="hover:text-yellow-500 transition">Categories</a></li>
            <li><a href="#bestsellers" className="hover:text-yellow-500 transition">Best Sellers</a></li>
            <li><a href="#contact" className="hover:text-yellow-500 transition">Contact</a></li>
          </ul>
        </div>

        {/* Customer Service */}
        <div>
          <h3 className="text-white font-semibold mb-4">Customer Service</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#faq" className="hover:text-yellow-500 transition">FAQ</a></li>
            <li><a href="#shipping" className="hover:text-yellow-500 transition">Shipping & Returns</a></li>
            <li><a href="#support" className="hover:text-yellow-500 transition">Support</a></li>
            <li><a href="#privacy" className="hover:text-yellow-500 transition">Privacy Policy</a></li>
          </ul>
        </div>

        {/* Social Links */}
        <div>
          <h3 className="text-white font-semibold mb-4">Follow Us</h3>
          <div className="flex gap-3">
            <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 hover:bg-yellow-500 text-white transition">
              <FaFacebookF />
            </a>
            <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 hover:bg-yellow-500 text-white transition">
              <FaTwitter />
            </a>
            <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 hover:bg-yellow-500 text-white transition">
              <FaInstagram />
            </a>
            <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 hover:bg-yellow-500 text-white transition">
              <FaLinkedinIn />
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-12 border-t border-gray-700 py-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} <span className="text-yellow-500 font-semibold">BookHaven</span>. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
