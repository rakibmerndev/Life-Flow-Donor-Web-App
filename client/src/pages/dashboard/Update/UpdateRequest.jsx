import { Helmet } from "react-helmet";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import useArea from "../../../hooks/useArea.js";
import useAxiosSecure from "../../../hooks/useAxiosSecure.js";
import useParticularRequest from "../../../hooks/useParticularRequest.js";
import {
  getDistrictName,
  getUpazilaName,
} from "../../../lib/getLocationName.js";

const UpdateRequest = () => {
  const params = useParams();
  const axiosSecure = useAxiosSecure();

  const { register, handleSubmit, reset } = useForm();
  const {
    districts,
    upazilas,
    selectedDistrict,
    setSelectedDistrict,
    isLoading,
  } = useArea();
  const { requests, refetch } = useParticularRequest();
  console.log(requests)

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    const recipientName = data.name;
    const requiredBloodGroup = data.requiredGroup;
    const upazila = getUpazilaName(data.upazila, upazilas);
    const district = getDistrictName(data.district, districts);
    const hospitalName = data.hospital;
    const fullAddress = data.address;
    const donationDate = data.donationDate;
    const donationTime = data.donationTime;
    const message = data.details;

    const updatedData = {
      recipientName,
      requiredBloodGroup,
      upazila,
      district,
      hospitalName,
      fullAddress,
      donationDate,
      donationTime,
      message,
    };

    const res = await axiosSecure.patch(`/request/${params.id}`, updatedData);
    if (res.data?.modifiedCount > 0) {
      refetch();
      reset();
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Request Updated Successfully",
        text: "Your donation request has been updated",
        confirmButtonColor: "#dc2626",
        showConfirmButton: false,
        timer: 1500,
      });
      navigate("/dashboard/all-blood-donation-request");
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen p-4 md:p-8">
      <Helmet>
        <title>LifeFlowDonor | Update Request</title>
      </Helmet>

      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Update Donation Request
          </h1>
          <p className="text-gray-600 mt-2">
            Modify the details of your blood donation request
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Card Header */}
          <div className="bg-red-600 px-6 py-4">
            <h2 className="text-xl font-bold text-white">Request Details</h2>
          </div>

          {/* Card Body */}
          <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
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
                  defaultValue={requests.recipientName}
                  className="w-full md:w-1/2 py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600"
                />
              </div>

              {/* Blood Group */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Required Blood Group <span className="text-red-600">*</span>
                </label>
                <select
                  defaultValue={requests.requiredBloodGroup}
                  {...register("requiredGroup", { required: true })}
                  className="w-full md:w-1/2 py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600"
                >
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
                    className="w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 disabled:bg-gray-100 disabled:cursor-not-allowed"
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
                  defaultValue={requests.hospitalName}
                  {...register("hospital", { required: true })}
                  type="text"
                  className="w-full md:w-1/2 py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600"
                />
              </div>

              {/* Full Address */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Address <span className="text-red-600">*</span>
                </label>
                <input
                  defaultValue={requests.fullAddress}
                  {...register("address", { required: true })}
                  type="text"
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
                    defaultValue={requests.donationDate}
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
                    defaultValue={requests.donationTime}
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
                  defaultValue={requests.message}
                  {...register("details", { required: true })}
                  placeholder="Describe why you need blood donation and any other relevant details"
                  rows="5"
                  className="w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 resize-none"
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="border-t pt-6 flex gap-3">
              <button
                type="submit"
                className="px-6 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors"
              >
                Update Request
              </button>
              <button
                type="button"
                onClick={() => reset()}
                className="px-6 py-2 rounded-md border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateRequest;
