/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/label-has-associated-control */
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
  const [emailFocus, setEmailFocus] = useState("");
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
    if (response) {
      setEmail("");
      setPassword("");
      setAuth({ token: response?.token, userId: response?.userId, isAdmin: response?.isAdmin });
      navigate(from, { replace: true });
    } else if (fetchError) {
      setErrMsg(fetchError);
      errRef.current.focus();
    }
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
    await loginUser(axiosFetch, email, password);
    setShowPwd(false);
    setErrMsg(fetchError);
  };

  return (
    <article className="formContainer">
      <h1>Connexion</h1>
      <form className="formItems loginForm" onSubmit={handleSubmit}>
        <p
          ref={errRef}
          className={errMsg ? "errMsg" : "offscreen"}
          aria-live="assertive"
        >
          {errMsg}
        </p>
        {loading && <p>Chargement en cours ...</p>}

        <div className="labelAndInputContainer">
          <label htmlFor="email"> Email :</label>
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
        </div>

        <div className="labelAndInputContainer">
          <label htmlFor="password">Mot de passe :</label>
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
        </div>
        
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
