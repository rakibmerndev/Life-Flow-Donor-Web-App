/* eslint-disable react/no-unescaped-entities */
import { Link } from "react-router-dom";

const Description = () => {
  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          Support LifeFlowDonor Initiatives
        </h1>
        <p className="text-gray-600 text-lg">
          Your contribution plays a crucial role in ensuring a steady and accessible blood supply, ultimately saving lives
        </p>
      </div>

      {/* Introduction Card */}
      <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 border-l-4 border-red-600">
        <p className="text-gray-800 leading-relaxed">
          Thank you for considering a monetary donation to empower our blood donation initiatives! Your support plays a crucial role in ensuring a
          steady and accessible blood supply, ultimately saving lives and making
          a lasting impact on communities in need.
        </p>
      </div>

      {/* Why Donate Section */}
      <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-4 border-b-2 border-red-600">
          Why Donate Financially?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 rounded-lg p-6 border-l-4 border-red-600">
            <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
              <span className="text-red-600 text-xl">🩸</span>
              Procurement and Storage
            </h3>
            <p className="text-gray-700">
              Enable us to efficiently collect and store blood and blood products, ensuring a constant supply for emergencies, surgeries, and medical treatments.
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 border-l-4 border-red-600">
            <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
              <span className="text-red-600 text-xl">🚐</span>
              Mobile Blood Drives
            </h3>
            <p className="text-gray-700">
              Support the organization of mobile blood drives, reaching underserved areas and making it easier for donors to contribute, even in remote locations.
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 border-l-4 border-red-600">
            <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
              <span className="text-red-600 text-xl">📢</span>
              Community Outreach Programs
            </h3>
            <p className="text-gray-700">
              Fund educational initiatives that raise awareness about the importance of blood donation, dispelling myths, and encouraging regular donors to sustain the lifeline.
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 border-l-4 border-red-600">
            <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
              <span className="text-red-600 text-xl">⭐</span>
              Donor Recognition
            </h3>
            <p className="text-gray-700">
              Recognize and appreciate the heroes who step forward to donate. Your donation helps organize events, provide certificates, and build a supportive community.
            </p>
          </div>
        </div>
      </div>

      {/* Impact Section */}
      <div className="bg-red-600 rounded-lg shadow-lg p-6 md:p-8 text-white">
        <h2 className="text-2xl font-bold mb-4">
          How Your Contribution Makes a Difference
        </h2>
        <p className="text-red-100 leading-relaxed text-lg">
          Every dollar you contribute goes directly towards ensuring that our LifeFlowDonor programs are efficient, sustainable, and able to reach those who need it the most. Your support is the driving force behind our mission to make a positive impact on countless lives.
        </p>
      </div>

      {/* CTA Section */}
      <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-4 border-b-2 border-red-600">
          Ready to Make a Difference?
        </h2>

        <p className="text-gray-800 leading-relaxed mb-6">
          Your generosity can transform lives. Whether it's a one-time donation or a recurring contribution, every amount makes a significant impact. Join us in this noble cause, and together, let's make a lasting difference in the lives of those in need.
        </p>

        <Link
          to="/donate"
          className="inline-block px-8 py-3 rounded-md bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors text-lg"
        >
          💝 Donate Now and Be a Lifesaver!
        </Link>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-white rounded-lg shadow-md p-6 text-center border-t-4 border-red-600">
          <div className="text-3xl font-bold text-red-600 mb-2">500+</div>
          <p className="text-gray-700 font-semibold">Lives Impacted</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 text-center border-t-4 border-red-600">
          <div className="text-3xl font-bold text-red-600 mb-2">1000+</div>
          <p className="text-gray-700 font-semibold">Active Donors</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 text-center border-t-4 border-red-600">
          <div className="text-3xl font-bold text-red-600 mb-2">50+</div>
          <p className="text-gray-700 font-semibold">Blood Drives</p>
        </div>
      </div>
    </div>
  );
};

export default Description;
