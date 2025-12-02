import React, { useState } from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import { FaFacebookF, FaTwitter, FaLinkedinIn } from "react-icons/fa";
import HeaderBookStore from "./Header";
import Footer from "./Footer";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const AboutUs = () => {
  const [lightboxIndex, setLightboxIndex] = useState(null);

  // Validate portfolioBooks array
  const portfolioBooks = [
    {
      src: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=800&q=80",
      title: "Modern Fiction",
      description: "Best-selling modern fiction e-book.",
    },
    {
      src: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80",
      title: "Science & Technology",
      description: "Latest trends in technology e-books.",
    },
    {
      src: "https://images.unsplash.com/photo-1496104679561-38bfe1f8b43c?auto=format&fit=crop&w=800&q=80",
      title: "Business & Finance",
      description: "Top business and finance reads.",
    },
  ].filter((b) => b && b.src && b.title); // Prevent invalid objects

  const safeIndex = (index) =>
    index >= 0 && index < portfolioBooks.length ? index : null;

  return (
    <>
      <HeaderBookStore />

      <div className="font-sans text-gray-800 overflow-x-hidden">

        {/* Hero Section */}
        <section className="bg-indigo-900 text-white text-center py-24">
          <motion.h1
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ duration: 0.8 }}
            className="text-5xl font-bold mb-4"
          >
            About Our E-Book Store
          </motion.h1>

          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="max-w-2xl mx-auto text-lg mb-6"
          >
            Discover thousands of e-books across multiple genres.
          </motion.p>

          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="bg-white text-indigo-900 px-6 py-2 rounded-md font-semibold hover:bg-gray-100 transition"
          >
            Browse Books
          </motion.button>
        </section>

        {/* Welcome Section */}
        <section className="py-16 bg-gray-50 text-center">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            transition={{ duration: 0.8 }}
            className="text-3xl font-bold mb-4"
          >
            Welcome to Our Library
          </motion.h2>

          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="max-w-3xl mx-auto text-gray-600 mb-6"
          >
            We provide a huge selection of e-books for all readers.
          </motion.p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-indigo-900 text-white px-6 py-2 rounded-md hover:bg-indigo-800"
          >
            Explore Now
          </motion.button>
        </section>

        {/* Mission / Vision / Story */}
        <section className="grid md:grid-cols-3 text-center">
          {[
            {
              title: "Our Story",
              text: "Started to make reading accessible to everyone.",
              color: "bg-indigo-700",
            },
            {
              title: "Our Mission",
              text: "Deliver high-quality e-books efficiently.",
              color: "bg-gray-900",
            },
            {
              title: "Our Vision",
              text: "Be the leading e-book platform globally.",
              color: "bg-indigo-700",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              transition={{ delay: index * 0.2, duration: 0.8 }}
              className={`${item.color} text-white p-10`}
            >
              <h3 className="text-2xl font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-200">{item.text}</p>
            </motion.div>
          ))}
        </section>

        {/* Services Section */}
        <section className="py-16 text-center bg-gray-50">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            variants={fadeUp}
            transition={{ duration: 0.8 }}
            className="text-3xl font-bold mb-10"
          >
            Our Services
          </motion.h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              "E-Book Downloads",
              "Online Reading",
              "Subscription Plans",
              "Author Support",
              "Reading App",
              "Customer Support",
            ].map((service, i) => (
              <motion.div
                key={service}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="border border-indigo-900 py-6 rounded-lg text-indigo-900 font-semibold hover:bg-indigo-900 hover:text-white transition"
              >
                {service}
              </motion.div>
            ))}
          </div>
        </section>

        {/* Stats Section */}
        <section className="bg-indigo-900 text-white py-16">
          <div className="grid grid-cols-2 md:grid-cols-6 text-center max-w-6xl mx-auto gap-6">
            {[
              { number: 1000, suffix: "k", label: "Books Available" },
              { number: 3000, suffix: "k", label: "Downloads" },
              { number: 25000, suffix: "", label: "Happy Readers" },
              { number: 2300, suffix: "k", label: "Hours Read" },
              { number: 4000, suffix: "", label: "Authors Supported" },
              { number: 120, suffix: "", label: "Awards Won" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1, duration: 1 }}
              >
                <h3 className="text-4xl font-bold mb-2">
                  <CountUp
                    start={0}
                    end={stat.number}
                    duration={2}
                    separator=","
                    enableScrollSpy
                    scrollSpyOnce
                  />
                  {stat.suffix}
                </h3>

                <p className="text-gray-300">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 text-center bg-gray-50">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            className="text-3xl font-bold mb-6"
          >
            Meet Our Team
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                name: "Alice Brown",
                role: "Founder & CEO",
                img: "https://images.unsplash.com/photo-1603415526960-f7e0328e3d4f?auto=format&fit=crop&w=400&q=80",
              },
              {
                name: "Bob Smith",
                role: "Lead Developer",
                img: "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?auto=format&fit=crop&w=400&q=80",
              },
              {
                name: "Catherine Lee",
                role: "Content Manager",
                img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80",
              },
            ].map((member, i) => (
              <motion.div
                key={i}
                className="p-4 bg-white rounded-lg shadow-lg hover:scale-105 transition-transform duration-300"
              >
                <img
                  src={member.img || "/fallback.jpg"}
                  alt={member.name}
                  className="w-32 h-32 mx-auto rounded-full object-cover mb-4"
                  onError={(e) => (e.target.src = "/fallback.jpg")}
                />
                <h3 className="font-semibold text-xl mb-1">{member.name}</h3>
                <p className="text-gray-600 mb-3">{member.role}</p>

                <div className="flex justify-center gap-4">
                  <FaFacebookF className="text-blue-600 cursor-pointer" />
                  <FaTwitter className="text-blue-400 cursor-pointer" />
                  <FaLinkedinIn className="text-blue-700 cursor-pointer" />
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Portfolio Section */}
        <section className="py-16 text-center bg-gray-50">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            className="text-3xl font-bold mb-6"
          >
            Popular E-Books
          </motion.h2>

          <motion.p
            initial="hidden"
            whileInView="visible"
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-gray-600 max-w-2xl mx-auto mb-10"
          >
            Explore our most popular e-books.
          </motion.p>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {portfolioBooks.map((book, i) => (
              <motion.img
                key={i}
                src={book.src}
                alt={book.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.2, duration: 0.6 }}
                className="rounded-lg shadow-lg hover:scale-105 transition-transform duration-300 cursor-pointer"
                onClick={() => setLightboxIndex(safeIndex(i))}
                onError={(e) => (e.target.src = "/fallback.jpg")}
              />
            ))}
          </div>

          {/* Lightbox */}
          {lightboxIndex !== null && portfolioBooks[lightboxIndex] && (
            <div
              className="fixed inset-0 bg-black bg-opacity-80 flex flex-col justify-center items-center z-50 p-4"
              onClick={() => setLightboxIndex(null)}
            >
              <img
                src={portfolioBooks[lightboxIndex].src}
                alt={portfolioBooks[lightboxIndex].title}
                className="max-h-[80vh] rounded-lg mb-4"
                onError={(e) => (e.target.src = "/fallback.jpg")}
              />

              <h3 className="text-2xl font-bold mb-2 text-white">
                {portfolioBooks[lightboxIndex].title}
              </h3>

              <p className="text-gray-200">
                {portfolioBooks[lightboxIndex].description}
              </p>
            </div>
          )}
        </section>

        {/* Call To Action */}
        <section className="py-16 text-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            className="text-3xl font-bold mb-4"
          >
            Start Your Reading Journey Today
          </motion.h2>

          <motion.p
            initial="hidden"
            whileInView="visible"
            transition={{ delay: 0.2, duration: 0.8 }}
            className="mb-6 max-w-2xl mx-auto"
          >
            Join thousands of readers and explore our rich e-book collection.
          </motion.p>

          <motion.a
            href="/shop"
            className="inline-block bg-white text-indigo-600 font-semibold py-3 px-8 rounded-full shadow-lg hover:bg-gray-200 transition-all duration-300"
          >
            Browse E-Books
          </motion.a>
        </section>
      </div>

      <Footer />
    </>
  );
};

export default AboutUs;
