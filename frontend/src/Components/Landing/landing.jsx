// frontend/src/Components/Landing/landing.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link for SPA navigation
import { Calendar, Clock, Users, BookOpen, Star, ArrowRight, Menu, X, LogOut, User } from 'lucide-react';

// The component now accepts props to know if a user is logged in
function LandingPage({ isLoggedIn, onLogout }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userName, setUserName] = useState('');

  // This effect runs when the component loads or when the login status changes.
  // It fetches the logged-in user's name from localStorage to display it.
  useEffect(() => {
    if (isLoggedIn) {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setUserName(userData.name);
        }
      } catch (error) {
        console.error("Failed to parse user data from localStorage", error);
      }
    }
  }, [isLoggedIn]);

  // All placeholder state and functions have been removed as they are now handled by props.

  const features = [
    {
      icon: <Calendar className="h-8 w-8 text-indigo-600" />,
      title: "Smart Scheduling",
      description: "AI-powered schedule optimization that considers teacher preferences, room availability, and student needs."
    },
    {
      icon: <Clock className="h-8 w-8 text-indigo-600" />,
      title: "Time Management",
      description: "Effortlessly manage class timings, break schedules, and substitute arrangements with our intuitive interface."
    },
    {
      icon: <Users className="h-8 w-8 text-indigo-600" />,
      title: "Team Collaboration",
      description: "Enable seamless communication between teachers, administrators, and staff for better coordination."
    },
    {
      icon: <BookOpen className="h-8 w-8 text-indigo-600" />,
      title: "Resource Planning",
      description: "Optimize classroom and resource allocation to ensure maximum utilization and minimal conflicts."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <img
                  src="/logo.svg"
                  alt="Planora Logo"
                  className="h-14 w-auto object-contain"
                />
              </Link>
            </div>

            <nav className="hidden md:flex space-x-8">
              <a href="#features" className="text-gray-700 hover:text-indigo-600 font-medium">Features</a>
              <Link to="/" className="text-gray-700 hover:text-indigo-600 font-medium">Home</Link>
            </nav>

            <div className="hidden md:flex items-center space-x-4">
              {/* Conditional rendering based on the isLoggedIn prop */}
              {isLoggedIn ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-700">Welcome, {userName}</span>
                  <Link to="/dashboard" className="text-gray-700 hover:text-indigo-600 font-medium">Dashboard</Link>
                  <button onClick={onLogout} className="text-gray-500 hover:text-red-600 transition-colors" title="Logout">
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <>
                  {/* Use <Link> instead of <a> for internal navigation */}
                  <Link to="/login" className="text-gray-700 hover:text-indigo-600 font-medium">Login</Link>
                  <Link to="/signup" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">Get Started</Link>
                </>
              )}
            </div>

            <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-4 py-2 space-y-1">
              <a href="#features" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-gray-700 hover:text-indigo-600">Features</a>
              <Link to="/" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-gray-700 hover:text-indigo-600">Home</Link>
              {isLoggedIn ? (
                <>
                  <Link to="/dashboard" onClick={() => setIsMenuOpen(false)} className="block w-full text-left px-3 py-2 text-gray-700 hover:text-indigo-600">Dashboard</Link>
                  <button onClick={() => { onLogout(); setIsMenuOpen(false); }} className="block w-full text-left px-3 py-2 text-red-600">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsMenuOpen(false)} className="block w-full text-left px-3 py-2 text-gray-700 hover:text-indigo-600">Login</Link>
                  <Link to="/signup" onClick={() => setIsMenuOpen(false)} className="block w-full text-left px-3 py-2 bg-indigo-600 text-white rounded-lg mt-2">Get Started</Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <main>
        <section className="bg-gradient-to-br from-indigo-50 via-white to-cyan-50 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
                  Revolutionize Your
                  <span className="text-indigo-600"> School Scheduling</span>
                </h1>
                <p className="mt-6 text-xl text-gray-600 leading-relaxed">
                  Streamline teacher schedules, optimize resources, and enhance educational efficiency with our intelligent scheduling platform.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                  {isLoggedIn ? (
                    <Link to="/dashboard" className="bg-indigo-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center space-x-2">
                      <span>Go to Dashboard</span>
                      <ArrowRight className="h-5 w-5" />
                    </Link>
                  ) : (
                    <Link to="/signup" className="bg-indigo-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center space-x-2">
                      <span>Get Started Free</span>
                      <ArrowRight className="h-5 w-5" />
                    </Link>
                  )}
                  {/* The button is now correctly displayed when isLoggedIn is true */}
                  {isLoggedIn && (
                    <Link to="/organisation" className="border-2 border-indigo-600 text-indigo-600 px-8 py-4 rounded-lg font-semibold hover:bg-indigo-50 transition-colors flex items-center justify-center space-x-2">
                      <span>Manage Organization</span>
                      <Users className="h-5 w-5" />
                    </Link>
                  )}
                </div>
              </div>
              <div className="relative hidden lg:block">
                <div className="bg-white rounded-2xl shadow-2xl p-6 transform rotate-3">
                  <div className="bg-indigo-600 rounded-lg p-4 mb-4">
                    <Calendar className="h-8 w-8 text-white mx-auto" />
                  </div>
                  <div className="space-y-3">
                    <div className="bg-gray-100 rounded-lg p-3">
                      <div className="flex items-center space-x-3">
                        <div className="bg-green-500 rounded-full w-3 h-3"></div>
                        <span className="text-sm font-medium">Math - Room 204</span>
                      </div>
                      <span className="text-xs text-gray-500">9:00 AM - 10:30 AM</span>
                    </div>
                    <div className="bg-gray-100 rounded-lg p-3">
                      <div className="flex items-center space-x-3">
                        <div className="bg-blue-500 rounded-full w-3 h-3"></div>
                        <span className="text-sm font-medium">Science - Lab 1</span>
                      </div>
                      <span className="text-xs text-gray-500">11:00 AM - 12:30 PM</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Powerful Features for Modern Education
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Everything you need to manage teacher schedules efficiently and effectively
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="text-center p-6 rounded-xl hover:shadow-lg transition-shadow">
                  <div className="mb-4 flex justify-center">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="bg-indigo-600 rounded-lg p-2">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold">Planora</span>
              </div>
              <p className="text-gray-400">
                Empowering educational institutions with intelligent scheduling solutions.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white">Features</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">API</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Contact Us</a></li>
                <li><a href="#" className="hover:text-white">Status</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Planora. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;