import React from "react";
import HeaderBookStore from "./Header";
import Footer from "./Footer";

function ContactUs() {
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      firstName: e.target[0].value,
      lastName: e.target[1].value,
      email: e.target[2].value,
      subject: e.target[3].value,
      message: e.target[4].value,
    };

    try {
      const res = await fetch("http://localhost:3000/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const text = await res.text();
        console.log("Server returned text:", text);
        alert("Something went wrong");
        return;
      }

      const result = await res.json();
      alert(result.message);
      e.target.reset();
    } catch (error) {
      console.error(error);
      alert("Network error");
    }
  };

  return (
    <div>
      <HeaderBookStore />

      {/* Hero Section */}
      <div className="bg-green-100 py-12 text-center mt-8">
        <h1 className="text-4xl font-bold mb-2">Contact Us</h1>
        <p className="text-gray-700">Share your thoughts, questions, or feedback with us</p>
      </div>

      <div className="max-w-6xl mx-auto p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Contact Form */}
        <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Send us a message</h2>
          <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSubmit}>
            <input type="text" placeholder="First Name" className="border p-2 rounded" />
            <input type="text" placeholder="Last Name" className="border p-2 rounded" />
            <input type="email" placeholder="Email Address" className="border p-2 rounded md:col-span-2" />
            <input type="text" placeholder="Subject" className="border p-2 rounded md:col-span-2" />
            <textarea placeholder="Your Message" className="border p-2 rounded md:col-span-2" rows={4}></textarea>
            <button type="submit" className="bg-green-700 text-white rounded p-2 md:col-span-2 hover:bg-green-800 transition">
              Submit
            </button>
          </form>
        </div>

        {/* Newsletter / Info Box */}
        <div className="bg-green-200 p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Our Newsletter</h3>
          <p className="mb-4 text-gray-700">
            Subscribe to get latest updates and news from us.
          </p>
          <form className="flex gap-2">
            <input type="email" placeholder="Enter your email" className="flex-1 border p-2 rounded" />
            <button type="submit" className="bg-green-700 text-white px-4 rounded hover:bg-green-800 transition">
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Contact Info */}
      <div className="max-w-6xl mx-auto p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <p className="text-gray-700 font-semibold mb-2">Phone</p>
          <p>(+876) 765 665</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <p className="text-gray-700 font-semibold mb-2">Email</p>
          <p>mail@influenca.id</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <p className="text-gray-700 font-semibold mb-2">Location</p>
          <p>London Eye, London</p>
        </div>
      </div>

      {/* Map Section */}
      <div className="max-w-6xl mx-auto p-8">
        <iframe
          title="Location Map"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d19874.923141779857!2d-0.122243!3d51.503323!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x487603536c56e1ab%3A0x96f43a5b5b55670!2sLondon%20Eye!5e0!3m2!1sen!2suk!4v1698888888888!5m2!1sen!2suk"
          width="100%"
          height="400"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>

      <Footer />
    </div>
  );
}

export default ContactUs;
