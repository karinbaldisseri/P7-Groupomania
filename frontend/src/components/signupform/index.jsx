/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { FaCheck, FaInfoCircle, FaTimes } from "react-icons/fa";
import axios from "../../api/axios";
import "./forms.scss";

function SignupForm({ onFormSwitch }) {
  // to put focus on input when page loads
  const focusRef = useRef();
  // to put focus on the error when there is one
  const errRef = useRef();

  const [firstname, setFirstname] = useState("");
  const [validFirstname, setValidFirstname] = useState(false);
  const [firstnameFocus, setFirstnameFocus] = useState(false);

  const [lastname, setLastname] = useState("");
  const [validLastname, setValidLastname] = useState(false);
  const [lastnameFocus, setLastnameFocus] = useState(false);

  const [email, setEmail] = useState("");
  const [validEmail, setValidEmail] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);

  const [password, setPassword] = useState("");
  const [validPassword, setValidPassword] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);

  const [matchPassword, setMatchPassword] = useState("");
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [errMsg, setErrMsg] = useState("");

  const nameRegExp = /^[a-zA-Zçéèêëàâîïôùû' -]{2,25}$/;
  const emailRegExp = /^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$/;
  const passwordRegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,24}$/;

  useEffect(() => {
    focusRef.current.focus();
  }, []);

  useEffect(() => {
    setValidFirstname(nameRegExp.test(firstname));
  }, [firstname]); // shorter syntax

  useEffect(() => {
    setValidLastname(nameRegExp.test(lastname));
  }, [lastname]); // longer syntax

  useEffect(() => {
    setValidEmail(emailRegExp.test(email));
  }, [email]);

  useEffect(() => {
    setValidPassword(passwordRegExp.test(password));
    setValidMatch(password === matchPassword);
  }, [password, matchPassword]);

  useEffect(() => {
    setErrMsg("");
  }, [firstname, lastname, email, password, matchPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // security in case button is enabled with JS hack
    if (
      !nameRegExp.test(firstname) ||
      !nameRegExp.test(lastname) ||
      !emailRegExp.test(email) ||
      !passwordRegExp.test(password)
      // || !form.reportValidity() // not sure correct syntax ?? add const form = document.querySelector(".formItems");
    ) {
      setErrMsg(
        "Saisie incorrecte, veuillez vérifier les différents champs nécessaires"
      );
      return;
    }
    try {
      await axios.post(
        "/api/auth/signup",
        JSON.stringify({ firstname, lastname, email, password }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      // clear input fields (need value attributes in inputs for this)
      setFirstname("");
      setLastname("");
      setEmail("");
      setPassword("");
      setMatchPassword("");
      // redirect to login
      window.location = "/login";
    } catch (err) {
      if (!err?.response) {
        setErrMsg("Erreur interne du serveur");
      } else if (err.response?.status === 400) {
        setErrMsg("Erreur de saisie, vérifiez tous les champs requis");
      } else if (err.response?.status === 403) {
        setErrMsg("Compte désactivé, merci de contacter votre administrateur");
      } else {
        setErrMsg("L'inscription n'a pas pu aboutir");
      }
      errRef.current.focus();
    }
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
        <label htmlFor="firstname">
          Prénom :
          <span className={validFirstname ? "valid" : "hide"}>
            <FaCheck />
          </span>
          <span className={validFirstname || !firstname ? "hide" : "invalid"}>
            <FaTimes />
          </span>
          <input
            type="text"
            id="firstname" // has to match the htmlfor in label
            ref={focusRef} // to set focus on the input (with useRef we created)
            autoComplete="off" // don't want autocomplete on a registration / signup form
            value={firstname} // makes it a controlled input -> necessary to empty out in handleSubmit (setFirstname(""))
            onChange={(e) => setFirstname(e.target.value)} // ties the input to the state
            placeholder="Votre prénom"
            required
            aria-invalid={validFirstname ? "false" : "true"} // accessibility , lets a screenreader announce if the input needs to be adjusted
            aria-describedby="fnidnote" // lets us provide another element that describes the input field, so a screenreader will read the requirements our form needs
            onFocus={() => setFirstnameFocus(true)} // simply setting if the field has focus & set it to true
            onBlur={() => setFirstnameFocus(false)} // when you leave input field -> set the focus to false
          />
        </label>
        <p
          id="fnidnote"
          className={
            firstnameFocus && firstname && !validFirstname // focus is on input & input is not empty NOR valid
              ? "instructions" // then show instructions with css styling
              : "offscreen" // or dont show it with css styling
          }
        >
          <FaInfoCircle />2 à 25 caractères (sans chiffres ni caractères
          spéciaux)
        </p>

        <label htmlFor="lastname">
          Nom :
          <span className={validLastname ? "valid" : "hide"}>
            <FaCheck />
          </span>
          <span className={validLastname || !lastname ? "hide" : "invalid"}>
            <FaTimes />
          </span>
          <input
            type="text"
            id="lastname"
            autoComplete="off"
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
            placeholder="Votre nom"
            required
            aria-invalid={validLastname ? "false" : "true"}
            aria-describedby="lnidnote"
            onFocus={() => setLastnameFocus(true)}
            onBlur={() => setLastnameFocus(false)}
          />
        </label>
        <p
          id="lnidnote"
          className={
            lastnameFocus && lastname && !validLastname // focus is on input & input is not empty NOR valid
              ? "instructions" // then show instructions with css styling
              : "offscreen" // or dont show it with css styling
          }
        >
          <FaInfoCircle /> 2 à 25 caractères (sans chiffres ni caractères
          spéciaux)
        </p>

        <label htmlFor="email">
          Email :
          <span className={validEmail ? "valid" : "hide"}>
            <FaCheck />
          </span>
          <span className={validEmail || !email ? "hide" : "invalid"}>
            <FaTimes />
          </span>
          <input
            type="email"
            id="email"
            autoComplete="off"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Votre email professionnel"
            required
            aria-invalid={validEmail ? "false" : "true"}
            aria-describedby="eidnote"
            onFocus={() => setEmailFocus(true)}
            onBlur={() => setEmailFocus(false)}
          />
        </label>
        <p
          id="eidnote"
          className={
            emailFocus && email && !validEmail // focus is on input & input is not empty NOR valid
              ? "instructions" // then show instructions with css styling
              : "offscreen" // or dont show it with css styling
          }
        >
          <FaInfoCircle /> Veuillez entrer une adresse email valide
        </p>

        <label htmlFor="password">
          Mot de passe :
          <span className={validPassword ? "valid" : "hide"}>
            <FaCheck />
          </span>
          <span className={validPassword || !password ? "hide" : "invalid"}>
            <FaTimes />
          </span>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Votre mot de passe"
            required
            aria-invalid={validPassword ? "false" : "true"}
            aria-describedby="pwidnote"
            onFocus={() => setPasswordFocus(true)}
            onBlur={() => setPasswordFocus(false)}
          />
        </label>
        <p
          id="pwidnote"
          className={
            passwordFocus && !validPassword // focus is on input & input is not valid , here we want the instructions even if input is empty (if focused)
              ? "instructions" // then show instructions with css styling
              : "offscreen" // or dont show it with css styling
          }
        >
          <FaInfoCircle /> 8 à 24 caractères, incluant un chiffre, une lettre
          minuscule et majuscule
        </p>

        <label htmlFor="confirmPassword">
          Confirmez le
          <br /> mot de passe :
          <span
            className={
              validMatch && matchPassword && validPassword ? "valid" : "hide"
            }
          >
            <FaCheck />
          </span>
          <span
            className={
              (validMatch && validPassword) || !matchPassword
                ? "hide"
                : "invalid"
            }
          >
            <FaTimes />
          </span>
          <input
            type="password"
            id="confirmPassword"
            value={matchPassword}
            onChange={(e) => setMatchPassword(e.target.value)}
            placeholder="Votre mot de passe"
            required
            aria-invalid={validMatch ? "false" : "true"}
            aria-describedby="confirmpwidnote"
            onFocus={() => setMatchFocus(true)}
            onBlur={() => setMatchFocus(false)}
          />
        </label>
        <p
          id="confirmpwidnote"
          className={
            matchFocus && !validMatch // focus is on input & input is not valid , here we want the instructions even if input is empty (if focused)
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
            !validMatch
          }
          className={
            !validFirstname ||
            !validLastname ||
            !validEmail ||
            !validPassword ||
            !validMatch
              ? "disabled"
              : "notDisabled"
          }
        >
          Créer mon compte
        </button>
      </form>

      <button
        className="linkBtn"
        type="button"
        onClick={() => onFormSwitch("loginForm")}
      >
        Vous avez déjà un compte ? Me connecter
      </button>
    </article>
  );
}

SignupForm.propTypes = {
  onFormSwitch: PropTypes.func,
};

SignupForm.defaultProps = {
  onFormSwitch: ["loginForm"],
};

export default SignupForm;
