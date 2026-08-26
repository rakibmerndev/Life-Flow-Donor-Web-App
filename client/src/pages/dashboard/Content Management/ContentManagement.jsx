import { useState } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure.js";
import useBlogs from "../../../hooks/useBlogs.js";
import useCurrentUser from "../../../hooks/useCurrentUser.js";

const ContentManagement = () => {
  const [status, setStatus] = useState("");

  const axiosSecure = useAxiosSecure();

  const { blogs, refetch } = useBlogs();

  const { currentUser } = useCurrentUser();

  const filteredBlogs = blogs.filter(
    (blog) => status === "" || blog.status === status,
  );

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
        const res = await axiosSecure.delete(`/blogs/${id}`);
        if (res.data.deletedCount > 0) {
          refetch();
          Swal.fire({
            title: "Deleted!",
            text: "Your blog has been deleted.",
            icon: "success",
          });
        }
      }
    });
  };

  const handlePublish = async (id) => {
    const res = await axiosSecure.patch(`/blogs/${id}`);
    if (res.data.modifiedCount > 0) {
      refetch();
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Your blog has been published",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen p-4 md:p-8">
      <Helmet>
        <title>LifeFlowDonor | Content Management</title>
      </Helmet>

      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
          Content Management
        </h1>
        <p className="text-gray-600 mt-2">Manage and publish your blog posts</p>
      </div>

      {/* Top Bar with Filter and Add Button */}
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
              <option value="">All Posts</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>

          <div className="md:flex-shrink-0">
            <Link to="/dashboard/content-management/add-blog">
              <button className="w-full md:w-auto px-6 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors">
                + Add Blog
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-red-600 px-6 py-4">
          <h2 className="text-xl font-bold text-white">
            {filteredBlogs.length} Blog{filteredBlogs.length !== 1 ? "s" : ""}
          </h2>
        </div>

        <div className="overflow-x-auto">
          {filteredBlogs.length > 0 ? (
            <table className="w-full">
              <thead className="bg-gray-100 border-b border-gray-300">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    #
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Blog Title
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredBlogs.map((blog, index) => (
                  <tr
                    key={blog._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-800">
                      {blog.title}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                          blog.status === "published"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {blog.status.charAt(0).toUpperCase() +
                          blog.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-2 flex-wrap">
                        {blog.status === "draft" &&
                          currentUser[0]?.role === "admin" && (
                            <button
                              onClick={() => handlePublish(blog._id)}
                              className="px-4 py-2 rounded-md bg-green-600 hover:bg-green-700 text-white text-xs font-semibold transition-colors"
                            >
                              Publish
                            </button>
                          )}
                        {currentUser[0]?.role === "admin" && (
                          <button
                            onClick={() => handleDelete(blog._id)}
                            className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white text-xs font-semibold transition-colors"
                          >
                            Delete
                          </button>
                        )}
                        {currentUser[0]?.role === "admin" && (
                          <Link  to={`/details/${blog._id}`}>
                            <button className="px-4 py-2 rounded-md bg-gray-600 hover:bg-gray-700 text-white text-xs font-semibold transition-colors">
                              View
                            </button>
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-8 text-center">
              <p className="text-lg text-gray-600">
                No blog posts found matching the selected filter.
              </p>
              <Link to="/dashboard/content-management/add-blog">
                <button className="mt-4 px-6 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors">
                  Create Your First Blog
                </button>
              </Link>
            </div>
          )}
        </div>

        {/* Footer Stats */}
        {filteredBlogs.length > 0 && (
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Showing{" "}
              <span className="font-semibold">{filteredBlogs.length}</span> of{" "}
              <span className="font-semibold">{blogs.length}</span> total blogs
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentManagement;
