import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ChevronDown, Image, UploadIcon, X } from "lucide-react";
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

interface PostFormProps {
  user: UserProfile;
  isMenuOpen: boolean;
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const PostForm: React.FC<PostFormProps> = ({
  user,
  setIsMenuOpen,
  isMenuOpen,
}) => {
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
      if (image && typeof image !== "string")
        postData.image = await readFileAsDataURL(image);

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
      console.log(result);
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
    <div className="relative">
      <div>
        <form className="p-4 bg-gray-200 rounded-lg" onSubmit={HandleSubmit}>
          <div className="flex items-center w-full gap-4">
            <img
              src={user?.profilePic}
              alt="profilePic"
              className="rounded-full w-14 h-14 object-cover"
            />
            <div
              className="w-full border-[1.3px] border-gray-400 h-10 rounded-full"
              onClick={() => setIsMenuOpen(true)}
            ></div>
          </div>

          <div className="flex justify-between items-center mt-4">
            <div className="flex  items-center gap-4">
              <div onClick={() => setIsMenuOpen(true)}>
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
                    onClick={() => setIsMenuOpen(true)}
                  />
                </label>
              </div>
              <div className="relative">
                <button
                  className="bg-sky-500 px-5 py-2 hidden md:block text-white rounded-full font-semibold outline-none appearance-none pr-10 cursor-pointer"
                  onClick={() => setIsMenuOpen(true)}
                  type="button"
                >
                  Select You Preference
                </button>
                {/* Custom dropdown arrow */}
                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                  <ChevronDown
                    className="text-white mt-1 hidden md:block"
                    size={20}
                  />
                </div>
              </div>
            </div>
            <div>
              <button
                className="bg-sky-500 px-6 py-2 text-white rounded-full font-semibold"
                onClick={() => setIsMenuOpen(true)}
                type="button"
              >
                {isPending ? <Loader className="animate-spin" /> : "Share"}
              </button>
            </div>
          </div>
        </form>
      </div>
      {isMenuOpen && (
        <div className="w-full mx-auto pb-10 rounded-lg border border-gray-300 absolute bg-white z-100 top-[-50px]">
          <button
            className="ml-[90%] mt-4"
            onClick={() => setIsMenuOpen(false)}
          >
            <X />
          </button>
          <div className="flex justify-center items-center flex-col">
            {image ? (
              <>
                {" "}
                {image && (
                  <button
                    className="bg-gray-600 absolute top-14 right-28 md:right-36 w-8 h-8 text-white flex justify-center items-center rounded-full"
                    onClick={() => setImage("")}
                  >
                    <X />
                  </button>
                )}
                {image && (
                  <div className="flex flex-col justify-center items-center w-full">
                    <h1 className="text-left font-bold text-gray-700">
                      Preview
                    </h1>
                    <div className="w-1/2 h-1/2 border-2 border-sky-600 rounded-lg p-2">
                      <img
                        src={imagePreview}
                        alt="preview-image"
                        className=" rounded-lg"
                      />
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className=" flex items-center flex-col">
                <img
                  src={
                    "https://img.freepik.com/free-vector/cute-boy-study-with-laptop-cartoon-icon-illustration-education-technology-icon-concept-isolated-flat-cartoon-style_138676-2107.jpg?ga=GA1.1.610046109.1735652660&semt=ais_keywords_boost"
                  }
                  alt="upload-image"
                  className="w-40"
                />
                <p>Select File to Being</p>
                <button className="flex flex-col items-center mt-4 gap-2 ">
                  {" "}
                  <span>
                    <UploadIcon />
                  </span>
                  <label
                    htmlFor="pic"
                    className="bg-sky-500 text-white px-5 py-2 rounded-full font-semibold flex items-center gap-2 justify-center text-sm"
                  >
                    <Image size={20} className="mt-1" />
                    Upload from Computer
                    <input
                      type="file"
                      className="hidden"
                      id="pic"
                      accept="image/*"
                      name="image"
                      onClick={() => setIsMenuOpen(true)}
                      onChange={handleChange}
                    />
                  </label>
                </button>
              </div>
            )}

            <div>
              {image && (
                <div className="relative">
                  <div>
                    <form
                      className="p-4 flex flex-col justify-center items-center "
                      onSubmit={HandleSubmit}
                    >
                      <div className="flex items-center mt-4 ">
                        <div className="flex  items-center gap-4">
                          <div className="relative">
                            <select
                              className="bg-sky-500 px-5 py-2 text-white rounded-full font-semibold outline-none appearance-none pr-10 cursor-pointer"
                              onChange={(e) => setvisibility(e.target.value)}
                              required
                            >
                              <option value="">Select your preference</option>
                              <option value="public">Public</option>
                              <option value="private">Private</option>
                            </select>
                            {/* Custom dropdown arrow */}
                            <div className="absolute inset-y-0 right-3  flex items-center pointer-events-none">
                              <ChevronDown
                                className="text-white mt-1"
                                size={20}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-center w-full gap-4 mt-16">
                        <div className="flex items-center  gap-2 w-full">
                          <img
                            src={user?.profilePic}
                            alt="profilePic"
                            className="rounded-full w-10 h-10 object-cover"
                          />
                          <input
                            type="text"
                            className="md:w-[500px] border-[1.3px] border-gray-400 outline-none rounded-full py-2 px-6"
                            placeholder="Create a post"
                            name="content"
                            value={content}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) => setContent(e.target.value)}
                          />
                          <div>
                            <button
                              className="bg-sky-500 px-6 py-2 text-white rounded-full font-semibold"
                              type="submit"
                            >
                              {isPending ? (
                                <Loader className="animate-spin" />
                              ) : (
                                "Share"
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostForm;
