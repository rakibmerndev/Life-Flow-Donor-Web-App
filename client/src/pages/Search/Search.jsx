import { Skeleton } from "@mui/material";
import { Stack } from "@mui/system";
import { useState } from "react";
import { Helmet } from "react-helmet";
import { useForm } from "react-hook-form";
import useArea from "../../hooks/useArea.js";
import useAxiosPublic from "../../hooks/useAxiosPublic.js";
import useSearchedUser from "../../hooks/useSearchedUser.js";
import { getDistrictName, getUpazilaName } from "../../lib/getLocationName.js";

const Search = () => {
  const [searchedUser, setSearchedUser] = useState([]);
  const [userNumber, setUserNumber] = useState(false);

  const { users, isLoading } = useSearchedUser();
  const { register, handleSubmit } = useForm();
  const { districts, upazilas, selectedDistrict, setSelectedDistrict } =
    useArea();
  const axiosPublic = useAxiosPublic();

  const onSubmit = async (data) => {
    const requestData = {
      bloodGroup: data.bloodGroup,
      upazila: getUpazilaName(data.upazila, upazilas),
      district: getDistrictName(data.district, districts),
    };

    const res = await axiosPublic.get("/search", { params: requestData });
    if (res.data.length == 0) {
      setUserNumber(true);
    } else {
      setUserNumber(false);
    }
    setSearchedUser(res.data);
  };

  return (
    <div className="bg-gray-50 min-h-screen p-4 md:p-8">
      <Helmet>
        <title>LifeFlowDonor | Search Donors</title>
      </Helmet>

      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Find Blood Donors
          </h1>
          <p className="text-gray-600">
            Search for available donors by blood group and location
          </p>
        </div>

        {/* Search Form Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 mb-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Blood Group Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Required Blood Group <span className="text-red-600">*</span>
              </label>
              <select
                {...register("bloodGroup", { required: true })}
                className="w-full md:w-64 py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600"
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

            {/* Location Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  District <span className="text-red-600">*</span>
                </label>
                <select
                  {...register("district", { required: true })}
                  className="w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600"
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                >
                  <option value="">Select Your District</option>
                  {districts.map((district) => (
                    <option key={district._id} value={district.id}>
                      {district.name} ({district.bn_name})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
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

            {/* Search Button */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full md:w-auto px-8 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors"
              >
                Search Donors
              </button>
            </div>
          </form>
        </div>

        {/* Search Results Section */}
        {searchedUser.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Search Results ({searchedUser.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {searchedUser.map((searched) => (
                <div
                  key={searched._id}
                  className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-600"
                >
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    {searched?.name}
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Blood Group:</span>
                      <span className="inline-block px-3 py-1 rounded-full bg-red-100 text-red-800 font-semibold text-sm">
                        {searched?.bloodGroup}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Email:</span>
                      <span className="text-gray-900 font-medium">
                        {searched?.email}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Location:</span>
                      <span className="text-gray-900 font-medium">
                        {searched?.upazila}, {searched?.district}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Results Message */}
        {userNumber && searchedUser.length === 0 && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg mb-8">
            <p className="text-lg font-semibold text-yellow-800 text-center">
              😔 Sorry, no donors found matching your search criteria. Please try
              different filters.
            </p>
          </div>
        )}

        {/* All Donors Table Section */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-red-600 px-6 py-4">
            <h2 className="text-xl font-bold text-white">
              {isLoading
                ? "Loading All Donors..."
                : `All Available Donors (${users.length})`}
            </h2>
          </div>

          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="p-8 space-y-4">
                <Stack>
                  <Skeleton width="100%" height={40} variant="text" />
                </Stack>
                <Stack>
                  <Skeleton width="100%" height={40} variant="text" />
                </Stack>
                <Stack>
                  <Skeleton width="100%" height={40} variant="text" />
                </Stack>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-100 border-b border-gray-300">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      #
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Blood Group
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Upazila
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      District
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users.map((user, index) => (
                    <tr
                      key={user._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-800">
                        {user?.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-800">
                        {user?.email}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className="inline-block px-3 py-1 rounded-full bg-red-100 text-red-800 font-semibold">
                          {user?.bloodGroup}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-800">
                        {user?.upazila}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-800">
                        {user?.district}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Footer Stats */}
          {!isLoading && users.length > 0 && (
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Total Donors Available:{" "}
                <span className="font-semibold">{users.length}</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
