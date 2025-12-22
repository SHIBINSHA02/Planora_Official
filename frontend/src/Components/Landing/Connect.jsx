// frontend/src/Components/Landing/Connect.jsx
import React, { useState } from "react";
import { Mail, Phone, User, MessageSquare } from "lucide-react";

const Connect = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 🔧 Hook backend later
    console.log("Enquiry:", formData);

    alert("Thanks for reaching out! We'll contact you soon.");

    setFormData({
      name: "",
      email: "",
      phone: "",
      message: "",
    });
  };

  return (
    <section className="py-20 m-4 rounded-3xl bg-gradient-to-t from-blue-100 to-white">
      <div className="max-w-4xl p-8 mx-auto bg-white shadow-2xl rounded-3xl">
        {/* Header */}
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-semibold md:text-4xl">
            Get in <span className="text-indigo-600">Touch</span>
          </h2>
          <p className="mt-4 text-gray-600">
            Have an enquiry about scheduling, onboarding, or pricing?
            Send us a message.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="grid gap-6 md:grid-cols-2">
          {/* Name */}
          <div>
            <label className="block mb-2 text-sm font-medium">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute w-5 h-5 text-gray-400 left-3 top-3" />
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                className="w-full py-3 pl-10 pr-4 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block mb-2 text-sm font-medium">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute w-5 h-5 text-gray-400 left-3 top-3" />
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full py-3 pl-10 pr-4 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block mb-2 text-sm font-medium">
              Phone (optional)
            </label>
            <div className="relative">
              <Phone className="absolute w-5 h-5 text-gray-400 left-3 top-3" />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 XXXXX XXXXX"
                className="w-full py-3 pl-10 pr-4 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Message */}
          <div className="md:col-span-2">
            <label className="block mb-2 text-sm font-medium">
              Message
            </label>
            <div className="relative">
              <MessageSquare className="absolute w-5 h-5 text-gray-400 left-3 top-3" />
              <textarea
                name="message"
                required
                rows="4"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us what you're looking for..."
                className="w-full py-3 pl-10 pr-4 border resize-none rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full py-4 text-white transition bg-indigo-600 rounded-2xl hover:bg-indigo-700"
            >
              Send Enquiry
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Connect;
