import HTMLReactParser from "html-react-parser";
import { Helmet } from "react-helmet";
import useParticularBlog from "../../../hooks/useParticularBlog";

const BlogDetails = () => {
  const { blog, error, isLoading } = useParticularBlog();

  if (isLoading) {
    return (
      <div className="bg-gray-50 min-h-screen flex justify-center items-center">
        <span className="loading loading-spinner loading-lg text-red-600"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-50 min-h-screen p-4 md:p-8 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <p className="text-red-800 font-semibold">⚠️ Error loading blog</p>
          <p className="text-red-700 text-sm mt-2">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen p-4 md:p-8">
      <Helmet>
        <title>{blog.title} | LifeFlowDonor Blog</title>
      </Helmet>

      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => window.history.back()}
            className="text-red-600 hover:text-red-700 font-semibold flex items-center gap-2"
          >
            ← Back
          </button>
        </div>

        {/* Blog Card */}
        <article className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header Section with Red Accent */}
          <div className="bg-red-600 h-2"></div>

          {/* Title Section */}
          <div className="px-6 md:px-8 py-6 bg-gradient-to-b from-gray-50 to-white border-b border-gray-200">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
              {blog.title}
            </h1>
            <div className="flex items-center gap-2 mt-3 text-sm text-gray-600">
              <span className="inline-block w-2 h-2 bg-red-600 rounded-full"></span>
              Blog Post
            </div>
          </div>

          {/* Featured Image */}
          <div className="px-6 md:px-8 py-6">
            <div className="overflow-hidden rounded-lg shadow-md border border-gray-200">
              <img
                className="w-full h-auto max-h-96 object-cover hover:scale-105 transition-transform duration-300"
                src={blog.image}
                alt={blog.title}
              />
            </div>
          </div>

          {/* Content Section */}
          <div className="px-6 md:px-8 py-6 prose prose-lg max-w-none">
            <div className="text-gray-800 leading-relaxed space-y-4 blog-content">
              {HTMLReactParser(blog?.content) || ""}
            </div>
          </div>

          {/* Footer Section */}
          <div className="px-6 md:px-8 py-6 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">
                Published on{" "}
                <span className="font-semibold text-gray-900">
                  {new Date(blog.time).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </p>
            </div>
            <button
              onClick={() => window.history.back()}
              className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors text-sm"
            >
              Back to Blogs
            </button>
          </div>
        </article>

        {/* Related Info */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6 border-l-4 border-red-600">
          <h3 className="text-lg font-bold text-gray-900 mb-2">💡 Tip</h3>
          <p className="text-gray-700">
            Share this article with others to raise awareness about blood
            donation and help save lives.
          </p>
        </div>
      </div>

      {/* Custom Styles for Blog Content */}
      <style>{`
        .blog-content h1,
        .blog-content h2,
        .blog-content h3 {
          color: #111827;
          font-weight: bold;
          margin-top: 1.5rem;
          margin-bottom: 1rem;
        }

        .blog-content h1 {
          font-size: 2rem;
          border-bottom: 2px solid #dc2626;
          padding-bottom: 0.5rem;
        }

        .blog-content h2 {
          font-size: 1.5rem;
          color: #dc2626;
        }

        .blog-content p {
          margin-bottom: 1rem;
          line-height: 1.75;
        }

        .blog-content ul,
        .blog-content ol {
          margin: 1rem 0;
          margin-left: 1.5rem;
        }

        .blog-content li {
          margin-bottom: 0.5rem;
          line-height: 1.75;
        }

        .blog-content a {
          color: #dc2626;
          font-weight: 600;
          text-decoration: underline;
        }

        .blog-content a:hover {
          color: #991b1b;
        }

        .blog-content blockquote {
          border-left: 4px solid #dc2626;
          padding-left: 1.5rem;
          margin: 1.5rem 0;
          color: #6b7280;
          font-style: italic;
        }

        .blog-content code {
          background-color: #f3f4f6;
          color: #dc2626;
          padding: 0.2rem 0.4rem;
          border-radius: 0.25rem;
          font-family: monospace;
        }

        .blog-content pre {
          background-color: #1f2937;
          color: #e5e7eb;
          padding: 1rem;
          border-radius: 0.5rem;
          overflow-x: auto;
          margin: 1rem 0;
        }

        .blog-content img {
          border-radius: 0.5rem;
          max-width: 100%;
          height: auto;
          margin: 1rem 0;
        }
      `}</style>
    </div>
  );
};

export default BlogDetails;
