import { Navigate, useLocation } from "react-router-dom";

import PropTypes from "prop-types";
import useAdmin from "../hooks/useAdmin";
import useAuth from "../hooks/useAuth";
import useCurrentUser from "../hooks/useCurrentUser";

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const [isAdmin, isAdminLoading] = useAdmin();
  const { currentUser } = useCurrentUser();

  const location = useLocation();
  if (loading || isAdminLoading) {
    return (
      <span className="loading loading-spinner min-h-screen flex justify-center items-center mx-auto loading-lg"></span>
    );
  }
  if ((user && isAdmin) || currentUser[0]?.role === "volunteer") {
    return children;
  }
  return <Navigate to="/login" state={{ from: location }} replace></Navigate>;
};

export default AdminRoute;

AdminRoute.propTypes = {
  children: PropTypes.node.isRequired,
};
