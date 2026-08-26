import { Helmet } from "react-helmet";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import useArea from "../../../hooks/useArea.js";
import useAuth from "../../../hooks/useAuth.js";
import useAxiosSecure from "../../../hooks/useAxiosSecure.js";
import useCurrentUser from "../../../hooks/useCurrentUser.js";
import {
  getDistrictName,
  getUpazilaName,
} from "../../../lib/getLocationName.js";

const CreateRequest = () => {
  const { user } = useAuth();
  const { register, handleSubmit, reset } = useForm();
  const {
    districts,
    upazilas,
    selectedDistrict,
    setSelectedDistrict,
    isLoading,
  } = useArea();

  const axiosSecure = useAxiosSecure();

  const onSubmit = async (data) => {
    const requestTime = new Date();
    const requester = user?.displayName;
    const requesterEmail = user?.email;
    const donationStatus = "pending";
    const recipientName = data.name;
    const requiredBloodGroup = data.requiredGroup;
    const upazila = getUpazilaName(data.upazila, upazilas);
    const district = getDistrictName(data.district, districts);
    const hospitalName = data.hospital;
    const fullAddress = data.address;
    const donationDate = data.donationDate;
    const donationTime = data.donationTime;
    const message = data.details;

    const requestData = {
      requester,
      requesterEmail,
      recipientName,
      requiredBloodGroup,
      upazila,
      district,
      hospitalName,
      fullAddress,
      donationDate,
      donationTime,
      message,
      donationStatus,
      requestTime,
    };

    const res = await axiosSecure.post("/request", requestData);
    if (res.data.insertedId) {
      reset();
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Request Added",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  const { currentUser } = useCurrentUser();
  const status = currentUser[0]?.status;

  return (
    <div className="bg-gray-50 min-h-screen p-4 md:p-8">
      <Helmet>
        <title>LifeFlowDonor | Create</title>
      </Helmet>

      {status === "blocked" ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-red-600 font-bold text-2xl mb-4">
            Account Blocked
          </h2>
          <p className="text-gray-700 text-lg mb-2">
            You have been blocked by the admin and cannot create requests.
          </p>
          <p className="text-gray-600">
            If this is a mistake, please contact us.
          </p>
        </div>
      ) : (
        <section className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-red-600 px-8 py-6">
            <h1 className="text-2xl md:text-3xl font-bold text-white text-center">
              Create a Donation Request
            </h1>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="p-8">
            {/* Requester Info */}
            <div className="bg-gray-50 rounded-lg p-6 mb-8 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Requester Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                    Name
                  </p>
                  <p className="text-lg text-gray-800">{user?.displayName}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                    Email
                  </p>
                  <p className="text-lg text-gray-800">{user?.email}</p>
                </div>
              </div>
            </div>

            {/* Recipient Information */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 border-b pb-3">
                Recipient Information
              </h3>

              {/* Recipient Name */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Recipient Name <span className="text-red-600">*</span>
                </label>
                <input
                  {...register("name", { required: true })}
                  type="text"
                  placeholder="Enter recipient name"
                  className="w-full md:w-1/2 py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600"
                />
              </div>

              {/* Blood Group */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Required Blood Group <span className="text-red-600">*</span>
                </label>
                <select
                  {...register("requiredGroup", { required: true })}
                  className="w-full md:w-1/2 py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600"
                >
                  <option value="">Select Blood Group</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>
            </div>

            {/* Location Information */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 border-b pb-3">
                Location Details
              </h3>

              {/* District & Upazila */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    District <span className="text-red-600">*</span>
                  </label>
                  <select
                    {...register("district", { required: true })}
                    className="w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600"
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                  >
                    <option>Select Your District</option>
                    {districts.map((district) => (
                      <option key={district._id} value={district.id}>
                        {district.name} ({district.bn_name})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Upazila <span className="text-red-600">*</span>
                  </label>
                  <select
                    {...register("upazila", { required: true })}
                    className="w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600"
                    disabled={!selectedDistrict || isLoading}
                  >
                    <option>
                      {isLoading
                        ? "⏳ Loading upazilas..."
                        : "-- Choose an Upazila --"}
                    </option>
                    {upazilas.map((upazila) => (
                      <option key={upazila._id} value={upazila.id}>
                        {upazila.name} ({upazila.bn_name})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Hospital Name */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Hospital Name <span className="text-red-600">*</span>
                </label>
                <input
                  {...register("hospital", { required: true })}
                  type="text"
                  placeholder="Enter hospital name"
                  className="w-full md:w-1/2 py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600"
                />
              </div>

              {/* Full Address */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Address <span className="text-red-600">*</span>
                </label>
                <input
                  {...register("address", { required: true })}
                  type="text"
                  placeholder="Enter full address"
                  className="w-full md:w-1/2 py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600"
                />
              </div>
            </div>

            {/* Donation Details */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 border-b pb-3">
                Donation Timing
              </h3>

              {/* Date & Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Donation Date <span className="text-red-600">*</span>
                  </label>
                  <input
                    {...register("donationDate", { required: true })}
                    type="date"
                    className="w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Donation Time <span className="text-red-600">*</span>
                  </label>
                  <input
                    {...register("donationTime", { required: true })}
                    type="time"
                    className="w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600"
                  />
                </div>
              </div>
            </div>

            {/* Message */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 border-b pb-3">
                Additional Information
              </h3>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Request Message <span className="text-red-600">*</span>
                </label>
                <textarea
                  {...register("details", { required: true })}
                  placeholder="Why do you need blood? Please provide relevant details..."
                  rows="5"
                  className="w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 resize-none"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6 border-t">
              <button
                type="submit"
                className="py-2 px-8 rounded-md font-semibold bg-red-600 hover:bg-red-700 text-white transition-colors duration-200"
              >
                Create Request
              </button>
            </div>
          </form>
        </section>
      )}
    </div>
  );
};

export default CreateRequest;
