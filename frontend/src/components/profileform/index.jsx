/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaCheck, FaInfoCircle, FaTimes } from "react-icons/fa";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { toast } from "react-toastify";
import InputField from "../InputField";
import useAxiosFetchFunction from "../../hooks/useAxiosFetchFunction";
import { getOneUser, updateUser, deleteUser, deactivateUser } from "../../api/calls/usercalls";
import useAuth from "../../hooks/useAuth";
import "../signupform/forms.scss";

export default function ProfileForm() {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const errRef = useRef();
  const [errMsg, setErrMsg] = useState("");

  const [inputs, setInputs] = useState({ firstname: "", lastname: "", password: "", confirmPwd: "", oldPassword: "" });
  const [validInputs, setValidInputs] = useState({ firstname: true, lastname: true, password: false });

  const { firstname, lastname, password, confirmPwd, oldPassword } = inputs;
  const validPassword = validInputs.password;

  // eslint-disable-next-line no-unused-vars
  const [oldPasswordFocus, setOldPasswordFocus] = useState(false);

  const [confirmPwdFocus, setConfirmPwdFocus] = useState(false);

  const nameRegExp = /^[a-zA-Zçéèêëàâîïôùû' -]{2,25}$/;
  const passwordRegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,24}$/;

  const [response, fetchError, loading, axiosFetch] = useAxiosFetchFunction();
  const [updateRes, updateErr, updateload, updateAxiosFetch] = useAxiosFetchFunction();
  const [deleteRes, deleteErr, deleteload, deleteAxiosFetch] = useAxiosFetchFunction();
  const [deactivateRes, deactivateErr, deactivateload, deactivateAxiosFetch] = useAxiosFetchFunction();

  useEffect(() => {
    setErrMsg("");
  }, [firstname, lastname, password, confirmPwd]);

  useEffect(() => {
    let ignore = false;
    if ((response && !ignore) || (updateRes && !ignore)) {
      setInputs({ firstname: response.firstname, lastname: response.lastname, password: "", confirmPwd: "", oldPassword: "" });
      setValidInputs({ firstname: true, lastname: true, password: false, confirmpwd: false });
      if (updateRes && !ignore) {
        toast.success("Profil modifié !");
      } 
    } else if ((deleteRes && !ignore) || (deactivateRes && !ignore)) {
      setInputs({ firstname: "", lastname: "", password: "", confirmPwd: "", oldPassword: "" });
      setTimeout(() => { navigate("/signup") }, 1000);
      if (deleteRes && !ignore) {
        toast.success("Profil supprimé !");
      } else if (deactivateRes && !ignore) {
        toast.success("Profil désactivé !");
      }
    }
    return () => { ignore = true };
  }, [response, updateRes, deleteRes, deactivateRes]);

  useEffect(() => {
    let ignore = false;
    if (fetchError && !ignore) {
      setErrMsg(fetchError);
    } else if (updateErr && !ignore) {
      setErrMsg(updateErr);
    } else if (deleteErr && !ignore) {
      setErrMsg(deleteErr);
    } else if (deactivateErr && !ignore) {
      setErrMsg(deactivateErr);
    }
    errRef.current.focus();
    return () => { ignore = true };
  }, [fetchError, updateErr, deleteErr]);

  useEffect(() => {
    getOneUser(axiosFetch);
  }, []);

  const handleSubmitUpdate = async (e) => {
    e.preventDefault();
    updateUser(updateAxiosFetch, firstname, lastname, oldPassword, password);
  };

  const handleDelete = async () => {
    deleteUser(deleteAxiosFetch);
  };

  const confirmDelete = () => {
    confirmAlert({
      title: "Confirmation :",
      message:
        "Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible et toutes les données liées à ce compte seront perdues",
      buttons: [
        { label: "Confirmer", onClick: () => handleDelete() },
        { label: "Annuler" },
      ],
    });
  };

  const handleDeactivate = async () => {
    if (auth.token || auth.isAdmin) {
      deactivateUser(deactivateAxiosFetch);
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
        <p ref={errRef} className={errMsg ? "errMsg" : "offscreen"} aria-live="assertive">
          {errMsg}
        </p>
        {loading || updateload || deleteload || deactivateload && <p>Chargement en cours ...</p>}
        
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

        <h2>Changer mon mot de passe :</h2>

        <label htmlFor="oldPassword">
          Ancien mot de passe :
          <input
            type="password"
            id="oldPassword"
            value={oldPassword}
            onChange={(e) => {
              setInputs((prevInputs) => ({...prevInputs, oldPassword: e.target.value}));
            }}
            placeholder="Votre mot de passe actuel"
            onFocus={() => setOldPasswordFocus(true)}
            onBlur={() => setOldPasswordFocus(false)}
          />
        </label>

        <InputField
          type="password"
          name="password"
          label="Nouveau mot de passe :"
          placeholder="Nouveau mot de passe"
          regExp={passwordRegExp}
          inputDescription="8 à 24 caractères, incluant un chiffre, une lettre minuscule et majuscule"
          inputs={inputs}
          setInputs={setInputs}
          validInputs={validInputs}
          setValidInputs={setValidInputs}
        />

        <label htmlFor="confirmPassword">
          Confirmez le nouveau
          <br /> mot de passe :
          <span className={confirmPwd === password && validPassword ? "valid" : "hide"}>
            <FaCheck />
          </span>
          <span className={(confirmPwd === password && validPassword) || !confirmPwd ? "hide" : "invalid"}>
            <FaTimes />
          </span>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPwd}
            onChange={(e) => {
              setInputs((prevInputs) => ({...prevInputs, confirmPwd: e.target.value}));
            }}
            placeholder="confirmez le mot de passe"
            aria-invalid={confirmPwd === password ? "false" : "true"}
            aria-describedby="confirmpwidnote"
            onFocus={() => setConfirmPwdFocus(true)}
            onBlur={() => setConfirmPwdFocus(false)}
          />
        </label>
        <p
          id="confirmpwidnote"
          className={confirmPwdFocus && confirmPwd !== password ? "instructions" : "offscreen"}>
          <FaInfoCircle /> Doit être identique au mot de passe saisi ci-dessus
        </p>

        <button
          type="submit"
          disabled={!firstname && !lastname && !password && confirmPwd !== password}
          className={!firstname && !lastname && !password && confirmPwd !== password ? "disabled" : "notDisabled"}>
          Enregistrer mes modifications
        </button>
        <button type="button" className="deleteBtn" onClick={confirmDelete}>
          Supprimer mon compte
        </button>
        <button type="button" className="deactivateBtn deleteBtn" onClick={confirmDeactivate}>
          Désactiver mon compte
        </button>
      </form>
    </article>
  );
}

