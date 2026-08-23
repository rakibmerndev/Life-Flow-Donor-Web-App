import "react-toastify/dist/ReactToastify.css";
import useAuth from "../../../hooks/useAuth.js";
import useAxiosPublic from "../../../hooks/useAxiosPublic.js";

import { useForm } from "react-hook-form";

import { useState } from "react";
import { Helmet } from "react-helmet";
import { ToastContainer, toast } from "react-toastify";
import useArea from "../../../hooks/useArea.js";
import useAxiosSecure from "../../../hooks/useAxiosSecure.js";
import useCurrentUser from "../../../hooks/useCurrentUser.js";
import {
  getDistrictName,
  getUpazilaName,
} from "../../../lib/getLocationName.js";

const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;

const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

const Profile = () => {
  const {
    districts,
    upazilas,
    isLoading,
    selectedDistrict,
    setSelectedDistrict,
  } = useArea();
  const { register, handleSubmit } = useForm();
  const { user, updateUser } = useAuth();
  const [editProfile, setEditProfile] = useState(false);
  const axiosPublic = useAxiosPublic();
  const axiosSecure = useAxiosSecure();
  const { currentUser, refetch } = useCurrentUser();

  const onSubmit = async (data) => {
    const name = data.name;
    const bloodGroup = data.group;
    const upazila = getUpazilaName(data.upazila, upazilas);
    const district = getDistrictName(data.district, districts);

    let avatar = user?.photoURL;

    if (data.image && data.image.length > 0) {
      const imageFile = { image: data.image[0] };

      const res = await axiosPublic.post(image_hosting_api, imageFile, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.success) {
        avatar = res.data.data.display_url;
      } else {
        toast.error("Image upload failed", { position: "bottom-center" });
        return;
      }
    }

    updateUser(name, avatar);

    const updatedProfile = {
      name,
      bloodGroup,
      upazila,
      district,
      avatar,
    };

    console.log(updatedProfile);
    const result = await axiosSecure.patch(
      `/user?email=${user?.email}`,
      updatedProfile,
    );

    if (result.data.modifiedCount > 0) {
      refetch();
      setEditProfile(false);
      toast.success("Profile Updated", {
        position: "bottom-center",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
  };

  const handleEditProfile = () => {
    setEditProfile(!editProfile);
  };

  const loggedInUser = currentUser[0];

  return (
    <div className="bg-gray-50 min-h-screen p-4 md:p-8">
      <Helmet>
        <title>LifeFlowDonor | Profile</title>
      </Helmet>

      {/* Profile Display Section */}
      <div className="bg-white rounded-lg shadow-md p-6 md:p-8 mb-8">
        <div className="flex flex-col md:flex-row gap-10 items-start">
          <div>
            <img
              src={loggedInUser?.avatarImage || user?.photoURL}
              alt="Avatar"
              className="w-36 h-36 rounded-lg object-cover shadow-md"
            />
          </div>
          <div className="flex-1 pt-2">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
              {loggedInUser?.name || user?.displayName}
            </h1>
            <div className="space-y-3">
              <div className="border-b pb-3">
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Email</p>
                <p className="text-lg text-gray-800">{loggedInUser?.email || user?.email}</p>
              </div>
              <div className="border-b pb-3">
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Blood Group</p>
                <p className="text-lg font-bold text-red-600">{loggedInUser?.bloodGroup}</p>
              </div>
              <div className="border-b pb-3">
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Location</p>
                <p className="text-lg text-gray-800">{loggedInUser?.upazila}, {loggedInUser?.district}</p>
              </div>
              <div className="border-b pb-3">
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Status</p>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                  loggedInUser?.status === "active"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}>
                  {loggedInUser?.status}
                </span>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Role</p>
                <p className="text-lg text-gray-800 capitalize">{loggedInUser?.role}</p>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={handleEditProfile}
          className="mt-8 py-2 px-6 rounded-md font-semibold bg-red-600 hover:bg-red-700 text-white transition-colors duration-200"
        >
          {editProfile ? "Cancel" : "Edit Profile"}
        </button>
      </div>

      {/* Update Profile Form Section */}
      {editProfile && (
        <section className="mb-8">
          {currentUser.map((user) => (
            <div key={user._id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="bg-red-600 px-8 py-6">
                <h3 className="text-2xl font-bold text-white text-center">Update Your Profile</h3>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="p-8">
                {/* Name Field */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    {...register("name", { required: true })}
                    type="text"
                    defaultValue={user.name}
                    className="w-full md:w-1/2 py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600"
                  />
                </div>

                {/* Photo Upload */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Profile Photo <span className="text-red-600">*</span>
                  </label>
                  <input
                    {...register("image", { required: false })}
                    type="file"
                    className="file-input file-input-bordered file-input-sm w-full max-w-xs border-gray-300"
                  />
                </div>

                {/* Blood Group */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Blood Group <span className="text-red-600">*</span>
                  </label>
                  <select
                    defaultValue={user.bloodGroup}
                    {...register("group", { required: true })}
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

                {/* Submit Button */}
                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="py-2 px-6 rounded-md font-semibold bg-red-600 hover:bg-red-700 text-white transition-colors duration-200"
                  >
                    Update Profile
                  </button>
                </div>
              </form>
            </div>
          ))}
        </section>
      )}

      <ToastContainer
        position="bottom-center"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
};

export default Profile;
