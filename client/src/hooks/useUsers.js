import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import useAxiosSecure from "./useAxiosSecure";

const useUsers = () => {
  const axiosSecure = useAxiosSecure();
  const [page, setPage] = useState(1);
  const {
    data = {},
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["users", page],
    queryFn: async () => {
      const res = await axiosSecure.get(`/user?page=${page}`);
      return res.data;
    },
  });

  return {
    users: data.users || [],
    totalUsers: data.totalUsers || 0,
    totalPages: data.totalPages || 0,
    currentPage: page,
    setPage,
    refetch,
    isLoading,
  };
};

export default useUsers;
