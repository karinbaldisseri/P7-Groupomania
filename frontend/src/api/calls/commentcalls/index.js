const getCommentsCount = async (axiosFetch, postId) => {
  await axiosFetch({
    url: `/api/post/${postId}/commentsCount`,
    method: "GET",
  });
};

const getCommentsByPost = async (axiosFetch, postId, page) => {
  await axiosFetch({
    url: `/api/post/${postId}/comments?page=${page}`,
    method: "GET",
  });
};

const createComment = async (axiosFetch, postId, commentData) => {
  await axiosFetch({
    url: `/api/post/${postId}/comments`,
    method: "POST",
    requestConfig: {
      data: { content: commentData },
    },
  });
};

const updateComment = async (axiosFetch, postId, commentId, commentData) => {
  await axiosFetch({
    url: `/api/post/${postId}/comments/${commentId}`,
    method: "PUT",
    requestConfig: {
      data: { content: commentData },
    },
  });
};

const deleteComment = async (axiosFetch, postId, commentId) => {
  await axiosFetch({
    url: `/api/post/${postId}/comments/${commentId}`,
    method: "DELETE",
  });
};

export {
  getCommentsCount,
  getCommentsByPost,
  createComment,
  updateComment,
  deleteComment,
};
