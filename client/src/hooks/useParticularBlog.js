import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import useAxiosSecure from "./useAxiosSecure";

const useParticularBlog = () => {
  const params = useParams();
  const axiosSecure = useAxiosSecure();

  const {
    data: blog = {},
    isLoading,
    error,
  } = useQuery({
    queryKey: ["blog", params.id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/blog/${params.id}`);
      return res.data;
    },
  });

  return { blog, isLoading, error };
};

export default useParticularBlog;
