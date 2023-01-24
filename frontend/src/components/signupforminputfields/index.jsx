/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef } from "react";
import { NavLink /* , useNavigate */ } from "react-router-dom";
import { FaCheck, FaInfoCircle, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import InputField from "../InputField";
import axios from "../../api/axios";
import "../signupform/forms.scss";

function SignupFormInputFields() {
  // const navigate = useNavigate();
  const errRef = useRef();
  // to put focus on input when page loads
  // const focusRef = useRef();

  const [formInputs, setFormInputs] = useState({});
  const [validFormInputs, setValidFormInputs] = useState({});

  const { firstname, lastname, email, password } = formInputs;
  const validFirstname = validFormInputs.firstname;
  const validLastname = validFormInputs.lastname;
  const validEmail = validFormInputs.email;
  const validPassword = validFormInputs.password;

  const [confirmPassword, setConfirmPassword] = useState("");
  const [isMatch, setIsMatch] = useState(false);
  const [confirmPwdFocus, setConfirmPwdFocus] = useState(false);

  const [errMsg, setErrMsg] = useState("");

  const nameRegExp = /^[a-zA-Zçéèêëàâîïôùû' -]{2,25}$/;
  const emailRegExp = /^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$/;
  const passwordRegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,24}$/;

  /* useEffect(() => {
    focusRef.current.focus();
  }, []); */

  useEffect(() => {
    setErrMsg("");
  }, [firstname, lastname, email, password, confirmPassword]);

  useEffect(() => {
    console.log(`PASSWORD`, password);
    console.log("CONFIRMPASSWORD", confirmPassword);
    /* if (password === confirmPassword) {
      setIsMatch(true);
    } */
    setIsMatch(password === confirmPassword);
    console.log("ISMATCH", isMatch);
  }, [password, confirmPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // security in case button is enabled with JS hack
    if (
      !validFirstname ||
      !validLastname ||
      !validEmail ||
      !validPassword
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
      // TOAST
      toast.success("Nouveau compte crée !");
      // redirect to login after toast shown
      /* setTimeout(() => {
        navigate("/login");
      }, 2000); */
      // clear input fields (need value attributes in inputs for this)
      setFormInputs({});
      setValidFormInputs({});
      setIsMatch(false);
      setConfirmPassword("");
    } catch (err) {
      toast.error("Erreur à l'inscription, veuillez réessayer svp !", {
        toastStyle: { backgroundColor: "red", color: "white" },
      });
      if (err.response.status === 500) {
        setErrMsg("Erreur interne du serveur");
      } else if (err.response.status === 400) {
        setErrMsg("Erreur de saisie, vérifiez tous les champs requis");
      } else if (err.response.status === 403) {
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

        <InputField
          type="text"
          name="firstname"
          label="Prénom :"
          placeholder="Votre prénom"
          // ref={focusRef}
          regExp={nameRegExp}
          inputDescription="2 à 25 caractères (sans chiffres ni caractères spéciaux"
          setFormInputs={setFormInputs}
          setValidFormInputs={setValidFormInputs}
          // required
        />

        <InputField
          type="text"
          name="lastname"
          label="Nom :"
          placeholder="Votre nom"
          regExp={nameRegExp}
          inputDescription="2 à 25 caractères (sans chiffres ni caractères spéciaux"
          setFormInputs={setFormInputs}
          setValidFormInputs={setValidFormInputs}
        />

        <InputField
          type="email"
          name="email"
          label="Email :"
          placeholder="Votre email professionnel"
          regExp={emailRegExp}
          inputDescription="Veuillez entrer une adresse email valide"
          setFormInputs={setFormInputs}
          setValidFormInputs={setValidFormInputs}
        />

        <InputField
          // type="password"
          type="text"
          name="password"
          label="Mot de passe :"
          placeholder="Votre mot de passe"
          regExp={passwordRegExp}
          inputDescription="8 à 24 caractères, incluant un chiffre, une lettre minuscule et majuscule"
          setFormInputs={setFormInputs}
          setValidFormInputs={setValidFormInputs}
        />

        {/* <InputField
          // type="password"
          type="text"
          name="confirmPassword"
          label="Confirmez le mot de passe :"
          placeholder="Votre mot de passe"
          regExp={passwordRegExp}
          inputDescription="Doit être identique au mot de passe saisi ci-dessus"
          setFormInputs={setFormInputs}
          setValidFormInputs={setValidFormInputs}
        /> */}

        <label htmlFor="confirmPassword">
          Confirmez le
          <br /> mot de passe :
          <span className={isMatch && validPassword ? "valid" : "hide"}>
            <FaCheck />
          </span>
          <span
            className={
              (isMatch && validPassword) || !confirmPassword
                ? "hide"
                : "invalid"
            }
          >
            <FaTimes />
          </span>
          <input
            type="text"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Votre mot de passe"
            required
            aria-invalid={isMatch ? "false" : "true"}
            aria-describedby="confirmpwidnote"
            onFocus={() => setConfirmPwdFocus(true)}
            onBlur={() => setConfirmPwdFocus(false)}
          />
        </label>
        <p
          id="confirmpwidnote"
          className={
            confirmPwdFocus && !isMatch // focus is on input & input is not valid , here we want the instructions even if input is empty (if focused)
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
            !isMatch
          }
          className={
            !validFirstname ||
            !validLastname ||
            !validEmail ||
            !validPassword ||
            !isMatch
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

export default SignupFormInputFields;
