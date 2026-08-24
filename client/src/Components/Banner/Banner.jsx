import { Link } from "react-router-dom";
import background from "../../assets/bg.jpg";
import useAuth from "../../hooks/useAuth.js";

const Banner = () => {
  const { user } = useAuth();
  return (
    <div
      className="relative bg-no-repeat bg-center bg-cover h-screen flex justify-center items-center mx-auto font-Font-Play"
      style={{ backgroundImage: `url(${background})` }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 md:px-8 space-y-8 text-center">
        {/* Icon */}
        <div className="text-6xl md:text-7xl">🩸</div>

        {/* Main Heading */}
        <div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 leading-tight drop-shadow-lg">
            Our mission is to save as many lives as possible
          </h1>
          <p className="text-lg md:text-xl text-red-100 drop-shadow-md max-w-2xl mx-auto">
            Join us in making a difference. Every donation counts towards saving someone&apos;s life.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 md:gap-6">
          {!user && (
            <Link to="/signup">
              <button className="px-8 py-3 md:px-10 md:py-4 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold text-lg transition-all transform hover:scale-105 shadow-lg">
                Join As A Donor
              </button>
            </Link>
          )}
          <Link to="/search">
            <button className="px-8 py-3 md:px-10 md:py-4 rounded-lg bg-gray-800 hover:bg-gray-900 text-white font-semibold text-lg transition-all transform hover:scale-105 shadow-lg">
              Search Donors
            </button>
          </Link>
        </div>

        {/* Stats/Info Section */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-12 pt-8 border-t border-white/20">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-red-300">500+</div>
            <p className="text-sm md:text-base text-white/80 mt-2">Lives Saved</p>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-red-300">1000+</div>
            <p className="text-sm md:text-base text-white/80 mt-2">Active Donors</p>
          </div>
          <div className="text-center col-span-2 md:col-span-1">
            <div className="text-3xl md:text-4xl font-bold text-red-300">50+</div>
            <p className="text-sm md:text-base text-white/80 mt-2">Blood Drives</p>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>
    </div>
  );
};

export default Banner;
