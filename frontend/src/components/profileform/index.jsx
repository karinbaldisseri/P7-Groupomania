/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaCheck, FaInfoCircle, FaTimes } from "react-icons/fa";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { toast } from "react-toastify";
import axios from "../../api/axios";
import useAuth from "../../hooks/useAuth";
import "../signupform/forms.scss";

export default function ProfileForm() {
  // to put focus on input when page loads
  const { auth } = useAuth();
  const navigate = useNavigate();
  const focusRef = useRef();
  // to put focus on the error when there is one
  const errRef = useRef();

  const [firstname, setFirstname] = useState("");
  const [validFirstname, setValidFirstname] = useState(false);
  const [firstnameFocus, setFirstnameFocus] = useState(false);

  const [lastname, setLastname] = useState("");
  const [validLastname, setValidLastname] = useState(false);
  const [lastnameFocus, setLastnameFocus] = useState(false);

  const [oldPassword, setOldPassword] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [oldPasswordFocus, setOldPasswordFocus] = useState(false);

  const [password, setPassword] = useState("");
  const [validPassword, setValidPassword] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);

  const [matchPassword, setMatchPassword] = useState("");
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [errMsg, setErrMsg] = useState("");

  const nameRegExp = /^[a-zA-Zçéèêëàâîïôùû' -]{2,25}$/;
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
    setValidPassword(passwordRegExp.test(password));
    setValidMatch(password === matchPassword);
  }, [password, matchPassword]);

  useEffect(() => {
    setErrMsg("");
  }, [firstname, lastname, password, matchPassword]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("/api/auth/me", {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        });
        setFirstname(response.data.firstname);
        setLastname(response.data.lastname);
      } catch (err) {
        if (!err?.response || err.response.status === 500) {
          setErrMsg("Erreur interne du serveur");
        } else if (err.response.status === 401) {
          setErrMsg("Accès au profil non autorisé");
        } else {
          setErrMsg("Erreur de chargement des données");
        }
        errRef.current.focus();
      }
    };
    fetchUser();
  }, []);

  const handleSubmitUpdate = async (e) => {
    e.preventDefault();
    setErrMsg("");
    if (auth.token) {
      try {
        const updateData = axios.put(
          "/api/auth/me",
          JSON.stringify({
            firstname,
            lastname,
            oldPassword,
            newPassword: password,
          }),
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth.token}`,
            },
          }
        );
        // Toast
        await toast.promise(updateData, {
          pending: "Chargement en cours...",
          success: "Profil modifié !",
        });
        // clear input fields (need value attributes in inputs for this)
        setOldPassword("");
        setPassword("");
        setMatchPassword("");
      } catch (err) {
        if (!err?.response || err.response.status === 500) {
          setErrMsg("Erreur interne du serveur");
        } else if (err.response.status === 401) {
          setErrMsg("Erreur de saisie, vérifiez les champs modifiés");
        } else {
          setErrMsg("Les modifications n'ont pas pu être enregistrées");
        }
        errRef.current.focus();
      }
    } else {
      setErrMsg("Problème d'autorisation, veuillez réessayer svp!");
    }
  };

  const handleDelete = async () => {
    try {
      const deleteData = axios.delete("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      // TOAST
      await toast.promise(deleteData, {
        pending: "Chargement en cours...",
        success: "Compte supprimé !",
      });
      // redirect to signup after toast shown
      setTimeout(() => {
        navigate("/signup");
      }, 2000);
      // clear input fields (need value attributes in inputs for this)
      setFirstname("");
      setLastname("");
      setOldPassword("");
      setPassword("");
      setMatchPassword("");
    } catch (err) {
      if (!err?.response || err.response.status === 500) {
        setErrMsg("Erreur interne du serveur");
      } else if (err.response.status === 401) {
        setErrMsg("Suppression non autorisée");
      } else {
        setErrMsg("La suppression du compte n'a pas aboutie");
      }
      errRef.current.focus();
    }
  };

  const confirmDelete = () => {
    confirmAlert({
      title: "Confirmation :",
      message:
        "Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible et toutes les données liées à ce compte seront perdues",
      buttons: [
        { label: "Confirmer", onClick: () => handleDelete() },
        { label: "Annuler" /* , onClick: () => navigate("/profile" ) */ },
      ],
    });
  };

  const handleDeactivate = async () => {
    if (auth.token || auth.isAdmin) {
      try {
        const updateData = axios.put(
          "/api/auth/me/deactivate",
          JSON.stringify({ isActive: false }),
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth.token}`,
            },
          }
        );
        await toast.promise(updateData, {
          pending: "Chargement en cours...",
          success: "Profil désactivé !",
        });
        navigate("/signup");
      } catch (err) {
        if (!err?.response || err.response.status === 500) {
          setErrMsg("Erreur interne du serveur");
        } else if (err.response.status === 401) {
          setErrMsg("Erreur de saisie, vérifiez les champs modifiés");
        } else {
          setErrMsg("Les modifications n'ont pas pu être enregistrées");
        }
        errRef.current.focus();
      }
    } else {
      setErrMsg("Problème d'autorisation, veuillez réessayer svp!");
    }
  };

  const confirmDeactivate = () => {
    confirmAlert({
      title: "Confirmation :",
      message:
        "Votre profil et messages ne seront plus visibles, mais pourront être réactivés par votre administrateur. Êtes-vous sûr de vouloir désactiver votre compte ?",
      buttons: [
        { label: "Confirmer", onClick: () => handleDeactivate() },
        { label: "Annuler" },
      ],
    });
  };

  return (
    <article className="formContainer">
      <form className="formItems" onSubmit={handleSubmitUpdate}>
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
        <h2>Changer mon mot de passe :</h2>

        <label htmlFor="oldPassword">
          Ancien mot de passe :
          <input
            type="password"
            id="oldPassword"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            placeholder="Votre mot de passe actuel"
            onFocus={() => setOldPasswordFocus(true)}
            onBlur={() => setOldPasswordFocus(false)}
          />
        </label>

        <label htmlFor="password">
          Nouveau mot de passe :
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
            placeholder="Votre nouveau mot de passe"
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
          <br /> nouveau mot de passe :
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
            placeholder="Votre nouveau mot de passe"
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

        <button
          type="submit"
          disabled={!firstname && !lastname && !password && !matchPassword}
          className={
            !firstname && !lastname && !password && !matchPassword
              ? "disabled"
              : "notDisabled"
          }
        >
          Enregistrer mes modifications
        </button>
        {/* {!errMsg && ( */}
        <button type="button" className="deleteBtn" onClick={confirmDelete}>
          Supprimer mon compte
        </button>
        <button
          type="button"
          className="deactivateBtn deleteBtn"
          onClick={confirmDeactivate}
        >
          Désactiver mon compte
        </button>
        {/* )} */}
      </form>
    </article>
  );
}
