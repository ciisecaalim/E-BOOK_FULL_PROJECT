import React from "react";
import { FaBook, FaHeadset, FaShippingFast, FaGift } from "react-icons/fa";

function Services() {
  const services = [
    {
      icon: <FaBook size={40} className="text-indigo-600" />,
      title: "Vast e-Book Library",
      description: "Access thousands of e-books across multiple genres anytime, anywhere.",
    },
    {
      icon: <FaHeadset size={40} className="text-indigo-600" />,
      title: "24/7 Support",
      description: "Our team is ready to help you with any issue or inquiry round the clock.",
    },
    {
      icon: <FaShippingFast size={40} className="text-indigo-600" />,
      title: "Instant Delivery",
      description: "Receive your purchased e-books instantly without any delays.",
    },
    {
      icon: <FaGift size={40} className="text-indigo-600" />,
      title: "Special Offers",
      description: "Enjoy exclusive discounts, offers, and free books regularly.",
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6 md:px-20">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">
          Our Services
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center text-center hover:scale-105 transition-transform duration-300"
            >
              <div className="mb-6">{service.icon}</div>
              <h3 className="text-xl font-semibold mb-4">{service.title}</h3>
              <p className="text-gray-600">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Services;
