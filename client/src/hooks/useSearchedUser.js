import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import useAxiosPublic from "./useAxiosPublic";

const useSearchedUser = () => {
  const axiosPublic = useAxiosPublic();
  const [searchParams, setSearchParams] = useSearchParams();

  // Get filter values and page from URL
  const bloodGroup = searchParams.get("bloodGroup") || "";
  const district = searchParams.get("district") || "";
  const upazila = searchParams.get("upazila") || "";
  const page = parseInt(searchParams.get("page")) || 1;

  const {
    data: responseData = {},
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["all-donors", bloodGroup, district, upazila, page],
    queryFn: async () => {
      const params = new URLSearchParams({ page });
      if (bloodGroup) params.append("bloodGroup", bloodGroup);
      if (district) params.append("district", district);
      if (upazila) params.append("upazila", upazila);

      const res = await axiosPublic.get(`/search?${params.toString()}`);
      return res.data;
    },
  });

  const setPage = (newPage) => {
    searchParams.set("page", newPage);
    setSearchParams(searchParams);
  };

  return {
    users: responseData.donors || [],
    refetch,
    isLoading,
    currentPage: page,
    setPage,
    totalDonors: responseData.totalDonors || 0,
    totalPages: responseData.totalPages || 0,
  };
};

export default useSearchedUser;
