const getCommentsCount = (axiosFetch, postId) => {
  axiosFetch({
    url: `/api/post/${postId}/commentsCount`,
    method: "GET",
  });
};

const getCommentsByPost = (axiosFetch, postId, page) => {
  axiosFetch({
    url: `/api/post/${postId}/comments?page=${page}`,
    method: "GET",
  });
};

const createComment = (axiosFetch, postId, commentData) => {
  axiosFetch({
    url: `/api/post/${postId}/comments`,
    method: "POST",
    requestConfig: {
      data: { content: commentData },
    },
  });
};

const updateComment = (axiosFetch, postId, commentId, commentData) => {
  axiosFetch({
    url: `/api/post/${postId}/comments/${commentId}`,
    method: "PUT",
    requestConfig: {
      data: { content: commentData },
    },
  });
};

const deleteComment = (axiosFetch, postId, commentId) => {
  axiosFetch({
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
