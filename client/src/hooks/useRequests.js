import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import useAxiosPublic from "./useAxiosPublic";

const useRequests = () => {
  const axiosPublic = useAxiosPublic();
  const [searchParams, setSearchParams] = useSearchParams();

  const page = parseInt(searchParams.get("page")) || 1;
  const status = searchParams.get("status") || "";

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
