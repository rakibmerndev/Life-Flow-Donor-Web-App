import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import {
  FaCodePullRequest,
  FaHandHoldingDollar,
  FaUsers,
} from "react-icons/fa6";
import { TbDiscountCheck } from "react-icons/tb";
import useAuth from "../../../hooks/useAuth.js";
import useAxiosSecure from "../../../hooks/useAxiosSecure.js";

const AdminHome = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const { data: totalData = {} } = useQuery({
    queryKey: ["totalData"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin-stats");
      return res.data;
    },
  });
  const { totalDonation } = totalData;
  const total = totalDonation?.reduce(
    (acc, transaction) => acc + transaction.price,
    0,
  );

  return (
    <div className="bg-gray-50 min-h-screen p-4 md:p-8">
      <Helmet>
        <title>LifeFlowDonor | Admin Dashboard</title>
      </Helmet>

      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
          Welcome, <span className="text-red-600">{user?.displayName}</span>
        </h1>
        <p className="text-gray-600 mt-2">Admin Dashboard Overview</p>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Users Card */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-l-red-600 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                Total Users
              </p>
              <p className="text-4xl font-bold text-gray-900 mt-3">
                {totalData.users || 0}
              </p>
            </div>
            <div className="text-5xl text-red-600">
              <FaUsers />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-4">
            Active users in the system
          </p>
        </div>

        {/* Total Requests Card */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-l-red-600 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                Total Requests
              </p>
              <p className="text-4xl font-bold text-gray-900 mt-3">
                {totalData.requests || 0}
              </p>
            </div>
            <div className="text-5xl text-red-600">
              <FaCodePullRequest />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-4">
            Donation requests created
          </p>
        </div>

        {/* Total Funding Count Card */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-l-red-600 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                Funding Count
              </p>
              <p className="text-4xl font-bold text-gray-900 mt-3">
                {totalData.donationsCount || 0}
              </p>
            </div>
            <div className="text-5xl text-red-600">
              <TbDiscountCheck />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-4">
            Total donations received
          </p>
        </div>

        {/* Total Funding Collected Card */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-l-red-600 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                Total Collected
              </p>
              <p className="text-4xl font-bold text-red-600 mt-3">
                ${total || 0}
              </p>
            </div>
            <div className="text-5xl text-red-600">
              <FaHandHoldingDollar />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-4">
            Total funds collected
          </p>
        </div>
      </div>

      {/* Additional Info Section (Optional) */}
      <div className="mt-10 bg-white rounded-lg shadow-md p-8 border-l-4 border-l-red-600">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          System Overview
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 text-xl">
              👥
            </div>
            <div>
              <p className="text-sm text-gray-600">User Engagement</p>
              <p className="text-lg font-semibold text-gray-900">
                {totalData.users ? Math.round((totalData.requests / totalData.users) * 10) / 10 : 0} requests per user
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 text-xl">
              💰
            </div>
            <div>
              <p className="text-sm text-gray-600">Average Donation</p>
              <p className="text-lg font-semibold text-gray-900">
                ${totalData.donationsCount ? Math.round((total / totalData.donationsCount) * 100) / 100 : 0}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 text-xl">
              🎯
            </div>
            <div>
              <p className="text-sm text-gray-600">Completion Rate</p>
              <p className="text-lg font-semibold text-gray-900">
                {totalData.requests ? Math.round((totalData.donationsCount / totalData.requests) * 100) : 0}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
