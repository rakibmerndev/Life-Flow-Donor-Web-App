import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import useAxiosPublic from "./useAxiosPublic";

const useAllUsers = () => {
  const axiosPublic = useAxiosPublic();

  const [page, setPage] = useState(1);
  const {
    data = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["all-requests"],
    queryFn: async () => {
      const res = await axiosPublic.get(`/request?page=${page}`);
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

export default useAllUsers;
