import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import useAxiosPublic from "./useAxiosPublic";

const useArea = () => {
  const axiosPublic = useAxiosPublic();
  const [selectedDistrict, setSelectedDistrict] = useState("");

  const { data: districts = [] } = useQuery({
    queryKey: ["districts"],
    queryFn: async () => {
      const res = await axiosPublic.get("/districts");
      return res.data;
    },
  });

  const { data: upazilas = [], isLoading } = useQuery({
    queryKey: ["upazilas", selectedDistrict],
    queryFn: async () => {
      const res = await axiosPublic.get(
        `/upazilas?district_id=${selectedDistrict}`,
      );
      return res.data;
    },
    enabled: !!selectedDistrict,
  });

  return {
    districts,
    upazilas,
    selectedDistrict,
    setSelectedDistrict,
    isLoading,
  };
};

export default useArea;
