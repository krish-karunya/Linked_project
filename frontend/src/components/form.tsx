import { X, Plus } from "lucide-react";
import React, { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";

const ProfileForm: React.FC<{
  setEdit: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ setEdit }) => {
  const [educationMenu, setEducationMenu] = useState(false);
  const [experienceMenu, setExperienceMenu] = useState(false);

  const {
    register,
    formState: { errors },
    control,
    handleSubmit,
  } = useForm({
    defaultValues: {
      userName: "",
      about: "",
      headline: "",
      location: "",
      education: [{ startYear: "", endYear: "", fieldOfStudy: "" }],
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
  });

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

  const onSubmit = (data: any) => {
    console.log("Form Data:", data);
  };

  return (
    <div className="w-7/12 bg-white mx-auto rounded-lg absolute top-1 right-66 z-50">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold p-4 rounded-lg text-sky-500">
          Edit Profile
        </h1>
        <div className="mr-4 cursor-pointer" onClick={() => setEdit(false)}>
          <X />
        </div>
      </div>

      <form
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
            {...register("userName", { required: "Username is required" })}
          />
          {errors.userName && (
            <p className="text-red-500 text-sm mt-1">
              {errors.userName?.message}
            </p>
          )}
        </div>

        {/* Education Section */}
        <div className="flex flex-col">
          <label className="font-semibold">Education</label>
          {educationMenu && (
            <div className="bg-white mx-auto rounded-lg p-4">
              <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold text-sky-500">
                  Add Education Details
                </h1>
                <div
                  className="cursor-pointer"
                  onClick={() => setEducationMenu(false)}
                >
                  <X />
                </div>
              </div>

              {fields.map((field, index) => (
                <div key={field.id} className="border p-4 rounded mb-2">
                  <div className="flex gap-2">
                    <div className="flex flex-col w-full">
                      <label className="font-semibold">Start Year</label>
                      <input
                        type="text"
                        className="outline-none border w-full border-gray-600 mt-1 py-1 rounded px-3 text-gray-900"
                        {...register(`education.${index}.startYear`)}
                      />
                    </div>
                    <div className="flex flex-col w-full">
                      <label className="font-semibold">End Year</label>
                      <input
                        type="text"
                        className="outline-none border w-full border-gray-600 mt-1 py-1 rounded px-3 text-gray-900"
                        {...register(`education.${index}.endYear`)}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col mt-2">
                    <label className="font-semibold">Field of Study</label>
                    <input
                      type="text"
                      className="outline-none border w-full border-gray-600 mt-1 py-1 rounded px-3 text-gray-900"
                      {...register(`education.${index}.fieldOfStudy`)}
                    />
                  </div>
                  {fields.length > 1 && (
                    <button
                      type="button"
                      className="mt-2 bg-red-500 text-white px-4 py-1 rounded"
                      onClick={() => remove(index)}
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}

              <button
                type="button"
                className="mt-2 bg-gray-200 px-4 py-2 rounded"
                onClick={() =>
                  append({ startYear: "", endYear: "", fieldOfStudy: "" })
                }
              >
                Add Education
              </button>
            </div>
          )}
          <span
            className="text-sky-600 mt-4 flex items-center gap-2 cursor-pointer"
            onClick={() => setEducationMenu(true)}
          >
            <Plus /> <span className="font-semibold">Add Education</span>
          </span>
        </div>

        {/* Experience Section */}
        <div className="flex flex-col">
          <label className="font-semibold">Experience</label>
          {experienceMenu && (
            <div className="bg-white mx-auto rounded-lg p-4">
              <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold text-sky-500">
                  Add Experience Details
                </h1>
                <div
                  className="cursor-pointer"
                  onClick={() => setExperienceMenu(false)}
                >
                  <X />
                </div>
              </div>

              {experienceList.map((field, index) => (
                <div key={field.id} className="border p-4 rounded mb-2">
                  <div className="flex flex-col">
                    <label className="font-semibold">Company Name</label>
                    <input
                      type="text"
                      className="outline-none border w-full border-gray-600 mt-1 py-1 rounded px-3 text-gray-900"
                      {...register(`experience.${index}.companyName`)}
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="font-semibold">Role</label>
                    <input
                      type="text"
                      className="outline-none border w-full border-gray-600 mt-1 py-1 rounded px-3 text-gray-900"
                      {...register(`experience.${index}.role`)}
                    />
                  </div>
                  {experienceList.length > 1 && (
                    <button
                      type="button"
                      className="mt-2 bg-red-500 text-white px-4 py-1 rounded"
                      onClick={() => removeExperience(index)}
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}

              <button
                type="button"
                className="mt-2 bg-gray-200 px-4 py-2 rounded"
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
            className="text-sky-600 mt-4 flex items-center gap-2 cursor-pointer"
            onClick={() => setExperienceMenu(true)}
          >
            <Plus /> <span className="font-semibold">Add Experience</span>
          </span>
        </div>

        <button
          type="submit"
          className="mt-6 w-full bg-sky-600 py-2 rounded text-white text-xl font-semibold"
        >
          Save
        </button>
      </form>
    </div>
  );
};

export default ProfileForm;
