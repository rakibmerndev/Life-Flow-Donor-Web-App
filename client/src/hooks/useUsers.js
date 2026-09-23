import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import useAxiosSecure from "./useAxiosSecure";

const useUsers = () => {
  const axiosSecure = useAxiosSecure();
  const [searchParams, setSearchParams] = useSearchParams();

  // Get page and status from URL, with defaults
  const page = parseInt(searchParams.get("page")) || 1;
  const status = searchParams.get("status") || "";

  const {
    data = {},
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["users", page, status],
    queryFn: async () => {
      const params = new URLSearchParams({ page });
      if (status && status !== "") {
        params.append("status", status);
      }
      const res = await axiosSecure.get(`/user?${params.toString()}`);
      return res.data;
    },
  });

  const setPage = (newPage) => {
    searchParams.set("page", newPage);
    setSearchParams(searchParams);
  };

  const handleStatusChange = (value) => {
    searchParams.set("status", value);
    searchParams.set("page", 1); 
    setSearchParams(searchParams);
  };

  return {
    users: data.users || [],
    totalUsers: data.totalUsers || 0,
    totalPages: data.totalPages || 0,
    currentPage: page,
    setPage,
    status,
    setStatus: handleStatusChange,
    refetch,
    isLoading,
  };
};

export default useUsers;
