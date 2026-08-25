import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";

const NotFound = () => {
  return (
    <div className="bg-gray-50 min-h-screen p-4 md:p-8 flex items-center justify-center">
      <Helmet>
        <title>LifeFlowDonor | Page Not Found</title>
      </Helmet>

      <div className="max-w-md w-full">
        {/* Card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-red-600 px-6 md:px-8 py-8 text-center">
            {/* Animated Icon */}
            <div className="text-6xl mb-4 inline-block animate-bounce">
              🩸
            </div>
            <h1 className="text-5xl font-bold text-white">404</h1>
          </div>

          {/* Content */}
          <div className="px-6 md:px-8 py-8 text-center space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">
              Oops! Page Not Found
            </h2>

            <p className="text-gray-600 leading-relaxed">
              The page you&apos;re looking for doesn&apos;t exist or has been moved. Let&apos;s get you back on track.
            </p>

            {/* Error Code */}
            <div className="py-4 bg-red-50 rounded-lg border border-red-200">
              <p className="text-sm text-red-800">
                <span className="font-semibold">Error Code:</span> 404 - Not Found
              </p>
            </div>

            {/* Buttons */}
            <div className="space-y-3 pt-4">
              <Link to="/">
                <button className="w-full px-6 py-3 rounded-md bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors">
                  Return Home
                </button>
              </Link>

              <Link to="/search">
                <button className="w-full px-6 py-3 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold transition-colors">
                  Search Donors
                </button>
              </Link>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 md:px-8 py-4 bg-gray-50 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-600">
              Need help? <Link to="/" className="text-red-600 hover:text-red-700 font-semibold">Contact us</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
