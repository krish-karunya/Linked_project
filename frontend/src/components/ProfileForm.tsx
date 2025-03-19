import { X } from "lucide-react";
import React, { useState } from "react";
import { Plus } from "lucide-react";
// import EducationForm from "./EducationForm";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../utils/axiosInstance";

const updateProfileData = (data: any) => {
  return axiosInstance.patch("/user/profile/edit", { data });
};

// Schema Types:
const formSchema = z.object({
  userName: z.string().min(3, "UserName is Required"),
  about: z.string().min(3, "About is Required"),
  headline: z.string().min(3, "Headline is Required"),
  location: z.string().min(3, "Location is Required"),
  profilePic: z.string(),
  bannerImg: z.string(),
  education: z.array(
    z.object({
      startYear: z.string(),
      endYear: z.string(),
      fieldOfStudy: z.string(),
    })
  ),

  experience: z.array(
    z.object({
      companyName: z.string().min(3, "UserName is Required"),
      role: z.string().min(3, "UserName is Required"),
      startDate: z.string(),
      endDate: z.string(),
      description: z.string(),
    })
  ),

  skill: z
    .string()
    .array()
    .refine((skills) => skills.length > 0, {
      message: "At least one skill is required",
    }),
});

// converting the schema in to typescript type using Infer method in zod library:
type FormData = z.infer<typeof formSchema>;
const ProfileForm: React.FC<{
  setEdit: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ setEdit }) => {
  const [educationMenu, setEducationMenu] = useState(false);
  const [experienceMenu, setExperienceMenu] = useState(false);
  const [input, setInput] = useState<string>("");
  const queryClient = useQueryClient();
  // useForm hook to handle the form Data :
  const {
    register,
    formState: { errors },
    control,
    setValue,
    handleSubmit,
    watch,
    reset,
  } = useForm<FormData>({
    defaultValues: {
      userName: "",
      about: "",
      headline: "",
      location: "",
      profilePic: "",
      bannerImg: "",
      education: [
        {
          startYear: "",
          endYear: "",
          fieldOfStudy: "",
        },
      ],
      experience: [
        {
          companyName: "",
          role: "",
          startDate: "",
          endDate: "",
          description: "",
        },
      ],
      skill: [],
    },
    resolver: zodResolver(formSchema),
  });
  const skill = watch("skill");

  // useField Array implementation for education and experience :
  const { fields, append, remove } = useFieldArray({
    control,
    name: "education",
  });
  const {
    fields: experienceList,
    append: addExperience,
    remove: removeExperience,
  } = useFieldArray({
    control,
    name: "experience",
  });

  const { mutate } = useMutation({
    mutationFn: updateProfileData,
    onSuccess: () => {
      console.log("Profile Updated Successfully");
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
    onError: (err) => {
      console.log(err);
    },
  });

  // Submit Function :
  const onSubmit = (data: any) => {
    console.log(data);
    mutate(data);
    // reset();
  };

  // Function to add skill in to skill Array:
  const addSkill = () => {
    setValue("skill", [...skill, input]);
    setInput("");
  };

  // Function to remove the skill form skill Array:
  const removeSkill = (index: number) => {
    setValue(
      "skill",
      skill.filter((_, i) => i !== index)
    );
  };
  console.log(errors);

  return (
    <div className="w-7/12 h-screen overflow-scroll bg-white mx-auto rounded-lg absolute top-1 right-66 z-50 ">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold p-4 rounded-lg text-sky-500">
          Edit Profile
        </h1>
        <div className="mr-4" onClick={() => setEdit(false)}>
          <X />
        </div>
      </div>

      {/* form */}
      <form
        action=""
        className="p-8 flex flex-col gap-2 text-gray-500"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex flex-col">
          <label htmlFor="userName" className="font-semibold">
            Username*
          </label>
          <input
            type="text"
            id="userName"
            className="outline-none border border-gray-600 mt-1 py-1 rounded px-3 text-gray-900"
            {...register("userName", { required: "UserName is Required" })}
          />
          {errors.userName && (
            <p className="text-red-500 text-sm mt-1">
              {errors.userName?.message}
            </p>
          )}
        </div>

        <div className="flex flex-col">
          <label htmlFor="about" className="font-semibold">
            About*
          </label>
          <input
            type="text"
            id="about"
            className="text-gray-900 outline-none border border-gray-600 mt-1 py-1 rounded px-3"
            {...register("about")}
          />
          {errors.about && (
            <p className="text-red-500 text-sm mt-1">{errors.about?.message}</p>
          )}
        </div>
        <div className="flex flex-col">
          <label htmlFor="headline" className="font-semibold">
            Headline*
          </label>
          <input
            type="text"
            id="headline"
            className="text-gray-900 outline-none border border-gray-600 mt-1 py-1 rounded px-3"
            {...register("headline")}
          />
          {errors.headline && (
            <p className="text-red-500 text-sm mt-1">
              {errors.headline?.message}
            </p>
          )}
        </div>
        <div className="flex flex-col">
          <label htmlFor="location" className="font-semibold">
            Location*
          </label>
          <input
            type="text"
            className="text-gray-900 outline-none border border-gray-600 mt-1 py-1 rounded px-3"
            {...register("location")}
          />
          {errors.headline && (
            <p className="text-red-500 text-sm mt-1">
              {errors.location?.message}
            </p>
          )}
        </div>

        {/* BannerImg */}
        <div className="flex flex-col">
          <label htmlFor="location" className="font-semibold">
            Banner Image*
          </label>
          <input
            type="text"
            placeholder="Paste Your Banner Image URL here"
            className="text-gray-900 outline-none border border-gray-600 mt-1 py-1 rounded px-3"
            {...register("bannerImg")}
          />
          {errors.headline && (
            <p className="text-red-500 text-sm mt-1">
              {errors.bannerImg?.message}
            </p>
          )}
        </div>
        {/* ProfilePic*/}
        <div className="flex flex-col">
          <label htmlFor="location" className="font-semibold">
            Profile Pic*
          </label>
          <input
            type="text"
            placeholder="Paste Your profile URL here"
            className="text-gray-900 outline-none border border-gray-600 mt-1 py-1 rounded px-3"
            {...register("profilePic")}
          />
          {errors.headline && (
            <p className="text-red-500 text-sm mt-1">
              {errors.profilePic?.message}
            </p>
          )}
        </div>
        {/* Education Inputs */}
        <div className="flex flex-col">
          <label
            htmlFor="education"
            className="font-semibold flex items-center justify-between"
          >
            Education*
          </label>
          {educationMenu && (
            <div className="w-full">
              <div className=" bg-white mx-auto rounded-lg  ">
                <div className="flex items-center justify-between">
                  <h1 className="text-xl font-semibold p-4 rounded-lg text-sky-500">
                    Add Education Details
                  </h1>
                  <div
                    className="mr-18 mt-6"
                    onClick={() => setEducationMenu(false)}
                  >
                    <X />
                  </div>
                </div>

                <div>
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="w-[80%] mx-auto border border-gray-600 p-8 rounded mt-2"
                    >
                      <div className="flex items-center gap-2">
                        <div className="flex flex-col w-full">
                          <label htmlFor="username" className="font-semibold">
                            start Date
                          </label>
                          <input
                            type="date"
                            className="outline-none border w-full border-gray-600 mt-1 py-1 rounded px-3 text-gray-900"
                            {...register(`education.${index}.startYear`)}
                          />
                        </div>
                        <div className="flex flex-col w-full">
                          <label htmlFor="username" className="font-semibold">
                            End Date
                          </label>
                          <input
                            type="date"
                            className="text-gray-900 outline-none border border-gray-600 mt-1 py-1 rounded px-3"
                            {...register(`education.${index}.endYear`)}
                          />
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <label htmlFor="username" className="font-semibold">
                          Field of Study
                        </label>
                        <input
                          type="text"
                          className="text-gray-900 outline-none border border-gray-600 mt-1 py-1 rounded px-3"
                          {...register(`education.${index}.fieldOfStudy`)}
                        />
                      </div>
                      {fields.length > 1 && (
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="bg-red-400 text-white  w-1/2 mx-auto rounded-lg px-4 py-2 font-medium text-sm mt-4 text-nowrap"
                        >
                          Remove Education
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  className="bg-sky-600 text-white w-[30%] ml-18 mx-auto rounded-lg px-4 py-2 font-medium text-sm mt-2"
                  onClick={() =>
                    append({
                      startYear: "",
                      endYear: "",
                      fieldOfStudy: "",
                    })
                  }
                >
                  Add Education
                </button>
              </div>
            </div>
          )}
          <span
            className="text-sky-600 mt-4 flex items-center gap-2"
            onClick={() => setEducationMenu(true)}
          >
            <Plus /> <span className="font-semibold">Add Education </span>
          </span>
        </div>
        <div className="flex flex-col">
          <label
            htmlFor="education"
            className="font-semibold flex items-center justify-between"
          >
            Experience*
          </label>

          {/* Experience Inputs */}
          {experienceMenu && (
            <div className="w-full p-4">
              <div className="bg-white mx-auto rounded-lg">
                <div className="flex items-center justify-between">
                  <h1 className="text-xl font-semibold p-4 rounded-lg text-sky-500">
                    Add Experience Details
                  </h1>
                  <div
                    className="mr-4 cursor-pointer"
                    onClick={() => setExperienceMenu(false)}
                  >
                    <X />
                  </div>
                </div>

                {experienceList.map((field, index) => (
                  <div
                    key={field.id}
                    className="border border-gray-600 rounded p-8 mt-2"
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex flex-col w-full">
                        <label className="font-semibold">Company Title</label>
                        <input
                          type="text"
                          className="outline-none border w-full border-gray-600 mt-1 py-1 rounded px-3 text-gray-900"
                          {...register(`experience.${index}.companyName`)}
                        />
                      </div>
                      <div className="flex flex-col w-full">
                        <label className="font-semibold">Role</label>
                        <input
                          type="text"
                          className="text-gray-900 outline-none border border-gray-600 mt-1 py-1 rounded px-3"
                          {...register(`experience.${index}.role`)}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex flex-col w-full">
                        <label className="font-semibold">Start Date</label>
                        <input
                          type="date"
                          className="outline-none border w-full border-gray-600 mt-1 py-1 rounded px-3 text-gray-900"
                          {...register(`experience.${index}.startDate`)}
                        />
                      </div>
                      <div className="flex flex-col w-full">
                        <label className="font-semibold">End Date</label>
                        <input
                          type="date"
                          className="text-gray-900 outline-none border border-gray-600 mt-1 py-1 rounded px-3"
                          {...register(`experience.${index}.endDate`)}
                        />
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <label className="font-semibold">Description</label>
                      <textarea
                        className="text-gray-900 outline-none border border-gray-600 mt-1 py-1 rounded px-3"
                        {...register(`experience.${index}.description`)}
                      />
                    </div>

                    {experienceList.length > 1 && (
                      <button
                        type="button"
                        className="bg-red-400 text-white w-1/2 mx-auto rounded-lg px-4 py-2 font-medium text-sm mt-4"
                        onClick={() => removeExperience(index)}
                      >
                        Remove Experience
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <button
                type="button"
                className="bg-sky-600 text-white w-1/2 mx-auto rounded-lg px-4 py-2 font-medium text-sm mt-4"
                onClick={() =>
                  addExperience({
                    companyName: "",
                    role: "",
                    startDate: "",
                    endDate: "",
                    description: "",
                  })
                }
              >
                Add Experience
              </button>
            </div>
          )}

          <span
            className="text-sky-600 mt-4 flex items-center gap-2"
            onClick={() => setExperienceMenu(true)}
          >
            <Plus /> <span className="font-semibold">Add Experience </span>
          </span>
        </div>
        <div className="flex flex-col">
          <label htmlFor="skill" className="font-semibold">
            Skill*
          </label>
          <div className="flex flex-col gap-4">
            <input
              type="text"
              id="skill"
              value={input}
              className="text-gray-900 outline-none border border-gray-600 mt-1 py-1 rounded w-full px-3"
              onChange={(e) => setInput(e.target.value)}
            />
            {errors.skill && (
              <p className="text-red-500 text-sm mt-1">
                {errors.skill?.message}
              </p>
            )}
            <button
              className="bg-sky-600 px-2 py-1 text-white rounded w-[20%]"
              onClick={() => addSkill()}
              type="button"
            >
              Add
            </button>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {skill?.map((s, index) => (
            <span
              key={index}
              className="bg-gray-200 text-sm px-4 py-2 rounded flex items-center"
            >
              {s}
              <button
                type="button"
                onClick={() => removeSkill(index)}
                className="ml-2 text-red-500"
              >
                <X size={16} />
              </button>
            </span>
          ))}
        </div>
        <button
          type="submit"
          className="mt-6 w-full bg-sky-600 py-2 rounded text-white text-xl font-semibold"
        >
          save
        </button>
      </form>
    </div>
  );
};

export default ProfileForm;
