import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import useAuth from "../../../hooks/useAuth.js";
import useAxiosSecure from "../../../hooks/useAxiosSecure.js";
import useUserRequests from "../../../hooks/useUserRequests.js";

const DashboardHome = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const { sortedRequest, refetch } = useUserRequests();
  const selectedRequests = sortedRequest.slice(0, 3);

  console.log(sortedRequest)

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
        const rest = await axiosSecure.delete(`/request/${id}`);

        if (rest.data.deletedCount > 0) {
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
        <title>LifeFlowDonor | My Dashboard</title>
      </Helmet>

      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
          Welcome, <span className="text-red-600">{user?.displayName}</span>
        </h1>
        <p className="text-gray-600 mt-2">Here&apos;s your donation request overview</p>
      </div>

      {/* Recent Requests Section */}
      {selectedRequests.length !== 0 ? (
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-red-600 px-4 md:px-6 py-4">
              <h2 className="text-lg md:text-xl font-bold text-white">Recent Requests (Last 3)</h2>
            </div>

            {/* Mobile/Tablet Card View */}
            <div className="block lg:hidden">
              {selectedRequests.map((request, index) => (
                <div key={request._id} className="border-b border-gray-200 p-4 hover:bg-gray-50">
                  <div className="space-y-3">
                    {/* Request Number and Status */}
                    <div className="flex justify-between items-start">
                      <span className="text-sm font-bold text-gray-900">#{index + 1}</span>
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
                      <p className="font-semibold text-gray-900">{request.recipientName}</p>
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
                      <p className="text-sm text-gray-800">{request.upazila}, {request.district}</p>
                    </div>

                    {/* Date & Time */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Date</p>
                        <p className="text-sm text-gray-800">{request.donationDate}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Time</p>
                        <p className="text-sm text-gray-800">{request.donationTime}</p>
                      </div>
                    </div>

                    {/* Donor Info */}
                    {request?.donationStatus === "inprogress" && (
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Donor</p>
                        <p className="font-medium text-gray-800 text-sm">{request.donorName || "N/A"}</p>
                        <p className="text-xs text-gray-500">{request.donorEmail || "N/A"}</p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2 pt-2">
                      {request?.donationStatus === "inprogress" &&
                        request?.requesterEmail === user?.email && (
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
                      {request?.requesterEmail === user?.email && (
                        <Link to={`/dashboard/update/${request._id}`}>
                          <button className="px-3 py-1.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors">
                            Edit
                          </button>
                        </Link>
                      )}
                      <Link to={`/dashboard/details/${request._id}`}>
                        <button className="px-3 py-1.5 rounded-md bg-gray-600 hover:bg-gray-700 text-white text-xs font-semibold transition-colors">
                          View
                        </button>
                      </Link>
                      {request?.requesterEmail === user?.email && (
                        <button
                          onClick={() => handleDelete(request._id)}
                          className="px-3 py-1.5 rounded-md bg-red-600 hover:bg-red-700 text-white text-xs font-semibold transition-colors"
                        >
                          Delete
                        </button>
                      )}
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
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">#</th>
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
                  {selectedRequests.map((request, index) => (
                    <tr key={request._id} className="hover:bg-gray-50 transition-colors">
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
                          <p className="text-xs text-gray-500">{request.donationTime}</p>
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
                          <span className="text-gray-500">Not assigned</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex gap-2 flex-wrap">
                          {request?.donationStatus === "inprogress" &&
                            request?.requesterEmail === user?.email && (
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
                          {request?.requesterEmail === user?.email && (
                            <Link to={`/dashboard/update/${request._id}`}>
                              <button className="px-3 py-1 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors">
                                Edit
                              </button>
                            </Link>
                          )}
                          <Link to={`/dashboard/details/${request._id}`}>
                            <button className="px-3 py-1 rounded-md bg-gray-600 hover:bg-gray-700 text-white text-xs font-semibold transition-colors">
                              View
                            </button>
                          </Link>
                          {request?.requesterEmail === user?.email && (
                            <button
                              onClick={() => handleDelete(request._id)}
                              className="px-3 py-1 rounded-md bg-red-600 hover:bg-red-700 text-white text-xs font-semibold transition-colors"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-lg text-gray-600 mb-6">
            You haven&apos;t created any donation requests yet.
          </p>
          <Link to="/dashboard/create-donation-request">
            <button className="px-6 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors">
              Create Your First Request
            </button>
          </Link>
        </div>
      )}

      {/* View All Button */}
      {selectedRequests.length !== 0 && (
        <div className="max-w-7xl mx-auto text-center mt-8">
          <Link to="/dashboard/my-donation-requests">
            <button className="px-6 py-2 rounded-md border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white font-semibold transition-colors">
              View All Requests
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default DashboardHome;
