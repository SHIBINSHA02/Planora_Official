// frontend/src/Components/organisation/organisation.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom'; 
// --- Placeholder Icons ---
// In a real app, you would import these from a library like 'lucide-react'
const Menu = ({ className }) => <svg className={className} stroke="currentColor" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>;
const X = ({ className }) => <svg className={className} stroke="currentColor" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;
const LogOut = ({ className }) => <svg className={className} stroke="currentColor" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>;


// --- Header Component (from your code) ---
const Header = ({ user, logout, isMenuOpen, setIsMenuOpen }) => {
  // In a real app, you'd use the useNavigate hook from react-router-dom
  const navigate = (path) => {
    alert(`Navigating to: /${path}`);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex items-center space-x-2">
              <div className="flex-shrink-0">
                <Link to="/" className="">
                <img
                  src="/logo.svg"
                  alt="Planora Logo"
                  className="h-14 w-auto object-contain"
                />
                </Link>
              </div>
            </div>
          </div>

          <nav className="hidden md:flex space-x-8">
            <a href="/#features" className="text-gray-700 hover:text-indigo-600 font-medium">Features</a>
            <a href="/" className="text-gray-700 hover:text-indigo-600 font-medium">Home</a>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-700">Welcome, {user.name}</span>
                <button onClick={logout} className="text-gray-500 hover:text-red-600 transition-colors">
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <>
                <a href="/login" className="text-gray-700 hover:text-indigo-600 font-medium">Login</a>
                <a href="/signup" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">Get Started</a>
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
            <a href="#features" className="block px-3 py-2 text-gray-700 hover:text-indigo-600">Features</a>
            <a href="/" className="block px-3 py-2 text-gray-700 hover:text-indigo-600">Home</a>
            <a href="#testimonials" className="block px-3 py-2 text-gray-700 hover:text-indigo-600">Testimonials</a>
            {user ? (
              <>
                <button onClick={() => navigate('dashboard')} className="block w-full text-left px-3 py-2 text-gray-700 hover:text-indigo-600">Dashboard</button>
                <button onClick={logout} className="block w-full text-left px-3 py-2 text-red-600">Logout</button>
              </>
            ) : (
              <>
                <button onClick={() => navigate('login')} className="block w-full text-left px-3 py-2 text-gray-700 hover:text-indigo-600">Login</button>
                <a href="/signup" className="block w-full text-left px-3 py-2 bg-indigo-600 text-white rounded-lg mt-2">Get Started</a>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};


// --- Organisation Onboarding Content Component ---
const TEMP_ORGANISATIONS = [
    { id: 1, name: 'Greenwood High School', location: 'Springfield, IL', adminEmail: 'admin@greenwood.edu', status: 'Active' },
    { id: 2, name: 'Northside Preparatory Academy', location: 'Metropolis, NY', adminEmail: 'contact@northsideprep.org', status: 'Active' },
    { id: 3, name: 'Oakridge International School', location: 'Sunnyvale, CA', adminEmail: 'info@oakridge.io', status: 'Pending' },
];

const OrganisationOnboarding = () => {
  const [organisations, setOrganisations] = useState(TEMP_ORGANISATIONS);
  const [orgName, setOrgName] = useState('');
  const [orgLocation, setOrgLocation] = useState('');
  const [orgEmail, setOrgEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedName = orgName.trim();
    const trimmedEmail = orgEmail.trim();
    if (!trimmedName || !trimmedEmail) {
      alert('Please fill in both Organisation Name and Admin Email.');
      return;
    }
    const newOrganisation = {
      id: Date.now(),
      name: trimmedName,
      location: orgLocation.trim(),
      adminEmail: trimmedEmail,
      status: 'Active',
    };
    setOrganisations(prevOrgs => [newOrganisation, ...prevOrgs]);
    setOrgName('');
    setOrgLocation('');
    setOrgEmail('');
  };

  const getStatusBadgeClass = (status) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Organisation Management</h1>
        <div className="bg-white p-6 rounded-lg shadow-md mb-10">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Add New Organisation</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Organisation Name</label>
                <input type="text" value={orgName} onChange={(e) => setOrgName(e.target.value)} placeholder="e.g., Springfield Elementary" className="mt-1 w-full rounded-md bg-white border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <input type="text" value={orgLocation} onChange={(e) => setOrgLocation(e.target.value)} placeholder="e.g., City, State" className="mt-1 w-full rounded-md bg-white border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Admin Email</label>
              <input type="email" value={orgEmail} onChange={(e) => setOrgEmail(e.target.value)} placeholder="e.g., admin@springfield.edu" className="mt-1 w-full rounded-md bg-white border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600" />
            </div>
            <div className="pt-2">
              <button type="submit" className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200 shadow">Add Organisation</button>
            </div>
          </form>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Available Organisations</h2>
          <div className="space-y-4">
            {organisations.map((org) => (
              <div key={org.id} className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center">
                <div className="mb-4 md:mb-0">
                  <h3 className="text-lg font-bold text-gray-900">{org.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{org.location}</p>
                  <p className="text-sm text-gray-500 mt-1">{org.adminEmail}</p>
                </div>
                <div>
                  <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(org.status)}`}>{org.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};


// --- Main Page Component ---
const OrganisationPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Mock user data and functions for the header
  // In a real app, this would come from your authentication context
  const mockUser = { name: 'Admin User' };
  const mockLogout = () => {
    alert('Logout function called!');
    // Here you would typically clear tokens and redirect to login
  };

  return (
    <div>
      <Header
        user={mockUser}
        logout={mockLogout}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
      />
      <main>
        <OrganisationOnboarding />
      </main>
    </div>
  );
};

export default OrganisationPage;