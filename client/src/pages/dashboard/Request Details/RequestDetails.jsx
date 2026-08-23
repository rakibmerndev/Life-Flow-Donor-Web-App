import { useState } from "react";
import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import useAuth from "../../../hooks/useAuth.js";
import useAxiosSecure from "../../../hooks/useAxiosSecure.js";
import useParticularRequest from "../../../hooks/useParticularRequest.js";

const RequestDetails = () => {
  const { user } = useAuth();
  // No need for = {} here - already handled in the hook
  const { requests, refetch, isLoading } = useParticularRequest();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const params = useParams();
  const axiosSecure = useAxiosSecure();

  const handleConfirm = async () => {
    const donorName = user?.displayName;
    const donorEmail = user?.email;
    const donationStatus = "inprogress";

    const updatedData = {
      donorName,
      donorEmail,
      donationStatus,
    };

    const res = await axiosSecure.patch(`/status/${params.id}`, updatedData);

    if (res.data.modifiedCount > 0) {
      refetch();
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "You have been added as donor!",
        showConfirmButton: false,
        timer: 1500,
      });
      setIsModalOpen(false);
    }
  };

  const getStatusColor = (status) => {
    if (!status) return "bg-gray-100 text-gray-800";
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "inprogress":
        return "bg-blue-100 text-blue-800";
      case "done":
        return "bg-green-100 text-green-800";
      case "canceled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status) => {
    if (!status) return "Unknown";
    if (status === "inprogress") return "In Progress";
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-gray-50 min-h-screen p-4 md:p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-red-600 border-t-transparent"></div>
          <p className="text-gray-600 mt-4">Loading request details...</p>
        </div>
      </div>
    );
  }

  // Error state - check if request data exists
  if (!requests || Object.keys(requests).length === 0) {
    return (
      <div className="bg-gray-50 min-h-screen p-4 md:p-8">
        <Helmet>
          <title>LifeFlowDonor | Request Details</title>
        </Helmet>
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <p className="text-lg text-gray-600">Request not found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen p-4 md:p-8">
      <Helmet>
        <title>LifeFlowDonor | Request Details</title>
      </Helmet>

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Request Details
          </h1>
          <p className="text-gray-600 mt-2">
            Complete information about this donation request
          </p>
        </div>

        {/* Requester Information Card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="bg-red-600 px-6 py-4">
            <h2 className="text-xl font-bold text-white">
              Requester Information
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                  Name
                </p>
                <p className="text-lg text-gray-800 mt-1">
                  {requests?.requester || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                  Email
                </p>
                <p className="text-lg text-gray-800 mt-1">
                  {requests?.requesterEmail || "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Recipient Information Card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="bg-red-600 px-6 py-4">
            <h2 className="text-xl font-bold text-white">
              Recipient Information
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                  Name
                </p>
                <p className="text-lg text-gray-800 mt-1">
                  {requests?.recipientName || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                  Blood Group
                </p>
                <div className="mt-1">
                  <span className="inline-block px-4 py-2 rounded-full bg-red-100 text-red-800 font-bold text-lg">
                    {requests?.requiredBloodGroup || "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Donation Details Card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="bg-red-600 px-6 py-4">
            <h2 className="text-xl font-bold text-white">Donation Details</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                  Donation Date
                </p>
                <p className="text-lg text-gray-800 mt-1">
                  {requests?.donationDate || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                  Donation Time
                </p>
                <p className="text-lg text-gray-800 mt-1">
                  {requests?.donationTime || "N/A"}
                </p>
              </div>
            </div>

            <div className="border-t pt-6">
              <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                Hospital Name
              </p>
              <p className="text-lg text-gray-800 mt-1">
                {requests?.hospitalName || "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* Location Information Card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="bg-red-600 px-6 py-4">
            <h2 className="text-xl font-bold text-white">Location</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                  Area
                </p>
                <p className="text-lg text-gray-800 mt-1">
                  {requests?.upazila}, {requests?.district || "N/A"}
                </p>
              </div>
            </div>

            <div className="border-t pt-6">
              <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                Full Address
              </p>
              <p className="text-lg text-gray-800 mt-1">
                {requests?.fullAddress || "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* Request Message Card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="bg-red-600 px-6 py-4">
            <h2 className="text-xl font-bold text-white">Request Message</h2>
          </div>
          <div className="p-6">
            <p className="text-gray-700 leading-relaxed">
              {requests?.message || "No message provided"}
            </p>
          </div>
        </div>

        {/* Request Status & Donor Info Card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="bg-red-600 px-6 py-4">
            <h2 className="text-xl font-bold text-white">Request Status</h2>
          </div>
          <div className="p-6 space-y-6">
            <div>
              <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                Status
              </p>
              <div className="mt-2">
                <span
                  className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(
                    requests?.donationStatus
                  )}`}
                >
                  {getStatusLabel(requests?.donationStatus)}
                </span>
              </div>
            </div>

            {requests?.donorName || requests?.donorEmail ? (
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Assigned Donor
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                      Name
                    </p>
                    <p className="text-lg text-gray-800 mt-1">
                      {requests?.donorName || "Not assigned"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                      Email
                    </p>
                    <p className="text-lg text-gray-800 mt-1">
                      {requests?.donorEmail || "Not assigned"}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="border-t pt-6">
                <p className="text-gray-600">No donor has been assigned yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* Donate Button */}
        {requests?.donationStatus === "pending" && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full py-3 px-6 rounded-md bg-red-600 hover:bg-red-700 text-white font-bold text-lg transition-colors mb-8"
          >
            Donate Now
          </button>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            {/* Modal Header */}
            <div className="bg-red-600 px-6 py-4">
              <h3 className="text-xl font-bold text-white">Confirm Donation</h3>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <p className="text-gray-700 mb-4">
                Please confirm that you want to donate blood for this request.
              </p>

              <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-3">
                <div>
                  <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                    Your Name
                  </p>
                  <p className="text-lg text-gray-800 mt-1">
                    {user?.displayName || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                    Your Email
                  </p>
                  <p className="text-lg text-gray-800 mt-1">
                    {user?.email || "N/A"}
                  </p>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2 px-4 rounded-md border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  className="flex-1 py-2 px-4 rounded-md bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestDetails;
