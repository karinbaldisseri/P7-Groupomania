const getAllPosts = (axiosFetch, page) => {
  axiosFetch({
    url: `/api/posts?page=${page}`,
    method: "GET",
  });
};

const createPost = (axiosFetch, postData) => {
  axiosFetch({
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

const deletePost = (axiosFetch, postId) => {
  axiosFetch({
    url: `/api/posts/${postId}`,
    method: "DELETE",
  });
};

const updatePost = (axiosFetch, postId, postData) => {
  axiosFetch({
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
