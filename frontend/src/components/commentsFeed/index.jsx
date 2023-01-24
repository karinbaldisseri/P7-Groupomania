/* eslint-disable prettier/prettier */
import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import { FaPaperPlane, FaUserCircle } from "react-icons/fa";
import TextareaAutosize from "react-textarea-autosize";
import useAxiosFetchFunction from "../../hooks/useAxiosFetchFunction";
import Comment from "../comment";
import "./commentsFeed.scss";
import { getCommentsByPost, createComment } from "../../api/calls/commentcalls";

function CommentsFeed({ postId, setCommentsCount }) {
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);
  const [page, setPage] = useState(1);
  const [errMsg, setErrMsg] = useState("");
  const errRef = useRef();
  const effectRan = useRef(false);

  const [commentsResponse, commentsError, commentsLoading, commentsAxiosFetch] = useAxiosFetchFunction();
  const [createCommRes, createCommErr, createCommLoad, createCommAxiosFetch] = useAxiosFetchFunction();

  useEffect(() => {
    if (effectRan.current === true) {
      getCommentsByPost(commentsAxiosFetch, postId, page);
      if (commentsError) {
        setErrMsg(commentsError);
      } else {
        setErrMsg("");
      }
    }
    return () => {
      effectRan.current = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (/* effectRan.current === true && */ commentsResponse) {
      setComments((prev) => [...prev, ...commentsResponse.items])
      // setComments(commentsResponse.items);
      setPage(commentsResponse.nextPage)
    }
    /* return () => {
      effectRan.current = true;
    }; */
  }, [commentsResponse]);

  useEffect(() => {
    // if (createCommRes.length > 0 || Object.keys(createCommRes).length !== 0) {
    if (createCommRes) {
      if (!comments) {
        setComments([createCommRes]);
      } else {
        setComments((prev) => [createCommRes, ...prev]);
      } 
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createCommRes]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!commentText) {
      setErrMsg("Merci d'inclure du texte dans votre commentaire");
    }
    createComment(createCommAxiosFetch, postId, commentText);
    // if (createCommLoad} { tost.load("loading")}
    setCommentsCount((prev) => prev + 1);
    toast.success("Nouveau commentaire crée !");
    setCommentText("");
    if (createCommErr) {
      setErrMsg(createCommErr);
    } 
  };

  const handleDelete = (commentId) => {
    if (comments.length === 1) {
      setCommentsCount(0);
      setComments(undefined); // valeur de comments et commentsResponse.items si vide = undefined
    } else {
      setCommentsCount((prev) => prev - 1);
      setComments(comments.filter((comm) => comm.id !== commentId));
    }
  };

  const handleUpdate = (commentId, content) => {
    setComments(
      comments.map((comment) => {
        if (comment.id === commentId) {
          return { ...comment, content };
        }
        return comment;
      })
    );
  };

  const handleCharge = () => {
    getCommentsByPost(commentsAxiosFetch, postId, page);
    // setComments((prev) => [...prev, ...commentsResponse.items]);
  }

  return (
    <>
      <div className="formContainer addComment">
        <p
          ref={errRef}
          className={errMsg ? "errMsg" : "offscreen"}
          aria-live="assertive"
        >
          {errMsg}
        </p>
        <form className="formItems commentForm" onSubmit={handleSubmit}>
          <FaUserCircle className="userIcon" />
          <TextareaAutosize
            autoComplete="off"
            className="content"
            value={commentText}
            placeholder="Ajoutez un commentaire"
            required
            onChange={(e) => setCommentText(e.target.value)}
          />
          <button type="submit" className="sendCommentBtn">
            <FaPaperPlane fill="grey" />
          </button>
        </form>
      </div>
      {(commentsLoading || createCommLoad) && <p>Loading ...</p>}
      {!commentsLoading && !createCommLoad && !commentsError && !createCommErr && comments?.length && (
          <div
            className=" formContainer commentsContainer"
            id="commentsContainer"
          >
            {comments.map((comment) => (
              <Comment comment={comment} key={comment.id} onDelete={handleDelete} onUpdate={handleUpdate} />
            ))}
          {page > 1 && <button className="linkBtn" type="button" onClick={handleCharge}>Afficher plus de commentaires</button>}
          
          </div>
        )}
    </>
  );
}

CommentsFeed.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  postId: PropTypes.number.isRequired,
  setCommentsCount: PropTypes.func.isRequired,
};

/* CommentsFeed.defaultProps = {
  commentsTotal: 0,
}; */

export default CommentsFeed;
