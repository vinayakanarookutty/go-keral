import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faComment, 
  faBars, 
  faTimes,
  faCalendarAlt 
} from '@fortawesome/free-solid-svg-icons';
import { Button } from 'antd';
import Logo from "../../../public/gokeral.png";
import background_img from "../../../public/background.jpg";
import { useUserStore } from "../../store/user";

const NavLink = ({ href, children, onClick }: { href: string; children: React.ReactNode; onClick?: () => void }) => (
  <a 
    href={href}
    onClick={onClick}
    className="text-zinc-100 hover:text-golden transition-colors duration-300 flex items-center gap-2 px-4 py-2 text-sm tracking-wider uppercase"
    style={{ fontFamily: 'Montserrat, sans-serif' }}
  >
    {children}
  </a>
);

const HomePage: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const user = useUserStore((state: any) => state?.userDetails);

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Custom CSS */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Montserrat:wght@300;400;500;600&display=swap');
          
          .text-golden {
            color: #D4AF37;
          }
          
          .bg-golden {
            background-color: #D4AF37;
          }
          
          .hover\:text-golden:hover {
            color: #D4AF37;
          }
          
          .hover\:bg-golden:hover {
            background-color: #D4AF37;
          }
          
          .border-golden {
            border-color: #D4AF37;
          }

          .content-blur {
            filter: blur(8px);
            transition: filter 0.3s ease-in-out;
          }
        `}
      </style>

      {/* Main background with gradient overlay */}
      <div className={`fixed inset-0 z-0 transition-all duration-300 ${isMenuOpen ? 'content-blur' : ''}`}>
        <div 
          style={{ backgroundImage: `url(${background_img})` }}
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
      </div>

      {/* Header */}
      <header className="fixed w-full z-20 bg-black/30 backdrop-blur-sm border-b border-zinc-700/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 md:h-24">
            {/* Logo section */}
            <div className="flex items-center space-x-2">
              <a 
                href="#" 
                style={{fontFamily: "Playfair Display, serif"}}
                className="text-golden text-2xl md:text-4xl font-bold hover:text-white transition-colors duration-300"
              >
                Go Keral
              </a>
              <img 
                src={Logo} 
                alt="Go Keral Logo" 
                className="h-12 md:h-16"
              />
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <NavLink href="/">Home</NavLink>
              <NavLink href="/services">Services</NavLink>
              <NavLink href="/about">About</NavLink>
              <NavLink href="/contact">Contact</NavLink>
              
              {user.email ? (
                <a href="/userProfile">
                  <Button className="ml-6 bg-transparent text-golden hover:text-white border border-golden hover:border-white px-6 py-4 h-auto transition-all duration-300">
                    <p style={{fontFamily: "Montserrat"}} className="flex text-sm tracking-wider uppercase">Profile</p>
                  </Button>
                </a>
              ) : (
                <a href="/userRegistration">
                  <Button className="ml-6 bg-transparent text-golden hover:text-white border border-golden hover:border-white px-6 py-4 h-auto transition-all duration-300">
                    <p style={{fontFamily: "Montserrat"}} className="flex text-sm tracking-wider uppercase">Register</p>
                  </Button>
                </a>
              )}
            </nav>

            {/* Mobile menu button */}
            <button 
              onClick={toggleMenu}
              className="md:hidden p-2 text-golden hover:text-white transition-colors duration-300 z-50"
            >
              <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} className="text-2xl" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation - Full screen overlay */}
        <div 
          className={`
            fixed 
            inset-0 
            bg-black/95
            backdrop-blur-xl
            z-40 
            md:hidden
            transition-all
            duration-300 
            ease-in-out
            flex
            flex-col
            ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}
          `}
        >
          <div className="flex flex-col h-full pt-24 px-6">
            <div className="flex flex-col space-y-8">
              <NavLink href="/" onClick={closeMenu}>Home</NavLink>
              <NavLink href="/services" onClick={closeMenu}>Services</NavLink>
              <NavLink href="/about" onClick={closeMenu}>About</NavLink>
              <NavLink href="/contact" onClick={closeMenu}>Contact</NavLink>
              
              {user.email ? (
                <a href="/userProfile" onClick={closeMenu} className="mt-4">
                  <Button className="w-full bg-transparent text-golden hover:text-white border border-golden hover:border-white h-auto py-4 transition-all duration-300">
                    <p style={{fontFamily: "Montserrat"}} className="flex justify-center text-sm tracking-wider uppercase">Profile</p>
                  </Button>
                </a>
              ) : (
                <a href="/userRegistration" onClick={closeMenu} className="mt-4">
                  <Button className="w-full bg-transparent text-golden hover:text-white border border-golden hover:border-white h-auto py-4 transition-all duration-300">
                    <p style={{fontFamily: "Montserrat"}} className="flex justify-center text-sm tracking-wider uppercase">Register</p>
                  </Button>
                </a>
              )}
            </div>

            {/* Additional mobile menu content */}
            <div className="mt-auto mb-12">
              <div className="text-zinc-400 space-y-4" style={{fontFamily: "Montserrat"}}>
                <p className="text-sm uppercase tracking-wider text-golden">Contact Us</p>
                <p className="text-sm">contact@gokeral.com</p>
                <p className="text-sm">+91 123 456 7890</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className={`relative min-h-screen pt-24 transition-all duration-300 ${isMenuOpen ? 'content-blur' : ''}`}>
        <div className="h-full flex flex-col justify-center px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="space-y-8 py-20 md:py-32">
            <div className="space-y-2">
              <p className="text-golden tracking-widest uppercase text-sm md:text-base"
                 style={{fontFamily: "Montserrat"}}>
                Premium Travel Experience
              </p>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight"
                  style={{fontFamily: "Playfair Display"}}>
                Discover Kerala <br />in Luxury
              </h1>
            </div>
            <p className="text-lg md:text-xl text-zinc-300 max-w-lg leading-relaxed"
               style={{fontFamily: "Montserrat"}}>
              Experience the beauty of God's own country with our premium vehicle booking service
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <a href="/maps">
                <button className="
                  bg-transparent
                  hover:bg-golden 
                  border
                  border-golden
                  text-golden
                  hover:text-black
                  px-8 
                  py-4
                  rounded-none
                  w-full 
                  sm:w-auto 
                  transition-all 
                  duration-300
                  flex
                  items-center
                  justify-center
                  gap-2
                  group
                "
                style={{fontFamily: "Montserrat"}}
                >
                  <FontAwesomeIcon icon={faCalendarAlt} className="text-golden group-hover:text-black transition-colors duration-300" />
                  <span className="tracking-wider uppercase text-sm">Book Now</span>
                </button>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Bot Button */}
      <button className={`
        fixed 
        right-4 
        bottom-4 
        md:right-6 
        md:bottom-6 
        bg-golden
        hover:bg-transparent 
        text-black
        hover:text-golden
        border
        border-golden
        w-12 
        h-12 
        md:w-16 
        md:h-16 
        rounded-none
        flex 
        items-center 
        justify-center 
        shadow-lg 
        transition-all 
        duration-300
        ${isMenuOpen ? 'content-blur' : ''}
      `}>
        <FontAwesomeIcon icon={faComment} className="text-xl md:text-2xl" />
      </button>
    </div>
  );
};

export default HomePage;