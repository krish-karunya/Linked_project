import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import axiosInstance from "../utils/axiosInstance";
import { CommentData } from "./PostCard";
import { UserProfileProps } from "./FeedPost";

type CommentFnProps = {
  postId: string;
  commentId: string;
};

type CommentDataProps = {
  commentData: CommentData;
  postId: string;
};

const fetchDeleteComment = ({ postId, commentId }: CommentFnProps) => {
  return axiosInstance.delete(`/comment/${postId}/${commentId}`);
};

const Comment = ({ commentData, postId }: CommentDataProps) => {
  const { content, userId, _id: commentId } = commentData;
  const { profilePic, userName, headline } = userId;

  const queryClient = useQueryClient();

  // Fetch the profile data:
  const { data } = useQuery<UserProfileProps>({
    queryKey: ["userProfile"],
  });
  const user = data?.data.data;

  // function handle the deletePost
  const handleDeleteComment = (postId: string, commentId: string) => {
    // console.log(postId);
    // console.log(commentId);
    mutate({ postId, commentId });
  };

  // delete Comment mutationFn :

  const { mutate } = useMutation({
    mutationFn: fetchDeleteComment,
    onSuccess: (data) => {
      // console.log(data);
      queryClient.invalidateQueries({ queryKey: ["postListData"] });
      queryClient.invalidateQueries({ queryKey: ["comment"] });
      // console.log("Comment Deleted Successfully");
    },
  });
  return (
    <div className="bg-gray-200 p-2">
      <div className="bg-gray-300 rounded-lg py-2">
        <div className="flex items-center rounded-lg justify-between relative">
          <div className="flex items-center p-2 ">
            <img
              src={profilePic}
              alt="post-image"
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="flex flex-col ml-4">
              <p className="font-bold text-left">{userName}</p>
              <p className="text-sm text-gray-400 ">{headline}</p>
            </div>
          </div>
          <button
            className="mr-4 absolute right-0 top-2"
            onClick={() => handleDeleteComment(postId, commentId)}
          >
            {user?._id === userId._id && (
              <Trash2 size={18} className="hover:text-red-400" />
            )}
          </button>
        </div>
        <div className="px-[70px] text-sm text-left">{content}</div>
      </div>
    </div>
  );
};

export default Comment;
