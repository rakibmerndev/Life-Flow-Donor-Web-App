import JoditEditor from "jodit-react";
import { useRef } from "react";
import { Helmet } from "react-helmet";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import useAxiosPublic from "../../../hooks/useAxiosPublic.js";
import useAxiosSecure from "../../../hooks/useAxiosSecure.js";

const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;

const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

const AddBlog = () => {
  const editor = useRef(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const axiosPublic = useAxiosPublic();
  const axiosSecure = useAxiosSecure();

  const onSubmit = async (data) => {
    const editorContent = editor.current?.value || "";

    const plainText = editorContent.replace(/<[^>]*>/g, "").trim();

    if (!plainText) {
      Swal.fire({
        icon: "warning",
        title: "Content Required",
        text: "Please write some content for your blog",
        confirmButtonColor: "#dc2626",
      });
      return;
    }

    if (!data.title || !data.title.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Title Required",
        text: "Please enter a blog title",
        confirmButtonColor: "#dc2626",
      });
      return;
    }

    if (!data.image || data.image.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Image Required",
        text: "Please select a thumbnail image",
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
        const thumbnail = res.data.data.display_url;
        const blogData = {
          title: data.title,
          image: thumbnail,
          content: editorContent,
          status: "draft",
          time: new Date(),
        };

        const result = await axiosSecure.post("/addBlog", blogData);
        if (result.data.insertedId) {
          reset();
          // Reset editor
          if (editor.current) {
            editor.current.value = "";
          }

          Swal.fire({
            position: "center",
            icon: "success",
            title: "Blog Created Successfully!",
            text: "Your blog has been saved as draft",
            confirmButtonColor: "#dc2626",
            showConfirmButton: false,
            timer: 1500,
          });

        }
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to create blog. Please try again.",
        confirmButtonColor: "#dc2626",
      });
    }
  };

  const editorConfig = {
    readonly: false,
    height: 400,
    toolbar: true,
    toolbarAdaptive: false,
    showCharsCounter: false,
    showWordsCounter: false,
    showXPathInStatusbar: false,
    askBeforePasteHTML: false,
    askBeforePasteFromWord: false,
  };

  return (
    <div className="bg-gray-50 min-h-screen p-4 md:p-8">
      <Helmet>
        <title>LifeFlowDonor | Add Blog</title>
      </Helmet>

      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Write a New Blog
          </h1>
          <p className="text-gray-600 mt-2">
            Share your thoughts and insights with the community
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Card Header */}
          <div className="bg-red-600 px-6 py-4">
            <h2 className="text-xl font-bold text-white">Blog Details</h2>
          </div>

          {/* Card Body */}
          <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
            {/* Title Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Blog Title <span className="text-red-600">*</span>
              </label>
              <input
                {...register("title", { required: true })}
                type="text"
                placeholder="Enter your blog title"
                className="w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600"
              />
              {errors.title && (
                <p className="text-red-600 text-sm mt-1">Title is required</p>
              )}
            </div>

            {/* Thumbnail Image Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Thumbnail Image <span className="text-red-600">*</span>
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-red-600 transition-colors">
                <input
                  {...register("image", { required: true })}
                  type="file"
                  accept="image/*"
                  className="w-full cursor-pointer"
                />
                <p className="text-sm text-gray-500 mt-2">
                  Recommended size: 1200x600px (JPG, PNG)
                </p>
              </div>
              {errors.image && (
                <p className="text-red-600 text-sm mt-1">Image is required</p>
              )}
            </div>

            {/* Content Editor Section */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Blog Content <span className="text-red-600">*</span>
              </label>
              <div className="border border-gray-300 rounded-md overflow-hidden bg-white">
                <JoditEditor
                  ref={editor}
                  config={editorConfig}
                  tabIndex={1}
                  defaultValue=""
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                💡 Tip: Use the formatting toolbar to style your content. Make
                sure to type at least some content.
              </p>
            </div>

            {/* Form Actions */}
            <div className="border-t pt-6 flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                className="px-6 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors"
              >
                Create Blog
              </button>
              <button
                type="button"
                onClick={() => {
                  reset();
                  if (editor.current) {
                    editor.current.value = "";
                  }
                }}
                className="px-6 py-2 rounded-md border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
              >
                Clear
              </button>
            </div>
          </form>
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 border-l-4 border-l-blue-600 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            💡 Tips for Writing a Blog
          </h3>
          <ul className="text-sm text-blue-800 space-y-2">
            <li>✓ Write a compelling and descriptive title</li>
            <li>
              ✓ Choose a high-quality thumbnail image (recommended 1200x600px)
            </li>
            <li>✓ Write meaningful content - at least a few sentences</li>
            <li>
              ✓ Use the editor toolbar to format with headings, bold, italics,
              etc.
            </li>
            <li>
              ✓ Your blog will be saved as draft and can be published from
              Content Management
            </li>
            <li>✓ Make sure all fields are filled before submitting</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AddBlog;
