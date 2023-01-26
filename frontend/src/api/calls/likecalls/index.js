const getLikeCount = async (axiosFetch, postId) => {
  await axiosFetch({
    url: `api/posts/${postId}/likecount`,
    method: "GET",
  });
};

const getLikeByPostByUser = async (axiosFetch, postId) => {
  await axiosFetch({
    url: `api/posts/${postId}/like`,
    method: "GET",
  });
};

const addOrRemoveLike = async (axiosFetch, postId, vote) => {
  await axiosFetch({
    url: `api/posts/${postId}/like`,
    method: "POST",
    requestConfig: {
      data: { like: vote },
    },
  });
};

export { getLikeCount, getLikeByPostByUser, addOrRemoveLike };
