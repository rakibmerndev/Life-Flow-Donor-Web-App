import { useState } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure.js";
import useUserRequests from "../../../hooks/useUserRequests.js";

const MyDonationRequests = () => {
  const axiosSecure = useAxiosSecure();
  const { sortedRequest, refetch } = useUserRequests();
  const [status, setStatus] = useState("");

  const filteredRequests = sortedRequest.filter(
    (request) => status === "" || request.donationStatus === status,
  );

  const handleDone = async (id) => {
    const data = {
      donationStatus: "done",
    };
    const res = await axiosSecure.patch(`/done/${id}`, data);
    if (res.data.modifiedCount > 0) {
      refetch();
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Marked as Done",
        showConfirmButton: false,
        timer: 1500,
        confirmButtonColor: "#dc2626",
      });
    }
  };

  const handleCancel = async (id) => {
    const data = {
      donationStatus: "canceled",
    };
    const res = await axiosSecure.patch(`/cancel/${id}`, data);
    if (res.data.modifiedCount > 0) {
      refetch();
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Request Canceled",
        showConfirmButton: false,
        timer: 1500,
        confirmButtonColor: "#dc2626",
      });
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
        const res = await axiosSecure.delete(`/request/${id}`);

        if (res.data.deletedCount > 0) {
          Swal.fire({
            title: "Deleted!",
            text: "Your request has been deleted.",
            icon: "success",
            confirmButtonColor: "#dc2626",
          });
          refetch();
        }
      }
    });
  };

  return (
    <div className="bg-gray-50 min-h-screen p-4 md:p-8">
      <Helmet>
        <title>LifeFlowDonor | My Donation Requests</title>
      </Helmet>

      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
          My Donation Requests
        </h1>
        <p className="text-gray-600 mt-2">
          Manage all your blood donation requests
        </p>
      </div>

      {/* Filter Section */}
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1">
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

          <div className="md:flex-shrink-0">
            <Link to="/dashboard/create-donation-request">
              <button className="w-full md:w-auto px-6 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors">
                + Create New Request
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-red-600 px-6 py-4">
          <h2 className="text-xl font-bold text-white">
            {filteredRequests.length} Request
            {filteredRequests.length !== 1 ? "s" : ""}
          </h2>
        </div>

        <div className="overflow-x-auto">
          {filteredRequests.length > 0 ? (
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
                    Donor Info
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Actions
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
                        <span className="text-gray-500 text-sm">
                          Not assigned
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm">
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
                        <Link to={`/dashboard/update/${request._id}`}>
                          <button className="px-3 py-1 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors">
                            Edit
                          </button>
                        </Link>
                        <Link to={`/dashboard/details/${request._id}`}>
                          <button className="px-3 py-1 rounded-md bg-gray-600 hover:bg-gray-700 text-white text-xs font-semibold transition-colors">
                            View
                          </button>
                        </Link>
                        <button
                          onClick={() => handleDelete(request._id)}
                          className="px-3 py-1 rounded-md bg-red-600 hover:bg-red-700 text-white text-xs font-semibold transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-8 text-center">
              <p className="text-lg text-gray-600 mb-6">
                No donation requests found matching the selected filter.
              </p>
              <Link to="/dashboard/create-donation-request">
                <button className="px-6 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors">
                  Create Your First Request
                </button>
              </Link>
            </div>
          )}
        </div>

        {/* Footer Stats */}
        {filteredRequests.length > 0 && (
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Showing{" "}
              <span className="font-semibold">{filteredRequests.length}</span>{" "}
              of <span className="font-semibold">{sortedRequest.length}</span>{" "}
              total requests
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyDonationRequests;
