/* eslint-disable jsx-a11y/img-redundant-alt */
import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import { FaInfoCircle } from "react-icons/fa";
import TextareaAutosize from "react-textarea-autosize";
import useAxiosFetchFunction from "../../hooks/useAxiosFetchFunction";
import useAuth from "../../hooks/useAuth";
import { updatePost } from "../../api/calls/postcalls";
import "./modifypostform.scss";

// eslint-disable-next-line prettier/prettier
function ModifyPostForm({ content, setContent, imageUrl, setImageUrl, postUserId, postId, onUpdate, onClose }) {
  const { auth } = useAuth();
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
    // if (response.length > 0 || Object.keys(response).length !== 0) {
    if (response) {
      onUpdate(response, postId);
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response]);

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
    // if (response) {
    toast.success("Le post a été modifié !");
    // cleanup
    setContent("");
    setImageUrl("");
    setErrMsg("");
    setDeleteImage(false);
    /* } else  */ if (loading) {
      toast.loading("Chargement en cours...");
    } else if (fetchError) {
      setErrMsg(fetchError);
    }
    setErrMsg("");
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
            <img src={imageUrl} alt="relative à ce post" />
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
                Supprimer l'image
              </button>
              <button
                type="submit"
                id="updateBtn"
                className={!content ? "disabled" : "notDisabled"}
                disabled={!content}
              >
                Enregistrer les modifications
              </button>
            </div>
          </div>
        )}
        {!imageUrl && (
          <div className="btnsContainer">
            <input
              type="file"
              id="fileInput"
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
              Ajouter une image
            </button>
            <button
              type="submit"
              id="updateBtn"
              className={!content ? "disabled" : "notDisabled"}
              disabled={!content}
            >
              Enregistrer les modifications
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
                Supprimer l'image
              </button>
              <button
                type="submit"
                id="updateBtn"
                className={!content ? "disabled" : "notDisabled"}
                disabled={!content}
              >
                Enregistrer les modifications
              </button>
            </div>
          </>
        )}
        <div className="undoContainer">
          <FaInfoCircle className="infoIcon" />
          <p className="undoChanges">
            Cliquez à nouveau sur "Modifier" pour annuler les modifications !
          </p>
        </div>
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
  // setImageUrl: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
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
