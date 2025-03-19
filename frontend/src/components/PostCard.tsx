import { Trash2, ThumbsUp } from "lucide-react";

import { MessageCircle } from "lucide-react";
import { Share2 } from "lucide-react";
import Comment from "./Comment";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../utils/axiosInstance";
import { useAuthContext } from "../context/AuthUser";
import { Default_user_img } from "../utils/constant";
import { UserProfileProps } from "./FeedPost";
import toast from "react-hot-toast";

export interface PostCardProps {
  _id: string;
  author: Author;
  visibility: string;
  content: string;
  comment: string[];
  like?: string[];
  image: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Author {
  _id: string;
  userName: string;
  profilePic: string;
  headline: string;
}
type CreateCommentProps = {
  postId: string;
  commentValue: string;
};

export type CommentData = {
  _id: string;
  postId: string;
  userId: UserID;
  content: string;
  createdAt: Date;
  updatedAt: Date;
};
type UserID = {
  _id: string;
  userName: string;
  profilePic: string;
  headline: string;
};
type Message = {
  message: string;
};
type Data = {
  email: string;
  userName: string;
  _id: string;
};

export type AuthContexTypes = {
  message: Message;
  data: Data;
};

const fetchCommentData = (postId: string) => {
  return axiosInstance.get(`/comment/${postId}`);
};

const fetchLikeAndUnlike = (postId: string) => {
  return axiosInstance.post(`/post/likeanddislike/${postId}`);
};

const createComment = ({ postId, commentValue }: CreateCommentProps) => {
  return axiosInstance.post(`/comment/${postId}`, { content: commentValue });
};

const postDeleteFn = (postId: string) => {
  return axiosInstance.delete(`/post/${postId}`);
};

const PostCard: React.FC<{ postList: PostCardProps }> = (props) => {
  const { author, comment, content, image, like, _id: postId } = props.postList;
  const { userName, profilePic, headline } = author;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [commentValue, setCommentValue] = useState("");
  const { authUser } = useAuthContext();

  const isLiked = like?.some((user_id: string) => {
    return user_id === authUser?.data?._id;
  });

  const queryClient = useQueryClient();

  // Query Function to fetch the Comment Data :
  const { data } = useQuery({
    queryKey: ["comment", postId],
    queryFn: () => fetchCommentData(postId),
  });
  // console.log(data?.data.data);
  const commentList = data?.data.data;

  // function Query to create a comment
  const { mutate } = useMutation({
    mutationFn: createComment,
    onSuccess: () => {
      // console.log(data);
      setCommentValue("");
      console.log("Comment Created Successfully");
      queryClient.invalidateQueries({ queryKey: ["comment"] });
      queryClient.invalidateQueries({ queryKey: ["postListData"] });
    },
    onError: (error) => {
      console.log(error);
    },
  });

  //Query function to handle Like :
  const { mutate: createLikeAndDisLike } = useMutation({
    mutationFn: fetchLikeAndUnlike,
    onSuccess: (data) => {
      // console.log(data.data.message);
      queryClient.invalidateQueries({ queryKey: ["postListData"] });
    },
  });

  // Create comment function :
  const HandleCreateComment = (postId: string) => {
    // console.log(postId);
    mutate({ postId, commentValue });
  };
  // Handle like function :
  const handleLike = (postId: string) => {
    createLikeAndDisLike(postId);
  };
  // Delete Post Function :

  const { mutate: deletePost } = useMutation({
    mutationFn: postDeleteFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["postListData"] });
    },
  });

  // Fetch the profile data:
  const { data: profileData } = useQuery<UserProfileProps>({
    queryKey: ["userProfile"],
  });
  const user = profileData?.data?.data;

  return (
    <div>
      <div className="bg-gray-200 mt-2 p-2 rounded-lg">
        <div className="flex items-center">
          <img
            src={profilePic || Default_user_img}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div className="flex flex-col ml-4">
            <p className="font-bold text-left">{userName}</p>
            <p className="text-sm text-gray-400 w-40 h-4 overflow-hidden ">
              {headline}
            </p>
          </div>
          <button className="ml-auto" onClick={() => deletePost(postId)}>
            {authUser?.data._id === author._id && (
              <Trash2 className="hover:text-red-400" />
            )}
          </button>
        </div>
        <div>
          <p className="text-left ml-4 mt-2 text-sm">{content}</p>
          <img
            src={image}
            alt="post-image"
            className="rounded-lg mt-1 w-full h-96 object-cover"
          />
        </div>
        <div className="flex justify-between px-8 mt-3">
          <button
            className="flex items-center gap-1"
            onClick={() => handleLike(postId)}
          >
            <ThumbsUp size={18} className={isLiked ? `text-blue-700` : ""} />
            like ({like?.length})
          </button>
          <button
            className="flex items-center gap-1"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <MessageCircle size={18} />
            comment ({comment.length})
          </button>
          <button className="flex items-center gap-1">
            <Share2 size={18} />
            share
          </button>
        </div>
      </div>
      {isMenuOpen && (
        <div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              HandleCreateComment(postId);
            }}
            className="my-2 flex items-center gap-4"
          >
            <img
              src={user?.profilePic}
              alt=""
              className="rounded-full w-12 h-12"
            />
            <input
              type="text"
              className="w-full border-[1.3px] border-gray-400 outline-none rounded-full py-2 px-6"
              placeholder="Create a comment"
              name="content"
              value={commentValue}
              onChange={(e) => setCommentValue(e.target.value)}
              required
            />
            <button className="bg-sky-400 px-4 py-2 rounded-full text-white font-semibold">
              Comment
            </button>
          </form>
          {commentList.map((data: CommentData) => (
            <div key={data._id}>
              <Comment commentData={data} postId={postId} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostCard;
