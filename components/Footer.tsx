import React from 'react';
import { Mail, Phone, MapPin, Instagram, Linkedin, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="mt-20 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-display text-2xl text-slate-900 mb-4">PEC Portal</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Empowering the students of College of Engineering, Pathanapuram to organize, innovate, and lead.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-slate-800 mb-4 uppercase text-xs tracking-wider">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-slate-600 text-sm">
                <MapPin size={16} />
                <span>Elamadu P.O, Pathanapuram, Kerala</span>
              </div>
              <div className="flex items-center space-x-3 text-slate-600 text-sm">
                <Mail size={16} />
                <span>info@pec.ac.in</span>
              </div>
              <div className="flex items-center space-x-3 text-slate-600 text-sm">
                <Phone size={16} />
                <span>+91 475 222 5959</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-slate-800 mb-4 uppercase text-xs tracking-wider">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-900 hover:text-white transition-all">
                <Instagram size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-blue-600 hover:text-white transition-all">
                <Linkedin size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-sky-500 hover:text-white transition-all">
                <Twitter size={20} />
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-slate-100 text-center text-slate-400 text-sm">
          &copy; {new Date().getFullYear()} College of Engineering, Pathanapuram. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
