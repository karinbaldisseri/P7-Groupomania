/* eslint-disable jsx-a11y/img-redundant-alt */
import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import { FaTimes, FaUserCircle } from "react-icons/fa";
import useAxiosFetchFunction from "../../hooks/useAxiosFetchFunction";
import { getOneUser } from "../../api/calls/usercalls";
import { createPost } from "../../api/calls/postcalls";
import "./createpostform.scss";

function CreatePostForm({ onCreate }) {
  const [postText, setPostText] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const [errMsg, setErrMsg] = useState("");
  const errRef = useRef();
  const fileInput = useRef(null);

  const [response, fetchError, loading, axiosFetch] = useAxiosFetchFunction();
  const [userRes, userErr, userLoad, userAxiosFetch] = useAxiosFetchFunction();

  useEffect(() => {
    setErrMsg("");
  }, [postText, imageUrl]);

  useEffect(() => {
    getOneUser(userAxiosFetch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (
      response &&
      (response.length > 0 || Object.keys(response).length !== 0)
    ) {
      onCreate(response);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!postText) {
      setErrMsg("Merci d'inclure du texte dans votre post");
    }
    const postData = new FormData();
    postData.append("content", postText);
    if (imageUrl) {
      // imageUrl = used for useState / "image" = name used in multer => module.exports = multer({ storage }).single('image');
      postData.append("image", imageUrl);
    }
    createPost(axiosFetch, postData);
    if (fetchError) {
      setErrMsg(fetchError);
    } else if (loading) {
      toast.info("Chargement en cours...");
    } else if (response) {
      toast.success("Nouveau post crée !");
    }
    setPostText("");
    setImageUrl("");
  };

  return (
    <article className="formContainer createPostForm">
      <div className="createPostHeader">
        <FaUserCircle fill="lightgrey" className="userIcon" />
        {!userLoad && !userErr && userRes?.firstname && (
          <h2>{userRes?.firstname}, exprimez-vous...</h2>
        )}
        {userErr || (!userRes?.firstname && <h2>Exprimez-vous...</h2>)}
      </div>
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
        <input
          type="text"
          autoComplete="off"
          value={postText}
          onChange={(e) => setPostText(e.target.value)}
          required
          placeholder="Quoi de neuf aujourd'hui ?"
        />
        <input
          type="file"
          id="fileInput"
          name="imageUrl"
          onChange={(e) => {
            setImageUrl(e.target.files[0]);
            e.target.value = null; // need to empty out value in fileinput in case you wanna re-add the same
            // imageUrl will still hold the file as you would want to !
          }}
          accept="image/jpg, image/jpeg, image/png"
          ref={fileInput}
        />
        <div className="btnsContainer">
          <button
            type="button"
            id={imageUrl ? "hide" : "imgBtn"}
            disabled={!postText}
            className={!postText ? "addImgDisabled" : "notDisabled"}
            onClick={() => fileInput.current.click()}
          >
            Ajouter une image
          </button>
          {imageUrl && (
            <div className="previewImgContainer">
              <img
                className="previewImg"
                src={URL.createObjectURL(imageUrl)}
                alt="aperçu de l'image du post"
                title={imageUrl.name}
              />
              <FaTimes
                className="deleteImgUrl"
                title="Supprimer l'image"
                onClick={() => setImageUrl("")}
              />
            </div>
          )}
          <button
            type="submit"
            disabled={!postText}
            className={!postText ? "disabled" : "notDisabled"}
          >
            Poster
          </button>
        </div>
      </form>
    </article>
  );
}

CreatePostForm.propTypes = {
  onCreate: PropTypes.func.isRequired,
};

export default CreatePostForm;
