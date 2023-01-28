/* eslint-disable prettier/prettier */
/* eslint-disable jsx-a11y/img-redundant-alt */
import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import { FaImage, FaInfoCircle, FaPaperPlane } from "react-icons/fa";
import { MdImageNotSupported } from "react-icons/md";
import TextareaAutosize from "react-textarea-autosize";
import useAxiosFetchFunction from "../../hooks/useAxiosFetchFunction";
import useAuth from "../../hooks/useAuth";
import useWindowSize from "../../hooks/useWindowSize";
import { updatePost } from "../../api/calls/postcalls";
import "./modifypostform.scss";

function ModifyPostForm({ content, setContent, imageUrl, setImageUrl, postUserId, postId, onUpdate, onClose }) {
  const { auth } = useAuth();
  const { width } = useWindowSize();
  const fileInput = useRef(null);
  const [errMsg, setErrMsg] = useState("");
  const [updatedImage, setUpdatedImage] = useState(false);
  const [deleteImage, setDeleteImage] = useState(false);
  const errRef = useRef();
  const focusRef = useRef();

  const [response, fetchError, loading, axiosFetch] = useAxiosFetchFunction();

  useEffect(() => {
    focusRef.current.focus();
  }, []);

  useEffect(() => {
    let ignore = false;
    if (response && !ignore) {
      onUpdate(response, postId);
      onClose();
      toast.success("Le post a été modifié !");
      setContent("");
      setImageUrl("");
      setDeleteImage(false);
    } else if (fetchError && !ignore) {
      setErrMsg(fetchError);
    }
    setErrMsg("");
    return () => {
      ignore = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response, fetchError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content) {
      setErrMsg("Merci d'inclure du texte dans votre post");
    } else if (auth.userId === postUserId || auth.isAdmin) {
      const data = new FormData();
      data.append("content", content);
      if (imageUrl && updatedImage) {
        data.append("image", imageUrl);
      }
      if (deleteImage && !updatedImage) {
        data.append("currentImage", "none");
      }
      updatePost(axiosFetch, postId, data);
    }
  };

  return (
    <article className="modifyPostPopup formContainer createPostForm">
      <form
        className="formItems"
        encType="multipart/form-data"
        onSubmit={handleSubmit}
      >
        <p
          ref={errRef}
          className={errMsg ? "errMsg" : "offscreen"}
          aria-live="assertive"
        >
          {errMsg}
        </p>
        {loading && <p>Chargement en cours...</p>}

        <TextareaAutosize
          ref={focusRef}
          autoComplete="off"
          className="content"
          value={content}
          required
          onChange={(e) => setContent(e.target.value)}
        />
        {imageUrl && !updatedImage && (
          <div>
            <img className="postImg" src={imageUrl} alt="relative à ce post" loading="lazy"/>
            <div className="btnsContainer">
              <button
                type="button"
                id={imageUrl ? "imgBtn" : "hide"}
                onClick={() => {
                  setImageUrl("");
                  setUpdatedImage(false);
                  setDeleteImage(true);
                }}
              >
                {width > 768 ? (
                  "Supprimer l'image"
                ) : (
                  <MdImageNotSupported title="Supprimer l'image" />
                )}
              </button>
              <button
                type="submit"
                id="updateBtn"
                className={!content ? "disabled" : "notDisabled"}
                disabled={!content}
              >
                {width > 768 ? (
                  "Enregistrer"
                ) : (
                  <FaPaperPlane title="Enregistrer" />
                )}
              </button>
            </div>
          </div>
        )}
        {!imageUrl && (
          <div className="btnsContainer">
            <input
              type="file"
              className="hide"
              name="imageUrl"
              accept="image/jpg, image/jpeg, image/png"
              ref={fileInput}
              onChange={(e) => {
                setImageUrl(e.target.files[0]);
                setUpdatedImage(true);
                e.target.value = null; // need to empty out value in fileinput in case you wanna re-add the same
                // imageUrl will still hold the file as you would want to !
              }}
            />
            <button
              type="button"
              id={imageUrl ? "hide" : "imgBtn"}
              disabled={imageUrl}
              className={imageUrl ? "addImgDisabled" : "notDisabled"}
              onClick={() => {
                fileInput.current.click();
                setUpdatedImage(true);
              }}
            >
              {width > 768 ? (
                "Ajouter une image"
              ) : (
                <FaImage title="Ajouter une image" />
              )}
            </button>
            <button
              type="submit"
              id="updateBtn"
              className={!content ? "disabled" : "notDisabled"}
              disabled={!content}
            >
              {width > 768 ? (
                "Enregistrer"
              ) : (
                <FaPaperPlane title="Enregistrer" />
              )}
            </button>
          </div>
        )}
        {imageUrl && updatedImage && (
          <>
            <div className="previewImgContainer">
              <img
                className="previewImg"
                src={URL.createObjectURL(imageUrl)}
                alt="aperçu de l'image du post"
                title={imageUrl.name}
                loading="lazy"
              />
            </div>
            <div className="btnsContainer">
              <button
                type="button"
                id={imageUrl ? "imgBtn" : "hide"}
                onClick={() => {
                  setImageUrl("");
                  setUpdatedImage(true);
                }}
              >
                {width > 768 ? (
                  "Supprimer l'image"
                ) : (
                  <MdImageNotSupported title="Supprimer l'image" />
                )}
              </button>
              <button
                type="submit"
                id="updateBtn"
                className={!content ? "disabled" : "notDisabled"}
                disabled={!content}
              >
                {width > 768 ? (
                  "Enregistrer"
                ) : (
                  <FaPaperPlane title="Enregistrer" />
                )}
              </button>
            </div>
          </>
        )}
        <p className="undoChanges">
          <FaInfoCircle className="infoIcon" />
          Cliquez à nouveau sur "Modifier" pour annuler les modifications !
        </p>
      </form>
    </article>
  );
}

ModifyPostForm.propTypes = {
  content: PropTypes.string.isRequired,
  setContent: PropTypes.func.isRequired,
  imageUrl: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  // eslint-disable-next-line react/forbid-prop-types
  setImageUrl: PropTypes.any,
  postUserId: PropTypes.number.isRequired,
  postId: PropTypes.number.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

ModifyPostForm.defaultProps = {
  imageUrl: "",
  setImageUrl: "",
};

export default ModifyPostForm;
