import { useState } from "react";
import { Helmet } from "react-helmet";
import { useForm } from "react-hook-form";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import useAuth from "../../hooks/useAuth.js";
import useAxiosPublic from "../../hooks/useAxiosPublic.js";
import useArea from "../../hooks/useArea.js";

const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

const Signup = () => {
  const { signup, updateUser } = useAuth();
  const navigate = useNavigate();
  const axiosPublic = useAxiosPublic();
  const { register, handleSubmit, reset } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState("");

  const {
    districts,
    upazilas,
    setSelectedDistrict: setDistrictFromHook,
    isLoading,
  } = useArea();

  const district = selectedDistrict;
  const handleDistrictChange = (e) => {
    setSelectedDistrict(e.target.value);
    setDistrictFromHook(e.target.value);
  };

  const onSubmit = async (data) => {
    if (data.password !== data.confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Password Mismatch",
        text: "Passwords do not match!",
        confirmButtonColor: "#dc2626",
      });
      return;
    }

    const imageFile = { image: data.image[0] };

    try {
      const res = await axiosPublic.post(image_hosting_api, imageFile, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.success) {
        const avatarImage = res.data.data.display_url;

        signup(data.email, data.password)
          .then(async () => {
            // Update user profile
            updateUser(data.name, avatarImage);

            // Get district and upazila names
            const districtName =
              districts.find((d) => d.id === data.district)?.name || "";
            const upazilaName =
              upazilas.find((u) => u.id === data.upazila)?.name || "";

            // Save user to database
            const userInfo = {
              name: data.name,
              email: data.email,
              avatarImage,
              bloodGroup: data.bloodGroup,
              district: districtName,
              upazila: upazilaName,
              status: "active",
              role: "donor",
            };

            const dbRes = await axiosPublic.post("/user", userInfo);

            if (dbRes.data.insertedId) {
              reset();
              Swal.fire({
                position: "center",
                icon: "success",
                title: "Registration successful",
                confirmButtonColor: "#dc2626",
                showConfirmButton: false,
                timer: 2000,
              });
              navigate("/");
            }
          })
          .catch((error) => {
            console.log(error);
            Swal.fire({
              position: "center",
              icon: "error",
              title: "This email is already registered with another account",
              confirmButtonColor: "#dc2626",
              showConfirmButton: false,
              timer: 2000,
            });
          });
      }
    } catch (error) {
      console.error("Signup error:", error);
      Swal.fire({
        icon: "error",
        title: "Signup Failed",
        text: error.message || "An error occurred during signup",
        confirmButtonColor: "#dc2626",
      });
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen p-4 md:p-8 flex items-center justify-center">
      <Helmet>
        <title>LifeFlowDonor | Sign Up</title>
      </Helmet>

      <div className="w-full max-w-md">
        {/* Form Card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Card Header */}
          <div className="bg-red-600 px-6 py-6 text-center">
            <div className="text-4xl mb-3">🩸</div>
            <h1 className="text-2xl font-bold text-white">LifeFlowDonor</h1>
            <p className="text-red-100 mt-2 text-sm">Create Your Account</p>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name <span className="text-red-600">*</span>
              </label>
              <input
                {...register("name", { required: true })}
                type="text"
                placeholder="Enter your full name"
                className="w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600"
              />
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address <span className="text-red-600">*</span>
              </label>
              <input
                {...register("email", { required: true })}
                type="email"
                placeholder="Enter your email"
                className="w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600"
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <input
                  {...register("password", { required: true })}
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-600 hover:text-gray-800"
                >
                  {showPassword ? (
                    <AiOutlineEyeInvisible size={20} />
                  ) : (
                    <AiOutlineEye size={20} />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Confirm Password <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <input
                  {...register("confirmPassword", { required: true })}
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  className="w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-2.5 text-gray-600 hover:text-gray-800"
                >
                  {showConfirmPassword ? (
                    <AiOutlineEyeInvisible size={20} />
                  ) : (
                    <AiOutlineEye size={20} />
                  )}
                </button>
              </div>
            </div>

            {/* Blood Group Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Blood Group <span className="text-red-600">*</span>
              </label>
              <select
                {...register("bloodGroup", { required: true })}
                className="w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600"
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

            {/* District & Upazila */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  District <span className="text-red-600">*</span>
                </label>
                <select
                  {...register("district", { required: true })}
                  className="w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600"
                  value={district}
                  onChange={handleDistrictChange}
                >
                  <option value="">Select Your District</option>
                  {districts.map((districtOption) => (
                    <option key={districtOption._id} value={districtOption.id}>
                      {districtOption.name} ({districtOption.bn_name})
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
                  disabled={!district || isLoading}
                >
                  <option>
                    {isLoading
                      ? "⏳ Loading upazilas..."
                      : "-- Choose an Upazila --"}
                  </option>
                  {upazilas.map((upazilaOption) => (
                    <option key={upazilaOption._id} value={upazilaOption.id}>
                      {upazilaOption.name} ({upazilaOption.bn_name})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Photo Upload Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Profile Photo <span className="text-red-600">*</span>
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-red-600 transition-colors">
                <input
                  {...register("image", { required: true })}
                  type="file"
                  accept="image/*"
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-2">JPG, PNG (Max 5MB)</p>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-2 px-4 rounded-md bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors mt-6"
            >
              Create Account
            </button>

            {/* Login Link */}
            <p className="text-center text-sm text-gray-600 mt-4">
              Already have an account?{" "}
              <Link to="/login" className="text-red-600 font-semibold hover:underline">
                Login here
              </Link>
            </p>
          </form>
        </div>

        {/* Bottom Info */}
        <div className="text-center mt-6 text-sm text-gray-600">
          <p>
            By signing up, you agree to our{" "}
            <span className="text-red-600 font-semibold">Terms & Conditions</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
