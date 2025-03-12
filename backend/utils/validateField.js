export const AllowedEditField = [
  "userName",
  "education",
  "password",
  "profilePic",
  "bannerImg",
  "headline",
  "location",
  "about",
  "skill",
  "experience",
];

export const validateField = (req) => {
  console.log(req.body);

  const isValidField = Object.keys(req.body).every((field) =>
    AllowedEditField.includes(field)
  );
  console.log(isValidField);

  return isValidField;
};
