const getOneUser = (axiosFetch) => {
  axiosFetch({
    url: "/api/auth/me",
    method: "GET",
  });
};

// eslint-disable-next-line import/prefer-default-export
export { getOneUser };
