import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Dashboard from "../Layouts/Dashboard";
import Main from "../Layouts/Main";
import AllRequest from "../pages/AllRequest/AllRequest";
import BlogDetails from "../pages/BlogDetails/BlogDetails";
import Blogs from "../pages/Blogs/Blogs";
import AddBlog from "../pages/Dashboard/AddBlog/AddBlog";
import AdminHome from "../pages/Dashboard/AdminHome/AdminHome";
import AllBgRequests from "../pages/Dashboard/AllRequest.jsx/AllBgRequests";
import AllUsers from "../pages/Dashboard/AllUsers/AllUsers";
import ContentManagement from "../pages/Dashboard/ContentManagement/ContentManagement";
import CreateRequest from "../pages/Dashboard/CreateRequest/CreateRequest";
import DashboardHome from "../pages/Dashboard/DashboardHome/DashboardHome";
import DonationHistory from "../pages/Dashboard/DonationHistory/DonationHistory";
import MyRequest from "../pages/Dashboard/MyRequest/MyRequest";
import Profile from "../pages/Dashboard/Profile/Profile";
import RequestDetails from "../pages/Dashboard/RequestDetails/RequestDetails";
import UpdateRequest from "../pages/Dashboard/UpdateRequest/UpdateRequest";
import Funding from "../pages/Funding/Funding";
import Login from "../pages/Login/Login";
import NotFound from "../pages/NotFound/NotFound";
import Payment from "../pages/Payment/Payment";
import Search from "../pages/Search/Search";
import Signup from "../pages/Signup/Signup";
import AdminRoute from "./AdminRoute";
import PrivateRoute from "./PrivateRoute";

const Routers = createBrowserRouter([
  {
    path: "/",
    element: <Main></Main>,
    errorElement: <NotFound></NotFound>,
    children: [
      {
        path: "/",
        element: <App />,
      },
      {
        path: "/signup",
        element: <Signup></Signup>,
      },
      {
        path: "/login",
        element: <Login></Login>,
      },
      {
        path: "/requests",
        element: <AllRequest></AllRequest>,
      },
      {
        path: "/blogs",
        element: <Blogs></Blogs>,
      },
      {
        path: "/details/:id",
        element: <BlogDetails></BlogDetails>,
      },
      {
        path: "/search",
        element: <Search></Search>,
      },
      {
        path: "/funding",
        element: <Funding></Funding>,
      },
      {
        path: "/donate",
        element: (
          <PrivateRoute>
            <Payment></Payment>
          </PrivateRoute>
        ),
      },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <Dashboard></Dashboard>
      </PrivateRoute>
    ),
    children: [
      {
        path: "/dashboard/userHome",
        element: <DashboardHome></DashboardHome>,
      },

      {
        path: "/dashboard/paymentHistory",
        element: <DonationHistory></DonationHistory>,
      },

      {
        path: "/dashboard/profile",
        element: <Profile></Profile>,
      },
      {
        path: " /dashboard/my-donation-requests",
      },
      {
        path: "/dashboard/create-donation-request",
        element: <CreateRequest></CreateRequest>,
      },
      {
        path: "/dashboard/update/:id",
        element: <UpdateRequest></UpdateRequest>,
      },
      {
        path: "/dashboard/my-donation-requests",
        element: <MyRequest></MyRequest>,
      },
      {
        path: "/dashboard/details/:id",
        element: (
          <PrivateRoute>
            <RequestDetails></RequestDetails>
          </PrivateRoute>
        ),
      },
      // admin related route
      {
        path: "/dashboard/allusers",
        element: (
          <AdminRoute>
            <AllUsers></AllUsers>
          </AdminRoute>
        ),
      },
      {
        path: "/dashboard/adminHome",
        element: (
          <AdminRoute>
            <AdminHome></AdminHome>
          </AdminRoute>
        ),
      },
      {
        path: "/dashboard/all-blood-donation-request",
        element: (
          <AdminRoute>
            <AllBgRequests></AllBgRequests>
          </AdminRoute>
        ),
      },
      {
        path: "/dashboard/content-management",
        element: (
          <AdminRoute>
            <ContentManagement></ContentManagement>
          </AdminRoute>
        ),
      },
      {
        path: "/dashboard/content-management/add-blog",
        element: (
          <AdminRoute>
            <AddBlog></AddBlog>
          </AdminRoute>
        ),
      },
    ],
  },
]);

export default Routers;
