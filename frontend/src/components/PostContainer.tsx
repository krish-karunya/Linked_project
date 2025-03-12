import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../utils/axiosInstance";

import PostCard, { PostCardProps } from "./PostCard";
import { Loader2Icon } from "lucide-react";

const fetchPostData = () => {
  return axiosInstance.get("/post");
};

const PostContainer = () => {
  // Fetching the post Data :
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["postListData"],
    queryFn: fetchPostData,
  });
  // console.log(data?.data.data);
  const postList = data?.data.data;
  // console.log(postList);

  if (isLoading) {
    return (
      <h1 className="mx-auto">
        {<Loader2Icon className="animate-spin size-16 w-full mt-20" />}
      </h1>
    );
  }

  if (isError) {
    console.log("Error is ", error);
  }

  return (
    <div>
      {postList?.map((post: PostCardProps) => {
        // console.log(post);

        return (
          <div key={post._id}>
            <PostCard postList={post} />
          </div>
        );
      })}
    </div>
  );
};

export default PostContainer;
