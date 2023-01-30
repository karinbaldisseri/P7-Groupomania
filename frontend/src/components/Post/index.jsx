/* eslint-disable react-hooks/exhaustive-deps */
import { FaUserCircle, FaEllipsisH, FaPen, FaTrashAlt } from "react-icons/fa";
import moment from "moment/min/moment-with-locales";
import { useState, useRef, useEffect } from "react";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import useAxiosFetchFunction from "../../hooks/useAxiosFetchFunction";
import useWindowSize from "../../hooks/useWindowSize";
import useAuth from "../../hooks/useAuth";
import Likes from "../likes";
import ModifyPostForm from "../modifypostform";
import "./post.scss";
import { deletePost } from "../../api/calls/postcalls";

moment.locale("fr");

function Post({ post, onDelete, onUpdate }) {
  const { width } = useWindowSize();
  const { auth } = useAuth();
  const [open, setOpen] = useState(false);
  const [trigger, setTrigger] = useState(false);
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const errRef = useRef();

  const [response, fetchError, loading, axiosFetch] = useAxiosFetchFunction();

  useEffect(() => {
    setContent(post.content);
    setImageUrl(post.imageUrl);
  }, [post.content, post.imageUrl]);

  useEffect(() => {
    let ignore = false;
    if (response && !ignore) {
      toast.success("Post supprimé !");
      onDelete(post.id);
      setOpen(!open);
    } else if (fetchError && !ignore) {
      setErrMsg(fetchError);
      errRef.current.focus();
    }
    setErrMsg("");
    return () => {
      ignore = true;
    };
  }, [response, fetchError]);

  const handleDelete = async () => {
    if (post.userId === auth.userId || auth.isAdmin) {
      await deletePost(axiosFetch, post.id);
    }
  };

  const confirmDelete = () => {
    confirmAlert({
      title: "Confirmation :",
      message:
        "Êtes-vous sûr de vouloir supprimer ce post ? Cette action est irréversible !",
      buttons: [
        { label: "Confirmer", onClick: () => handleDelete() },
        { label: "Annuler", onClick: () => setOpen(!open) },
      ],
    });
  };

  const handleClose = () => {
    setOpen(false);
    setTrigger(false);
  };

  const handleToggleTrigger = () => {
    setTrigger(!trigger);
    setContent(post.content);
    setImageUrl(post.imageUrl);
    if (trigger) {
      setOpen(false);
    }
  };

  return (
    <article key={post.id} className="postContainer">
      <p
        ref={errRef}
        className={errMsg ? "errMsg" : "offscreen"}
        aria-live="assertive"
      >
        {errMsg}
      </p>
      {loading && <p className="loading">Chargement en cours...</p>}

      <div
        className={
          // eslint-disable-next-line no-nested-ternary
          post.imageUrl ? undefined : !trigger ? "borderBottom" : undefined
        }
      >
        <div className="postHeader">
          <div className="userInfoContainer">
            <FaUserCircle fill="lightgrey" className="userIcon" />
            <div>
              <p className="userName">{post.user.username}</p>
              <p className="time">{moment(post.createdAt).fromNow()}</p>
            </div>
          </div>
          <FaEllipsisH
            fill="grey"
            className={
              auth.userId === post.userId || auth.isAdmin ? "dotsIcon" : "hide"
            }
            title="Actions : cliquez pour montrer ou cacher "
            onClick={() => {
              setOpen(!open);
            }}
          />
          {open && (
            <div className="dropDownMenu">
              <button type="button" onClick={handleToggleTrigger}>
                <FaPen fill="grey" className="dropDownIcon" />
                {width > 768 ? "Modifier" : ""}
              </button>
              <button type="button" onClick={confirmDelete}>
                <FaTrashAlt fill="grey" className="dropDownIcon" />
                {width > 768 ? "Supprimer" : ""}
              </button>
            </div>
          )}
        </div>
        {trigger && (
          <ModifyPostForm
            imageUrl={imageUrl}
            content={content}
            setImageUrl={setImageUrl}
            setContent={setContent}
            postUserId={post.userId}
            postId={post.id}
            onUpdate={onUpdate}
            onClose={handleClose}
          />
        )}
        {!trigger && !post.imageUrl && (
          <p className="content">{post.content}</p>
        )}
        {!trigger && post.imageUrl && (
          <>
            <p className="content">{post.content}</p>
            <img
              className="postImg"
              src={post.imageUrl}
              alt="relative à ce post"
              loading="lazy"
            />
          </>
        )}
      </div>
      {!trigger && <Likes postId={post.id} />}
    </article>
  );
}
// )

Post.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  post: PropTypes.any,
  onDelete: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
};

Post.defaultProps = {
  post: {},
};

export default Post;
