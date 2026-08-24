import { useState } from "react";
import { Helmet } from "react-helmet";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import useAuth from "../../hooks/useAuth.js";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  let from = location.state?.from?.pathname || "/";

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await login(email, password);

      if (result.user) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Login successful",
          confirmButtonColor: "#dc2626",
          showConfirmButton: false,
          timer: 2000,
        });
        navigate(from, { replace: true });
      }
    } catch (error) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Email or Password is incorrect",
        confirmButtonColor: "#dc2626",
        showConfirmButton: false,
        timer: 1500,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen p-4 md:p-8 flex items-center justify-center">
      <Helmet>
        <title>LifeFlowDonor | Login</title>
      </Helmet>

      <div className="w-full max-w-md">
        {/* Form Card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Card Header */}
          <div className="bg-red-600 px-6 py-6 text-center">
            <div className="text-4xl mb-3">🩸</div>
            <h1 className="text-2xl font-bold text-white">LifeFlowDonor</h1>
            <p className="text-red-100 mt-2 text-sm">Welcome Back</p>
          </div>

          {/* Form Body */}
          <form onSubmit={handleLogin} className="p-6 space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address <span className="text-red-600">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600"
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600"
                  required
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

            {/* Forgot Password Link */}
            <div className="text-right">
              <a href="#" className="text-sm text-red-600 hover:text-red-700 font-semibold">
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 px-4 rounded-md bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-semibold transition-colors mt-6"
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>

            {/* Signup Link */}
            <p className="text-center text-sm text-gray-600 mt-4">
              Don&apos;t have an account?{" "}
              <Link to="/signup" className="text-red-600 font-semibold hover:underline">
                Sign up here
              </Link>
            </p>
          </form>
        </div>

        {/* Bottom Info */}
        <div className="text-center mt-6 text-sm text-gray-600">
          <p>
            By logging in, you agree to our{" "}
            <span className="text-red-600 font-semibold">Terms & Conditions</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
