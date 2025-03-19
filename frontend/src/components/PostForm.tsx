import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Image } from "lucide-react";
import { useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import toast from "react-hot-toast";
import { Loader } from "lucide-react";
import { UserProfile } from "./FeedPost";

type PostData = {
  content: string;
  visibility: string;
  image?: string;
};

const PostForm: React.FC<{ user: UserProfile }> = ({ user }) => {
  // console.log(user);

  const [content, setContent] = useState<string>("");
  const [visibility, setvisibility] = useState<string>("");
  const [image, setImage] = useState<string>("");
  const [imagePreview, setImagePreview] = useState<string>("");
  const queryClient = useQueryClient();

  const { mutate: createPostMutation, isPending } = useMutation({
    mutationFn: async (postData: PostData) => {
      const res = await axiosInstance.post("/post", postData, {
        headers: { "Content-Type": "application/json" },
      });
      return res.data;
    },
    onSuccess: () => {
      resetForm();
      toast.success("Post created successfully");
      queryClient.invalidateQueries({ queryKey: ["postListData"] });
    },
    onError: (err: any) => {
      toast.error(err.response.data.message || "Failed to create post");
    },
  });

  const HandleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // console.log(imagePreview);

    try {
      const postData: PostData = { content, visibility };
      if (image) postData.image = await readFileAsDataURL(image);

      createPostMutation(postData);
    } catch (error) {
      console.error("Error in handlePostCreation:", error);
    }
  };
  const handleChange = async (e: any): Promise<void> => {
    const file = e.target.files[0];
    // console.log(file);

    setImage(file);
    if (file) {
      const result = await readFileAsDataURL(file); // convert image URL => Base 64 format
      // console.log(result);
      setImagePreview(result);
    } else {
      setImagePreview("");
    }
  };
  const readFileAsDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          resolve(reader.result);
        } else {
          reject(new Error("FileReader result is not a string"));
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const resetForm = () => {
    setContent("");
    setImage("");
    setImagePreview("");
    setvisibility("");
  };

  return (
    <div>
      <form className="p-4 bg-gray-200 rounded-lg" onSubmit={HandleSubmit}>
        <div className="flex items-center w-full gap-4">
          <img
            src={user?.profilePic}
            alt="profilePic"
            className="rounded-full w-14 h-14 object-cover"
          />
          <input
            type="text"
            className="w-full border-[1.3px] border-gray-400 outline-none rounded-full py-2 px-6"
            placeholder="Create a post"
            name="content"
            value={content}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setContent(e.target.value)
            }
          />
        </div>

        <div className="flex justify-between items-center mt-4">
          <div className="flex  items-center gap-4">
            <div>
              <label
                htmlFor="pic"
                className="bg-sky-500 text-white px-5 py-2 rounded-full font-semibold flex items-center gap-2 justify-center text-sm"
              >
                <Image size={20} className="mt-1" />
                Add Photo
                <input
                  type="file"
                  className="hidden"
                  id="pic"
                  accept="image/*"
                  name="image"
                  onChange={handleChange}
                />
              </label>
            </div>
            <div>
              <select
                className="bg-sky-500 px-5 py-2  text-white rounded-full font-semibold outline-none"
                onChange={(e) => setvisibility(e.target.value)}
                required
              >
                <option value="">select your preference</option>
                <option value="public">public</option>
                <option value="private">private</option>
              </select>
            </div>
          </div>
          <div>
            <button
              className="bg-sky-500 px-6 py-2 text-white rounded-full font-semibold"
              type="submit"
            >
              {isPending ? <Loader className="animate-spin" /> : "Share"}
            </button>
          </div>
        </div>
      </form>
      <div className="relative">
        {image && (
          <button
            className="bg-gray-600 absolute right-0  w-8 h-8 text-white flex justify-center items-center rounded-full"
            onClick={() => setImage("")}
          >
            X
          </button>
        )}
        {image && <img src={imagePreview} alt="" />}
      </div>
    </div>
  );
};

export default PostForm;
