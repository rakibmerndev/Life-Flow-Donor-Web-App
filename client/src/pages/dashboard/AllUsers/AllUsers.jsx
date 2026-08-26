import { useState } from "react";
import { Helmet } from "react-helmet";
import Swal from "sweetalert2";
import { AiOutlineDelete } from "react-icons/ai";
import useAxiosSecure from "../../../hooks/useAxiosSecure.js";
import useUsers from "../../../hooks/useUsers.js";

const AllUsers = () => {
  const { users, refetch } = useUsers();
  const [status, setStatus] = useState("");
  const axiosSecure = useAxiosSecure();

  const handleBlock = async (id) => {
    const res = await axiosSecure.patch(`/users/block/${id}`);

    if (res.data.modifiedCount > 0) {
      refetch();
      Swal.fire({
        title: "User Blocked",
        text: "This user has been blocked",
        icon: "success",
        confirmButtonColor: "#dc2626",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  const handleActive = async (id) => {
    const res = await axiosSecure.patch(`/users/active/${id}`);

    if (res.data.modifiedCount > 0) {
      refetch();
      Swal.fire({
        title: "User Unblocked",
        text: "This user has been unblocked",
        icon: "success",
        confirmButtonColor: "#dc2626",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  const handleVolunteer = (id) => {
    Swal.fire({
      title: "Make Volunteer?",
      text: "Are you sure you want to make this user a volunteer?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, make volunteer!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await axiosSecure.patch(`/users/volunteer/${id}`);
        if (res.data.modifiedCount > 0) {
          refetch();
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Volunteer Added",
            text: "User has been made a volunteer",
            confirmButtonColor: "#dc2626",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      }
    });
  };

  const handleAdmin = (id) => {
    Swal.fire({
      title: "Make Admin?",
      text: "Are you sure you want to make this user an admin?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, make admin!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await axiosSecure.patch(`/users/admin/${id}`);
        if (res.data.modifiedCount > 0) {
          refetch();
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Admin Added",
            text: "User has been made an admin",
            confirmButtonColor: "#dc2626",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      }
    });
  };

  const handleUserDelete = (id) => {
    Swal.fire({
      title: "Delete User?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await axiosSecure.delete(`/user/delete/${id}`);
        if (res.data.deletedCount > 0) {
          refetch();
          Swal.fire({
            position: "center",
            icon: "success",
            title: "User Deleted",
            text: "User has been removed from the system",
            confirmButtonColor: "#dc2626",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      }
    });
  };

  const filteredUsers = users.filter(
    (user) => status === "" || user.status === status,
  );

  const getRoleColor = (role) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-800";
      case "volunteer":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status) => {
    return status === "active"
      ? "bg-green-100 text-green-800"
      : "bg-red-100 text-red-800";
  };

  return (
    <div className="bg-gray-50 min-h-screen p-4 md:p-8">
      <Helmet>
        <title>LifeFlowDonor | All Users</title>
      </Helmet>

      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
          All Users
        </h1>
        <p className="text-gray-600 mt-2">Manage and monitor all system users</p>
      </div>

      {/* Filter Section */}
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-md p-6 mb-8">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Filter by Status
        </label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full md:w-64 py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600"
        >
          <option value="">All Users</option>
          <option value="active">Active</option>
          <option value="blocked">Blocked</option>
        </select>
      </div>

      {/* Table Section */}
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-red-600 px-6 py-4">
          <h2 className="text-xl font-bold text-white">
            {filteredUsers.length} User{filteredUsers.length !== 1 ? "s" : ""}
          </h2>
        </div>

        <div className="overflow-x-auto">
          {filteredUsers.length > 0 ? (
            <table className="w-full">
              <thead className="bg-gray-100 border-b border-gray-300">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    #
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    User Info
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.map((user, index) => (
                  <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                          <img
                            src={user?.avatarImage}
                            alt={user?.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {user?.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {user?.upazila}, {user?.district}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      {user?.email}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                          user.status
                        )}`}
                      >
                        {user.status.charAt(0).toUpperCase() +
                          user.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getRoleColor(
                          user.role
                        )}`}
                      >
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-2 flex-wrap">
                        {user.status === "active" && (
                          <button
                            onClick={() => handleBlock(user._id)}
                            className="px-3 py-1 rounded-md bg-red-600 hover:bg-red-700 text-white text-xs font-semibold transition-colors"
                          >
                            Block
                          </button>
                        )}
                        {user.status === "blocked" && (
                          <button
                            onClick={() => handleActive(user._id)}
                            className="px-3 py-1 rounded-md bg-green-600 hover:bg-green-700 text-white text-xs font-semibold transition-colors"
                          >
                            Unblock
                          </button>
                        )}
                        <button
                          onClick={() => handleVolunteer(user._id)}
                          className="px-3 py-1 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors"
                        >
                          Volunteer
                        </button>
                        <button
                          onClick={() => handleAdmin(user._id)}
                          className="px-3 py-1 rounded-md bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold transition-colors"
                        >
                          Admin
                        </button>
                        <button
                          onClick={() => handleUserDelete(user._id)}
                          className="px-3 py-1 rounded-md bg-red-600 hover:bg-red-700 text-white text-xs font-semibold transition-colors flex items-center gap-1"
                        >
                          <AiOutlineDelete className="text-sm" />
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
              <p className="text-lg text-gray-600">
                No users found matching the selected filter.
              </p>
            </div>
          )}
        </div>

        {/* Footer Stats */}
        {filteredUsers.length > 0 && (
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Showing <span className="font-semibold">{filteredUsers.length}</span> of{" "}
              <span className="font-semibold">{users.length}</span> total users
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllUsers;
