export const users = [
  {
    email: "admin@crm.com",
    password: "123456",
    role: "admin"
  },
  {
    email: "user@crm.com",
    password: "123456",
    role: "user"
  }
];

export const loginUser = (email, password) => {
  const user = users.find(
    (u) => u.email === email && u.password === password
  );

  if (user) {
    localStorage.setItem("crmUser", JSON.stringify(user));
    return user;
  }

  return null;
};

export const logoutUser = () => {
  localStorage.removeItem("crmUser");
};

export const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("crmUser"));
};