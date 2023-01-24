const getLikeCount = (axiosFetch, postId) => {
  axiosFetch({
    url: `api/posts/${postId}/likecount`,
    method: "GET",
  });
};

const getLikeByPostByUser = (axiosFetch, postId) => {
  axiosFetch({
    url: `api/posts/${postId}/like`,
    method: "GET",
  });
};

const addOrRemoveLike = (axiosFetch, postId, vote) => {
  axiosFetch({
    url: `api/posts/${postId}/like`,
    method: "POST",
    requestConfig: {
      data: { like: vote },
    },
  });
};

export { getLikeCount, getLikeByPostByUser, addOrRemoveLike };
