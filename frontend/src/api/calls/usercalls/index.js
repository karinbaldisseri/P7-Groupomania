const getOneUser = async (axiosFetch) => {
  await axiosFetch({
    url: "/api/auth/me",
    method: "GET",
  });
};

const createUser = async (axiosFetch, firstname, lastname, email, password) => {
  await axiosFetch({
    url: "/api/auth/signup",
    method: "POST",
    requestConfig: {
      data: { firstname, lastname, email, password },
    },
  });
};

const loginUser = async (axiosFetch, email, password) => {
  await axiosFetch({
    url: "/api/auth/login",
    method: "POST",
    requestConfig: {
      data: { email, password },
    },
  });
};

const updateUser = async (
  axiosFetch,
  firstname,
  lastname,
  oldPassword,
  password
) => {
  await axiosFetch({
    url: "/api/auth/me",
    method: "PUT",
    requestConfig: {
      data: { firstname, lastname, oldPassword, newPassword: password },
    },
  });
};

const deleteUser = async (axiosFetch) => {
  await axiosFetch({
    url: "/api/auth/me",
    method: "DELETE",
  });
};

const deactivateUser = async (axiosFetch) => {
  await axiosFetch({
    url: "/api/auth/me/deactivate",
    method: "PUT",
    requestConfig: {
      data: { isActive: false },
    },
  });
};

export {
  getOneUser,
  createUser,
  loginUser,
  updateUser,
  deleteUser,
  deactivateUser,
};
