/* eslint-disable prettier/prettier */
import { useState, useEffect, useRef } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import useAxiosFetchFunction from "../../hooks/useAxiosFetchFunction";
import { loginUser } from "../../api/calls/usercalls";
import useAuth from "../../hooks/useAuth";
import "../signupform/forms.scss";
import "./loginform.scss";

function LoginForm() {
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/postswall"; // get where the user came from
  const focusRef = useRef();
  const errRef = useRef();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [emailFocus, setEmailFocus] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [pwdFocus, setPwdFocus] = useState("");
  const [showPwd, setShowPwd] = useState(false);

  const [response, fetchError, loading, axiosFetch] = useAxiosFetchFunction();

  useEffect(() => {
    focusRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [email, password]);

  useEffect(() => {
    let ignore = false;
    if (response && !ignore) {
      setEmail("");
      setPassword("");
      setAuth({ token: response?.token, userId: response?.userId, isAdmin: response?.isAdmin });
      navigate(from, { replace: true });
    } else if (fetchError && !ignore) {
      setErrMsg(fetchError);
      errRef.current.focus();
    }
    return () => { ignore = true };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response, fetchError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrMsg(
        "Saisie incorrecte, veuillez vérifier l'email et le mot de passe saisi."
      );
      return;
    }
    loginUser(axiosFetch, email, password);
    /* setAuth({ token: response?.token, userId: response?.userId, isAdmin: response?.isAdmin });
    navigate(from, { replace: true }); */
  };

  /* const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrMsg(
        "Saisie incorrecte, veuillez vérifier l'email et le mot de passe saisi."
      );
      return;
    }
    try {
      const response = await axios.post(
        "/api/auth/login",
        JSON.stringify({ email, password }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      const token = response?.data?.token;
      const userId = response?.data?.userId;
      const isAdmin = response?.data?.isAdmin;
      setAuth({ token, userId, isAdmin });
      // clear input fields (need value attributes in inputs for this)
      setEmail("");
      setPassword("");
      // redirect to login
      navigate(from, { replace: true });
    } catch (err) {
      // (err?.response) = chainage optionnel (dans l'éventualité d'une référence manquante)
      if (!err?.response || err.response.status === 500) {
        setErrMsg("Erreur interne du serveur");
      } else if (err.response.status === 400 || err.response?.status === 401) {
        setErrMsg("Erreur de saisie, veuillez vérifier les champs requis");
      } else if (err.response.status === 403) {
        setErrMsg("Compte désactivé, merci de contacter votre administrateur");
      } else {
        setErrMsg("Désolé, la connexion n'a pas pu aboutir");
      }
      errRef.current.focus();
    }
  }; */

  return (
    <article className="formContainer">
      <h1>Connexion</h1>
      <form className="formItems loginForm" onSubmit={handleSubmit}>
        <p
          ref={errRef}
          className={errMsg ? "errMsg" : "offscreen"}
          aria-live="assertive" // if focus on this ref element, it will be announced with the screen reader
        >
          {errMsg}
        </p>
        {loading && <p>Chargement en cours ...</p>}

        <label htmlFor="email">
          Email :
          <input
            type="email"
            id="email"
            ref={focusRef}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Votre email professionnel"
            required
            onFocus={() => setEmailFocus(true)}
            onBlur={() => setEmailFocus(false)}
          />
        </label>

        <label htmlFor="password">
          Mot de passe :
          <div className="pwdContainer">
          <input
            type={showPwd ? "text" : "password"}
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Votre mot de passe"
            required
            onFocus={() => setPwdFocus(true)}
            onBlur={() => setPwdFocus(false)}
            />
            <button type="button" className="showPwd" onClick={() => setShowPwd(!showPwd)}>
              {!showPwd ? <FaEye /> : <FaEyeSlash />}
            </button>
          </div>

        </label>

        <p className="required">* Tous les champs sont requis</p>
        <button
          type="submit"
          disabled={!email || !password}
          className={!email || !password ? "disabled" : "notDisabled"}
        >
          Me connecter
        </button>
      </form>
      <NavLink className="link" to="/signup">
        Pas encore de compte ? M'inscrire
      </NavLink>
    </article>
  );
}

export default LoginForm;
