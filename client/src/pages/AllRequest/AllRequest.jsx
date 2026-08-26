import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import useAxiosPublic from "../../hooks/useAxiosPublic.js";
import LoadingSkeleton from "./LoadingSkeleton.jsx";

const AllRequest = () => {
  const axiosPublic = useAxiosPublic();
  const { data: requests = [], isLoading } = useQuery({
    queryKey: ["requests"],
    queryFn: async () => {
      const res = await axiosPublic.get("/request");
      return res.data;
    },
  });

  const [selectedFilter, setSelectedFilter] = useState("");

  const filteredRequests =
    selectedFilter === ""
      ? requests
      : requests.filter((request) => request.donationStatus === selectedFilter);

  const handleSelect = (e) => {
    setSelectedFilter(e.target.value);
  };

  return (
    <div className="bg-gray-50 min-h-screen p-4 md:p-8">
      <Helmet>
        <title>LifeFlowDonor | All Requests</title>
      </Helmet>

      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          All Donation Requests
        </h1>
        <p className="text-gray-600">
          Browse all blood donation requests and find ways to help
        </p>
      </div>

      {/* Filter Section */}
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-md p-6 mb-8">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Filter by Status
        </label>
        <select
          name="select-request"
          onChange={handleSelect}
          value={selectedFilter}
          className="w-full md:w-64 py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 text-gray-800"
        >
          <option value="">All Requests</option>
          <option value="pending">Pending</option>
          <option value="inprogress">In Progress</option>
          <option value="done">Done</option>
          <option value="canceled">Canceled</option>
        </select>
      </div>

      {/* Table Section */}
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-red-600 px-6 py-4">
          <h2 className="text-xl font-bold text-white">
            {isLoading
              ? "Loading..."
              : `${filteredRequests.length} Request${filteredRequests.length !== 1 ? "s" : ""}`}
          </h2>
        </div>

        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-8">
              <LoadingSkeleton />
            </div>
          ) : filteredRequests.length > 0 ? (
            <table className="w-full">
              <thead className="bg-gray-100 border-b border-gray-300">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    #
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Recipient Name
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Blood Group
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredRequests.map((request, index) => (
                  <tr
                    key={request._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-800">
                      {request.recipientName}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="inline-block px-3 py-1 rounded-full bg-red-100 text-red-800 font-semibold">
                        {request.requiredBloodGroup}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      {request.upazila}, {request.district}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      <div>
                        <p>{request.donationDate}</p>
                        <p className="text-xs text-gray-500">
                          {request.donationTime}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                          request.donationStatus === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : request.donationStatus === "inprogress"
                              ? "bg-blue-100 text-blue-800"
                              : request.donationStatus === "done"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                        }`}
                      >
                        {request.donationStatus === "inprogress"
                          ? "In Progress"
                          : request.donationStatus.charAt(0).toUpperCase() +
                            request.donationStatus.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <Link to={`/dashboard/details/${request._id}`}>
                        <button className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors">
                          View Details
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-8 text-center">
              <p className="text-lg text-gray-600">
                No donation requests found matching the selected filter.
              </p>
              <Link to="/">
                <button className="mt-4 px-6 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors">
                  View All Requests
                </button>
              </Link>
            </div>
          )}
        </div>

        {/* Footer Stats */}
        {!isLoading && filteredRequests.length > 0 && (
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Showing{" "}
              <span className="font-semibold">{filteredRequests.length}</span>{" "}
              of <span className="font-semibold">{requests.length}</span> total
              requests
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllRequest;
