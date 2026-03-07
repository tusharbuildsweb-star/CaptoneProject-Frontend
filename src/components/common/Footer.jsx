import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-zinc-950 border-t border-white/5 py-16 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-1">
          <span className="text-3xl font-serif font-bold text-white tracking-widest block mb-6">
            RESERVE
          </span>
          <p className="text-zinc-500 text-sm leading-relaxed max-w-xs font-light">
            Defining the pinnacle of luxury dining reservations. Discover and book the world's most sought-after tables with ease.
          </p>
        </div>

        <div>
          <h4 className="text-amber-500 font-semibold mb-6 uppercase tracking-widest text-xs">Discover</h4>
          <ul className="space-y-4 text-sm text-zinc-400">
            <li><Link to="/restaurants?filter=top10" className="hover:text-white transition-colors block font-light">Top 10 Restaurants</Link></li>
            <li><Link to="/testimonials" className="hover:text-white transition-colors block font-light">Guest Testimonials</Link></li>
            <li><Link to="/restaurants?filter=openNow" className="hover:text-white transition-colors block font-light">Restaurants Open Now</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-amber-500 font-semibold mb-6 uppercase tracking-widest text-xs">Company</h4>
          <ul className="space-y-4 text-sm text-zinc-400">
            <li><Link to="/about" className="hover:text-white transition-colors block font-light">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-white transition-colors block font-light">Contact Us</Link></li>
            <li><Link to="/faq" className="hover:text-white transition-colors block font-light">FAQ</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-amber-500 font-semibold mb-6 uppercase tracking-widest text-xs">Contact Us</h4>
          <ul className="space-y-4 text-sm text-zinc-400">
            <li className="font-light">Email: info@reserve.com</li>
            <li className="font-light">Phone: +91 98765 43210</li>
            <li className="font-light">Mylapore, Chennai, Tamil Nadu</li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-[10px] text-zinc-600 uppercase tracking-widest font-medium">
          &copy; {new Date().getFullYear()} Reserve. Premium Restaurant Reservations.
        </p>
        <div className="flex gap-8 text-[10px] text-zinc-600 uppercase tracking-widest font-medium">
          <Link to="/privacy" className="hover:text-zinc-400 transition-colors">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-zinc-400 transition-colors">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
