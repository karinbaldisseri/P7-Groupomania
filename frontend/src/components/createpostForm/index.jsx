/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/img-redundant-alt */
import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import { FaTimes, FaUserCircle, FaPaperPlane, FaImage } from "react-icons/fa";
import TextareaAutosize from "react-textarea-autosize";
import useAxiosFetchFunction from "../../hooks/useAxiosFetchFunction";
import useWindowSize from "../../hooks/useWindowSize";
import { getOneUser } from "../../api/calls/usercalls";
import { createPost } from "../../api/calls/postcalls";
import "./createpostform.scss";

function CreatePostForm({ onCreate }) {
  const { width } = useWindowSize();
  const [postText, setPostText] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const [errMsg, setErrMsg] = useState("");
  const errRef = useRef();
  const fileInput = useRef(null);
  const effectRan = useRef(false);

  const [response, fetchError, loading, axiosFetch] = useAxiosFetchFunction();
  const [userRes, userErr, userLoad, userAxiosFetch] = useAxiosFetchFunction();

  useEffect(() => {
    setErrMsg("");
  }, [postText, imageUrl]);

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (effectRan.current === false) {
      const fetchData = async () => {
        await getOneUser(userAxiosFetch);
      };
      fetchData();
      if (userErr) {
        setErrMsg(userErr);
      }
      return () => {
        effectRan.current = true;
      };
    }
  }, []);

  useEffect(() => {
    if (
      response &&
      (response.length > 0 || Object.keys(response).length !== 0)
    ) {
      onCreate(response);
    }
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
    await createPost(axiosFetch, postData);
    if (fetchError) {
      setErrMsg(fetchError);
    } else if (response) {
      toast.success("Nouveau post crée !");
    }
    setPostText("");
    setImageUrl("");
  };

  return (
    <article className="formContainer createPostForm">
      {userLoad || (loading && <p>Chargement en cours...</p>)}
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

        <TextareaAutosize
          autoComplete="off"
          value={postText}
          placeholder="Quoi de neuf aujourd'hui ?"
          required
          onChange={(e) => setPostText(e.target.value)}
        />

        <input
          type="file"
          className="hide"
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
            className={!postText ? "disabled" : "notDisabled"}
            disabled={!postText}
            onClick={() => fileInput.current.click()}
          >
            {width > 768 ? (
              "Ajouter une image"
            ) : (
              <FaImage title="Ajouter une image" />
            )}
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
            {width > 768 ? (
              "Poster"
            ) : (
              <FaPaperPlane title="Poster le message" />
            )}
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
