const getAllPosts = async (axiosFetch, page) => {
  await axiosFetch({
    url: `/api/posts?page=${page}`,
    method: "GET",
  });
};

const createPost = async (axiosFetch, postData) => {
  await axiosFetch({
    url: "/api/posts",
    method: "POST",
    requestConfig: {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      data: postData,
    },
  });
};

const deletePost = async (axiosFetch, postId) => {
  await axiosFetch({
    url: `/api/posts/${postId}`,
    method: "DELETE",
  });
};

const updatePost = async (axiosFetch, postId, postData) => {
  await axiosFetch({
    url: `/api/posts/${postId}`,
    method: "PUT",
    requestConfig: {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      data: postData,
    },
  });
};

export { getAllPosts, createPost, deletePost, updatePost };
