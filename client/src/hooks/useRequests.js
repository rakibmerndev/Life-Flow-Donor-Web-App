import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import useAxiosPublic from "./useAxiosPublic";

const useRequests = () => {
  const axiosPublic = useAxiosPublic();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");

  const {
    data = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["all-requests", page, status],
    queryFn: async () => {
      const params = new URLSearchParams({ page });
      if (status && status !== "") {
        params.append("status", status);
      }
      const res = await axiosPublic.get(`/request?${params.toString()}`);
      return res.data;
    },
  });

  const handleStatusChange = (value) => {
    setStatus(value);
    setPage(1);
  };

  return {
    requests: data.requests || [],
    refetch,
    isLoading,
    currentPage: page,
    setPage,
    status,
    setStatus: handleStatusChange,
    totalRequests: data.totalRequests,
    totalPages: data.totalPages,
  };
};

export default useRequests;
