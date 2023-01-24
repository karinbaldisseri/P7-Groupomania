/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prettier/prettier */
import { useState, useEffect } from "react";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import PropTypes from "prop-types";
// import { toast } from "react-toastify";
import useAxiosFetchFunction from "../../hooks/useAxiosFetchFunction";
import "./likes.scss";
import CommentsFeed from "../commentsFeed";
import {getLikeCount, getLikeByPostByUser, addOrRemoveLike} from "../../api/calls/likecalls";
import { getCommentsCount } from "../../api/calls/commentcalls";

function Likes({ postId }) {
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [commentsCount, setCommentsCount] = useState(0);
  const [likesCount, setLikesCount] = useState(0);
  const [dislikesCount, setDislikesCount] = useState(0);

  const [likeCountRes, likeCountErr, likeCountLoad, likeCountAxiosFetch] = useAxiosFetchFunction();
  // const { likesTotal, dislikesTotal } = likeCountRes;
  const [commCountRes, commCountErr, commCountLoad, commCountAxiosFetch] = useAxiosFetchFunction();
  // const { commentsTotal } = commCountRes;
  const [likeRes, likeErr, likeLoad, likeAxiosFetch] = useAxiosFetchFunction();
  const [voteRes, voteErr, voteLoad, voteAxiosFetch] = useAxiosFetchFunction();

  useEffect(() => {
    getLikeCount(likeCountAxiosFetch, postId);
    getCommentsCount(commCountAxiosFetch, postId);
    getLikeByPostByUser(likeAxiosFetch, postId);
  }, []);

  useEffect(() => {
    if (commCountRes) {
      setCommentsCount(commCountRes.commentsTotal);
    }
  }, [commCountRes]);

  useEffect(() => {
    if (likeCountRes) {
      setLikesCount(likeCountRes.likesTotal);
      setDislikesCount(likeCountRes.dislikesTotal);
    }
  }, [likeCountRes]);

  useEffect(() => {
    if (likeRes) {
      if (likeRes.likeValue === 1) {
      setIsLiked(true);
    } else if (likeRes.likeValue === -1) {
      setIsDisliked(true);
    }
    }
  }, [likeRes]);

  const handleLike = async () => {
    let vote;
    if (isLiked && !isDisliked) {
      vote = 0;
      setLikesCount((likes) => likes - 1);
      setIsLiked(false);
    } else if (!isLiked && !isDisliked) {
      vote = 1;
      setLikesCount((likes) => likes + 1);
      setIsLiked(true);
    } else if (!isLiked && isDisliked) {
      vote = 1;
      setLikesCount((likes) => likes + 1);
      setIsLiked(true);
      setDislikesCount((dislikes) => dislikes - 1);
      setIsDisliked(false);
    }
    addOrRemoveLike(voteAxiosFetch, postId, vote);
  };

  const handleDislike = async () => {
    let vote;
    if (isDisliked && !isLiked) {
      vote = 0;
      setDislikesCount((dislikes) => dislikes - 1);
      setIsDisliked(false);
    } else if (!isDisliked && !isLiked) {
      vote = -1;
      setDislikesCount((dislikes) => dislikes + 1);
      setIsDisliked(true);
    } else if (!isDisliked && isLiked) {
      vote = -1;
      setDislikesCount((dislikes) => dislikes + 1);
      setIsDisliked(true);
      setLikesCount((likes) => likes - 1);
      setIsLiked(false);
    }
    addOrRemoveLike(voteAxiosFetch, postId, vote);
  };

  return (
    <>
      <div className="likesAndComments">
        <div className="likesBtns">
          <button type="button" onClick={handleLike}>
            <FaThumbsUp className={isLiked ? "liked thumbs up" : "thumbs up"} />
            <p>{likesCount}</p>
          </button>
          <button type="button" onClick={handleDislike}>
            <FaThumbsDown
              className={isDisliked ? "disliked thumbs down" : "thumbs down"}
            />
            <p>{dislikesCount}</p>
          </button>
        </div>
        {likeCountLoad || likeCountErr || likeLoad || likeErr || voteLoad ||
          voteErr && <p>Likes indisponibles</p>}
        <button
          type="button"
          className="commentBtn"
          title="Montrer ou cacher les commentaires"
          onClick={() => setCommentsOpen(!commentsOpen)}
        >
          {!commCountLoad && !commCountErr && commentsCount} commentaires
        </button>
      </div>
      {commentsOpen && (
        <CommentsFeed postId={postId} setCommentsCount={setCommentsCount} />
      )}
    </>
  );
}

Likes.propTypes = {
  postId: PropTypes.number.isRequired,
};

export default Likes;
