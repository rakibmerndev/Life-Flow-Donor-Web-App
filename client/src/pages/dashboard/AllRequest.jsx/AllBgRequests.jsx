import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import useAxiosPublic from "../../../hooks/useAxiosPublic.js";
import useAxiosSecure from "../../../hooks/useAxiosSecure.js";
import useCurrentUser from "../../../hooks/useCurrentUser.js";

const AllBgRequests = () => {
  const axiosPublic = useAxiosPublic();
  const axiosSecure = useAxiosSecure();
  const { data: allRequests = [], refetch } = useQuery({
    queryKey: ["all-requests"],
    queryFn: async () => {
      const res = await axiosPublic.get("/request");
      return res.data;
    },
  });

  const [status, setStatus] = useState("");

  const { currentUser } = useCurrentUser();

  const handleCancel = async (id) => {
    const data = {
      donationStatus: "canceled",
    };
    const res = await axiosSecure.patch(`/cancel/${id}`, data);
    if (res.data.modifiedCount > 0) {
      refetch();
    }
  };

  const handleDone = async (id) => {
    const data = {
      donationStatus: "done",
    };
    const res = await axiosSecure.patch(`/done/${id}`, data);
    if (res.data.modifiedCount > 0) {
      refetch();
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const rest = await axiosSecure.delete(`/request/${id}`);

        if (rest.data.deletedCount > 0) {
          Swal.fire({
            title: "Deleted!",
            text: "The request has been deleted.",
            icon: "success",
          });
          refetch();
        }
      }
    });
  };

  const filteredRequest = allRequests.filter(
    (request) => status === "" || request.donationStatus === status,
  );

  return (
    <div className="bg-gray-50 min-h-screen p-4 md:p-8">
      <Helmet>
        <title>LifeFlowDonor | All Requests</title>
      </Helmet>

      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
          All Donation Requests
        </h1>
        <p className="text-gray-600 mt-2">
          Manage and filter all blood donation requests
        </p>
      </div>

      {/* Filter Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Filter by Status
        </label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full md:w-64 py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600"
        >
          <option value="">All Requests</option>
          <option value="pending">Pending</option>
          <option value="inprogress">In Progress</option>
          <option value="done">Done</option>
          <option value="canceled">Canceled</option>
        </select>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-red-600 px-4 md:px-6 py-4">
          <h2 className="text-lg md:text-xl font-bold text-white">
            {filteredRequest.length}{" "}
            {filteredRequest.length === 1 ? "Request" : "Requests"} Found
          </h2>
        </div>

        {filteredRequest.length > 0 ? (
          <>
            {/* Mobile/Tablet Card View */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:hidden gap-4 p-4 md:p-6">
              {filteredRequest.map((request, index) => (
                <div
                  key={request._id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-white"
                >
                  <div className="space-y-3">
                    {/* Request Number and Status */}
                    <div className="flex justify-between items-start">
                      <span className="text-sm font-bold text-gray-900">
                        #{index + 1}
                      </span>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
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
                    </div>

                    {/* Recipient Info */}
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Recipient</p>
                      <p className="font-semibold text-gray-900">
                        {request.recipientName}
                      </p>
                    </div>

                    {/* Blood Group */}
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Blood Group</p>
                      <span className="inline-block px-3 py-1 rounded-full bg-red-100 text-red-800 font-semibold text-sm">
                        {request.requiredBloodGroup}
                      </span>
                    </div>

                    {/* Location */}
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Location</p>
                      <p className="text-sm text-gray-800">
                        {request.upazila}, {request.district}
                      </p>
                    </div>

                    {/* Date & Time */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Date</p>
                        <p className="text-sm text-gray-800">
                          {request.donationDate}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Time</p>
                        <p className="text-sm text-gray-800">
                          {request.donationTime}
                        </p>
                      </div>
                    </div>

                    {/* Donor Info */}
                    {request?.donationStatus === "inprogress" && (
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Donor</p>
                        <p className="font-medium text-gray-800 text-sm">
                          {request.donorName || "N/A"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {request.donorEmail || "N/A"}
                        </p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2 pt-2">
                      {request?.donationStatus === "inprogress" && (
                        <>
                          <button
                            onClick={() => handleDone(request._id)}
                            className="px-3 py-1.5 rounded-md bg-green-600 hover:bg-green-700 text-white text-xs font-semibold transition-colors"
                          >
                            Done
                          </button>
                          <button
                            onClick={() => handleCancel(request._id)}
                            className="px-3 py-1.5 rounded-md bg-red-600 hover:bg-red-700 text-white text-xs font-semibold transition-colors"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                      {currentUser[0]?.role === "admin" && (
                        <>
                          <Link to={`/dashboard/update/${request._id}`}>
                            <button className="px-3 py-1.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors">
                              Edit
                            </button>
                          </Link>
                          <button
                            onClick={() => handleDelete(request._id)}
                            className="px-3 py-1.5 rounded-md bg-red-600 hover:bg-red-700 text-white text-xs font-semibold transition-colors"
                          >
                            Delete
                          </button>
                        </>
                      )}
                      <Link to={`/dashboard/details/${request._id}`}>
                        <button className="px-3 py-1.5 rounded-md bg-gray-600 hover:bg-gray-700 text-white text-xs font-semibold transition-colors">
                          View
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
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
                      Donor
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredRequest.map((request, index) => (
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
                        {request?.donationStatus === "inprogress" ? (
                          <div>
                            <p className="font-medium text-gray-800">
                              {request.donorName || "N/A"}
                            </p>
                            <p className="text-xs text-gray-500">
                              {request.donorEmail || "N/A"}
                            </p>
                          </div>
                        ) : (
                          <span className="text-gray-500">
                            {request.donorName || "Not assigned"}{" "}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2 flex-wrap">
                          {request?.donationStatus === "inprogress" && (
                            <>
                              <button
                                onClick={() => handleDone(request._id)}
                                className="px-3 py-1 rounded-md bg-green-600 hover:bg-green-700 text-white text-xs font-semibold transition-colors"
                              >
                                Done
                              </button>
                              <button
                                onClick={() => handleCancel(request._id)}
                                className="px-3 py-1 rounded-md bg-red-600 hover:bg-red-700 text-white text-xs font-semibold transition-colors"
                              >
                                Cancel
                              </button>
                            </>
                          )}
                          {currentUser[0]?.role === "admin" && (
                            <>
                              <Link to={`/dashboard/update/${request._id}`}>
                                <button className="px-3 py-1 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors">
                                  Edit
                                </button>
                              </Link>
                              <button
                                onClick={() => handleDelete(request._id)}
                                className="px-3 py-1 rounded-md bg-red-600 hover:bg-red-700 text-white text-xs font-semibold transition-colors"
                              >
                                Delete
                              </button>
                            </>
                          )}
                          <Link to={`/dashboard/details/${request._id}`}>
                            <button className="px-3 py-1 rounded-md bg-gray-600 hover:bg-gray-700 text-white text-xs font-semibold transition-colors">
                              View
                            </button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="p-8 text-center">
            <p className="text-lg text-gray-600">
              No donation requests found matching the selected filter.
            </p>
          </div>
        )}

        {/* Footer Stats */}
        {filteredRequest.length > 0 && (
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Showing{" "}
              <span className="font-semibold">{filteredRequest.length}</span> of{" "}
              <span className="font-semibold">{allRequests.length}</span> total
              requests
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllBgRequests;
