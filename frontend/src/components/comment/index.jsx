/* eslint-disable prettier/prettier */
import { FaUserCircle, FaPen, FaTrashAlt, FaTimes, FaCheck } from "react-icons/fa";
import moment from "moment/min/moment-with-locales";
import { useState, useRef, useEffect } from "react";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import PropTypes from "prop-types";
import TextareaAutosize from "react-textarea-autosize";
import useAxiosFetchFunction from "../../hooks/useAxiosFetchFunction";
import useAuth from "../../hooks/useAuth";
import { updateComment, deleteComment } from "../../api/calls/commentcalls";

moment.locale("fr");

function Comment({ comment, onDelete, onUpdate }) {
  const { auth } = useAuth();
  const [trigger, setTrigger] = useState(false);
  const [content, setContent] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const errRef = useRef();
  const focusRef = useRef();

  const [updateCommRes, updateCommErr, updateCommLoad, updateCommAxiosFetch] = useAxiosFetchFunction();
  const [deleteCommRes, deleteCommErr, deleteCommLoad, deleteCommAxiosFetch] = useAxiosFetchFunction();

  useEffect(() => {
    setContent(comment.content);
  }, [comment.content, trigger]);

  useEffect(() => {
    if (trigger) {
      focusRef.current.focus();
    }
  }, [trigger]);

  useEffect(() => {
    setErrMsg("");
  }, [trigger, content]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content) {
      setErrMsg("Merci d'inclure du texte");
    } else if (auth.userId === comment.userId || auth.isAdmin) {
      updateComment(updateCommAxiosFetch, comment.postId, comment.id, content);
      onUpdate(comment.id, content);
      if (updateCommErr && !updateCommRes) {
        setErrMsg(updateCommErr);
      }
      setTrigger(false);
    }
    setErrMsg("");
  };

  const handleDelete = () => {
    if (auth.userId === comment.userId || auth.isAdmin) {
      deleteComment(deleteCommAxiosFetch, comment.postId, comment.id);
      onDelete(comment.id);
      if (deleteCommErr && !deleteCommRes) {
        setErrMsg(deleteCommErr);
      }
      setTrigger(false);
    }
  };

  const confirmDelete = () => {
    confirmAlert({
      title: "Confirmation :",
      message:
        "Êtes-vous sûr de vouloir supprimer ce commentaire ? Cette action est irréversible !",
      buttons: [
        {
          label: "Confirmer",
          onClick: () => handleDelete(),
        },
        {
          label: "Annuler",
        },
      ],
    });
  };

  return (
    <>
      {updateCommLoad || (deleteCommLoad && <p>Chargement en cours ...</p>)}
      <p
        ref={errRef}
        className={errMsg ? "errMsg" : "offscreen"}
        aria-live="assertive"
      >
        {errMsg}
      </p>
      <form
        className="formItems commentForm"
        onSubmit={handleSubmit}
      >
        <FaUserCircle className="userIcon" />
        {!trigger && (
          <>
            <div className="commentContent">
              <p className="username">{comment.user.username} <span className="time">- {moment(comment.createdAt).fromNow()}</span></p>
              <p>{comment.content}</p>
            </div>
            <div
              className={
                auth.userId === comment.userId || auth.isAdmin
                  ? "menuIcons"
                  : "hide"
              }
            >
              <button
                type="button"
                className={
                  auth.userId === comment.userId || auth.isAdmin
                    ? "sendCommentBtn"
                    : "sendCommentBtn disabled"
                }
                title="Modifier le commentaire"
                disabled={
                  // eslint-disable-next-line no-unneeded-ternary
                  auth.userId === comment.userId || auth.isAdmin ? false : true
                }
                onClick={() => {
                  setTrigger(true);
                }}
              >
                <FaPen fill="grey" />
              </button>
              <button
                type="button"
                className={
                  auth.userId === comment.userId || auth.isAdmin
                    ? "sendCommentBtn"
                    : "sendCommentBtn disabled"
                }
                title="Supprimer le commentaire"
                disabled={
                  // eslint-disable-next-line no-unneeded-ternary
                  auth.userId === comment.userId || auth.isAdmin ? false : true
                }
                onClick={confirmDelete}
              >
                <FaTrashAlt fill="grey" />
              </button>
            </div>
          </>
        )}
        {trigger && (
          <>
            <TextareaAutosize
              ref={focusRef}
              autoComplete="off"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <button
              type="submit"
              className={
                !content ? "sendCommentBtn disabled" : "sendCommentBtn"
              }
              title="Enregistrer les modifications"
            >
              <FaCheck fill="grey" />
            </button>
            <button
              type="button"
              className="sendCommentBtn"
              title="Annuler"
              onClick={() => setTrigger(false)}
            >
              <FaTimes fill="grey" />
            </button>
          </>
        )}
      </form>
    </>
  );
}

Comment.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  comment: PropTypes.any.isRequired,
  onDelete: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default Comment;
