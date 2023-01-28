/* eslint-disable react-hooks/exhaustive-deps */
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
  const [comments, setComments] = useState(undefined); 
  const [page, setPage] = useState(1);
  const [errMsg, setErrMsg] = useState("");
  const errRef = useRef();
  const focusRef = useRef();
  const effectRan = useRef(false);

  const [commentsResponse, commentsError, commentsLoading, commentsAxiosFetch] = useAxiosFetchFunction();
  const [createCommRes, createCommErr, createCommLoad, createCommAxiosFetch] = useAxiosFetchFunction();

  useEffect(() => {
    focusRef.current.focus();
    if (effectRan.current === true) {
    /* let ignore = false;
    if (!ignore) { */
      getCommentsByPost(commentsAxiosFetch, postId, page);
      if (commentsError) {
        setErrMsg(commentsError);
      } else {
        setErrMsg("");
      }
    }
    // return () => { ignore = true };
    return () => {
      effectRan.current = true;
    };
  }, []);

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    // let ignore = false;
    // if (!ignore && commentsResponse !==null && !commentsResponse.message) {
    if (effectRan.current === true && commentsResponse !== null && !commentsResponse.message) {
      if (!comments) {
        setComments(commentsResponse.items);
      } else {
        setComments((prev) => [...prev, ...commentsResponse.items])
      }
      setPage(commentsResponse.nextPage);
    }
    // return () => { ignore = true };
    return () => {
      effectRan.current = true;
    };
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
  }, [createCommRes]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!commentText) {
      setErrMsg("Merci d'inclure du texte dans votre commentaire");
    }
    createComment(createCommAxiosFetch, postId, commentText);
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
    toast.success("Commentaire supprimé !");
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
    toast.success("Commentaire modifié");
  };

  const handleCharge = () => {
    getCommentsByPost(commentsAxiosFetch, postId, page);
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
            ref={focusRef}
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
      {(commentsLoading || createCommLoad) && <p className="loading">Chargement en cours ...</p>}
      
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

export default CommentsFeed;
