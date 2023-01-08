import { useState, useRef, useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import axios from "../../api/axios";
import "./createpost.scss";

export default function CreatePost() {
  const { auth } = useAuth();
  const [postText, setPostText] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const errRef = useRef();
  const fileInput = useRef(); // or null ?

  useEffect(() => {
    setErrMsg("");
  }, [postText, imageUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!postText) {
      setErrMsg("Merci d'inclure du texte dans votre post");
    } else if (auth.token) {
      try {
        const data = new FormData();
        data.append("content", postText);
        if (imageUrl) {
          // imageUrl = used for useState / "image" = name used in multer => module.exports = multer({ storage }).single('image');
          data.append("image", imageUrl);
        }
        await axios.post("/api/posts", data, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${auth.token}`,
          },
        });
        setPostText("");
        setImageUrl("");
      } catch (err) {
        if (!err?.response || err.response.status === 500) {
          setErrMsg("Erreur interne du serveur");
        } else if (err.response.status === 401) {
          setErrMsg("Erreur de saisie, vérifiez tous les champs requis");
        } else {
          setErrMsg("Le post n'a pas pu être créé, merci de réessayer");
        }
      }
    } else {
      setErrMsg("Problème d'autorisation, veuillez réessayer svp!");
    }
  };

  return (
    <article className="formContainer createPostForm">
      <h2>Exprimez-vous...</h2>
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
          onChange={(e) => setImageUrl(e.target.files[0])}
          accept="image/jpg, image/jpeg, image/png"
          ref={fileInput}
        />
        <div className="btnsContainer">
          <button
            type="button"
            id="addImgBtn"
            disabled={!postText}
            className={!postText ? "addImgDisabled" : "notDisabled"}
            onClick={() => fileInput.current.click()}
          >
            Ajouter une image
          </button>
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
