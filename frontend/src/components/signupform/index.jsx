/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaCheck, FaInfoCircle, FaTimes, FaEyeSlash, FaEye } from "react-icons/fa";
import { toast } from "react-toastify";
import InputField from "../InputField";
import useAxiosFetchFunction from "../../hooks/useAxiosFetchFunction";
import useWindowSize from "../../hooks/useWindowSize";
import { createUser } from "../../api/calls/usercalls";
import "./forms.scss";

export default function SignupForm() {
  const { width } = useWindowSize();
  const navigate = useNavigate();
  const errRef = useRef();
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);

  const [inputs, setInputs] = useState({ firstname: "", lastname: "", email: "", password: "", confirmPwd: "" });
  const [validInputs, setValidInputs] = useState({ firstname: false, lastname: false, email: false, password: false });

  const { firstname, lastname, email, password, confirmPwd } = inputs;
  const validFirstname = validInputs.firstname;
  const validLastname = validInputs.lastname;
  const validEmail = validInputs.email;
  const validPassword = validInputs.password;

   const [pwdFocus, setPwdFocus] = useState(false);
  const [confirmPwdFocus, setConfirmPwdFocus] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const nameRegExp = /^[a-zA-Zçéèêëàâîïôùû' -]{2,25}$/;
  const emailRegExp = /^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$/;
  const passwordRegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,24}$/;

  const [response, fetchError, loading, axiosFetch] = useAxiosFetchFunction();

  useEffect(() => {
    setErrMsg("");
  }, [firstname, lastname, email, password, confirmPwd]);

  useEffect(() => {
    let ignore = false;
    if (response && !ignore) {
      toast.success("Nouveau compte crée !");
      setInputs({ firstname: "", lastname: "", email: "", password: "", confirmPwd: "" });
      setValidInputs({ firstname: false, lastname: false, email: false, password: false });
    }
    return () => {
      ignore = true;
    };
  }, [response]);

  useEffect(() => {
    let ignore = false;
    if (fetchError && !ignore) {
      setErrMsg(fetchError);
      errRef.current.focus();
    }
    return () => {
      ignore = true;
    };
  }, [fetchError]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // security in case button is enabled with JS hack
    if (
      !validFirstname ||
      !validLastname ||
      !validEmail ||
      !validPassword ||
      !e.target.reportValidity()
    ) {
      setErrMsg(
        "Saisie incorrecte, veuillez vérifier les différents champs nécessaires"
      );
      return;
    }
    createUser(axiosFetch, firstname, lastname, email, password);
    setShowPwd(false);
    setShowConfirmPwd(false);
    // redirect to login after toast shown
    setTimeout(() => { navigate("/signup") }, 1000);
  };

  return (
    <article className="formContainer">
      <h1>Inscription</h1>
      <form className="formItems" onSubmit={handleSubmit}>
        <p
          ref={errRef}
          className={errMsg ? "errMsg" : "offscreen"}
          aria-live="assertive" // if focus on this ref element, it will be announced with the screen reader
        >
          {errMsg}
        </p>
        {loading && <p>Chargement en cours ...</p>}

        <InputField
          type="text"
          name="firstname"
          label="Prénom :"
          placeholder="Votre prénom"
          regExp={nameRegExp}
          inputDescription="2 à 25 caractères (sans chiffres ni caractères spéciaux"
          inputs={inputs}
          setInputs={setInputs}
          validInputs={validInputs}
          setValidInputs={setValidInputs}
        />

        <InputField
          type="text"
          name="lastname"
          label="Nom :"
          placeholder="Votre nom"
          regExp={nameRegExp}
          inputDescription="2 à 25 caractères (sans chiffres ni caractères spéciaux"
          inputs={inputs}
          setInputs={setInputs}
          validInputs={validInputs}
          setValidInputs={setValidInputs}
        />

        <InputField
          type="email"
          name="email"
          label="Email :"
          placeholder="Votre email professionnel"
          regExp={emailRegExp}
          inputDescription="Veuillez entrer une adresse email valide"
          inputs={inputs}
          setInputs={setInputs}
          validInputs={validInputs}
          setValidInputs={setValidInputs}
        />

        <div className="labelAndInputContainer passwordLabelAndInput">
          <label htmlFor="password">
            Mot de passe :
            <span className={validPassword ? "valid" : "hide"}>
              <FaCheck />
            </span>
            <span className={validPassword || !password ? "hide" : "invalid"}>
              <FaTimes />
              </span>
          </label>
          <div className="pwdContainer">
            <input
              type={showPwd ? "text" : "password"}
              id="password"
              name="password"
              value={password}
              autoComplete="off"
              onChange={(e) => {
                setInputs((prevInputs) => ({
                  ...prevInputs,
                  [e.target.name]: e.target.value,
                }));
                setValidInputs((prevValidInputs) => ({
                  ...prevValidInputs,
                  [e.target.name]: passwordRegExp.test(e.target.value),
                }));
              }}
              placeholder="Votre mot de passe"
              required
              aria-invalid={validPassword ? "false" : "true"}
              aria-describedby="passwordidnote"
              onFocus={() => setPwdFocus(true)}
              onBlur={() => setPwdFocus(false)}
            />
            <button type="button" className="showPwd" onClick={() => setShowPwd(!showPwd)}>
              {!showPwd ? <FaEye /> : <FaEyeSlash />}
            </button>
          </div>
        </div>
        <p
          id="passwordidnote"
          className={
            pwdFocus && password  && !validPassword// focus is on input & input is not valid , here we want the instructions even if input is empty (if focused)
              ? "instructions" // then show instructions with css styling
              : "offscreen" // or dont show it with css styling
          }
        >
          <FaInfoCircle /> 8 à 24 caractères, incluant un chiffre, une lettre minuscule et majuscule
        </p>


        <div className="labelAndInputContainer passwordLabelAndInput">
          <label htmlFor="confirmPwd">
            Confirmez le 
            {width > 992 ? <br /> : " "}
            mot de passe :
            <span
              className={
                confirmPwd === password && validPassword ? "valid" : "hide"
              }
            >
              <FaCheck />
            </span>
            <span
              className={
                (password === confirmPwd && validPassword) || !confirmPwd
                  ? "hide"
                  : "invalid"
              }
            >
              <FaTimes />
              </span>
          </label>
          <div className="pwdContainer">
            <input
              type={showConfirmPwd ? "text" : "password"}
              id="confirmPwd"
              name="confirmPwd"
              value={confirmPwd}
              autoComplete="off"
              onChange={(e) => {
                setInputs((prevInputs) => ({
                  ...prevInputs,
                  [e.target.name]: e.target.value,
                }));
              }}
              placeholder="Votre mot de passe"
              required
              aria-invalid={confirmPwd === password ? "false" : "true"}
              aria-describedby="confirmpwdidnote"
              onFocus={() => setConfirmPwdFocus(true)}
              onBlur={() => setConfirmPwdFocus(false)}
            />
            <button type="button" className="showPwd" onClick={() => setShowConfirmPwd(!showConfirmPwd)}>
              {!showConfirmPwd ? <FaEye /> : <FaEyeSlash />}
            </button>
          </div>
        </div>
        <p
          id="confirmpwdidnote"
          className={
            confirmPwdFocus && confirmPwd !== password // focus is on input & input is not valid , here we want the instructions even if input is empty (if focused)
              ? "instructions" // then show instructions with css styling
              : "offscreen" // or dont show it with css styling
          }
        >
          <FaInfoCircle /> Doit être identique au mot de passe saisi ci-dessus
        </p>

        <p className="required">* Tous les champs sont requis</p>
        <button
          type="submit"
          disabled={
            !validFirstname ||
            !validLastname ||
            !validEmail ||
            !validPassword ||
            confirmPwd !== password
          }
          className={
            !validFirstname ||
            !validLastname ||
            !validEmail ||
            !validPassword ||
            confirmPwd !== password
              ? "disabled"
              : "notDisabled"
          }
        >
          Créer mon compte
        </button>
      </form>
      <NavLink className="link" to="/login">
        Vous avez déjà un compte ? Me connecter
      </NavLink>
    </article>
  );
}

