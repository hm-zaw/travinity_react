import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white text-gray-900 py-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <h5 className="text-2xl font-semibold mb-6">Contact Us</h5>
            <p className="text-gray-700 text-lg">
              Customer Care<br />
              <span className="text-2xl text-blue-600">+(95) 998 505 6890</span>
            </p>
            <p className="text-gray-700 text-lg mt-4">
              Need live support?<br />
              <a href="mailto:travinity@org.com" className="text-2xl text-blue-600">travinity@org.com</a>
            </p>
          </div>
          <div>
            <h5 className="text-2xl font-semibold mb-6">Company</h5>
            <ul className="space-y-4 text-gray-700 text-lg">
              <li><a href="#" className="hover:text-gray-900">About Us</a></li>
              <li><a href="#" className="hover:text-gray-900">Careers</a></li>
              <li><a href="#" className="hover:text-gray-900">Blog</a></li>
              <li><a href="#" className="hover:text-gray-900">Press</a></li>
              <li><a href="#" className="hover:text-gray-900">Offers</a></li>
              <li><a href="#" className="hover:text-gray-900">Deals</a></li>
            </ul>
          </div>
          <div>
            <h5 className="text-2xl font-semibold mb-6">Support</h5>
            <ul className="space-y-4 text-gray-700 text-lg">
              <li><a href="#" className="hover:text-gray-900">Contact</a></li>
              <li><a href="#" className="hover:text-gray-900">Legal Notice</a></li>
              <li><a href="#" className="hover:text-gray-900">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-gray-900">Terms and Conditions</a></li>
              <li><a href="#" className="hover:text-gray-900">Sitemap</a></li>
            </ul>
          </div>
          <div className="text-center lg:text-left">
            <h5 className="text-2xl font-semibold mb-6">Other Services</h5>
            <ul className="space-y-4 text-gray-700 text-lg">
              <li><a href="#" className="hover:text-gray-900">Bus</a></li>
              <li><a href="#" className="hover:text-gray-900">Activity Finder</a></li>
              <li><a href="#" className="hover:text-gray-900">Tour List</a></li>
              <li><a href="#" className="hover:text-gray-900">Flight Search</a></li>
              <li><a href="#" className="hover:text-gray-900">Cruise Ticket</a></li>
              <li><a href="#" className="hover:text-gray-900">Holidays</a></li>
              <li><a href="#" className="hover:text-gray-900">Travel Agents</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-300 pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center">
            <p className="text-gray-700 text-lg">&copy; 2025 Travinity. All rights reserved.</p>
            <ul className="flex space-x-6 mt-6 lg:mt-0 text-lg">
              <li><a href="#" className="text-gray-700 hover:text-gray-900">Privacy</a></li>
              <li><a href="#" className="text-gray-700 hover:text-gray-900">Terms</a></li>
              <li><a href="#" className="text-gray-700 hover:text-gray-900">Site Map</a></li>
            </ul>
            <div className="flex space-x-6 mt-6 lg:mt-0">
              <a href="#" className="text-3xl text-gray-700 hover:text-gray-900"><i className="bi bi-facebook"></i></a>
              <a href="#" className="text-3xl text-gray-700 hover:text-gray-900"><i className="bi bi-twitter-x"></i></a>
              <a href="#" className="text-3xl text-gray-700 hover:text-gray-900"><i className="bi bi-linkedin"></i></a>
              <a href="#" className="text-3xl text-gray-700 hover:text-gray-900"><i className="bi bi-instagram"></i></a>
              <a href="#" className="text-3xl text-gray-700 hover:text-gray-900"><i className="bi bi-whatsapp"></i></a>
            </div>
          </div>
        </div>
        <a href="#" className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg">
          <i className="bi bi-chevron-double-up"></i>
        </a>
      </div>
    </footer>
  );
};

export default Footer;